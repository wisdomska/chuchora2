/*
 * Churchora — Google Sign-In backend (Vercel serverless function)
 *
 *   GET  /api/auth/google   → { clientId }            (public OAuth client id, for the browser)
 *   POST /api/auth/google   → { ok, name, email, … }  (exchange auth code, verify, return profile)
 *
 * The authorization-code flow keeps the Client Secret on the server: the browser
 * only ever handles a short-lived code, which we exchange here for tokens using the
 * secret. The returned ID token is then verified (audience + issuer) before we trust it.
 *
 * Required environment variables (set in Vercel project settings):
 *   GOOGLE_CLIENT_ID      — OAuth 2.0 Web client ID
 *   GOOGLE_CLIENT_SECRET  — OAuth 2.0 Web client secret
 */

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

function decodeJwtPayload(jwt) {
  const part = String(jwt).split(".")[1];
  const json = Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  return JSON.parse(json);
}

function initialsOf(name) {
  return String(name).trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

module.exports = async function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // ── GET: hand the public client id to the browser so it can start the flow ──
  if (req.method === "GET") {
    if (!clientId) {
      return res.status(500).json({ error: "GOOGLE_CLIENT_ID is not configured on the server." });
    }
    return res.status(200).json({ clientId });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Google OAuth is not configured on the server." });
  }

  // Vercel parses JSON bodies automatically, but guard for string bodies too.
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const code = body.code;
  if (!code) return res.status(400).json({ error: "Missing authorization code." });

  try {
    // ── Exchange the auth code for tokens (server-side, with the secret) ──
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: "postmessage", // popup (initCodeClient) flow
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(401).json({ error: "Token exchange failed.", detail: tokens.error_description || tokens.error || null });
    }

    let profile = null;

    // ── Preferred path: verify the ID token returned by Google ──
    if (tokens.id_token) {
      const payload = decodeJwtPayload(tokens.id_token);

      if (payload.aud !== clientId) {
        return res.status(401).json({ error: "Token audience mismatch." });
      }
      if (payload.iss !== "https://accounts.google.com" && payload.iss !== "accounts.google.com") {
        return res.status(401).json({ error: "Invalid token issuer." });
      }
      if (payload.email && payload.email_verified === false) {
        return res.status(401).json({ error: "Google account email is not verified." });
      }
      profile = payload;
    } else if (tokens.access_token) {
      // ── Fallback: fetch the profile with the access token we just obtained ──
      const uiRes = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (!uiRes.ok) {
        return res.status(401).json({ error: "Could not fetch Google profile." });
      }
      profile = await uiRes.json();
    } else {
      return res.status(401).json({ error: "Google returned no usable token." });
    }

    const name = profile.name || (profile.email ? profile.email.split("@")[0] : "Member");

    return res.status(200).json({
      ok: true,
      email: profile.email || null,
      name,
      picture: profile.picture || null,
      sub: profile.sub || null,
      initials: initialsOf(name),
    });
  } catch (err) {
    return res.status(500).json({ error: "Verification error.", detail: String((err && err.message) || err) });
  }
};

/*
 * Churchora — form notification endpoint (Vercel serverless function)
 *
 *   POST /api/notify   body: { type: "waitlist" | "contact", ...fields }
 *
 * Delivers Contact + Member-App-waitlist submissions to the church inbox.
 * Two delivery paths, picked automatically:
 *   1. Resend  — used when RESEND_API_KEY is set (professional, recommended).
 *   2. FormSubmit — keyless fallback so email works with zero configuration.
 *      (FormSubmit sends a one-time "activate" email to the destination the
 *       first time; after it's confirmed once, all submissions arrive.)
 *
 * Env (all optional):
 *   RESEND_API_KEY  — enables the Resend path
 *   NOTIFY_TO       — destination inbox (defaults to wisdomska@gmail.com)
 *   NOTIFY_FROM     — verified Resend sender (defaults to onboarding@resend.dev)
 */

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_TO = "wisdomska@gmail.com";
const DEFAULT_FROM = "Churchora <onboarding@resend.dev>";

const isEmail = (s) => typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function row(label, value) {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 14px 6px 0;color:#888;font:13px/1.5 -apple-system,system-ui,sans-serif;white-space:nowrap;vertical-align:top">${esc(label)}</td>
    <td style="padding:6px 0;color:#111;font:14px/1.6 -apple-system,system-ui,sans-serif">${esc(value).replace(/\n/g, "<br>")}</td>
  </tr>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

  // Honeypot — bots fill hidden fields; pretend success and drop silently.
  if (body.company) return res.status(200).json({ ok: true });

  const type = body.type === "waitlist" ? "waitlist" : body.type === "contact" ? "contact" : null;
  if (!type) return res.status(400).json({ error: "Unknown submission type." });

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 200);
  if (!name) return res.status(400).json({ error: "Name is required." });
  if (!isEmail(email)) return res.status(400).json({ error: "A valid email is required." });

  // Per-type fields
  let subject, rows, fields;
  if (type === "waitlist") {
    const church = String(body.church || "").trim().slice(0, 160) || "—";
    subject = `New Member App waitlist signup — ${name}`;
    rows = row("Name", name) + row("Email", email) + row("Church", church);
    fields = { Submission: "Member App waitlist", Name: name, Email: email, Church: church };
  } else {
    const msgSubject = String(body.subject || "").trim().slice(0, 200) || "—";
    const message = String(body.message || "").trim().slice(0, 5000);
    if (!message) return res.status(400).json({ error: "Message is required." });
    subject = `New contact message — ${name}${msgSubject !== "—" ? ` · ${msgSubject}` : ""}`;
    rows = row("Name", name) + row("Email", email) + row("Subject", msgSubject) + row("Message", message);
    fields = { Submission: "Contact form", Name: name, Email: email, Subject: msgSubject, Message: message };
  }

  const to = process.env.NOTIFY_TO || DEFAULT_TO;
  const apiKey = process.env.RESEND_API_KEY;

  try {
    // ── Path 1: Resend (if configured) ──
    if (apiKey) {
      const heading = type === "waitlist" ? "Member App waitlist signup" : "Contact form message";
      const html = `<div style="max-width:560px;margin:0 auto;padding:24px">
        <div style="font:600 12px/1 -apple-system,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#D6531F;margin-bottom:6px">Churchora</div>
        <h2 style="font:600 20px/1.3 -apple-system,system-ui,sans-serif;color:#111;margin:0 0 16px">${esc(heading)}</h2>
        <table style="border-collapse:collapse;width:100%">${rows}</table>
        <p style="font:12px/1.5 -apple-system,system-ui,sans-serif;color:#aaa;margin-top:20px;border-top:1px solid #eee;padding-top:14px">Sent from churchora2.vercel.app</p>
      </div>`;
      const r = await fetch(RESEND_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.NOTIFY_FROM || DEFAULT_FROM, to: [to], reply_to: email, subject, html }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) return res.status(200).json({ ok: true, via: "resend", id: data.id || null });
      return res.status(502).json({ error: "Could not send the email.", detail: data.message || data.name || null });
    }

    // ── Path 2: FormSubmit (keyless fallback) ──
    const r = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(to), {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ _subject: subject, _captcha: "false", _template: "table", _replyto: email, ...fields }),
    });
    const data = await r.json().catch(() => ({}));
    const ok = r.ok && (data.success === true || data.success === "true");
    if (ok) return res.status(200).json({ ok: true, via: "formsubmit" });
    return res.status(502).json({ error: "Could not send the email.", detail: data.message || ("HTTP " + r.status) });
  } catch (err) {
    return res.status(500).json({ error: "Email send failed.", detail: String((err && err.message) || err) });
  }
};

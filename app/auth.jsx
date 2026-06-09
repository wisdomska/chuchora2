/* Churchora — Auth screen (login / sign up) */
const { Icon: AIcon, Logo: ALogo } = window;

function AuthScreen({ onAuth }) {
  const [mode, setMode]       = React.useState("login");
  const [email, setEmail]     = React.useState("");
  const [password, setPass]   = React.useState("");
  const [name, setName]       = React.useState("");
  const [church, setChurch]   = React.useState("");
  const [error, setError]     = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShow]   = React.useState(false);

  const clearErr = () => setError("");

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (mode === "signup" && !name.trim()) return "Please enter your name.";
    return null;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({
        email,
        name: name.trim() || email.split("@")[0],
        church: church.trim() || "Grace Chapel International",
        initials: (name.trim() || email.split("@")[0]).split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase(),
      });
    }, 950);
  };

  const switchMode = (m) => { setMode(m); setError(""); setPass(""); };

  /* ── testimonial avatars from mock data ── */
  const avatarRow = CH.members.slice(0, 5);

  return (
    <div style={{ height: "100vh", display: "flex", background: "var(--page)", overflow: "hidden" }}>

      {/* ── Left brand panel ── */}
      <div style={{
        flex: "0 0 460px", background: "var(--chrome)", color: "var(--chrome-text)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px 52px", position: "relative", overflow: "hidden",
      }}>
        {/* decorative glows */}
        <div style={{ position:"absolute", bottom:-160, right:-100, width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,var(--primary) 0%,transparent 65%)", opacity:.22, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,var(--primary) 0%,transparent 70%)", opacity:.12, pointerEvents:"none" }} />

        {/* logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, position:"relative" }}>
          <ALogo size={38} />
          <span style={{ fontSize:21, fontWeight:500, letterSpacing:"-.02em" }}>Churchora</span>
        </div>

        {/* verse quote */}
        <div style={{ position:"relative" }}>
          <div style={{ width:36, height:3, background:"var(--primary)", borderRadius:99, marginBottom:24 }} />
          <p className="serif-verse" style={{ fontSize:"1.65rem", lineHeight:1.38, color:"var(--chrome-text)", marginBottom:18 }}>
            "For where two or three gather in my name, there am I with them."
          </p>
          <div style={{ fontSize:".88rem", color:"var(--chrome-muted)" }}>Matthew 18:20 · NIV</div>
        </div>

        {/* social proof */}
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", marginBottom:12 }}>
            {avatarRow.map((m, i) => (
              <div key={m.id} style={{
                width:38, height:38, borderRadius:"50%", background:m.tone, color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:".78rem", fontWeight:600, border:"2.5px solid var(--chrome)",
                marginLeft: i ? -10 : 0,
              }}>
                {m.name.split(" ").map(w => w[0]).slice(0,2).join("")}
              </div>
            ))}
          </div>
          <div style={{ fontSize:".85rem", color:"var(--chrome-muted)", lineHeight:1.55 }}>
            Trusted by{" "}
            <span style={{ color:"var(--chrome-text)", fontWeight:500 }}>1,200+ congregations</span>
            {" "}across the country.
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 40px", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          {/* heading */}
          <div className="anim-up" style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:"2rem", letterSpacing:"-.025em", marginBottom:8 }}>
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="muted" style={{ fontSize:".95rem" }}>
              {mode === "login"
                ? "Sign in to your Churchora workspace."
                : "Set up your church — free forever to start."}
            </p>
          </div>

          <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:15 }}>

            {mode === "signup" && (<>
              <div>
                <label className="eyebrow" style={{ display:"block", marginBottom:7 }}>Your name</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--text-subtle)" }}><AIcon name="user" size={17} /></span>
                  <input value={name} onChange={e => { setName(e.target.value); clearErr(); }}
                    placeholder="Adwoa Mensah" className="field" style={{ paddingLeft:40 }} autoComplete="name" />
                </div>
              </div>
              <div>
                <label className="eyebrow" style={{ display:"block", marginBottom:7 }}>Church name</label>
                <input value={church} onChange={e => setChurch(e.target.value)}
                  placeholder="Grace Chapel International" className="field" />
              </div>
            </>)}

            <div>
              <label className="eyebrow" style={{ display:"block", marginBottom:7 }}>Email address</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--text-subtle)" }}><AIcon name="mail" size={17} /></span>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearErr(); }}
                  placeholder="you@church.org" className="field" style={{ paddingLeft:40 }} autoComplete="email" />
              </div>
            </div>

            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7 }}>
                <label className="eyebrow">Password</label>
                {mode === "login" && (
                  <span style={{ fontSize:".82rem", color:"var(--primary)", cursor:"pointer" }}>Forgot password?</span>
                )}
              </div>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"var(--text-subtle)" }}><AIcon name="lock" size={17} /></span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password} onChange={e => { setPass(e.target.value); clearErr(); }}
                  placeholder={mode === "signup" ? "Minimum 6 characters" : "••••••••"}
                  className="field" style={{ paddingLeft:40, paddingRight:46 }}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                <button type="button" onClick={() => setShow(s => !s)} style={{
                  position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", color:"var(--text-subtle)", cursor:"pointer", padding:3,
                }}>
                  <AIcon name={showPass ? "eye-off" : "eye"} size={17} />
                </button>
              </div>
            </div>

            {/* error */}
            {error && (
              <div className="anim-in" style={{ display:"flex", alignItems:"center", gap:9, padding:"11px 14px", background:"var(--danger-tint)", borderRadius:"var(--r-sm)", color:"var(--danger)", fontSize:".87rem" }}>
                <AIcon name="alert-triangle" size={16} style={{ flexShrink:0 }} />{error}
              </div>
            )}

            {/* submit */}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-block" style={{ marginTop:4 }}>
              {loading ? (
                <span style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:18, height:18, borderRadius:"50%", border:"2.5px solid rgba(255,255,255,.35)", borderTopColor:"#fff", animation:"ch-spin .7s linear infinite", display:"inline-block" }} />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </span>
              ) : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* divider */}
          <div style={{ display:"flex", alignItems:"center", gap:14, margin:"22px 0" }}>
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
            <span className="subtle" style={{ fontSize:".82rem" }}>or</span>
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
          </div>

          {/* Google SSO */}
          <button className="btn btn-ghost btn-lg btn-block" style={{ gap:10 }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.8l6-6C34.4 3.1 29.5 1 24 1 15.1 1 7.4 6.2 3.7 13.9l7 5.4C12.5 13.3 17.8 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"/>
              <path fill="#FBBC05" d="M10.7 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7-5.4A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8.1-6.1z"/>
              <path fill="#34A853" d="M24 47c5.5 0 10.1-1.8 13.5-4.9l-7.4-5.7c-1.9 1.3-4.3 2.1-6.1 2.1-6.2 0-11.5-3.8-13.3-9.8l-8.1 6.1C7.4 41.8 15.1 47 24 47z"/>
            </svg>
            Continue with Google
          </button>

          {/* mode toggle */}
          <p className="muted" style={{ textAlign:"center", marginTop:26, fontSize:".9rem" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              style={{ color:"var(--primary)", cursor:"pointer", fontWeight:500 }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </span>
          </p>
        </div>
      </div>

      <style>{`@keyframes ch-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

window.AuthScreen = AuthScreen;

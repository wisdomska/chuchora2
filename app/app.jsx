/* Churchora — app shell: prototype navigator + theme engine */
const { Icon, Logo } = window;
const LS = "churchora.v1";

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; }
}
function saveState(s) { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} }

function useAuth() {
  const init = loadState();
  const [user, setUser] = React.useState(init.user || null);
  const login  = (u) => { saveState({ ...loadState(), user: u }); setUser(u); };
  const logout = ()  => { saveState({ ...loadState(), user: null }); setUser(null); };
  return { user, login, logout };
}

function useThemeEngine() {
  const init = loadState();
  const [theme, setTheme] = React.useState(init.theme || "orange");
  const [mode, setMode]   = React.useState(init.mode || "light");
  // Always start on "site" — the landing page is public
  const [surface, setSurface] = React.useState("site");
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", mode);
    saveState({ ...loadState(), theme, mode });
  }, [theme, mode]);
  return { theme, setTheme, mode, setMode, surface, setSurface };
}

function ThemeSwitcher({ theme, setTheme, mode, setMode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {CH.themes.map(t => {
          const active = t.id === theme;
          return (
            <button key={t.id} type="button" onClick={() => setTheme(t.id)} title={t.label} style={{
              width: 22, height: 22, borderRadius: "50%", padding: 0, cursor: "pointer",
              background: t.swatch, border: "2px solid " + (active ? "var(--chrome-text)" : "transparent"),
              boxShadow: active ? "0 0 0 1px var(--chrome)" : "none",
              outline: "1px solid rgba(255,255,255,.18)", transition: "all .15s",
              transform: active ? "scale(1.08)" : "scale(1)",
            }} />
          );
        })}
      </div>
      <button type="button" onClick={() => setMode(mode === "light" ? "dark" : "light")} title="Toggle dark mode" style={{
        width: 34, height: 34, borderRadius: 999, border: "1px solid var(--chrome-muted)", background: "transparent",
        color: "var(--chrome-text)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
      }}>
        <Icon name={mode === "light" ? "moon" : "sun"} size={17} />
      </button>
    </div>
  );
}

/* Nav shown when logged in — full surface tabs + user chip */
function AuthedNavigator({ surface, go, theme, setTheme, mode, setMode, user, logout }) {
  return (
    <div style={{
      height: 56, flexShrink: 0, background: "var(--chrome)", color: "var(--chrome-text)",
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 16px",
      borderBottom: "1px solid rgba(255,255,255,.08)", zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 200 }}>
        <Logo size={28} />
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-.01em" }}>Churchora</span>
        <span style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--chrome-muted)", border: "1px solid var(--chrome-muted)", padding: "2px 7px", borderRadius: 5 }}>Prototype</span>
      </div>
      <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,.07)", borderRadius: 999, padding: 4 }}>
        {CH.navMain.map(n => {
          const active = n.id === surface;
          return (
            <button key={n.id} type="button" onClick={() => go(n.id)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer",
              padding: "8px 16px", borderRadius: 999, fontFamily: "var(--font)", fontSize: ".88rem", fontWeight: active ? 400 : 300,
              background: active ? "var(--primary)" : "transparent",
              color: active ? "var(--primary-contrast)" : "var(--chrome-muted)",
              transition: "all var(--dur) var(--ease)", whiteSpace: "nowrap",
            }}>
              <Icon name={n.icon} size={16} />{n.label}
            </button>
          );
        })}
      </div>
      <div style={{ minWidth: 200, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
        <ThemeSwitcher theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} />
        <div style={{ display: "flex", alignItems: "center", gap: 9, paddingLeft: 14, borderLeft: "1px solid rgba(255,255,255,.12)" }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--primary)", color: "var(--primary-contrast)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 600 }}>{user.initials}</div>
          <span style={{ fontSize: ".84rem", color: "var(--chrome-muted)", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
          <button onClick={logout} title="Sign out" style={{ width: 30, height: 30, borderRadius: "var(--r-xs)", border: "1px solid rgba(255,255,255,.14)", background: "transparent", color: "var(--chrome-muted)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="log-out" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* Nav shown on the public landing page — just logo + theme + sign in/up */
function PublicNavigator({ theme, setTheme, mode, setMode, onSignIn }) {
  return (
    <div style={{
      height: 56, flexShrink: 0, background: "var(--chrome)", color: "var(--chrome-text)",
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px 0 16px",
      borderBottom: "1px solid rgba(255,255,255,.08)", zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <Logo size={28} />
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-.01em" }}>Churchora</span>
        <span style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--chrome-muted)", border: "1px solid var(--chrome-muted)", padding: "2px 7px", borderRadius: 5 }}>Prototype</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <ThemeSwitcher theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} />
        <div style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 14, borderLeft: "1px solid rgba(255,255,255,.12)" }}>
          <button onClick={() => onSignIn("login")} style={{
            border: "1px solid rgba(255,255,255,.22)", background: "transparent", color: "var(--chrome-text)",
            borderRadius: "var(--r-sm)", padding: "8px 16px", fontFamily: "var(--font)", fontSize: ".88rem",
            cursor: "pointer", transition: "all var(--dur) var(--ease)",
          }}>Sign in</button>
          <button onClick={() => onSignIn("signup")} style={{
            border: "none", background: "var(--primary)", color: "var(--primary-contrast)",
            borderRadius: "var(--r-sm)", padding: "8px 16px", fontFamily: "var(--font)", fontSize: ".88rem",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
          }}>Get started <Icon name="arrow-right" size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function StubSurface({ label }) {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "var(--text-muted)" }}>
      <Icon name="sparkles" size={28} />
      <div style={{ fontSize: "1.1rem" }}>{label} — coming in this build</div>
    </div>
  );
}

function MemberStage({ children }) {
  return (
    <div className="scroll-area" style={{ height: "100%", overflowY: "auto", background: "var(--surface-2)" }}>
      <div style={{ minHeight: "100%", display: "flex", alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap", gap: 40, padding: "44px 32px 60px" }}>
        {children}
      </div>
    </div>
  );
}
window.MemberStage = MemberStage;

function App() {
  const eng  = useThemeEngine();
  const auth = useAuth();
  const { surface, setSurface, theme, setTheme, mode, setMode } = eng;
  const { user, login, logout } = auth;

  // Surface the user was trying to reach before auth; null = default to cms
  const [pendingSurface, setPendingSurface] = React.useState(null);
  const [showAuth, setShowAuth]             = React.useState(false);
  const [authMode, setAuthMode]             = React.useState("login");

  // Gate: "site" is always public; all other surfaces require login
  const go = (s) => {
    if (s === "site") { setSurface("site"); return; }
    if (!user) {
      setPendingSurface(s);
      setAuthMode("login");
      setShowAuth(true);
    } else {
      setSurface(s);
    }
  };

  const handleAuth = (userData) => {
    login(userData);
    setShowAuth(false);
    setSurface(pendingSurface || "cms");
    setPendingSurface(null);
  };

  const handleSignInClick = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  // Auth overlay
  if (showAuth) {
    return <window.AuthScreen onAuth={handleAuth} initialMode={authMode} onBack={() => setShowAuth(false)} />;
  }

  // Logged-in full app
  if (user) {
    const surfaces = {
      site: window.MarketingSite,
      member: window.MemberApp,
      cms: window.AdminCMS,
      sermon: window.SermonMode,
    };
    const Comp = surfaces[surface];
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--page)" }}>
        <AuthedNavigator surface={surface} go={go} theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} user={user} logout={logout} />
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <div key={surface + theme + mode} className="anim-in" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {Comp ? <Comp go={go} theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} /> : <StubSurface label={surface} />}
          </div>
        </div>
      </div>
    );
  }

  // Public landing page (not logged in)
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--page)" }}>
      <PublicNavigator theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} onSignIn={handleSignInClick} />
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <div key={theme + mode} className="anim-in" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <window.MarketingSite go={go} />
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

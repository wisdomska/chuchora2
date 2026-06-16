/* Churchora — app shell */
const { Icon, Logo } = window;
const LS = "churchora.v1";

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; }
}
function saveState(s) { try { localStorage.setItem(LS, JSON.stringify(s)); } catch {} }

const SESSION_KEY = "churchora.session";

function readSession() {
  // localStorage persists across browser restarts ("remember me");
  // sessionStorage lasts only for the tab when "remember me" is off.
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function useAuth() {
  // Restore a remembered session so a page reload keeps you signed in.
  const [user, setUser] = React.useState(readSession);

  const login = (u, remember = true) => {
    setUser(u);
    try {
      const raw = JSON.stringify(u);
      if (remember) { localStorage.setItem(SESSION_KEY, raw); sessionStorage.removeItem(SESSION_KEY); }
      else          { sessionStorage.setItem(SESSION_KEY, raw); localStorage.removeItem(SESSION_KEY); }
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); } catch {}
  };

  return { user, login, logout };
}

function useThemeEngine() {
  const init = loadState();
  const [theme, setTheme] = React.useState(init.theme || "orange");
  const [mode,  setMode]  = React.useState(init.mode  || "light");
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode",  mode);
    saveState({ ...loadState(), theme, mode });
  }, [theme, mode]);
  return { theme, setTheme, mode, setMode };
}

function ThemeSwitcher({ theme, setTheme, mode, setMode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ display:"flex", gap:7, alignItems:"center" }}>
        {CH.themes.map(t => {
          const active = t.id === theme;
          return (
            <button key={t.id} type="button" onClick={() => setTheme(t.id)} title={t.label} style={{
              width:22, height:22, borderRadius:"50%", padding:0, cursor:"pointer",
              background:t.swatch, border:"2px solid "+(active?"var(--chrome-text)":"transparent"),
              boxShadow:active?"0 0 0 1px var(--chrome)":"none",
              outline:"1px solid rgba(255,255,255,.18)", transition:"all .15s",
              transform:active?"scale(1.08)":"scale(1)",
            }}/>
          );
        })}
      </div>
      <button type="button" onClick={() => setMode(mode==="light"?"dark":"light")} title="Toggle dark mode" style={{
        width:34, height:34, borderRadius:999, border:"1px solid var(--chrome-muted)", background:"transparent",
        color:"var(--chrome-text)", display:"inline-flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
      }}>
        <Icon name={mode==="light"?"moon":"sun"} size={17}/>
      </button>
    </div>
  );
}

/* Full app navigator — shown only on non-site surfaces when logged in */
function AppNavigator({ surface, go, theme, setTheme, mode, setMode, user, logout }) {
  const { isMobileOrTablet } = window.useViewport();
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => { if (!isMobileOrTablet) setMenuOpen(false); }, [isMobileOrTablet]);

  return (
    <>
      <div style={{
        height:56, flexShrink:0, background:"var(--chrome)", color:"var(--chrome-text)",
        display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 0 16px",
        borderBottom:"1px solid rgba(255,255,255,.08)", zIndex:100,
      }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <button onClick={() => { go("site"); setMenuOpen(false); }} style={{ display:"flex", alignItems:"center", gap:11, background:"none", border:"none", cursor:"pointer", color:"inherit", padding:0, fontFamily:"var(--font)" }}>
            <Logo size={28}/>
            <span style={{ fontSize:15, fontWeight:500, letterSpacing:"-.01em" }}>Churchora</span>
          </button>
          {!isMobileOrTablet && <span style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:".12em", color:"var(--chrome-muted)", border:"1px solid var(--chrome-muted)", padding:"2px 7px", borderRadius:5 }}>Prototype</span>}
        </div>

        {/* Desktop surface tabs */}
        {!isMobileOrTablet && (
          <div style={{ display:"flex", gap:3, background:"rgba(255,255,255,.07)", borderRadius:999, padding:4 }}>
            {CH.navMain.map(n => {
              const active = n.id === surface;
              return (
                <button key={n.id} type="button" onClick={() => go(n.id)} style={{
                  display:"inline-flex", alignItems:"center", gap:8, border:"none", cursor:"pointer",
                  padding:"8px 16px", borderRadius:999, fontFamily:"var(--font)", fontSize:".88rem", fontWeight:active?400:300,
                  background:active?"var(--primary)":"transparent",
                  color:active?"var(--primary-contrast)":"var(--chrome-muted)",
                  transition:"all var(--dur) var(--ease)", whiteSpace:"nowrap",
                }}>
                  <Icon name={n.icon} size={16}/>{n.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop right */}
        {!isMobileOrTablet && (
          <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:14 }}>
            <ThemeSwitcher theme={theme} setTheme={setTheme} mode={mode} setMode={setMode}/>
            <div style={{ display:"flex", alignItems:"center", gap:9, paddingLeft:14, borderLeft:"1px solid rgba(255,255,255,.12)" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--primary)", color:"var(--primary-contrast)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".72rem", fontWeight:600 }}>{user.initials}</div>
              <span style={{ fontSize:".84rem", color:"var(--chrome-muted)", maxWidth:90, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</span>
              <button onClick={logout} title="Sign out" style={{ width:30, height:30, borderRadius:"var(--r-xs)", border:"1px solid rgba(255,255,255,.14)", background:"transparent", color:"var(--chrome-muted)", cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="log-out" size={14}/>
              </button>
            </div>
          </div>
        )}

        {/* Mobile/tablet right: user avatar + hamburger */}
        {isMobileOrTablet && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--primary)", color:"var(--primary-contrast)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:".72rem", fontWeight:600 }}>{user.initials}</div>
            <button onClick={() => setMenuOpen(m => !m)} style={{ width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer", color:"var(--chrome-text)" }}>
              <window.Hamburger open={menuOpen} size={20} color="var(--chrome-text)"/>
            </button>
          </div>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isMobileOrTablet && (
        <div style={{
          background:"var(--chrome)", borderBottom:"1px solid rgba(255,255,255,.08)",
          maxHeight: menuOpen ? 500 : 0, overflow:"hidden",
          transition:"max-height .32s cubic-bezier(.22,.61,.36,1)", zIndex:99, flexShrink:0,
        }}>
          <div style={{ padding:"8px 16px 16px" }}>
            {CH.navMain.map(n => {
              const active = n.id === surface;
              return (
                <button key={n.id} onClick={() => { go(n.id); setMenuOpen(false); }} style={{
                  display:"flex", alignItems:"center", gap:12, width:"100%",
                  padding:"13px 12px", borderRadius:"var(--r-sm)", textAlign:"left",
                  fontFamily:"var(--font)", fontSize:"1rem", fontWeight:active?400:300,
                  background:active?"rgba(255,255,255,.10)":"transparent",
                  color:active?"var(--chrome-text)":"var(--chrome-muted)",
                  borderLeft:"3px solid "+(active?"var(--primary)":"transparent"),
                  marginBottom:2,
                }}>
                  <Icon name={n.icon} size={18}/>{n.label}
                </button>
              );
            })}
            <div style={{ borderTop:"1px solid rgba(255,255,255,.08)", marginTop:10, paddingTop:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <ThemeSwitcher theme={theme} setTheme={setTheme} mode={mode} setMode={setMode}/>
              <button onClick={() => { logout(); setMenuOpen(false); }} style={{ display:"flex", alignItems:"center", gap:7, color:"var(--chrome-muted)", fontSize:".85rem", padding:"6px 10px", borderRadius:"var(--r-xs)", border:"1px solid rgba(255,255,255,.14)" }}>
                <Icon name="log-out" size={14}/>Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StubSurface({ label }) {
  return (
    <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:"var(--text-muted)" }}>
      <Icon name="sparkles" size={28}/>
      <div style={{ fontSize:"1.1rem" }}>{label} — coming in this build</div>
    </div>
  );
}

function MemberStage({ children }) {
  return (
    <div className="scroll-area" style={{ height:"100%", overflowY:"auto", background:"var(--surface-2)" }}>
      <div style={{ minHeight:"100%", display:"flex", alignItems:"flex-start", justifyContent:"center", flexWrap:"wrap", gap:40, padding:"44px 32px 60px" }}>
        {children}
      </div>
    </div>
  );
}
window.MemberStage = MemberStage;

function App() {
  const { theme, setTheme, mode, setMode } = useThemeEngine();
  const { user, login, logout } = useAuth();

  const [surface,    setSurface]    = React.useState("site");
  const [showAuth,   setShowAuth]   = React.useState(false);
  const [authMode,   setAuthMode]   = React.useState("login");
  const [pendingSurf, setPending]   = React.useState(null);
  // which CMS page to open when entering cms
  const [cmsOpenTo, setCmsOpenTo]   = React.useState("dashboard");

  // Reset cmsOpenTo when leaving cms
  React.useEffect(() => {
    if (surface !== "cms") setCmsOpenTo("dashboard");
  }, [surface]);

  /* ── App-wide autofill ──
     Remembers every text field's last value (keyed by its `name`) and
     pre-fills empty fields on load and whenever new fields mount (modals,
     surface changes). Passwords, the honeypot, and autocomplete="off" fields
     are never stored. Values inject via the native setter + an input event so
     controlled React inputs pick them up. */
  React.useEffect(() => {
    const PREFIX = "churchora.af.";
    const keyFor = (el) => {
      if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return null;
      const type = (el.type || "text").toLowerCase();
      if (["password", "checkbox", "radio", "hidden", "file", "submit", "button", "image", "range", "color"].includes(type)) return null;
      const ac = (el.getAttribute("autocomplete") || "").toLowerCase();
      if (ac === "off" || /password/.test(ac)) return null;
      if (/pass(word)?/i.test(el.name || "")) return null;
      const k = el.name || el.id;
      return k || null;
    };
    const save = (el) => {
      const k = keyFor(el); if (!k) return;
      try {
        if (el.value) localStorage.setItem(PREFIX + k, String(el.value).slice(0, 1000));
        else localStorage.removeItem(PREFIX + k);
      } catch (e) {}
    };
    const inject = (el, val) => {
      const proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
      setter.call(el, val);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const restore = (root) => {
      const scope = root && root.querySelectorAll ? root : document;
      scope.querySelectorAll("input, textarea").forEach((el) => {
        const k = keyFor(el); if (!k || el.value) return; // never clobber typed/default values
        let saved = null;
        try { saved = localStorage.getItem(PREFIX + k); } catch (e) {}
        if (saved) inject(el, saved);
      });
    };

    const onInput = (e) => save(e.target);
    document.addEventListener("input", onInput, true);
    const t0 = setTimeout(() => restore(document), 80);
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if ((n.matches && n.matches("input, textarea")) || (n.querySelector && n.querySelector("input, textarea"))) {
            restore(n);
          }
        });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { document.removeEventListener("input", onInput, true); obs.disconnect(); clearTimeout(t0); };
  }, []);

  /* Navigate — "site" is always public; anything else requires auth */
  const go = React.useCallback((dest) => {
    if (dest === "site") { setSurface("site"); return; }
    if (!user) { setPending(dest); setAuthMode("login"); setShowAuth(true); return; }
    setSurface(dest);
  }, [user]);

  const goToSettings = React.useCallback(() => {
    setCmsOpenTo("settings");
    if (!user) { setPending("cms"); setAuthMode("login"); setShowAuth(true); return; }
    setSurface("cms");
  }, [user]);

  const handleAuth = (userData, remember = true) => {
    login(userData, remember);
    setShowAuth(false);
    const dest = pendingSurf || "cms";
    setPending(null);
    setSurface(dest);
  };

  const handleSignIn = (mode) => { setAuthMode(mode); setShowAuth(true); };

  /* ── Auth overlay ── */
  if (showAuth) {
    return <window.AuthScreen onAuth={handleAuth} initialMode={authMode} onBack={() => setShowAuth(false)} />;
  }

  /* ── Landing page (site) — handles its own nav ── */
  if (surface === "site") {
    return (
      <div key="site" className="anim-in" style={{ height:"100vh", overflow:"hidden", background:"var(--page)" }}>
        <window.MarketingSite
          go={go}
          user={user}
          onSignIn={handleSignIn}
          goToSettings={goToSettings}
          theme={theme} setTheme={setTheme}
          mode={mode}   setMode={setMode}
          onLogout={logout}
        />
      </div>
    );
  }

  /* ── App surfaces (require login, handled by go()) ── */
  const surfaces = {
    member: window.MemberApp,
    cms:    window.AdminCMS,
    sermon: window.SermonMode,
  };
  const Comp = surfaces[surface];

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"var(--page)" }}>
      <AppNavigator surface={surface} go={go} theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} user={user} logout={logout}/>
      <div style={{ flex:1, minHeight:0, position:"relative" }}>
        {/* key on surface only — theme/mode changes must NOT remount */}
        <div key={surface} className="anim-in" style={{ position:"absolute", inset:0, overflow:"hidden" }}>
          {Comp
            ? <Comp go={go} theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} openTo={cmsOpenTo}/>
            : <StubSurface label={surface}/>}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);

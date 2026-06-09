/* Churchora — Marketing website (fully responsive) */
const { Icon, Logo, Wordmark, Avatar, Btn, Pill, Eyebrow, IconChip, Segmented, Sparkline, useViewport, Hamburger } = window;

function Container({ children, style, narrow }) {
  const { isMobile } = useViewport();
  return (
    <div style={{ maxWidth: narrow ? 860 : 1180, margin: "0 auto", padding: isMobile ? "0 20px" : "0 32px", ...style }}>
      {children}
    </div>
  );
}

/* ── Scroll-animation helpers ── */
function useReveal(threshold = 0.09) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const root = document.getElementById("site-scroll") || null;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold, root });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, distance = 26, style, className }) {
  const [ref, visible] = useReveal(0.08);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : `translateY(${distance}px)`,
      transition: `opacity .7s ${delay}s cubic-bezier(.22,.61,.36,1), transform .7s ${delay}s cubic-bezier(.22,.61,.36,1)`,
      willChange: "opacity, transform",
      ...style,
    }}>{children}</div>
  );
}

function AnimSection({ id, children, style, padding }) {
  const outerRef = React.useRef(null);
  const [scale,    setScale]    = React.useState(1);
  const [opacity,  setOpacity]  = React.useState(1);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRevealed(true);
    }, { threshold: 0.05, root: el });
    if (outerRef.current) obs.observe(outerRef.current);
    const update = () => {
      if (!outerRef.current) return;
      const rect = outerRef.current.getBoundingClientRect();
      const cRect = el.getBoundingClientRect();
      const above = Math.max(0, (cRect.top + 72) - rect.top);
      const pct = Math.min(above / Math.max(rect.height * 0.55, 1), 1);
      setScale(1 - pct * 0.055);
      setOpacity(1 - pct * 0.18);
    };
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => { obs.disconnect(); el.removeEventListener("scroll", update); };
  }, []);

  return (
    <div ref={outerRef} style={{ transform: `scale(${scale}) translateZ(0)`, transformOrigin: "center top", transition: "transform .06s linear", opacity }}>
      <section id={id} style={{
        padding: padding || "80px 0",
        opacity:   revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(32px)",
        transition: "opacity .75s cubic-bezier(.22,.61,.36,1), transform .75s cubic-bezier(.22,.61,.36,1)",
        ...style,
      }}>{children}</section>
    </div>
  );
}

/* ── Site Header ── */
function SiteHeader({ go, user, onSignIn, goToSettings }) {
  const { isMobileOrTablet } = useViewport();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 12);
    el.addEventListener("scroll", fn); return () => el.removeEventListener("scroll", fn);
  }, []);

  // close menu on resize to desktop
  React.useEffect(() => { if (!isMobileOrTablet) setMenuOpen(false); }, [isMobileOrTablet]);

  const publicLinks = ["Features", "Sermons", "Pricing", "Contact"];
  const authedLinks = ["Features", "Sermons", "Pricing"];
  const links = user ? authedLinks : publicLinks;

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: (scrolled || menuOpen) ? "color-mix(in srgb, var(--page) 92%, transparent)" : "transparent",
        backdropFilter: (scrolled || menuOpen) ? "blur(14px)" : "none",
        WebkitBackdropFilter: (scrolled || menuOpen) ? "blur(14px)" : "none",
        borderBottom: (scrolled || menuOpen) ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all var(--dur) var(--ease)",
      }}>
        <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <button onClick={() => { go("site"); setMenuOpen(false); }} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            <Wordmark size={isMobileOrTablet ? 16 : 19} />
          </button>

          {/* Desktop nav */}
          {!isMobileOrTablet && (
            <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {links.map(l => (
                <a key={l} href={"#" + l.toLowerCase()}
                  onClick={e => { e.preventDefault(); scrollTo(l); }}
                  style={{ padding: "8px 15px", fontSize: ".94rem", color: "var(--text-muted)", borderRadius: "var(--r-xs)", cursor: "pointer", transition: "color var(--dur) var(--ease)", fontWeight: 300 }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>{l}</a>
              ))}
            </nav>
          )}

          {/* Desktop auth buttons */}
          {!isMobileOrTablet && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {user ? (
                <button onClick={goToSettings} title="Settings" style={{
                  width: 38, height: 38, borderRadius: "50%", background: "var(--primary)",
                  color: "var(--primary-contrast)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".78rem", fontWeight: 600,
                }}>{user.initials}</button>
              ) : (
                <>
                  <Btn variant="ghost" size="sm" onClick={() => onSignIn("login")}>Sign in</Btn>
                  <Btn variant="primary" size="sm" iconRight="arrow-right" onClick={() => onSignIn("signup")}>Start free</Btn>
                </>
              )}
            </div>
          )}

          {/* Mobile/tablet right: [avatar if logged in] + hamburger */}
          {isMobileOrTablet && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {user && (
                <button onClick={() => { goToSettings(); setMenuOpen(false); }} style={{
                  width: 36, height: 36, borderRadius: "50%", background: "var(--primary)",
                  color: "var(--primary-contrast)", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".75rem", fontWeight: 600,
                }}>{user.initials}</button>
              )}
              <button onClick={() => setMenuOpen(m => !m)} style={{
                width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                background: "none", border: "none", cursor: "pointer", color: "var(--text)",
              }}>
                <Hamburger open={menuOpen} size={22} />
              </button>
            </div>
          )}
        </Container>
      </header>

      {/* Mobile/tablet slide-down menu */}
      {isMobileOrTablet && (
        <div style={{
          position: "sticky", top: 68, zIndex: 29,
          background: "color-mix(in srgb, var(--surface) 96%, transparent)",
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderBottom: menuOpen ? "1px solid var(--border)" : "none",
          maxHeight: menuOpen ? 480 : 0,
          overflow: "hidden",
          transition: "max-height .32s cubic-bezier(.22,.61,.36,1)",
        }}>
          <div style={{ padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map(l => (
              <button key={l} onClick={() => scrollTo(l)} style={{
                textAlign: "left", padding: "13px 16px", borderRadius: "var(--r-sm)",
                fontSize: "1.05rem", fontWeight: 300, color: "var(--text)",
                background: "none", border: "none", cursor: "pointer",
                borderBottom: "1px solid var(--border)",
              }}>{l}</button>
            ))}
            {!user && (
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Btn variant="ghost" style={{ flex: 1 }} onClick={() => { onSignIn("login"); setMenuOpen(false); }}>Sign in</Btn>
                <Btn variant="primary" style={{ flex: 1 }} iconRight="arrow-right" onClick={() => { onSignIn("signup"); setMenuOpen(false); }}>Start free</Btn>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Hero ── */
function HeroVerseCard() {
  return (
    <div className="card" style={{ padding: 26, boxShadow: "var(--shadow-lg)", borderRadius: "var(--r-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <Eyebrow>Verse of the day</Eyebrow>
        <Pill kind="accent">Hope</Pill>
      </div>
      <p className="serif-verse" style={{ fontSize: "1.5rem", lineHeight: 1.4, color: "var(--text)", letterSpacing: "-.015em" }}>
        "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <span className="mono" style={{ fontSize: ".9rem", color: "var(--primary)", fontWeight: 400 }}>Jeremiah 29:11 · NIV</span>
        <div style={{ display: "flex", gap: 8 }}>
          {["heart", "bookmark", "share"].map(ic => (
            <span key={ic} style={{ width: 34, height: 34, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", background: "var(--surface-2)" }}>
              <Icon name={ic} size={16} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroGiveCard() {
  return (
    <div className="card" style={{ padding: 20, boxShadow: "var(--shadow-md)", borderRadius: "var(--r-lg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <IconChip name="hand-coins" size={42} tone="success" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: ".82rem", color: "var(--text-muted)" }}>Tithe received</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 500, letterSpacing: "-.02em" }}>GHS 500.00</div>
        </div>
        <Pill kind="success" dot>Completed</Pill>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
        <span style={{ width: 26, height: 26, borderRadius: 6, background: "#FFCC00", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", fontWeight: 700, color: "#1a1a1a" }}>MTN</span>
        <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>MTN MoMo · in 4 seconds</span>
      </div>
    </div>
  );
}

function HeroCards({ scrollY }) {
  const ref = React.useRef(null);
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = React.useState(false);
  const targetRef = React.useRef({ x: 0, y: 0 });
  const currentRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      const t = targetRef.current, c = currentRef.current;
      c.x += (t.x - c.x) * 0.09; c.y += (t.y - c.y) * 0.09;
      setMouse({ x: c.x, y: c.y });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { running = false; };
  }, []);

  const onMove  = (e) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); targetRef.current = { x: (e.clientX-r.left)/r.width-.5, y: (e.clientY-r.top)/r.height-.5 }; };
  const onLeave = () => { targetRef.current = { x: 0, y: 0 }; setHovered(false); };
  const onEnter = () => setHovered(true);

  const parallax = scrollY * 0.06;
  const ease = "transform 0.05s linear";

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onEnter}
      className="anim-up" style={{ animationDelay: ".1s", position: "relative", display: "flex", flexDirection: "column", gap: 18, perspective: 1200 }}>
      <div style={{ transform: `translateY(${-parallax}px) rotateX(${mouse.y*-9}deg) rotateY(${mouse.x*9}deg) scale(${hovered?1.025:1})`, transition: hovered?ease:"transform .6s cubic-bezier(.22,.61,.36,1)", transformStyle:"preserve-3d", willChange:"transform", filter:hovered?"drop-shadow(0 28px 40px rgba(0,0,0,.18))":"none" }}>
        <HeroVerseCard />
      </div>
      <div style={{ marginLeft: 48, marginRight: -8, transform: `translateY(${-parallax*.55}px) rotateX(${mouse.y*-5}deg) rotateY(${mouse.x*5}deg) scale(${hovered?1.015:1})`, transition: hovered?ease:"transform .75s cubic-bezier(.22,.61,.36,1)", transformStyle:"preserve-3d", willChange:"transform", filter:hovered?"drop-shadow(0 18px 28px rgba(0,0,0,.14))":"none" }}>
        <HeroGiveCard />
      </div>
      {hovered && <div style={{ position:"absolute", pointerEvents:"none", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,var(--primary-tint) 0%,transparent 70%)", opacity:.55, left:`calc(50% + ${mouse.x*120}px)`, top:`calc(50% + ${mouse.y*120}px)`, transform:"translate(-50%,-50%)", transition:"left .05s linear,top .05s linear" }}/>}
    </div>
  );
}

function Hero({ go, scrollY }) {
  const { isMobile, isTablet } = useViewport();
  const isSmall = isMobile || isTablet;

  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => {};
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <section style={{ position: "relative", paddingTop: isSmall ? 48 : 70, paddingBottom: isSmall ? 56 : 90, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -160, right: -120, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,var(--primary-tint) 0%,transparent 68%)", opacity: .9, pointerEvents: "none" }} />
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1.05fr .95fr", gap: isSmall ? 40 : 64, alignItems: "center" }}>
          {/* Text content — always first */}
          <div>
            <div className="anim-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 6px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, marginBottom: isSmall ? 20 : 28 }}>
              <Pill kind="primary">New</Pill>
              <span style={{ fontSize: ".84rem", color: "var(--text-muted)" }}>Sermon live-sync is here</span>
            </div>
            <h1 className="anim-up" style={{
              animationDelay: ".05s", marginBottom: isSmall ? 16 : 22,
              fontSize: isMobile ? "clamp(2.6rem, 12vw, 3.6rem)" : isTablet ? "clamp(2.8rem, 7vw, 4.2rem)" : "clamp(3.2rem, 6.5vw, 5.2rem)",
              lineHeight: 1.0, letterSpacing: "-.03em", fontWeight: 400,
            }}>
              Church<br/>Management<br/>Made Easier
            </h1>
            <p className="lead anim-up" style={{ animationDelay: ".12s", maxWidth: isSmall ? "100%" : 480, marginBottom: isSmall ? 24 : 34, fontSize: isMobile ? "1rem" : "1.1875rem" }}>
              Churchora brings giving, members, scripture and Sunday service into one quiet, beautiful place.
            </p>
            <div className="anim-up" style={{ animationDelay: ".18s", display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn variant="primary" size={isSmall ? "default" : "lg"} iconRight="arrow-right" onClick={() => go("cms")}>Start free</Btn>
              <Btn variant="ghost" size={isSmall ? "default" : "lg"} icon="play" onClick={() => go("sermon")}>See sermon mode</Btn>
            </div>
            <div className="anim-up" style={{ animationDelay: ".24s", display: "flex", alignItems: "center", gap: 14, marginTop: isSmall ? 24 : 36 }}>
              <div style={{ display: "flex" }}>
                {CH.members.slice(0, 4).map((m, i) => (
                  <span key={m.id} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={m.name} tone={m.tone} size={32} ring /></span>
                ))}
              </div>
              <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>Trusted by <b style={{ fontWeight: 500, color: "var(--text)" }}>1,200+</b> congregations</span>
            </div>
          </div>

          {/* Cards — desktop: 3D parallax, mobile/tablet: static stacked */}
          {isSmall ? (
            <div className="anim-up" style={{ animationDelay: ".14s", display: "flex", flexDirection: "column", gap: 14 }}>
              <HeroVerseCard />
              <div style={{ marginLeft: isMobile ? 0 : 32 }}><HeroGiveCard /></div>
            </div>
          ) : (
            <HeroCards scrollY={scrollY} />
          )}
        </div>
      </Container>
    </section>
  );
}

/* ── Trust strip ── */
function CountUp({ target, prefix = "", suffix = "", decimals = 0, duration = 1600 }) {
  const [val, setVal] = React.useState(0);
  const ref = React.useRef(null);
  const started = React.useRef(false);
  React.useEffect(() => {
    const root = document.getElementById("site-scroll") || null;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(+(eased * target).toFixed(decimals));
        if (p < 1) requestAnimationFrame(tick); else setVal(target);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4, root });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, decimals]);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function TrustStrip() {
  const { isMobile } = useViewport();
  const items = [
    { target: 1200,  prefix: "",     suffix: "+",  decimals: 0, label: "Congregations"  },
    { target: 4.2,   prefix: "GHS ", suffix: "M",  decimals: 1, label: "Given monthly"  },
    { target: 68000, prefix: "",     suffix: "",   decimals: 0, label: "Members served" },
    { target: 99.9,  prefix: "",     suffix: "%",  decimals: 1, label: "Uptime"         },
  ];
  return (
    <Container>
      <Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: isMobile ? 20 : 24, padding: "30px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          {items.map(item => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? "1.5rem" : "1.9rem", fontWeight: 500, letterSpacing: "-.025em" }}>
                <CountUp target={item.target} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals} />
              </div>
              <div className="eyebrow" style={{ marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}

/* ── Features ── */
const FEATURES = [
  { icon: "hand-coins",   tone: "success", title: "Giving that just works",    body: "Tithes and offerings by MTN MoMo, Vodafone Cash or card. Recurring gifts, pledges and instant receipts." },
  { icon: "cake",         tone: "warn",    title: "Birthdays, never missed",   body: "Upcoming-birthday widgets and one-tap wishes keep your community feeling seen and remembered." },
  { icon: "book-open",    tone: "primary", title: "Scripture, shared daily",   body: "Post a verse of the day, search any reference across translations, and let members save and share." },
  { icon: "presentation", tone: "info",    title: "Sermon live-sync",          body: "Queue verses ahead of service and push them to the projection screen live — in perfect time." },
  { icon: "users",        tone: "accent",  title: "Members & groups",          body: "A warm directory of every member, group and leader — with the history that matters." },
  { icon: "trending-up",  tone: "danger",  title: "Reports you'll read",       body: "Giving trends, attendance and pledge progress in views your treasurer will actually open." },
];

function Features() {
  const { isMobile, isTablet } = useViewport();
  const cols = isMobile ? 1 : isTablet ? 2 : 3;
  return (
    <AnimSection id="features">
      <Container>
        <Reveal style={{ maxWidth: 620, marginBottom: isMobile ? 36 : 56 }}>
          <Eyebrow style={{ marginBottom: 14 }}>One quiet platform</Eyebrow>
          <h2 className="display" style={{ marginBottom: 16, fontSize: isMobile ? "1.9rem" : "2.75rem" }}>Everything a church carries, gently held.</h2>
          <p className="lead">Six tools that usually live in six spreadsheets — brought together with the calm and care your ministry deserves.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: isMobile ? 14 : 20 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * .05}>
              <div className="card card-pad" style={{ borderRadius: "var(--r-lg)", height: "100%" }}>
                <IconChip name={f.icon} tone={f.tone} size={isMobile ? 40 : 48} style={{ marginBottom: 16 }} />
                <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>{f.title}</h3>
                <p className="muted" style={{ fontSize: ".94rem" }}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </AnimSection>
  );
}

/* ── Sermon showcase ── */
function SermonShowcase({ go }) {
  const { isMobile } = useViewport();
  return (
    <AnimSection id="sermons" padding={isMobile ? "48px 0" : "60px 0"}>
      <Container>
        <Reveal>
          <div style={{
            background: "var(--chrome)", borderRadius: "var(--r-xl)",
            padding: isMobile ? "36px 24px" : "56px 56px",
            color: "var(--chrome-text)",
            display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr",
            gap: isMobile ? 32 : 56, alignItems: "center", overflow: "hidden", position: "relative",
          }}>
            <div style={{ position: "absolute", bottom: -120, left: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,var(--primary) 0%,transparent 70%)", opacity: .28, pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--chrome-muted)", marginBottom: 16 }}>
                <Icon name="radio" size={16} /><span className="eyebrow" style={{ color: "var(--chrome-muted)" }}>Live during service</span>
              </div>
              <h2 style={{ fontSize: isMobile ? "1.6rem" : "2.4rem", lineHeight: 1.1, letterSpacing: "-.025em", color: "var(--chrome-text)", marginBottom: 16 }}>Push the next verse to the screen, in time.</h2>
              <p style={{ fontSize: "1rem", lineHeight: 1.55, color: "var(--chrome-muted)", marginBottom: 24, maxWidth: 420 }}>
                Build your reading list before Sunday. Advance verses from your phone and the congregation sees them instantly.
              </p>
              <Btn variant="primary" size={isMobile ? "default" : "lg"} iconRight="arrow-right" onClick={() => go("sermon")}>Open sermon mode</Btn>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ background: "#05080c", border: "1px solid rgba(255,255,255,.12)", borderRadius: "var(--r-lg)", padding: isMobile ? "28px 22px" : "44px 40px", boxShadow: "0 30px 60px rgba(0,0,0,.4)" }}>
                <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 16 }}>Now showing · Psalm 23</div>
                <p className="serif-verse" style={{ fontSize: isMobile ? "1.2rem" : "1.7rem", lineHeight: 1.4, color: "#fff" }}>"The Lord is my shepherd; I shall not want."</p>
                <div className="mono" style={{ marginTop: 18, color: "rgba(255,255,255,.65)", fontSize: ".9rem" }}>Psalm 23:1 · NKJV</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
                {[0,1,2,3,4].map(i => <span key={i} style={{ width: i===0?22:7, height: 7, borderRadius: 99, background: i===0?"var(--primary)":"rgba(255,255,255,.2)" }} />)}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </AnimSection>
  );
}

/* ── Pricing ── */
function PlanCard({ plan, go }) {
  const featured = plan.featured;
  return (
    <div className="card" style={{
      padding: 32, borderRadius: "var(--r-lg)",
      border: featured ? "1.5px solid var(--primary)" : "1px solid var(--border)",
      boxShadow: featured ? "var(--shadow-lg)" : "var(--shadow-sm)",
      position: "relative", background: "var(--surface)",
    }}>
      {featured && <div style={{ position: "absolute", top: -12, left: 32 }}><Pill kind="primary" style={{ background: "var(--primary)", color: "var(--primary-contrast)" }}>Most popular</Pill></div>}
      <h3 style={{ fontSize: "1.35rem", marginBottom: 6 }}>{plan.name}</h3>
      <p className="muted" style={{ fontSize: ".92rem", minHeight: 40, marginBottom: 18 }}>{plan.tagline}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 22 }}>
        <span style={{ fontSize: "3rem", fontWeight: 500, letterSpacing: "-.03em" }}>{plan.price === 0 ? "Free" : "$" + plan.price}</span>
        {plan.price !== 0 && <span className="muted" style={{ fontSize: ".95rem" }}>/ {plan.cadence}</span>}
      </div>
      <Btn variant={featured ? "primary" : "ghost"} size="lg" className="btn-block" iconRight="arrow-right" onClick={() => go("cms")} style={{ marginBottom: 26 }}>
        {plan.price === 0 ? "Start on Basic" : "Choose Advanced"}
      </Btn>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }}><Icon name="check" size={17} /></span>
            <span style={{ fontSize: ".94rem" }}>{f}</span>
          </div>
        ))}
        {plan.missing.map(f => (
          <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: .4 }}>
            <span style={{ color: "var(--text-subtle)", marginTop: 2, flexShrink: 0 }}><Icon name="x" size={17} /></span>
            <span style={{ fontSize: ".94rem", textDecoration: "line-through" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing({ go }) {
  const { isMobile } = useViewport();
  return (
    <AnimSection id="pricing">
      <Container>
        <Reveal style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 48px" }}>
          <Eyebrow style={{ marginBottom: 14 }}>Simple pricing</Eyebrow>
          <h2 className="display" style={{ marginBottom: 16, fontSize: isMobile ? "1.9rem" : "2.75rem" }}>Start free. Grow when you're ready.</h2>
          <p className="lead">Every church begins on Basic at no cost. Unlock live service tools with Advanced.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, maxWidth: 900, margin: "0 auto" }}>
          {CH.plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * .1}><PlanCard plan={plan} go={go} /></Reveal>
          ))}
        </div>
        <Reveal style={{ textAlign: "center", marginTop: 24 }}>
          <p className="subtle" style={{ fontSize: ".88rem" }}>All prices in USD · billed monthly · cancel anytime</p>
        </Reveal>
      </Container>
    </AnimSection>
  );
}

/* ── Contact ── */
function ContactSection() {
  const { isMobile } = useViewport();
  const [form, setForm] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");

  const handle = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(""); };
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setError("Please fill in your name, email and message."); return; }
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1100);
  };

  return (
    <AnimSection id="contact">
      <Container narrow>
        <Reveal style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 48px" }}>
          <Eyebrow style={{ marginBottom: 14 }}>Get in touch</Eyebrow>
          <h2 className="display" style={{ marginBottom: 16, fontSize: isMobile ? "1.9rem" : "2.75rem" }}>We'd love to hear from you.</h2>
          <p className="lead">Questions, partnership ideas, or just want to say hello — we read every message.</p>
        </Reveal>
        {sent ? (
          <Reveal style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--success-tint)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="check" size={36} />
            </div>
            <h3 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Message sent!</h3>
            <p className="muted">We'll get back to you at <b style={{ color: "var(--text)" }}>{form.email}</b> within a day or two.</p>
            <button className="btn btn-ghost" style={{ marginTop: 20 }} onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>Send another</button>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={submit} style={{ maxWidth: 620, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Your name</label>
                  <input value={form.name} onChange={handle("name")} placeholder="Adwoa Mensah" className="field" required />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Email address</label>
                  <input type="email" value={form.email} onChange={handle("email")} placeholder="you@church.org" className="field" required />
                </div>
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Subject</label>
                <input value={form.subject} onChange={handle("subject")} placeholder="How can we help?" className="field" />
              </div>
              <div>
                <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Message</label>
                <textarea value={form.message} onChange={handle("message")} rows={5} placeholder="Tell us more…" className="field" required />
              </div>
              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", background: "var(--danger-tint)", borderRadius: "var(--r-sm)", color: "var(--danger)", fontSize: ".87rem" }}>
                  <Icon name="alert-triangle" size={16} style={{ flexShrink: 0 }} />{error}
                </div>
              )}
              <div>
                <button type="submit" disabled={sending} className="btn btn-primary btn-lg">
                  {sending ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.35)", borderTopColor: "#fff", animation: "ch-spin .7s linear infinite", display: "inline-block" }} />
                      Sending…
                    </span>
                  ) : "Send message"}
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </Container>
    </AnimSection>
  );
}

/* ── Footer ── */
function SiteFooter() {
  const { isMobile, isTablet } = useViewport();
  const cols = { Product: ["Features","Giving","Sermon sync","Pricing"], Church: ["Members","Groups","Reports","Audit log"], Company: ["About","Stories","Support","Status"] };
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: isMobile ? "40px 0 32px" : "56px 0 40px" }}>
      <Container style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1.4fr 1fr 1fr 1fr", gap: isMobile ? 32 : 32 }}>
        <div>
          <Wordmark size={18} />
          <p className="muted" style={{ fontSize: ".9rem", marginTop: 14, maxWidth: 240 }}>Your church partner — for giving, people and the Word.</p>
        </div>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>{h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {items.map(i => <a key={i} href="#" className="muted" style={{ fontSize: ".92rem" }}>{i}</a>)}
            </div>
          </div>
        ))}
      </Container>
      <Container style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 8, marginTop: 36, paddingTop: 22, borderTop: "1px solid var(--border)" }}>
        <span className="subtle" style={{ fontSize: ".84rem" }}>© 2026 Churchora. All rights reserved.</span>
        <span className="subtle" style={{ fontSize: ".84rem" }}>Privacy · Terms · Security</span>
      </Container>
    </footer>
  );
}

/* ── Root ── */
function MarketingSite({ go, user, onSignIn, goToSettings, theme, setTheme, mode, setMode, onLogout }) {
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <div id="site-scroll" className="scroll-area" style={{ height: "100%", overflowY: "auto", background: "var(--page)" }}>
      <SiteHeader go={go} user={user} onSignIn={onSignIn} goToSettings={goToSettings} />
      <Hero go={go} scrollY={scrollY} />
      <TrustStrip />
      <Features />
      <SermonShowcase go={go} />
      <Pricing go={go} />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}

window.MarketingSite = MarketingSite;
window.Container = Container;

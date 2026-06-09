/* Churchora — Marketing website */
const { Icon, Logo, Wordmark, Avatar, Btn, Pill, Eyebrow, IconChip, Segmented, Sparkline } = window;

function Container({ children, style, narrow }) {
  return <div style={{ maxWidth: narrow ? 860 : 1180, margin:"0 auto", padding:"0 32px", ...style }}>{children}</div>;
}

/* ─────────────────────────────────────────────
   Scroll-animation helpers
───────────────────────────────────────────── */
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

/* Fade-up reveal on scroll into view */
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

/* Section wrapper: reveals on enter, scales down as it exits upward */
function AnimSection({ id, children, style, padding }) {
  const outerRef = React.useRef(null);
  const [scale,   setScale]   = React.useState(1);
  const [opacity, setOpacity] = React.useState(1);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;

    // reveal observer
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRevealed(true);
    }, { threshold: 0.05, root: el });
    if (outerRef.current) obs.observe(outerRef.current);

    // exit-upward scale listener
    const update = () => {
      if (!outerRef.current) return;
      const rect  = outerRef.current.getBoundingClientRect();
      const cRect = el.getBoundingClientRect();
      const above = Math.max(0, (cRect.top + 72) - rect.top);
      const pct   = Math.min(above / Math.max(rect.height * 0.55, 1), 1);
      setScale(1 - pct * 0.055);
      setOpacity(1 - pct * 0.18);
    };
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => { obs.disconnect(); el.removeEventListener("scroll", update); };
  }, []);

  return (
    <div ref={outerRef} style={{
      transform: `scale(${scale}) translateZ(0)`,
      transformOrigin: "center top",
      transition: "transform .06s linear, opacity .06s linear",
      opacity,
    }}>
      <section id={id} style={{
        padding: padding || "104px 0",
        opacity:   revealed ? 1 : 0,
        transform: revealed ? "none" : "translateY(32px)",
        transition: "opacity .75s cubic-bezier(.22,.61,.36,1), transform .75s cubic-bezier(.22,.61,.36,1)",
        ...style,
      }}>
        {children}
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Header — two variants based on auth state
───────────────────────────────────────────── */
function SiteHeader({ go, user, onSignIn, goToSettings, theme, setTheme, mode, setMode, onLogout }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 12);
    el.addEventListener("scroll", fn); return () => el.removeEventListener("scroll", fn);
  }, []);

  const publicLinks  = ["Features", "Sermons", "Pricing", "Contact"];
  const authedLinks  = ["Features", "Sermons", "Pricing"];
  const links = user ? authedLinks : publicLinks;

  return (
    <header style={{
      position:"sticky", top:0, zIndex:30,
      background: scrolled ? "color-mix(in srgb, var(--page) 85%, transparent)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition:"all var(--dur) var(--ease)",
    }}>
      <Container style={{ display:"flex", alignItems:"center", justifyContent:"space-between", height:76 }}>
        <button onClick={() => go("site")} style={{ background:"none", border:"none", padding:0, cursor:"pointer" }}>
          <Wordmark size={19}/>
        </button>

        <nav style={{ display:"flex", gap:4, alignItems:"center" }}>
          {links.map(l => (
            <a key={l} href={"#" + l.toLowerCase()}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(l.toLowerCase())
                  ?.scrollIntoView({ behavior:"smooth", block:"start" });
              }}
              style={{ padding:"8px 15px", fontSize:".94rem", color:"var(--text-muted)", borderRadius:"var(--r-xs)", transition:"color var(--dur) var(--ease)", fontWeight:300, cursor:"pointer" }}
              onMouseEnter={e => e.currentTarget.style.color="var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color="var(--text-muted)"}>{l}</a>
          ))}
        </nav>

        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          {user ? (
            /* Logged-in: profile avatar → settings */
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <button onClick={goToSettings} title="Settings" style={{
                width:38, height:38, borderRadius:"50%", background:"var(--primary)",
                color:"var(--primary-contrast)", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:".78rem", fontWeight:600, boxShadow:"var(--shadow-sm)",
              }}>{user.initials}</button>
            </div>
          ) : (
            /* Logged-out: Sign in → login, Start free → signup */
            <>
              <Btn variant="ghost" size="sm" onClick={() => onSignIn("login")}>Sign in</Btn>
              <Btn variant="primary" size="sm" iconRight="arrow-right" onClick={() => onSignIn("signup")}>Start free</Btn>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Hero
───────────────────────────────────────────── */
function HeroVerseCard() {
  return (
    <div className="card" style={{ padding:26, boxShadow:"var(--shadow-lg)", borderRadius:"var(--r-lg)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <Eyebrow>Verse of the day</Eyebrow>
        <Pill kind="accent">Hope</Pill>
      </div>
      <p className="serif-verse" style={{ fontSize:"1.5rem", lineHeight:1.4, color:"var(--text)", letterSpacing:"-.015em" }}>
        "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you."
      </p>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20 }}>
        <span className="mono" style={{ fontSize:".9rem", color:"var(--primary)", fontWeight:400 }}>Jeremiah 29:11 · NIV</span>
        <div style={{ display:"flex", gap:8 }}>
          {["heart","bookmark","share"].map(ic => (
            <span key={ic} style={{ width:34, height:34, borderRadius:8, display:"inline-flex", alignItems:"center", justifyContent:"center", color:"var(--text-muted)", background:"var(--surface-2)" }}>
              <Icon name={ic} size={16}/>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroGiveCard() {
  return (
    <div className="card" style={{ padding:20, boxShadow:"var(--shadow-md)", borderRadius:"var(--r-lg)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <IconChip name="hand-coins" size={42} tone="success"/>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:".82rem", color:"var(--text-muted)" }}>Tithe received</div>
          <div style={{ fontSize:"1.4rem", fontWeight:500, letterSpacing:"-.02em" }}>GHS 500.00</div>
        </div>
        <Pill kind="success" dot>Completed</Pill>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:14, paddingTop:14, borderTop:"1px solid var(--border)" }}>
        <span style={{ width:26, height:26, borderRadius:6, background:"#FFCC00", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:".6rem", fontWeight:700, color:"#1a1a1a" }}>MTN</span>
        <span style={{ fontSize:".85rem", color:"var(--text-muted)" }}>MTN MoMo · in 4 seconds</span>
      </div>
    </div>
  );
}

function HeroCards({ scrollY }) {
  const ref       = React.useRef(null);
  const [mouse, setMouse]     = React.useState({ x:0, y:0 });
  const [hovered, setHovered] = React.useState(false);
  const targetRef  = React.useRef({ x:0, y:0 });
  const currentRef = React.useRef({ x:0, y:0 });

  React.useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      const t = targetRef.current, c = currentRef.current;
      c.x += (t.x - c.x) * 0.09;
      c.y += (t.y - c.y) * 0.09;
      setMouse({ x: c.x, y: c.y });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { running = false; };
  }, []);

  const onMove  = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    targetRef.current = { x:(e.clientX-r.left)/r.width-.5, y:(e.clientY-r.top)/r.height-.5 };
  };
  const onLeave = () => { targetRef.current = { x:0, y:0 }; setHovered(false); };
  const onEnter = () => setHovered(true);

  const parallax = scrollY * 0.06;
  const ease     = "transform 0.05s linear";

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onEnter}
      className="anim-up" style={{ animationDelay:".1s", position:"relative", display:"flex", flexDirection:"column", gap:18, perspective:1200 }}>
      <div style={{
        transform:`translateY(${-parallax}px) rotateX(${mouse.y*-9}deg) rotateY(${mouse.x*9}deg) scale(${hovered?1.025:1})`,
        transition: hovered ? ease : "transform .6s cubic-bezier(.22,.61,.36,1)",
        transformStyle:"preserve-3d", willChange:"transform",
        filter: hovered ? "drop-shadow(0 28px 40px rgba(0,0,0,.18))" : "none",
      }}><HeroVerseCard/></div>

      <div style={{
        marginLeft:48, marginRight:-8,
        transform:`translateY(${-parallax*.55}px) rotateX(${mouse.y*-5}deg) rotateY(${mouse.x*5}deg) scale(${hovered?1.015:1})`,
        transition: hovered ? ease : "transform .75s cubic-bezier(.22,.61,.36,1)",
        transformStyle:"preserve-3d", willChange:"transform",
        filter: hovered ? "drop-shadow(0 18px 28px rgba(0,0,0,.14))" : "none",
      }}><HeroGiveCard/></div>

      {hovered && (
        <div style={{
          position:"absolute", pointerEvents:"none",
          width:320, height:320, borderRadius:"50%",
          background:"radial-gradient(circle, var(--primary-tint) 0%, transparent 70%)",
          opacity:.55,
          left:`calc(50% + ${mouse.x*120}px)`, top:`calc(50% + ${mouse.y*120}px)`,
          transform:"translate(-50%,-50%)", transition:"left .05s linear, top .05s linear",
        }}/>
      )}
    </div>
  );
}

function Hero({ go, scrollY }) {
  return (
    <section style={{ position:"relative", paddingTop:70, paddingBottom:90, overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-160, right:-120, width:620, height:620, borderRadius:"50%", background:"radial-gradient(circle,var(--primary-tint) 0%,transparent 68%)", opacity:.9, pointerEvents:"none" }}/>
      <Container style={{ position:"relative", display:"grid", gridTemplateColumns:"1.05fr .95fr", gap:64, alignItems:"center" }}>
        <div>
          <div className="anim-up" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px 6px 6px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:999, marginBottom:28 }}>
            <Pill kind="primary">New</Pill>
            <span style={{ fontSize:".84rem", color:"var(--text-muted)" }}>Sermon live-sync is here</span>
          </div>
          <h1 className="anim-up" style={{
            animationDelay:".05s", marginBottom:22,
            fontSize:"clamp(3.2rem, 6.5vw, 5.2rem)",
            lineHeight:1.0, letterSpacing:"-.03em", fontWeight:400,
          }}>
            Church<br/>Management<br/>Made Easier
          </h1>
          <p className="lead anim-up" style={{ animationDelay:".12s", maxWidth:480, marginBottom:34 }}>
            Churchora brings giving, members, scripture and Sunday service into one quiet, beautiful place — so your team can tend to people, not paperwork.
          </p>
          <div className="anim-up" style={{ animationDelay:".18s", display:"flex", gap:12, flexWrap:"wrap" }}>
            <Btn variant="primary" size="lg" iconRight="arrow-right" onClick={() => go("cms")}>Start free</Btn>
            <Btn variant="ghost" size="lg" icon="play" onClick={() => go("sermon")}>See sermon mode</Btn>
          </div>
          <div className="anim-up" style={{ animationDelay:".24s", display:"flex", alignItems:"center", gap:14, marginTop:36 }}>
            <div style={{ display:"flex" }}>
              {CH.members.slice(0,4).map((m,i) => (
                <span key={m.id} style={{ marginLeft:i?-10:0 }}><Avatar name={m.name} tone={m.tone} size={34} ring/></span>
              ))}
            </div>
            <span style={{ fontSize:".88rem", color:"var(--text-muted)" }}>Trusted by <b style={{ fontWeight:500, color:"var(--text)" }}>1,200+</b> congregations</span>
          </div>
        </div>
        <HeroCards scrollY={scrollY}/>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Count-up trust strip
───────────────────────────────────────────── */
function CountUp({ target, prefix="", suffix="", decimals=0, duration=1600 }) {
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
        const p     = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(+(eased * target).toFixed(decimals));
        if (p < 1) requestAnimationFrame(tick); else setVal(target);
      };
      requestAnimationFrame(tick);
    }, { threshold:0.4, root });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, decimals]);
  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function TrustStrip() {
  const items = [
    { target:1200,  prefix:"",    suffix:"+",  decimals:0, label:"Congregations"  },
    { target:4.2,   prefix:"GHS ",suffix:"M",  decimals:1, label:"Given monthly"  },
    { target:68000, prefix:"",    suffix:"",   decimals:0, label:"Members served" },
    { target:99.9,  prefix:"",    suffix:"%",  decimals:1, label:"Uptime"         },
  ];
  return (
    <Container>
      <Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, padding:"30px 0", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }}>
          {items.map(item => (
            <div key={item.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:"1.9rem", fontWeight:500, letterSpacing:"-.025em" }}>
                <CountUp target={item.target} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals}/>
              </div>
              <div className="eyebrow" style={{ marginTop:4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}

/* ─────────────────────────────────────────────
   Features
───────────────────────────────────────────── */
const FEATURES = [
  { icon:"hand-coins",  tone:"success", title:"Giving that just works",    body:"Tithes and offerings by MTN MoMo, Vodafone Cash or card. Recurring gifts, pledges and instant receipts." },
  { icon:"cake",        tone:"warn",    title:"Birthdays, never missed",   body:"Upcoming-birthday widgets and one-tap wishes keep your community feeling seen and remembered." },
  { icon:"book-open",   tone:"primary", title:"Scripture, shared daily",   body:"Post a verse of the day, search any reference across translations, and let members save and share." },
  { icon:"presentation",tone:"info",   title:"Sermon live-sync",          body:"Queue verses ahead of service and push them to the projection screen live — in perfect time." },
  { icon:"users",       tone:"accent",  title:"Members & groups",          body:"A warm directory of every member, group and leader — with the history that matters." },
  { icon:"trending-up", tone:"danger",  title:"Reports you'll read",       body:"Giving trends, attendance and pledge progress in views your treasurer will actually open." },
];

function Features() {
  return (
    <AnimSection id="features">
      <Container>
        <Reveal style={{ maxWidth:620, marginBottom:56 }}>
          <Eyebrow style={{ marginBottom:14 }}>One quiet platform</Eyebrow>
          <h2 className="display" style={{ marginBottom:16 }}>Everything a church carries, gently held.</h2>
          <p className="lead">Six tools that usually live in six spreadsheets — brought together with the calm and care your ministry deserves.</p>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {FEATURES.map((f,i) => (
            <Reveal key={f.title} delay={i * .06}>
              <div className="card card-pad" style={{ borderRadius:"var(--r-lg)", height:"100%" }}>
                <IconChip name={f.icon} tone={f.tone} size={48} style={{ marginBottom:20 }}/>
                <h3 style={{ fontSize:"1.2rem", marginBottom:10 }}>{f.title}</h3>
                <p className="muted" style={{ fontSize:".96rem" }}>{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </AnimSection>
  );
}

/* ─────────────────────────────────────────────
   Sermon showcase
───────────────────────────────────────────── */
function SermonShowcase({ go }) {
  return (
    <AnimSection id="sermons" padding="60px 0">
      <Container>
        <Reveal>
          <div style={{ background:"var(--chrome)", borderRadius:"var(--r-xl)", padding:"56px 56px", color:"var(--chrome-text)", display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:56, alignItems:"center", overflow:"hidden", position:"relative" }}>
            <div style={{ position:"absolute", bottom:-120, left:-80, width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,var(--primary) 0%,transparent 70%)", opacity:.28 }}/>
            <div style={{ position:"relative" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, color:"var(--chrome-muted)", marginBottom:18 }}>
                <Icon name="radio" size={16}/><span className="eyebrow" style={{ color:"var(--chrome-muted)" }}>Live during service</span>
              </div>
              <h2 className="display" style={{ color:"var(--chrome-text)", marginBottom:18 }}>Push the next verse to the screen, in time.</h2>
              <p style={{ fontSize:"1.1rem", lineHeight:1.55, color:"var(--chrome-muted)", marginBottom:28, maxWidth:420 }}>
                Build your reading list before Sunday. During the sermon, advance verses from your phone and the congregation sees them instantly.
              </p>
              <Btn variant="primary" size="lg" iconRight="arrow-right" onClick={() => go("sermon")}>Open sermon mode</Btn>
            </div>
            <div style={{ position:"relative" }}>
              <div style={{ background:"#05080c", border:"1px solid rgba(255,255,255,.12)", borderRadius:"var(--r-lg)", padding:"44px 40px", boxShadow:"0 30px 60px rgba(0,0,0,.4)" }}>
                <div className="eyebrow" style={{ color:"var(--primary)", marginBottom:20 }}>Now showing · Psalm 23</div>
                <p className="serif-verse" style={{ fontSize:"1.7rem", lineHeight:1.4, color:"#fff" }}>
                  "The Lord is my shepherd; I shall not want."
                </p>
                <div className="mono" style={{ marginTop:22, color:"rgba(255,255,255,.65)", fontSize:".9rem" }}>Psalm 23:1 · NKJV</div>
              </div>
              <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:16 }}>
                {[0,1,2,3,4].map(i => <span key={i} style={{ width:i===0?22:7, height:7, borderRadius:99, background:i===0?"var(--primary)":"rgba(255,255,255,.2)" }}/>)}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </AnimSection>
  );
}

/* ─────────────────────────────────────────────
   Pricing
───────────────────────────────────────────── */
function PlanCard({ plan, go }) {
  const featured = plan.featured;
  return (
    <div className="card" style={{
      padding:32, borderRadius:"var(--r-lg)",
      border: featured ? "1.5px solid var(--primary)" : "1px solid var(--border)",
      boxShadow: featured ? "var(--shadow-lg)" : "var(--shadow-sm)",
      position:"relative", background:"var(--surface)",
    }}>
      {featured && <div style={{ position:"absolute", top:-12, left:32 }}><Pill kind="primary" style={{ padding:"5px 12px", background:"var(--primary)", color:"var(--primary-contrast)" }}>Most popular</Pill></div>}
      <h3 style={{ fontSize:"1.35rem", marginBottom:6 }}>{plan.name}</h3>
      <p className="muted" style={{ fontSize:".92rem", minHeight:44, marginBottom:18 }}>{plan.tagline}</p>
      <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:22 }}>
        <span style={{ fontSize:"3rem", fontWeight:500, letterSpacing:"-.03em" }}>{plan.price===0?"Free":"$"+plan.price}</span>
        {plan.price!==0 && <span className="muted" style={{ fontSize:".95rem" }}>/ {plan.cadence}</span>}
      </div>
      <Btn variant={featured?"primary":"ghost"} size="lg" className="btn-block" iconRight="arrow-right" onClick={() => go("cms")} style={{ marginBottom:26 }}>
        {plan.price===0?"Start on Basic":"Choose Advanced"}
      </Btn>
      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
            <span style={{ color:"var(--primary)", marginTop:2, flexShrink:0 }}><Icon name="check" size={17}/></span>
            <span style={{ fontSize:".95rem" }}>{f}</span>
          </div>
        ))}
        {plan.missing.map(f => (
          <div key={f} style={{ display:"flex", gap:11, alignItems:"flex-start", opacity:.45 }}>
            <span style={{ color:"var(--text-subtle)", marginTop:2, flexShrink:0 }}><Icon name="x" size={17}/></span>
            <span style={{ fontSize:".95rem", textDecoration:"line-through" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing({ go }) {
  return (
    <AnimSection id="pricing">
      <Container>
        <Reveal style={{ textAlign:"center", maxWidth:600, margin:"0 auto 56px" }}>
          <Eyebrow style={{ marginBottom:14 }}>Simple pricing</Eyebrow>
          <h2 className="display" style={{ marginBottom:16 }}>Start free. Grow when you're ready.</h2>
          <p className="lead">Every church begins on Basic at no cost. Unlock live service tools and deeper reports with Advanced.</p>
        </Reveal>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, maxWidth:900, margin:"0 auto", alignItems:"start" }}>
          {CH.plans.map((plan,i) => (
            <Reveal key={plan.id} delay={i*.1}>
              <PlanCard plan={plan} go={go}/>
            </Reveal>
          ))}
        </div>
        <Reveal style={{ textAlign:"center", marginTop:28 }}>
          <p className="subtle" style={{ fontSize:".88rem" }}>All prices in USD · billed monthly · cancel anytime · no card required to start</p>
        </Reveal>
      </Container>
    </AnimSection>
  );
}

/* ─────────────────────────────────────────────
   Contact
───────────────────────────────────────────── */
function ContactSection() {
  const [form, setForm] = React.useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent]       = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError]     = React.useState("");

  const handle = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(""); };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message."); return;
    }
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1100);
  };

  return (
    <AnimSection id="contact">
      <Container narrow>
        <Reveal style={{ textAlign:"center", maxWidth:560, margin:"0 auto 52px" }}>
          <Eyebrow style={{ marginBottom:14 }}>Get in touch</Eyebrow>
          <h2 className="display" style={{ marginBottom:16 }}>We'd love to hear from you.</h2>
          <p className="lead">Questions, partnership ideas, or just want to say hello — we read every message.</p>
        </Reveal>

        {sent ? (
          <Reveal style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"var(--success-tint)", color:"var(--success)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <Icon name="check" size={36}/>
            </div>
            <h3 style={{ fontSize:"1.4rem", marginBottom:8 }}>Message sent!</h3>
            <p className="muted">We'll get back to you at <b style={{ color:"var(--text)" }}>{form.email}</b> within a day or two.</p>
            <button className="btn btn-ghost" style={{ marginTop:20 }} onClick={() => { setSent(false); setForm({ name:"", email:"", subject:"", message:"" }); }}>Send another</button>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={submit} style={{ maxWidth:620, margin:"0 auto", display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div>
                  <label className="eyebrow" style={{ display:"block", marginBottom:7 }}>Your name</label>
                  <input value={form.name} onChange={handle("name")} placeholder="Adwoa Mensah" className="field" required/>
                </div>
                <div>
                  <label className="eyebrow" style={{ display:"block", marginBottom:7 }}>Email address</label>
                  <input type="email" value={form.email} onChange={handle("email")} placeholder="you@church.org" className="field" required/>
                </div>
              </div>
              <div>
                <label className="eyebrow" style={{ display:"block", marginBottom:7 }}>Subject</label>
                <input value={form.subject} onChange={handle("subject")} placeholder="How can we help?" className="field"/>
              </div>
              <div>
                <label className="eyebrow" style={{ display:"block", marginBottom:7 }}>Message</label>
                <textarea value={form.message} onChange={handle("message")} rows={5} placeholder="Tell us more…" className="field" required/>
              </div>
              {error && (
                <div style={{ display:"flex", alignItems:"center", gap:9, padding:"11px 14px", background:"var(--danger-tint)", borderRadius:"var(--r-sm)", color:"var(--danger)", fontSize:".87rem" }}>
                  <Icon name="alert-triangle" size={16} style={{ flexShrink:0 }}/>{error}
                </div>
              )}
              <div>
                <button type="submit" disabled={sending} className="btn btn-primary btn-lg">
                  {sending ? (
                    <span style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ width:16, height:16, borderRadius:"50%", border:"2.5px solid rgba(255,255,255,.35)", borderTopColor:"#fff", animation:"ch-spin .7s linear infinite", display:"inline-block" }}/>
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

/* ─────────────────────────────────────────────
   Footer
───────────────────────────────────────────── */

function SiteFooter() {
  const cols = {
    Product: ["Features", "Giving", "Sermon sync", "Pricing"],
    Church:  ["Members", "Groups", "Reports", "Audit log"],
    Company: ["About", "Stories", "Support", "Status"],
  };
  return (
    <footer style={{ borderTop:"1px solid var(--border)", padding:"56px 0 40px" }}>
      <Container style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:32 }}>
        <div>
          <Wordmark size={18}/>
          <p className="muted" style={{ fontSize:".9rem", marginTop:14, maxWidth:240 }}>Your church partner — for giving, people and the Word.</p>
        </div>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <div className="eyebrow" style={{ marginBottom:16 }}>{h}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
              {items.map(i => <a key={i} href="#" className="muted" style={{ fontSize:".92rem", textDecoration:"none" }}>{i}</a>)}
            </div>
          </div>
        ))}
      </Container>
      <Container style={{ display:"flex", justifyContent:"space-between", marginTop:44, paddingTop:24, borderTop:"1px solid var(--border)" }}>
        <span className="subtle" style={{ fontSize:".84rem" }}>© 2026 Churchora. All rights reserved.</span>
        <span className="subtle" style={{ fontSize:".84rem" }}>Privacy · Terms · Security</span>
      </Container>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Root
───────────────────────────────────────────── */
function MarketingSite({ go, user, onSignIn, goToSettings, theme, setTheme, mode, setMode, onLogout }) {
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", fn, { passive:true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <div id="site-scroll" className="scroll-area" style={{ height:"100%", overflowY:"auto", background:"var(--page)" }}>
      <SiteHeader go={go} user={user} onSignIn={onSignIn} goToSettings={goToSettings} theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} onLogout={onLogout}/>
      <Hero go={go} scrollY={scrollY}/>
      <TrustStrip/>
      <Features/>
      <SermonShowcase go={go}/>
      <Pricing go={go}/>
      <ContactSection/>
      <SiteFooter/>
    </div>
  );
}

window.MarketingSite = MarketingSite;
window.Container     = Container;

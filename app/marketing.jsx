/* Churchora — Marketing website (landing + pricing) */
const { Icon, Logo, Wordmark, Avatar, Btn, Pill, Eyebrow, IconChip, Segmented, Sparkline } = window;

function Container({ children, style, narrow }) {
  return <div style={{ maxWidth: narrow ? 880 : 1180, margin: "0 auto", padding: "0 32px", ...style }}>{children}</div>;
}

function SiteHeader({ go }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 12);
    el.addEventListener("scroll", fn); return () => el.removeEventListener("scroll", fn);
  }, []);
  const links = ["Features", "Giving", "Sermons", "Pricing"];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30,
      background: scrolled ? "color-mix(in srgb, var(--page) 82%, transparent)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all var(--dur) var(--ease)",
    }}>
      <Container style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <Wordmark size={19} />
        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {links.map(l => (
            <a key={l} href={"#" + l.toLowerCase()} style={{ padding: "8px 14px", fontSize: ".94rem", color: "var(--text-muted)", borderRadius: "var(--r-xs)" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>{l}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn variant="ghost" size="sm" onClick={() => go("member")}>Sign in</Btn>
          <Btn variant="primary" size="sm" iconRight="arrow-right" onClick={() => go("cms")}>Start free</Btn>
        </div>
      </Container>
    </header>
  );
}

function HeroVerseCard() {
  return (
    <div className="card" style={{ padding: 26, boxShadow: "var(--shadow-lg)", borderRadius: "var(--r-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <Eyebrow>Verse of the day</Eyebrow>
        <Pill kind="accent">Hope</Pill>
      </div>
      <p className="serif-verse" style={{ fontSize: "1.5rem", lineHeight: 1.4, color: "var(--text)", letterSpacing: "-.015em" }}>
        “For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.”
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
  const rafRef = React.useRef(null);
  const targetRef = React.useRef({ x: 0, y: 0 });
  const currentRef = React.useRef({ x: 0, y: 0 });

  /* smooth mouse tracking via rAF lerp */
  React.useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      const t = targetRef.current, c = currentRef.current;
      c.x += (t.x - c.x) * 0.09;
      c.y += (t.y - c.y) * 0.09;
      setMouse({ x: c.x, y: c.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    targetRef.current = {
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top)  / r.height - 0.5,
    };
  };
  const onLeave = () => { targetRef.current = { x: 0, y: 0 }; setHovered(false); };
  const onEnter = () => setHovered(true);

  const parallaxOffset = scrollY * 0.06;
  const tiltX = mouse.y * -10;
  const tiltY = mouse.x *  10;
  const ease = "transform 0.05s linear";

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      className="anim-up"
      style={{ animationDelay: ".1s", position: "relative", display: "flex", flexDirection: "column", gap: 18, perspective: 1200 }}
    >
      {/* Verse card — deeper parallax layer, stronger tilt */}
      <div style={{
        transform: `translateY(${-parallaxOffset * 1.0}px) rotateX(${tiltX * 0.9}deg) rotateY(${tiltY * 0.9}deg) scale(${hovered ? 1.025 : 1})`,
        transition: hovered ? ease : "transform 0.6s cubic-bezier(.22,.61,.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        filter: hovered ? "drop-shadow(0 28px 40px rgba(0,0,0,.18))" : "none",
      }}>
        <HeroVerseCard />
      </div>

      {/* Give card — shallower layer, offset right, slower parallax */}
      <div style={{
        marginLeft: 48, marginRight: -8,
        transform: `translateY(${-parallaxOffset * 0.55}px) rotateX(${tiltX * 0.5}deg) rotateY(${tiltY * 0.5}deg) scale(${hovered ? 1.015 : 1})`,
        transition: hovered ? ease : "transform 0.75s cubic-bezier(.22,.61,.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        filter: hovered ? "drop-shadow(0 18px 28px rgba(0,0,0,.14))" : "none",
      }}>
        <HeroGiveCard />
      </div>

      {/* subtle floating glow that follows cursor */}
      {hovered && (
        <div style={{
          position: "absolute", pointerEvents: "none",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, var(--primary-tint) 0%, transparent 70%)",
          opacity: 0.55,
          left: `calc(50% + ${mouse.x * 120}px)`,
          top:  `calc(50% + ${mouse.y * 120}px)`,
          transform: "translate(-50%, -50%)",
          transition: "left 0.05s linear, top 0.05s linear",
        }} />
      )}
    </div>
  );
}

function Hero({ go }) {
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    const el = document.getElementById("site-scroll");
    if (!el) return;
    const fn = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <section style={{ position: "relative", paddingTop: 70, paddingBottom: 90, overflow: "hidden" }}>
      {/* soft radial glow */}
      <div style={{ position: "absolute", top: -160, right: -120, width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle, var(--primary-tint) 0%, transparent 68%)", opacity: .9, pointerEvents: "none" }} />
      <Container style={{ position: "relative", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 64, alignItems: "center" }}>
        <div>
          <div className="anim-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 6px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, marginBottom: 28 }}>
            <Pill kind="primary">New</Pill>
            <span style={{ fontSize: ".84rem", color: "var(--text-muted)" }}>Sermon live-sync is here</span>
          </div>
          <h1 className="display-xl anim-up" style={{ animationDelay: ".05s", marginBottom: 22 }}>
            The Complete Home<br />For Your Church.
          </h1>
          <p className="lead anim-up" style={{ animationDelay: ".12s", maxWidth: 480, marginBottom: 34 }}>
            Churchora brings giving, members, scripture and Sunday service into one quiet, beautiful place — so your team can tend to people, not paperwork.
          </p>
          <div className="anim-up" style={{ animationDelay: ".18s", display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Btn variant="primary" size="lg" iconRight="arrow-right" onClick={() => go("cms")}>Start free</Btn>
            <Btn variant="ghost" size="lg" icon="play" onClick={() => go("sermon")}>See sermon mode</Btn>
          </div>
          <div className="anim-up" style={{ animationDelay: ".24s", display: "flex", alignItems: "center", gap: 14, marginTop: 36 }}>
            <div style={{ display: "flex" }}>
              {CH.members.slice(0, 4).map((m, i) => (
                <span key={m.id} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={m.name} tone={m.tone} size={34} ring /></span>
              ))}
            </div>
            <span style={{ fontSize: ".88rem", color: "var(--text-muted)" }}>Trusted by <b style={{ fontWeight: 500, color: "var(--text)" }}>1,200+</b> congregations</span>
          </div>
        </div>
        <HeroCards scrollY={scrollY} />
      </Container>
    </section>
  );
}

/* Count-up number that animates in when scrolled into view */
function CountUp({ target, prefix = "", suffix = "", decimals = 0, duration = 1600 }) {
  const [val, setVal]    = React.useState(0);
  const ref              = React.useRef(null);
  const started          = React.useRef(false);

  React.useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        setVal(+(eased * target).toFixed(decimals));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, decimals]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function TrustStrip() {
  const items = [
    { target: 1200,  prefix: "",    suffix: "+",  decimals: 0, label: "Congregations"  },
    { target: 4.2,   prefix: "GHS ", suffix: "M", decimals: 1, label: "Given monthly"  },
    { target: 68000, prefix: "",    suffix: "",   decimals: 0, label: "Members served" },
    { target: 99.9,  prefix: "",    suffix: "%",  decimals: 1, label: "Uptime"         },
  ];
  return (
    <Container>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, padding: "30px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        {items.map(item => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.9rem", fontWeight: 500, letterSpacing: "-.025em" }}>
              <CountUp target={item.target} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals} />
            </div>
            <div className="eyebrow" style={{ marginTop: 4 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </Container>
  );
}

const FEATURES = [
  { icon: "hand-coins", tone: "success", title: "Giving that just works", body: "Tithes and offerings by MTN MoMo, Vodafone Cash or card. Recurring gifts, pledges and instant receipts." },
  { icon: "cake", tone: "warn", title: "Birthdays, never missed", body: "Upcoming-birthday widgets and one-tap wishes keep your community feeling seen and remembered." },
  { icon: "book-open", tone: "primary", title: "Scripture, shared daily", body: "Post a verse of the day, search any reference across translations, and let members save and share." },
  { icon: "presentation", tone: "info", title: "Sermon live-sync", body: "Queue verses ahead of service and push them to the projection screen live — in perfect time." },
  { icon: "users", tone: "accent", title: "Members & groups", body: "A warm directory of every member, group and leader — with the history that matters." },
  { icon: "trending-up", tone: "danger", title: "Reports you'll read", body: "Giving trends, attendance and pledge progress in views your treasurer will actually open." },
];

function Features() {
  return (
    <section id="features" style={{ padding: "104px 0" }}>
      <Container>
        <div style={{ maxWidth: 620, marginBottom: 56 }}>
          <Eyebrow style={{ marginBottom: 14 }}>One quiet platform</Eyebrow>
          <h2 className="display" style={{ marginBottom: 16 }}>Everything a church carries, gently held.</h2>
          <p className="lead">Six tools that usually live in six spreadsheets — brought together with the calm and care your ministry deserves.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card card-pad anim-up" style={{ animationDelay: (i * .05) + "s", borderRadius: "var(--r-lg)" }}>
              <IconChip name={f.icon} tone={f.tone} size={48} style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: "1.2rem", marginBottom: 10 }}>{f.title}</h3>
              <p className="muted" style={{ fontSize: ".96rem" }}>{f.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Sermon sync showcase with projection mock */
function SermonShowcase({ go }) {
  return (
    <section id="sermons" style={{ padding: "60px 0" }}>
      <Container>
        <div style={{ background: "var(--chrome)", borderRadius: "var(--r-xl)", padding: "56px 56px", color: "var(--chrome-text)", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 56, alignItems: "center", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", bottom: -120, left: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)", opacity: .28 }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--chrome-muted)", marginBottom: 18 }}>
              <Icon name="radio" size={16} /><span className="eyebrow" style={{ color: "var(--chrome-muted)" }}>Live during service</span>
            </div>
            <h2 className="display" style={{ color: "var(--chrome-text)", marginBottom: 18 }}>Push the next verse to the screen, in time.</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.55, color: "var(--chrome-muted)", marginBottom: 28, maxWidth: 420 }}>
              Build your reading list before Sunday. During the sermon, advance verses from your phone and the congregation sees them instantly — no fumbling with slides.
            </p>
            <Btn variant="primary" size="lg" iconRight="arrow-right" onClick={() => go("sermon")}>Open sermon mode</Btn>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ background: "#05080c", border: "1px solid rgba(255,255,255,.12)", borderRadius: "var(--r-lg)", padding: "44px 40px", boxShadow: "0 30px 60px rgba(0,0,0,.4)" }}>
              <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 20 }}>Now showing · Psalm 23</div>
              <p className="serif-verse" style={{ fontSize: "1.7rem", lineHeight: 1.4, color: "#fff" }}>
                “The Lord is my shepherd; I shall not want.”
              </p>
              <div className="mono" style={{ marginTop: 22, color: "rgba(255,255,255,.55)", fontSize: ".9rem" }}>Psalm 23:1 · NKJV</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {[0,1,2,3,4].map(i => <span key={i} style={{ width: i === 0 ? 22 : 7, height: 7, borderRadius: 99, background: i === 0 ? "var(--primary)" : "rgba(255,255,255,.2)", transition: "all .2s" }} />)}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Pricing({ go }) {
  return (
    <section id="pricing" style={{ padding: "104px 0" }}>
      <Container>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
          <Eyebrow style={{ marginBottom: 14 }}>Simple pricing</Eyebrow>
          <h2 className="display" style={{ marginBottom: 16 }}>Start free. Grow when you're ready.</h2>
          <p className="lead">Every church begins on Basic at no cost. Unlock live service tools and deeper reports with Advanced.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900, margin: "0 auto", alignItems: "start" }}>
          {CH.plans.map(plan => <PlanCard key={plan.id} plan={plan} go={go} />)}
        </div>
        <p className="subtle" style={{ textAlign: "center", marginTop: 28, fontSize: ".88rem" }}>All prices in USD · billed monthly · cancel anytime · no card required to start</p>
      </Container>
    </section>
  );
}

function PlanCard({ plan, go }) {
  const featured = plan.featured;
  return (
    <div className="card" style={{
      padding: 32, borderRadius: "var(--r-lg)",
      border: featured ? "1.5px solid var(--primary)" : "1px solid var(--border)",
      boxShadow: featured ? "var(--shadow-lg)" : "var(--shadow-sm)",
      position: "relative", background: "var(--surface)",
    }}>
      {featured && <div style={{ position: "absolute", top: -12, left: 32 }}><Pill kind="primary" style={{ padding: "5px 12px", background: "var(--primary)", color: "var(--primary-contrast)" }}>Most popular</Pill></div>}
      <h3 style={{ fontSize: "1.35rem", marginBottom: 6 }}>{plan.name}</h3>
      <p className="muted" style={{ fontSize: ".92rem", minHeight: 44, marginBottom: 18 }}>{plan.tagline}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 22 }}>
        <span style={{ fontSize: "3rem", fontWeight: 500, letterSpacing: "-.03em" }}>{plan.price === 0 ? "Free" : "$" + plan.price}</span>
        {plan.price !== 0 && <span className="muted" style={{ fontSize: ".95rem" }}>/ {plan.cadence}</span>}
      </div>
      <Btn variant={featured ? "primary" : "ghost"} size="lg" className="btn-block" iconRight="arrow-right" onClick={() => go("cms")} style={{ marginBottom: 26 }}>
        {plan.price === 0 ? "Start on Basic" : "Choose Advanced"}
      </Btn>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
            <span style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }}><Icon name="check" size={17} /></span>
            <span style={{ fontSize: ".95rem" }}>{f}</span>
          </div>
        ))}
        {plan.missing.map(f => (
          <div key={f} style={{ display: "flex", gap: 11, alignItems: "flex-start", opacity: .45 }}>
            <span style={{ color: "var(--text-subtle)", marginTop: 2, flexShrink: 0 }}><Icon name="x" size={17} /></span>
            <span style={{ fontSize: ".95rem", textDecoration: "line-through" }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTABand({ go }) {
  return (
    <section style={{ padding: "40px 0 110px" }}>
      <Container>
        <div style={{ textAlign: "center", padding: "72px 32px", background: "var(--primary-tint)", borderRadius: "var(--r-xl)", position: "relative", overflow: "hidden" }}>
          <Logo size={56} style={{ marginBottom: 24, display: "inline-flex" }} />
          <h2 className="display" style={{ marginBottom: 16, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>Give your church a quieter Sunday.</h2>
          <p className="lead" style={{ maxWidth: 460, margin: "0 auto 32px" }}>Set up in minutes. Free forever for small fellowships.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="primary" size="lg" iconRight="arrow-right" onClick={() => go("cms")}>Start free</Btn>
            <Btn variant="ghost" size="lg" onClick={() => go("member")}>Tour the app</Btn>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SiteFooter() {
  const cols = {
    Product: ["Features", "Giving", "Sermon sync", "Pricing"],
    Church: ["Members", "Groups", "Reports", "Audit log"],
    Company: ["About", "Stories", "Support", "Status"],
  };
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "56px 0 40px" }}>
      <Container style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <Wordmark size={18} />
          <p className="muted" style={{ fontSize: ".9rem", marginTop: 14, maxWidth: 240 }}>Your church partner — for giving, people and the Word.</p>
        </div>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>{h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {items.map(i => <a key={i} href="#" className="muted" style={{ fontSize: ".92rem" }}>{i}</a>)}
            </div>
          </div>
        ))}
      </Container>
      <Container style={{ display: "flex", justifyContent: "space-between", marginTop: 44, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <span className="subtle" style={{ fontSize: ".84rem" }}>© 2026 Churchora. All rights reserved.</span>
        <span className="subtle" style={{ fontSize: ".84rem" }}>Privacy · Terms · Security</span>
      </Container>
    </footer>
  );
}

function MarketingSite({ go }) {
  return (
    <div id="site-scroll" className="scroll-area" style={{ height: "100%", overflowY: "auto", background: "var(--page)" }}>
      <SiteHeader go={go} />
      <Hero go={go} />
      <TrustStrip />
      <Features />
      <SermonShowcase go={go} />
      <Pricing go={go} />
      <CTABand go={go} />
      <SiteFooter />
    </div>
  );
}

window.MarketingSite = MarketingSite;
window.Container = Container;

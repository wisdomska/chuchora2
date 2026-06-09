/* Churchora — Member app (interactive themed iPhone) */
const { Icon: MIcon, Avatar: MAvatar, Pill: MPill, Btn: MBtn, IconChip: MIconChip, Logo: MLogo, useViewport: MUseViewport } = window;

const TABS = [
  { id: "home", icon: "layout-dashboard", label: "Home" },
  { id: "give", icon: "hand-coins", label: "Give" },
  { id: "verses", icon: "book-open", label: "Word" },
  { id: "profile", icon: "user", label: "Profile" },
];

function SafeTop({ children, style }) {
  return <div style={{ paddingTop: 56, ...style }}>{children}</div>;
}

function ScreenHead({ title, sub }) {
  return (
    <div style={{ padding: "8px 20px 14px" }}>
      <div className="eyebrow" style={{ marginBottom: 4 }}>{sub}</div>
      <h2 style={{ fontSize: "1.7rem", letterSpacing: "-.025em" }}>{title}</h2>
    </div>
  );
}

/* ---------------- HOME ---------------- */
function MemberHome({ setTab, onWish }) {
  const v = CH.verses[2];
  return (
    <SafeTop>
      <div style={{ padding: "8px 20px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ whiteSpace: "nowrap" }}>
          <div className="muted" style={{ fontSize: ".82rem" }}>Good morning</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 500, letterSpacing: "-.02em" }}>Adwoa</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", background: "var(--surface-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
            <MIcon name="bell" size={18} />
            <span style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: "50%", background: "var(--primary)", border: "1.5px solid var(--page)" }} />
          </span>
          <MAvatar name="Adwoa Mensah" tone="#1F7A4D" size={40} />
        </div>
      </div>

      <div style={{ padding: "12px 20px 0" }}>
        {/* verse of the day */}
        <div className="card" style={{ padding: 20, borderRadius: "var(--r-lg)", background: "var(--primary)", border: "none", color: "var(--primary-contrast)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span className="eyebrow" style={{ color: "var(--primary-contrast)", opacity: .8, whiteSpace: "nowrap" }}>Verse of the day</span>
            <MLogo size={24} />
          </div>
          <p className="serif-verse" style={{ fontSize: "1.18rem", lineHeight: 1.45 }}>“{v.text}”</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <span className="mono" style={{ fontSize: ".82rem", opacity: .85 }}>{v.ref} · {v.tr}</span>
            <div style={{ display: "flex", gap: 8 }}>
              {["heart", "share"].map(ic => <span key={ic} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,.16)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><MIcon name={ic} size={15} /></span>)}
            </div>
          </div>
        </div>

        {/* quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
          <button onClick={() => setTab("give")} className="card" style={{ padding: 16, borderRadius: "var(--r-md)", textAlign: "left", cursor: "pointer", color: "var(--text)" }}>
            <MIconChip name="hand-coins" tone="success" size={38} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 500, fontSize: ".98rem", color: "var(--text)" }}>Give now</div>
            <div style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: 2 }}>Tithe & offering</div>
          </button>
          <button onClick={() => setTab("verses")} className="card" style={{ padding: 16, borderRadius: "var(--r-md)", textAlign: "left", cursor: "pointer", color: "var(--text)" }}>
            <MIconChip name="book-open" tone="primary" size={38} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 500, fontSize: ".98rem", color: "var(--text)" }}>The Word</div>
            <div style={{ fontSize: ".8rem", color: "var(--text-muted)", marginTop: 2 }}>Read & share</div>
          </button>
        </div>

        {/* birthdays */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "22px 0 12px" }}>
          <h3 style={{ fontSize: "1.05rem" }}>Upcoming birthdays</h3>
          <span className="muted" style={{ fontSize: ".82rem", display: "inline-flex", alignItems: "center", gap: 2, whiteSpace: "nowrap", flexShrink: 0 }}>See all <MIcon name="chevron-right" size={14} /></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CH.birthdays.slice(0, 3).map(b => (
            <div key={b.id} className="card" style={{ padding: "12px 14px", borderRadius: "var(--r-md)", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <MAvatar name={b.name} tone={b.tone} size={42} />
                <span style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: "var(--warn-tint)", color: "var(--warn)", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--surface)" }}><MIcon name="cake" size={11} /></span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: ".95rem" }}>{b.name}</div>
                <div className="muted" style={{ fontSize: ".8rem" }}>{b.when} · {b.group}</div>
              </div>
              <button onClick={() => onWish(b)} className="btn btn-sm" style={{ background: b.wished ? "var(--surface-2)" : "var(--primary-tint)", color: b.wished ? "var(--text-muted)" : "var(--primary)", border: "none" }}>
                {b.wished ? "Wished" : "Wish"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>
    </SafeTop>
  );
}

/* ---------------- GIVE FLOW ---------------- */
function MemberGive({ done }) {
  const [step, setStep] = React.useState(0); // 0 amount, 1 method, 2 confirm, 3 success
  const [amount, setAmount] = React.useState(100);
  const [fund, setFund] = React.useState("Tithe");
  const [method, setMethod] = React.useState("mtn");
  const [recurring, setRecurring] = React.useState(false);
  const prov = CH.momoProviders.find(p => p.id === method) || { name: "Card", short: "VISA", color: "var(--text)" };

  const Back = () => step > 0 && step < 3 ? (
    <button onClick={() => setStep(step - 1)} style={{ background: "none", border: "none", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4, padding: 0, fontSize: ".9rem" }}><MIcon name="chevron-left" size={18} />Back</button>
  ) : <span />;

  return (
    <SafeTop style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "4px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Back />
        <div style={{ display: "flex", gap: 5 }}>
          {[0,1,2].map(i => <span key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: 99, background: i <= step ? "var(--primary)" : "var(--border-strong)", transition: "all .2s" }} />)}
        </div>
        <span style={{ width: 48 }} />
      </div>

      {step === 0 && (
        <div style={{ padding: "8px 20px", flex: 1 }}>
          <ScreenHead sub="Give" title="How much today?" />
          <div style={{ textAlign: "center", padding: "20px 0 24px" }}>
            <div className="muted" style={{ fontSize: ".9rem", marginBottom: 4 }}>GHS</div>
            <div style={{ fontSize: "3.4rem", fontWeight: 500, letterSpacing: "-.03em", lineHeight: 1 }}>{amount.toLocaleString()}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 22 }}>
            {CH.presetAmounts.map(a => (
              <button key={a} onClick={() => setAmount(a)} className="btn btn-sm" style={{ background: amount === a ? "var(--primary)" : "var(--surface)", color: amount === a ? "var(--primary-contrast)" : "var(--text)", border: "1px solid " + (amount === a ? "var(--primary)" : "var(--border-strong)") }}>{a}</button>
            ))}
          </div>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Fund</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {CH.funds.map(f => (
              <button key={f.name} onClick={() => setFund(f.name)} style={{ border: "1px solid " + (fund === f.name ? "var(--primary)" : "var(--border)"), background: fund === f.name ? "var(--primary-tint)" : "var(--surface)", color: fund === f.name ? "var(--primary)" : "var(--text-muted)", borderRadius: 999, padding: "7px 14px", fontSize: ".85rem", fontFamily: "var(--font)", cursor: "pointer" }}>{f.name}</button>
            ))}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: ".9rem" }}>
            <window.Toggle on={recurring} onChange={setRecurring} /> Make this a monthly gift
          </label>
        </div>
      )}

      {step === 1 && (
        <div style={{ padding: "8px 20px", flex: 1 }}>
          <ScreenHead sub="Give" title="Payment method" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {CH.momoProviders.map(p => (
              <button key={p.id} onClick={() => setMethod(p.id)} className="card" style={{ padding: 14, borderRadius: "var(--r-md)", display: "flex", alignItems: "center", gap: 13, border: "1.5px solid " + (method === p.id ? "var(--primary)" : "var(--border)"), cursor: "pointer" }}>
                <span style={{ width: 42, height: 42, borderRadius: 10, background: p.color, color: p.id === "mtn" ? "#1a1a1a" : "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: ".7rem" }}>{p.short}</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 500, fontSize: ".95rem" }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: ".8rem" }}>Mobile money</div>
                </div>
                <span style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (method === p.id ? "var(--primary)" : "var(--border-strong)"), background: method === p.id ? "var(--primary)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{method === p.id && <MIcon name="check" size={12} style={{ color: "var(--primary-contrast)" }} />}</span>
              </button>
            ))}
            <button onClick={() => setMethod("card")} className="card" style={{ padding: 14, borderRadius: "var(--r-md)", display: "flex", alignItems: "center", gap: 13, border: "1.5px solid " + (method === "card" ? "var(--primary)" : "var(--border)"), cursor: "pointer" }}>
              <span style={{ width: 42, height: 42, borderRadius: 10, background: "var(--text)", color: "var(--page)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><MIcon name="credit-card" size={20} /></span>
              <div style={{ flex: 1, textAlign: "left" }}><div style={{ fontWeight: 500, fontSize: ".95rem" }}>Debit / credit card</div><div className="muted" style={{ fontSize: ".8rem" }}>Visa · Mastercard</div></div>
              <span style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (method === "card" ? "var(--primary)" : "var(--border-strong)"), background: method === "card" ? "var(--primary)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{method === "card" && <MIcon name="check" size={12} style={{ color: "var(--primary-contrast)" }} />}</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ padding: "8px 20px", flex: 1 }}>
          <ScreenHead sub="Give" title="Confirm gift" />
          <div className="card" style={{ padding: 18, borderRadius: "var(--r-md)", marginTop: 8 }}>
            {[["Amount", "GHS " + amount.toLocaleString()], ["Fund", fund], ["Method", prov.name], ["Frequency", recurring ? "Monthly" : "One-time"]].map(([k, val], i) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <span className="muted" style={{ fontSize: ".9rem" }}>{k}</span>
                <span style={{ fontSize: ".95rem", fontWeight: i === 0 ? 500 : 400 }}>{val}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: 14, padding: 12, background: "var(--info-tint)", borderRadius: "var(--r-sm)", color: "var(--info)" }}>
            <MIcon name="shield-check" size={17} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: ".82rem", lineHeight: 1.45 }}>You'll receive a prompt on your phone to approve this payment securely.</span>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="anim-scale" style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <span style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--success-tint)", color: "var(--success)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}><MIcon name="check" size={44} /></span>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 8 }}>Thank you, Adwoa</h2>
          <p className="muted" style={{ fontSize: ".95rem", maxWidth: 260 }}>Your gift of <b style={{ color: "var(--text)", fontWeight: 500 }}>GHS {amount.toLocaleString()}</b> to {fund} was received.</p>
          <div className="card" style={{ padding: 14, borderRadius: "var(--r-md)", marginTop: 22, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="mono muted" style={{ fontSize: ".82rem" }}>Receipt TX-4822</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--primary)", fontSize: ".85rem" }}><MIcon name="download" size={15} />Save receipt</span>
          </div>
        </div>
      )}

      {/* footer cta */}
      <div style={{ padding: "12px 20px 28px", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        {step === 0 && <MBtn variant="primary" className="btn-block btn-lg" iconRight="arrow-right" onClick={() => setStep(1)}>Continue</MBtn>}
        {step === 1 && <MBtn variant="primary" className="btn-block btn-lg" iconRight="arrow-right" onClick={() => setStep(2)}>Review gift</MBtn>}
        {step === 2 && <MBtn variant="primary" className="btn-block btn-lg" icon="lock" onClick={() => setStep(3)}>Give GHS {amount.toLocaleString()}</MBtn>}
        {step === 3 && <MBtn variant="ghost" className="btn-block btn-lg" onClick={() => { setStep(0); done && done(); }}>Done</MBtn>}
      </div>
    </SafeTop>
  );
}

/* ---------------- VERSES ---------------- */
function MemberVerses() {
  const [q, setQ] = React.useState("");
  const [tr, setTr] = React.useState("NIV");
  const [liked, setLiked] = React.useState({});
  const list = CH.verses.filter(v => (v.ref + v.text + v.tag).toLowerCase().includes(q.toLowerCase()));
  return (
    <SafeTop>
      <div style={{ padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <ScreenHead sub="The Word" title="Scripture" />
      </div>
      <div style={{ padding: "0 20px 8px", display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }}><MIcon name="search" size={17} /></span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by reference…" className="field" style={{ paddingLeft: 38, height: 42 }} />
        </div>
        <select value={tr} onChange={e => setTr(e.target.value)} className="field" style={{ width: 86, height: 42, padding: "0 8px" }}>
          {CH.translations.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div style={{ padding: "8px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map(v => (
          <div key={v.ref} className="card" style={{ padding: 18, borderRadius: "var(--r-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: ".82rem", color: "var(--primary)", fontWeight: 400 }}>{v.ref} · {tr}</span>
              <MPill kind="accent">{v.tag}</MPill>
            </div>
            <p className="serif-verse" style={{ fontSize: "1.05rem", lineHeight: 1.5 }}>“{v.text}”</p>
            <div style={{ display: "flex", gap: 6, marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[["heart", "like"], ["bookmark", "save"], ["share", "share"]].map(([ic, k]) => (
                <button key={k} onClick={() => k === "like" && setLiked({ ...liked, [v.ref]: !liked[v.ref] })} style={{ flex: 1, border: "none", background: "var(--surface-2)", borderRadius: 8, padding: "8px 0", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, color: (k === "like" && liked[v.ref]) ? "var(--danger)" : "var(--text-muted)", fontSize: ".82rem" }}>
                  <MIcon name={ic} size={16} fill={k === "like" && liked[v.ref]} /> {k === "like" ? (liked[v.ref] ? "Liked" : "Like") : k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ height: 16 }} />
      </div>
    </SafeTop>
  );
}

/* ---------------- PROFILE ---------------- */
function MemberProfile({ mode, setMode }) {
  return (
    <SafeTop>
      <div style={{ padding: "16px 20px 8px", textAlign: "center" }}>
        <MAvatar name="Adwoa Mensah" tone="#1F7A4D" size={84} />
        <h2 style={{ fontSize: "1.4rem", marginTop: 14 }}>Adwoa Mensah</h2>
        <div className="muted" style={{ fontSize: ".88rem" }}>Choir · Member since 2019</div>
        <div style={{ display: "inline-flex", marginTop: 10 }}><MPill kind="primary">Grace Chapel International</MPill></div>
      </div>
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="card" style={{ padding: 16, borderRadius: "var(--r-md)" }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Given this year</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>GHS 2,840</div>
          </div>
          <div className="card" style={{ padding: 16, borderRadius: "var(--r-md)" }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Gifts</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>14</div>
          </div>
        </div>
        <div className="card" style={{ marginTop: 14, borderRadius: "var(--r-md)", overflow: "hidden" }}>
          {[["clock", "Giving history"], ["repeat", "Recurring gifts"], ["cake", "My birthday · Jun 9"], ["bell", "Notifications"]].map(([ic, label], i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 16px", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <span style={{ color: "var(--text-muted)" }}><MIcon name={ic} size={18} /></span>
              <span style={{ flex: 1, fontSize: ".95rem" }}>{label}</span>
              <MIcon name="chevron-right" size={16} style={{ color: "var(--text-subtle)" }} />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 16px", borderTop: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-muted)" }}><MIcon name="moon" size={18} /></span>
            <span style={{ flex: 1, fontSize: ".95rem" }}>Dark mode</span>
            <window.Toggle on={mode === "dark"} onChange={() => setMode(mode === "light" ? "dark" : "light")} />
          </div>
        </div>
        <div style={{ height: 16 }} />
      </div>
    </SafeTop>
  );
}

/* ---------------- TAB BAR + PHONE ---------------- */
function TabBar({ tab, setTab }) {
  return (
    <div style={{ position: "sticky", bottom: 0, marginTop: "auto", background: "color-mix(in srgb, var(--surface) 88%, transparent)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderTop: "1px solid var(--border)", padding: "8px 14px 30px", display: "flex", justifyContent: "space-around" }}>
      {TABS.map(t => {
        const active = t.id === tab;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 14px", color: active ? "var(--primary)" : "var(--text-subtle)", cursor: "pointer" }}>
            <MIcon name={t.icon} size={22} fill={false} stroke={active ? 2 : 1.6} />
            <span style={{ fontSize: ".68rem", fontWeight: active ? 500 : 400 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="anim-scale" style={{ position: "absolute", bottom: 110, left: "50%", transform: "translateX(-50%)", zIndex: 80, background: "var(--text)", color: "var(--page)", padding: "11px 18px", borderRadius: 999, fontSize: ".85rem", display: "flex", alignItems: "center", gap: 8, boxShadow: "var(--shadow-lg)", whiteSpace: "nowrap" }}>
      <MIcon name="check-circle" size={16} /> {msg}
    </div>
  );
}

function MemberPhone({ mode, setMode }) {
  const [tab, setTab] = React.useState("home");
  const [birthdays, setBirthdays] = React.useState(CH.birthdays);
  const [toast, setToast] = React.useState("");
  const [scrollY, setScrollY] = React.useState(0);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2200); };
  const onWish = (b) => { setBirthdays(bs => bs.map(x => x.id === b.id ? { ...x, wished: true } : x)); if (!b.wished) showToast("Birthday wish sent to " + b.name.split(" ")[0]); };
  CH.birthdays = birthdays;

  return (
    <window.IOSDevice dark={mode === "dark"} width={392} height={830} scrollY={scrollY}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--page)", color: "var(--text)", position: "relative" }}>
        <div className="scroll-area" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}
          onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
          <div key={tab} className="anim-in" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {tab === "home" && <MemberHome setTab={setTab} onWish={onWish} />}
            {tab === "give" && <MemberGive done={() => showToast("Gift recorded — receipt saved")} />}
            {tab === "verses" && <MemberVerses />}
            {tab === "profile" && <MemberProfile mode={mode} setMode={setMode} />}
          </div>
          {tab !== "give" && <TabBar tab={tab} setTab={setTab} />}
        </div>
        {tab === "give" && <TabBar tab={tab} setTab={setTab} />}
        <Toast msg={toast} />
      </div>
    </window.IOSDevice>
  );
}

function MemberApp({ mode, setMode }) {
  const { w } = MUseViewport();
  // Scale phone to fit smaller screens
  const phoneScale = w < 480 ? Math.max((w - 32) / 392, 0.72) : w < 768 ? 0.88 : 1;

  return (
    <window.MemberStage>
      <div style={{ maxWidth: 360, textAlign: "center", alignSelf: "center", marginRight: 8, display: w < 768 ? "none" : "block" }} className="member-intro">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Member app</div>
        <h2 className="h1" style={{ marginBottom: 14, fontSize: "1.9rem" }}>Church in your pocket.</h2>
        <p className="lead" style={{ fontSize: "1.02rem" }}>Give in seconds with mobile money, read the daily Word, and never miss a birthday. Tap through the live phone — switch themes and dark mode from the top bar.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24, textAlign: "left" }}>
          {[["hand-coins", "Tithe & offering via MoMo or card"], ["book-open", "Verse of the day + scripture search"], ["cake", "Send birthday wishes in one tap"]].map(([ic, t]) => (
            <div key={t} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <window.IconChip name={ic} size={38} tone="primary" />
              <span style={{ fontSize: ".95rem" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ transform: `scale(${phoneScale})`, transformOrigin: "top center", flexShrink: 0 }}>
        <MemberPhone mode={mode} setMode={setMode} />
      </div>
    </window.MemberStage>
  );
}

window.MemberApp = MemberApp;

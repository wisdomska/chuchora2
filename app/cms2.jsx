/* Churchora — Admin CMS pages 2 + shell */
const { Icon: C2Icon, Avatar: C2Avatar, Pill: C2Pill, Btn: C2Btn, IconChip: C2Chip, Eyebrow: C2Eyebrow, Toggle: C2Toggle, Segmented: C2Seg } = window;

/* ---------------- VERSES & CONTENT ---------------- */
function CmsVerses() {
  const [ref, setRef] = React.useState("");
  const [tr, setTr] = React.useState("NIV");
  const scheduled = [
    { ref: "Psalm 121:1", when: "Tomorrow, 6:00 AM", tag: "Comfort" },
    { ref: "Isaiah 41:10", when: "Sun 15 Jun", tag: "Strength" },
    { ref: "Matthew 6:33", when: "Mon 16 Jun", tag: "Faith" },
  ];
  return (
    <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* composer */}
          <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>Post a verse</h3>
            <p className="muted" style={{ fontSize: ".86rem", marginBottom: 18 }}>Publish to the member feed now, or schedule it for a future service.</p>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Reference</label>
                <input value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. John 3:16" className="field" />
              </div>
              <div style={{ width: 130 }}>
                <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Translation</label>
                <select value={tr} onChange={e => setTr(e.target.value)} className="field" style={{ padding: "0 10px" }}>
                  {CH.translations.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Reflection (optional)</label>
            <textarea className="field" rows={3} placeholder="A short word for your congregation…" style={{ marginBottom: 14 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: ".88rem" }}><C2Icon name="calendar" size={16} style={{ color: "var(--text-muted)" }} /> Schedule for later</label>
              <div style={{ display: "flex", gap: 10 }}>
                <C2Btn variant="ghost" size="sm">Save draft</C2Btn>
                <C2Btn variant="primary" size="sm" icon="send">Publish</C2Btn>
              </div>
            </div>
          </div>
          {/* library */}
          <div className="card" style={{ borderRadius: "var(--r-md)", overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem" }}>Verse library</h3>
              <C2Seg options={["All", "Published", "Drafts"]} value="All" onChange={() => {}} />
            </div>
            <div>
              {CH.verses.slice(0, 5).map((v, i) => (
                <div key={v.ref} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderTop: "1px solid var(--border)" }}>
                  <C2Chip name="book-open" tone="primary" size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="mono" style={{ fontSize: ".85rem", color: "var(--primary)" }}>{v.ref}</span><C2Pill kind="accent">{v.tag}</C2Pill></div>
                    <div className="muted" style={{ fontSize: ".82rem", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 360 }}>“{v.text}”</div>
                  </div>
                  <C2Pill kind="success" dot>Published</C2Pill>
                  <C2Icon name="more-horizontal" size={18} style={{ color: "var(--text-subtle)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card card-pad" style={{ borderRadius: "var(--r-md)", background: "var(--primary)", color: "var(--primary-contrast)", border: "none" }}>
            <C2Eyebrow style={{ color: "var(--primary-contrast)", opacity: .8 }}>Today's verse</C2Eyebrow>
            <p className="serif-verse" style={{ fontSize: "1.15rem", lineHeight: 1.45, margin: "12px 0 14px" }}>“{CH.verses[2].text}”</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: ".82rem", opacity: .85 }}>{CH.verses[2].ref}</span>
              <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.16)", color: "var(--primary-contrast)", border: "none" }}>Change</button>
            </div>
          </div>
          <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: "1.05rem" }}>Scheduled</h3>
              <C2Icon name="calendar" size={17} style={{ color: "var(--text-muted)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {scheduled.map(s => (
                <div key={s.ref} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div className="mono" style={{ fontSize: ".86rem" }}>{s.ref}</div><div className="muted" style={{ fontSize: ".76rem" }}>{s.when}</div></div>
                  <C2Pill kind="neutral">{s.tag}</C2Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SERMON SYNC ---------------- */
function CmsSermonSync({ go, plan, setPage }) {
  if (plan === "basic") {
    return (
      <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card card-pad" style={{ borderRadius: "var(--r-lg)", maxWidth: 460, textAlign: "center", padding: 40 }}>
          <C2Chip name="lock" tone="accent" size={56} style={{ margin: "0 auto 22px" }} />
          <h3 className="h2" style={{ marginBottom: 12 }}>Sermon live-sync is an Advanced feature</h3>
          <p className="lead" style={{ fontSize: "1rem", marginBottom: 26 }}>Queue verses and push them to the projection screen in real time. Upgrade to unlock live service tools.</p>
          <C2Btn variant="primary" size="lg" iconRight="arrow-right" onClick={() => setPage("settings")}>Upgrade to Advanced</C2Btn>
        </div>
      </div>
    );
  }
  return (
    <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 18 }}>
        <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <C2Eyebrow>Next service</C2Eyebrow>
              <h3 style={{ fontSize: "1.3rem", margin: "6px 0 2px" }}>The Lord is my Shepherd</h3>
              <div className="muted" style={{ fontSize: ".88rem" }}>Sunday 15 June · 9:00 AM · Pastor Yaw</div>
            </div>
            <C2Btn variant="primary" icon="play" onClick={() => go("sermon")}>Launch sermon mode</C2Btn>
          </div>
          <C2Eyebrow style={{ marginBottom: 12 }}>Verse queue · {CH.sermonQueue.length} verses</C2Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CH.sermonQueue.map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", background: i === 0 ? "var(--primary-tint)" : "var(--surface-2)", border: "1px solid " + (i === 0 ? "var(--primary)" : "var(--border)"), borderRadius: "var(--r-sm)" }}>
                <span style={{ cursor: "grab", color: "var(--text-subtle)" }}><C2Icon name="list" size={16} /></span>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: "var(--surface)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem", fontWeight: 500 }} className="mono">{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="mono" style={{ fontSize: ".86rem", color: "var(--primary)", fontWeight: 400 }}>{v.ref} · {v.tr}</span>
                  <div className="muted" style={{ fontSize: ".82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>“{v.text}”</div>
                </div>
                {i === 0 && <C2Pill kind="primary" dot>On screen</C2Pill>}
                <C2Icon name="x" size={16} style={{ color: "var(--text-subtle)" }} />
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 6, alignSelf: "flex-start" }}><C2Icon name="plus" size={16} />Add verse</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card" style={{ borderRadius: "var(--r-md)", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
              <span className="eyebrow">Projection preview</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--danger)", fontSize: ".78rem", fontWeight: 500 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--danger)" }} />LIVE</span>
            </div>
            <div style={{ background: "#05080c", padding: "40px 28px", textAlign: "center" }}>
              <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: 14 }}>Psalm 23:1</div>
              <p className="serif-verse" style={{ fontSize: "1.3rem", lineHeight: 1.4, color: "#fff" }}>“The Lord is my shepherd; I shall not want.”</p>
            </div>
          </div>
          <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: 12 }}>Display settings</h3>
            {[["Show reference", true], ["Auto-advance", false], ["Member phones sync", true]].map(([l, on]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0" }}>
                <span style={{ fontSize: ".9rem" }}>{l}</span><C2Toggle on={on} onChange={() => {}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SETTINGS (incl. theming) ---------------- */
function ThemeCard({ t, active, mode, onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign: "left", cursor: "pointer", padding: 0, overflow: "hidden",
      border: "1.5px solid " + (active ? "var(--primary)" : "var(--border)"), borderRadius: "var(--r-md)", background: "var(--surface)",
      boxShadow: active ? "0 0 0 3px var(--ring)" : "none", transition: "all var(--dur) var(--ease)",
    }}>
      {/* mini preview — data-theme/data-mode scope the CSS tokens to this card's theme */}
      <div data-theme={t.id} data-mode={mode} style={{ height: 100, background: "var(--page)", padding: 12, display: "flex", gap: 8, borderRadius: "calc(var(--r-md) - 1px)" }}>
        <div style={{ width: 28, background: "var(--chrome)", borderRadius: 5, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
          {/* title bar mock */}
          <div style={{ height: 8, width: "62%", background: "var(--text)", opacity: .45, borderRadius: 3 }} />
          {/* content row */}
          <div style={{ display: "flex", gap: 6, flex: 1 }}>
            <div style={{ flex: 1, background: "var(--surface)", border: "1.5px solid var(--border-strong)", borderRadius: 5 }} />
            <div style={{ width: 38, background: "var(--primary)", borderRadius: 5, opacity: .95 }} />
          </div>
          {/* subtitle bar mock */}
          <div style={{ height: 6, width: "45%", background: "var(--text)", opacity: .30, borderRadius: 3 }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderTop: "1px solid var(--border)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: ".92rem", fontWeight: active ? 500 : 400 }}>
          <span style={{ width: 16, height: 16, borderRadius: "50%", background: t.swatch }} />{t.label}
        </span>
        {active && <span style={{ color: "var(--primary)" }}><C2Icon name="check-circle" size={18} /></span>}
      </div>
    </button>
  );
}

function CmsSettings({ theme, setTheme, mode, setMode, plan, setPlan }) {
  const [tab, setTab] = React.useState("appearance");
  const tabs = [["appearance", "Appearance"], ["branding", "Branding"], ["plan", "Plan & billing"], ["notifications", "Notifications"]];
  return (
    <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: 32 }}>
      <div style={{ display: "flex", gap: 26 }}>
        <div style={{ width: 190, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ textAlign: "left", border: "none", background: tab === id ? "var(--surface-2)" : "transparent", color: tab === id ? "var(--text)" : "var(--text-muted)", padding: "10px 14px", borderRadius: "var(--r-sm)", fontFamily: "var(--font)", fontSize: ".92rem", fontWeight: tab === id ? 400 : 300, cursor: "pointer" }}>{label}</button>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 760 }}>
          {tab === "appearance" && (
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Theme</h3>
              <p className="muted" style={{ fontSize: ".9rem", marginBottom: 20 }}>Choose your church's colour. It applies everywhere — website, member app and this dashboard.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 28 }}>
                {CH.themes.map(t => <ThemeCard key={t.id} t={t} mode={mode} active={theme === t.id} onClick={() => setTheme(t.id)} />)}
              </div>
              <div className="card card-pad" style={{ borderRadius: "var(--r-md)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <C2Chip name={mode === "dark" ? "moon" : "sun"} tone="primary" size={42} />
                  <div><div style={{ fontWeight: 400 }}>Appearance</div><div className="muted" style={{ fontSize: ".84rem" }}>{mode === "dark" ? "Dark mode" : "Light mode"}</div></div>
                </div>
                <C2Seg options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} value={mode} onChange={setMode} />
              </div>
            </div>
          )}
          {tab === "branding" && (
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: 20 }}>Branding</h3>
              <div className="card card-pad" style={{ borderRadius: "var(--r-md)", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <window.Logo size={64} />
                  <div><div style={{ fontWeight: 400, marginBottom: 6 }}>Church logo</div><C2Btn variant="ghost" size="sm" icon="download">Upload SVG / PNG</C2Btn></div>
                </div>
                <div className="hairline" />
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Church name</label>
                  <input className="field" defaultValue="Grace Chapel International" style={{ maxWidth: 380 }} />
                </div>
                <div>
                  <label className="eyebrow" style={{ display: "block", marginBottom: 7 }}>Public web address</label>
                  <div style={{ display: "flex", alignItems: "center", maxWidth: 380 }}>
                    <span className="field" style={{ width: "auto", borderRight: "none", borderRadius: "var(--r-sm) 0 0 var(--r-sm)", color: "var(--text-subtle)", display: "inline-flex", alignItems: "center" }}>churchora.app/</span>
                    <input className="field" defaultValue="grace-chapel" style={{ borderRadius: "0 var(--r-sm) var(--r-sm) 0", flex: 1 }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === "plan" && <PlanSettings plan={plan} setPlan={setPlan} />}
          {tab === "notifications" && (
            <div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: 20 }}>Notifications</h3>
              <div className="card" style={{ borderRadius: "var(--r-md)", overflow: "hidden" }}>
                {[["Birthday reminders", "Daily digest of upcoming birthdays", true], ["New gift received", "Notify treasurers of each gift", true], ["Failed payment", "Alert when a payment fails", true], ["Weekly giving report", "Sunday evening summary", false]].map(([t, d, on], i) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderTop: i ? "1px solid var(--border)" : "none" }}>
                    <div><div style={{ fontWeight: 400, fontSize: ".95rem" }}>{t}</div><div className="muted" style={{ fontSize: ".84rem" }}>{d}</div></div>
                    <C2Toggle on={on} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanSettings({ plan, setPlan }) {
  return (
    <div>
      <h3 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Plan & billing</h3>
      <p className="muted" style={{ fontSize: ".9rem", marginBottom: 20 }}>You're currently on the <b style={{ color: "var(--text)", fontWeight: 500 }}>{plan === "basic" ? "Basic" : "Advanced"}</b> plan.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
        {CH.plans.map(p => {
          const current = p.id === plan;
          return (
            <div key={p.id} className="card card-pad" style={{ borderRadius: "var(--r-md)", border: "1.5px solid " + (current ? "var(--primary)" : "var(--border)") }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ fontSize: "1.15rem" }}>{p.name}</h3>
                {current ? <C2Pill kind="primary">Current</C2Pill> : p.featured && <C2Pill kind="accent">Recommended</C2Pill>}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 16 }}>
                <span style={{ fontSize: "2rem", fontWeight: 500, letterSpacing: "-.03em" }}>{p.price === 0 ? "Free" : "$" + p.price}</span>
                {p.price !== 0 && <span className="muted" style={{ fontSize: ".88rem" }}>/ {p.cadence}</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
                {p.features.slice(0, 5).map(f => (
                  <div key={f} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: ".88rem" }}>
                    <span style={{ color: "var(--primary)" }}><C2Icon name="check" size={15} /></span>{f}
                  </div>
                ))}
              </div>
              {current
                ? <C2Btn variant="ghost" className="btn-block" disabled>Current plan</C2Btn>
                : <C2Btn variant="primary" className="btn-block" iconRight="arrow-right" onClick={() => setPlan(p.id)}>{p.id === "advanced" ? "Upgrade" : "Switch to Basic"}</C2Btn>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- SHELL ---------------- */
function AdminCMS({ go, theme, setTheme, mode, setMode, openTo = "dashboard" }) {
  const [page, setPage] = React.useState(openTo);
  const [plan, setPlan] = React.useState("advanced");
  const { CmsSidebar, CmsTopbar } = window.CmsShellParts;
  const { CmsDashboard, CmsMembers, CmsGiving } = window.CmsPages;

  const meta = {
    dashboard: ["Dashboard", "Sunday, 9 June · Grace Chapel International"],
    members: ["Members", CH.stats.members + " people across 6 groups"],
    giving: ["Giving", "Tithes, offerings and pledges"],
    verses: ["Verses & content", "The Word for your congregation"],
    sermon: ["Sermon sync", "Live scripture for Sunday service"],
    settings: ["Settings", "Workspace, branding and billing"],
  };
  const actions = {
    members: <C2Btn variant="primary" size="sm" icon="plus">Add member</C2Btn>,
    giving: <C2Btn variant="primary" size="sm" icon="plus">Record gift</C2Btn>,
    verses: <C2Btn variant="primary" size="sm" icon="plus">Post verse</C2Btn>,
    dashboard: <C2Btn variant="primary" size="sm" icon="download">Export report</C2Btn>,
  };

  return (
    <div style={{ height: "100%", display: "flex", background: "var(--page)" }}>
      <CmsSidebar page={page} setPage={setPage} plan={plan} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <CmsTopbar title={meta[page][0]} sub={meta[page][1]} action={actions[page]} />
        <div key={page} className="anim-in" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {page === "dashboard" && <CmsDashboard />}
          {page === "members" && <CmsMembers />}
          {page === "giving" && <CmsGiving />}
          {page === "verses" && <CmsVerses />}
          {page === "sermon" && <CmsSermonSync go={go} plan={plan} setPage={setPage} />}
          {page === "settings" && <CmsSettings theme={theme} setTheme={setTheme} mode={mode} setMode={setMode} plan={plan} setPlan={setPlan} />}
        </div>
      </div>
    </div>
  );
}

window.AdminCMS = AdminCMS;

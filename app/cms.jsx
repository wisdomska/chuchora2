/* Churchora — Admin CMS (desktop) */
const { Icon: CIcon, Avatar: CAvatar, Pill: CPill, Btn: CBtn, IconChip: CChip, Logo: CLogo, Sparkline: CSpark, Eyebrow: CEyebrow, Segmented: CSeg, Toggle: CToggle } = window;

function CmsSidebar({ page, setPage, plan, go }) {
  return (
    <div style={{ width: 232, flexShrink: 0, background: "var(--chrome)", color: "var(--chrome-text)", display: "flex", flexDirection: "column", height: "100%" }}>
      <button onClick={() => go && go("site")} style={{ padding: "20px 18px 18px", display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", cursor: "pointer", color: "inherit", textAlign: "left", width: "100%" }}>
        <CLogo size={32} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>Churchora</div>
          <div style={{ fontSize: 11, color: "var(--chrome-muted)" }}>Grace Chapel</div>
        </div>
      </button>
      <div style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {CH.cmsNav.map(n => {
          const active = n.id === page;
          const locked = n.id === "sermon" && plan === "basic";
          return (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: "flex", alignItems: "center", gap: 12, border: "none", cursor: "pointer",
              padding: "10px 12px", borderRadius: "var(--r-sm)", textAlign: "left", position: "relative",
              fontFamily: "var(--font)", fontSize: ".92rem", fontWeight: active ? 400 : 300,
              background: active ? "rgba(255,255,255,.10)" : "transparent",
              color: active ? "var(--chrome-text)" : "var(--chrome-muted)",
              borderLeft: "3px solid " + (active ? "var(--primary)" : "transparent"),
              transition: "all var(--dur) var(--ease)",
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              <CIcon name={n.icon} size={18} />{n.label}
              {locked && <CIcon name="lock" size={13} style={{ marginLeft: "auto", opacity: .6 }} />}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 4px" }}>
          <CAvatar name="Yaw Boateng" tone="#7A4DA8" size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: ".88rem", fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Pastor Yaw</div>
            <div style={{ fontSize: ".74rem", color: "var(--chrome-muted)" }}>Administrator</div>
          </div>
          <CIcon name="log-out" size={16} style={{ color: "var(--chrome-muted)" }} />
        </div>
      </div>
    </div>
  );
}

function CmsTopbar({ title, sub, action }) {
  return (
    <div style={{ height: 68, flexShrink: 0, borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
      <div>
        <h2 style={{ fontSize: "1.35rem", letterSpacing: "-.02em" }}>{title}</h2>
        {sub && <div className="muted" style={{ fontSize: ".85rem", marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }}><CIcon name="search" size={16} /></span>
          <input placeholder="Search…" className="field" style={{ height: 40, width: 220, paddingLeft: 34, fontSize: ".9rem" }} />
        </div>
        <span style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", background: "var(--surface-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          <CIcon name="bell" size={18} />
          <span style={{ position: "absolute", top: 9, right: 10, width: 7, height: 7, borderRadius: "50%", background: "var(--primary)", border: "1.5px solid var(--surface-2)" }} />
        </span>
        {action}
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function StatCard({ label, value, delta, icon, tone, dotColor }) {
  return (
    <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <CEyebrow>{label}</CEyebrow>
        <CChip name={icon} tone={tone} size={36} />
      </div>
      <div style={{ fontSize: "2.1rem", fontWeight: 500, letterSpacing: "-.03em", margin: "14px 0 6px" }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".82rem", color: "var(--success)" }}>
        <CIcon name="trending-up" size={15} /><span>{delta}</span>
      </div>
    </div>
  );
}

function GivingChart() {
  return (
    <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: 2 }}>Giving trend</h3>
          <div className="muted" style={{ fontSize: ".84rem" }}>Last 8 weeks · GHS thousands</div>
        </div>
        <CSeg options={["Weekly", "Monthly"]} value="Weekly" onChange={() => {}} />
      </div>
      <CSpark data={CH.givingTrend} width={640} height={130} stroke="var(--primary)" />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {CH.givingWeeks.map(w => <span key={w} className="subtle" style={{ fontSize: ".72rem" }}>{w}</span>)}
      </div>
    </div>
  );
}

function FundBreakdown() {
  const data = [["Tithe", 62, "var(--primary)"], ["Offering", 21, "var(--accent)"], ["Building", 10, "var(--info)"], ["Missions", 7, "var(--success)"]];
  return (
    <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
      <h3 style={{ fontSize: "1.1rem", marginBottom: 16 }}>By fund</h3>
      <div style={{ display: "flex", height: 12, borderRadius: 99, overflow: "hidden", marginBottom: 18 }}>
        {data.map(([n, p, c]) => <span key={n} style={{ width: p + "%", background: c }} />)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {data.map(([n, p, c]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: ".88rem" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            <span style={{ flex: 1, color: "var(--text-muted)" }}>{n}</span>
            <span style={{ fontWeight: 500 }} className="mono">{p}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniBirthdays() {
  return (
    <div className="card card-pad" style={{ borderRadius: "var(--r-md)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: "1.1rem" }}>Birthdays this week</h3>
        <CIcon name="cake" size={18} style={{ color: "var(--warn)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CH.birthdays.slice(0, 4).map(b => (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <CAvatar name={b.name} tone={b.tone} size={34} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: ".88rem", fontWeight: 400 }}>{b.name}</div>
              <div className="muted" style={{ fontSize: ".76rem" }}>{b.date}</div>
            </div>
            <CPill kind={b.when === "Today" ? "warn" : "neutral"}>{b.when}</CPill>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentGiving({ rows }) {
  return (
    <div className="card" style={{ borderRadius: "var(--r-md)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px" }}>
        <h3 style={{ fontSize: "1.1rem" }}>Recent giving</h3>
        <span className="muted" style={{ fontSize: ".84rem", display: "inline-flex", alignItems: "center", gap: 3 }}>View all <CIcon name="chevron-right" size={14} /></span>
      </div>
      <GivingTable rows={rows.slice(0, 5)} compact />
    </div>
  );
}

function CmsDashboard() {
  return (
    <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 18 }}>
        <StatCard label="Members" value={CH.stats.members} delta={CH.stats.membersDelta} icon="users" tone="primary" />
        <StatCard label="Giving · this month" value={"GHS " + (CH.stats.giving / 1000).toFixed(1) + "k"} delta={CH.stats.givingDelta} icon="hand-coins" tone="success" />
        <StatCard label="Avg attendance" value={CH.stats.attendance} delta={CH.stats.attendanceDelta} icon="calendar" tone="info" />
        <StatCard label="Pledge progress" value={CH.stats.pledged + "%"} delta="GHS 304k of 400k" icon="trending-up" tone="accent" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18, marginBottom: 18 }}>
        <GivingChart />
        <FundBreakdown />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18 }}>
        <RecentGiving rows={CH.giving} />
        <MiniBirthdays />
      </div>
    </div>
  );
}

/* ---------------- MEMBERS ---------------- */
function CmsMembers() {
  const [q, setQ] = React.useState("");
  const [grp, setGrp] = React.useState("All");
  const groups = ["All", ...new Set(CH.members.map(m => m.group))];
  const list = CH.members.filter(m => (grp === "All" || m.group === grp) && m.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {groups.map(g => (
          <button key={g} onClick={() => setGrp(g)} style={{ border: "1px solid " + (grp === g ? "var(--primary)" : "var(--border)"), background: grp === g ? "var(--primary-tint)" : "var(--surface)", color: grp === g ? "var(--primary)" : "var(--text-muted)", borderRadius: 999, padding: "7px 15px", fontSize: ".85rem", fontFamily: "var(--font)", cursor: "pointer" }}>{g}</button>
        ))}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)" }}><CIcon name="search" size={16} /></span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Find a member…" className="field" style={{ height: 40, width: 240, paddingLeft: 34, fontSize: ".9rem" }} />
        </div>
      </div>
      <div className="card" style={{ borderRadius: "var(--r-md)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
          <thead>
            <tr style={{ background: "var(--chrome)", color: "var(--chrome-text)" }}>
              {["Member", "Role", "Group", "Joined", "Given (GHS)", ""].map((h, i) => (
                <th key={i} style={{ textAlign: i >= 4 && i < 5 ? "right" : "left", padding: "13px 22px", fontWeight: 400, fontSize: ".78rem", textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((m, i) => (
              <tr key={m.id} style={{ borderTop: "1px solid var(--border)", background: i % 2 ? "var(--surface-2)" : "var(--surface)" }}>
                <td style={{ padding: "12px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <CAvatar name={m.name} tone={m.tone} size={36} />
                    <div><div style={{ fontWeight: 400 }}>{m.name}</div><div className="muted" style={{ fontSize: ".78rem" }}>{m.email}</div></div>
                  </div>
                </td>
                <td style={{ padding: "12px 22px" }}><CPill kind={m.role === "Pastor" || m.role === "Elder" || m.role === "Deacon" ? "primary" : "neutral"}>{m.role}</CPill></td>
                <td style={{ padding: "12px 22px", color: "var(--text-muted)" }}>{m.group}</td>
                <td style={{ padding: "12px 22px", color: "var(--text-muted)" }} className="mono">{m.joined}</td>
                <td style={{ padding: "12px 22px", textAlign: "right", fontWeight: 500 }} className="mono">{m.giving.toLocaleString()}</td>
                <td style={{ padding: "12px 22px", textAlign: "right", color: "var(--text-subtle)" }}><CIcon name="more-horizontal" size={18} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- GIVING TABLE (shared) ---------------- */
function methodBadge(method) {
  const map = { "MTN MoMo": "#FFCC00", "Vodafone Cash": "#E60000", "AirtelTigo": "#0033A0", "Card": "var(--text)", "Bank": "var(--info)" };
  const dark = method === "MTN MoMo";
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: ".85rem", color: "var(--text-muted)" }}>
    <span style={{ width: 8, height: 8, borderRadius: 3, background: map[method] || "var(--text-muted)" }} />{method}
  </span>;
}
function statusPill(s) {
  const k = s === "Completed" ? "success" : s === "Pending" ? "warn" : "danger";
  return <CPill kind={k} dot>{s}</CPill>;
}
function GivingTable({ rows, compact }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".9rem" }}>
      <thead>
        <tr style={{ background: compact ? "transparent" : "var(--chrome)", color: compact ? "var(--text-subtle)" : "var(--chrome-text)", borderTop: compact ? "1px solid var(--border)" : "none" }}>
          {["Txn", "Member", "Fund", "Method", "Amount", "Status"].map((h, i) => (
            <th key={i} style={{ textAlign: i === 4 ? "right" : "left", padding: compact ? "11px 22px" : "13px 22px", fontWeight: 400, fontSize: ".75rem", textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id} style={{ borderTop: "1px solid var(--border)", background: !compact && i % 2 ? "var(--surface-2)" : "var(--surface)" }}>
            <td style={{ padding: "12px 22px" }} className="mono"><span style={{ color: "var(--text-subtle)", fontSize: ".82rem" }}>{r.id}</span></td>
            <td style={{ padding: "12px 22px", fontWeight: 400 }}>{r.name}</td>
            <td style={{ padding: "12px 22px", color: "var(--text-muted)" }}>{r.type}</td>
            <td style={{ padding: "12px 22px" }}>{methodBadge(r.method)}</td>
            <td style={{ padding: "12px 22px", textAlign: "right", fontWeight: 500 }} className="mono">{r.amount.toLocaleString()}</td>
            <td style={{ padding: "12px 22px" }}>{statusPill(r.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CmsGiving() {
  const total = CH.giving.reduce((a, b) => a + b.amount, 0);
  return (
    <div className="scroll-area" style={{ flex: 1, overflowY: "auto", padding: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 18 }}>
        <StatCard label="Today" value={"GHS " + total.toLocaleString()} delta="+18% vs yesterday" icon="hand-coins" tone="success" />
        <StatCard label="Mobile money" value="72%" delta="Most-used method" icon="phone" tone="primary" />
        <StatCard label="Recurring givers" value="148" delta="+11 this month" icon="repeat" tone="accent" />
      </div>
      <div className="card" style={{ borderRadius: "var(--r-md)", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px" }}>
          <h3 style={{ fontSize: "1.1rem" }}>Transactions</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <CBtn variant="ghost" size="sm" icon="filter">Filter</CBtn>
            <CBtn variant="ghost" size="sm" icon="download">Export</CBtn>
          </div>
        </div>
        <GivingTable rows={CH.giving} />
      </div>
    </div>
  );
}

window.CmsShellParts = { CmsSidebar, CmsTopbar };
window.CmsPages = { CmsDashboard, CmsMembers, CmsGiving, StatCard, GivingTable };

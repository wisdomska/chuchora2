/* Churchora — shared UI primitives + inline icon set (Lucide-style, single weight) */

const ICONS = {
  "arrow-right": [["path",{d:"M5 12h14"}],["path",{d:"m12 5 7 7-7 7"}]],
  "arrow-up-right": [["path",{d:"M7 17 17 7"}],["path",{d:"M7 7h10v10"}]],
  "chevron-right": [["path",{d:"m9 18 6-6-6-6"}]],
  "chevron-left": [["path",{d:"m15 18-6-6 6-6"}]],
  "chevron-down": [["path",{d:"m6 9 6 6 6-6"}]],
  "check": [["path",{d:"M20 6 9 17l-5-5"}]],
  "x": [["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]],
  "plus": [["path",{d:"M5 12h14"}],["path",{d:"M12 5v14"}]],
  "minus": [["path",{d:"M5 12h14"}]],
  "search": [["circle",{cx:11,cy:11,r:8}],["path",{d:"m21 21-4.3-4.3"}]],
  "bell": [["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0"}]],
  "cake": [["path",{d:"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"}],["path",{d:"M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"}],["path",{d:"M2 21h20"}],["path",{d:"M7 8v3"}],["path",{d:"M12 8v3"}],["path",{d:"M17 8v3"}],["path",{d:"M7 4h.01"}],["path",{d:"M12 4h.01"}],["path",{d:"M17 4h.01"}]],
  "gift": [["path",{d:"M20 12v10H4V12"}],["rect",{x:2,y:7,width:20,height:5,rx:1}],["path",{d:"M12 22V7"}],["path",{d:"M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"}],["path",{d:"M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"}]],
  "heart": [["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3 5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 7.5 3 5.5 5.5 0 0 0 2 8.5c0 2.29 1.5 4.04 3 5.5l7 7Z"}]],
  "share": [["circle",{cx:18,cy:5,r:3}],["circle",{cx:6,cy:12,r:3}],["circle",{cx:18,cy:19,r:3}],["path",{d:"m8.6 13.5 6.8 4"}],["path",{d:"m15.4 6.5-6.8 4"}]],
  "calendar": [["rect",{x:3,y:4,width:18,height:18,rx:2}],["path",{d:"M16 2v4"}],["path",{d:"M8 2v4"}],["path",{d:"M3 10h18"}]],
  "clock": [["circle",{cx:12,cy:12,r:10}],["path",{d:"M12 6v6l4 2"}]],
  "log-out": [["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}],["path",{d:"m16 17 5-5-5-5"}],["path",{d:"M21 12H9"}]],
  "menu": [["path",{d:"M4 6h16"}],["path",{d:"M4 12h16"}],["path",{d:"M4 18h16"}]],
  "sun": [["circle",{cx:12,cy:12,r:4}],["path",{d:"M12 2v2"}],["path",{d:"M12 20v2"}],["path",{d:"m4.9 4.9 1.4 1.4"}],["path",{d:"m17.7 17.7 1.4 1.4"}],["path",{d:"M2 12h2"}],["path",{d:"M20 12h2"}],["path",{d:"m4.9 19.1 1.4-1.4"}],["path",{d:"m17.7 6.3 1.4-1.4"}]],
  "moon": [["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"}]],
  "palette": [["path",{d:"M13.5 2c-5.6 0-10 4-10 9.5S7.9 21 13.5 21c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.4-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H18c2.2 0 4-1.8 4-4C22 6 18.2 2 13.5 2Z"}],["circle",{cx:8,cy:10,r:1.2,fill:"currentColor",stroke:"none"}],["circle",{cx:12,cy:7,r:1.2,fill:"currentColor",stroke:"none"}],["circle",{cx:16.5,cy:9,r:1.2,fill:"currentColor",stroke:"none"}]],
  "sparkles": [["path",{d:"M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"}],["path",{d:"M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"}]],
  "shield": [["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"}]],
  "shield-check": [["path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"}],["path",{d:"m9 12 2 2 4-4"}]],
  "lock": [["rect",{x:3,y:11,width:18,height:11,rx:2}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4"}]],
  "mail": [["rect",{x:2,y:4,width:20,height:16,rx:2}],["path",{d:"m22 6-10 7L2 6"}]],
  "phone": [["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"}]],
  "credit-card": [["rect",{x:2,y:5,width:20,height:14,rx:2}],["path",{d:"M2 10h20"}]],
  "play": [["path",{d:"M6 4v16l14-8z"}]],
  "pause": [["rect",{x:6,y:4,width:4,height:16,rx:1}],["rect",{x:14,y:4,width:4,height:16,rx:1}]],
  "skip-forward": [["path",{d:"M5 4v16l11-8z"}],["rect",{x:18,y:4,width:2.4,height:16,rx:1}]],
  "skip-back": [["path",{d:"M19 4v16L8 12z"}],["rect",{x:3.6,y:4,width:2.4,height:16,rx:1}]],
  "eye": [["path",{d:"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"}],["circle",{cx:12,cy:12,r:3}]],
  "eye-off": [["path",{d:"M9.9 4.2A9.5 9.5 0 0 1 12 4c6.5 0 10 8 10 8a13 13 0 0 1-2 2.9"}],["path",{d:"M6.6 6.6A13 13 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 4-.9"}],["path",{d:"m2 2 20 20"}]],
  "monitor": [["rect",{x:2,y:3,width:20,height:14,rx:2}],["path",{d:"M8 21h8"}],["path",{d:"M12 17v4"}]],
  "send": [["path",{d:"m22 2-7 20-4-9-9-4Z"}],["path",{d:"M22 2 11 13"}]],
  "trending-up": [["path",{d:"m22 7-8.5 8.5-5-5L2 17"}],["path",{d:"M16 7h6v6"}]],
  "download": [["path",{d:"M12 3v12"}],["path",{d:"m7 10 5 5 5-5"}],["path",{d:"M5 21h14"}]],
  "filter": [["path",{d:"M22 3H2l8 9.46V19l4 2v-8.54z"}]],
  "more-horizontal": [["circle",{cx:12,cy:12,r:1.4,fill:"currentColor",stroke:"none"}],["circle",{cx:19,cy:12,r:1.4,fill:"currentColor",stroke:"none"}],["circle",{cx:5,cy:12,r:1.4,fill:"currentColor",stroke:"none"}]],
  "user": [["circle",{cx:12,cy:8,r:4}],["path",{d:"M20 21a8 8 0 0 0-16 0"}]],
  "star": [["path",{d:"M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2 1.3-7-5-4.8 7-.9z"}]],
  "zap": [["path",{d:"M13 2 3 14h7l-1 8 10-12h-7z"}]],
  "radio": [["circle",{cx:12,cy:12,r:2}],["path",{d:"M4.9 4.9a10 10 0 0 0 0 14.2"}],["path",{d:"M19.1 4.9a10 10 0 0 1 0 14.2"}],["path",{d:"M7.8 7.8a6 6 0 0 0 0 8.4"}],["path",{d:"M16.2 7.8a6 6 0 0 1 0 8.4"}]],
  "check-circle": [["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}],["path",{d:"m9 11 3 3L22 4"}]],
  "alert-triangle": [["path",{d:"M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"}],["path",{d:"M12 9v4"}],["path",{d:"M12 17h.01"}]],
  "info": [["circle",{cx:12,cy:12,r:10}],["path",{d:"M12 16v-4"}],["path",{d:"M12 8h.01"}]],
  "refresh": [["path",{d:"M21 2v6h-6"}],["path",{d:"M3 12a9 9 0 0 1 15-6.7L21 8"}],["path",{d:"M3 22v-6h6"}],["path",{d:"M21 12a9 9 0 0 1-15 6.7L3 16"}]],
  "edit": [["path",{d:"M12 20h9"}],["path",{d:"M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"}]],
  "trash": [["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}]],
  "copy": [["rect",{x:9,y:9,width:13,height:13,rx:2}],["path",{d:"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"}]],
  "globe": [["circle",{cx:12,cy:12,r:10}],["path",{d:"M2 12h20"}],["path",{d:"M12 2a15 15 0 0 1 0 20"}],["path",{d:"M12 2a15 15 0 0 0 0 20"}]],
  "smartphone": [["rect",{x:5,y:2,width:14,height:20,rx:2.5}],["path",{d:"M12 18h.01"}]],
  "users": [["circle",{cx:9,cy:8,r:4}],["path",{d:"M2 21a7 7 0 0 1 14 0"}],["path",{d:"M16 3.7a4 4 0 0 1 0 7.7"}],["path",{d:"M22 21a7 7 0 0 0-5-6.7"}]],
  "hand-coins": [["circle",{cx:9,cy:8,r:5}],["path",{d:"M9 5.5v5"}],["path",{d:"M7.5 7h3"}],["path",{d:"M14.7 4.2a5 5 0 0 1 0 7.6"}],["path",{d:"M3 19c2-2 5-2 7 0l1 1"}],["path",{d:"M11 20l4-1c1-.3 2-1.3 2-2.5"}]],
  "book-open": [["path",{d:"M12 7v14"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]],
  "presentation": [["path",{d:"M2 3h20"}],["path",{d:"M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"}],["path",{d:"m7 21 5-4 5 4"}],["path",{d:"M12 16v1"}]],
  "settings": [["circle",{cx:12,cy:12,r:3}],["path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"}]],
  "layout-dashboard": [["rect",{x:3,y:3,width:7,height:9,rx:1}],["rect",{x:14,y:3,width:7,height:5,rx:1}],["rect",{x:14,y:12,width:7,height:9,rx:1}],["rect",{x:3,y:16,width:7,height:5,rx:1}]],
  "plus-circle": [["circle",{cx:12,cy:12,r:10}],["path",{d:"M12 8v8"}],["path",{d:"M8 12h8"}]],
  "calendar-plus": [["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"}],["path",{d:"M16 2v4"}],["path",{d:"M8 2v4"}],["path",{d:"M3 10h18"}],["path",{d:"M19 16v6"}],["path",{d:"M16 19h6"}]],
  "list": [["path",{d:"M8 6h13"}],["path",{d:"M8 12h13"}],["path",{d:"M8 18h13"}],["path",{d:"M3 6h.01"}],["path",{d:"M3 12h.01"}],["path",{d:"M3 18h.01"}]],
  "external": [["path",{d:"M15 3h6v6"}],["path",{d:"M10 14 21 3"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],
  "wifi": [["path",{d:"M5 13a10 10 0 0 1 14 0"}],["path",{d:"M8.5 16.5a5 5 0 0 1 7 0"}],["path",{d:"M2 8.8a15 15 0 0 1 20 0"}],["path",{d:"M12 20h.01"}]],
  "logout": [["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}],["path",{d:"m16 17 5-5-5-5"}],["path",{d:"M21 12H9"}]],
  "chevrons-right": [["path",{d:"m6 17 5-5-5-5"}],["path",{d:"m13 17 5-5-5-5"}]],
  "repeat": [["path",{d:"m17 2 4 4-4 4"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14"}],["path",{d:"m7 22-4-4 4-4"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3"}]],
  "bookmark": [["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"}]],
};
const FILLED = new Set(["play","pause","skip-forward","skip-back"]);

function Icon({ name, size = 20, stroke = 1.75, fill = false, style, className }) {
  const node = ICONS[name];
  if (!node) return null;
  const isFill = fill || FILLED.has(name);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={isFill ? "currentColor" : "none"}
      stroke={isFill ? "none" : "currentColor"}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      className={className} style={{ flexShrink: 0, display: "block", ...style }}>
      {node.map((n, i) => React.createElement(n[0], { key: i, ...n[1] }))}
    </svg>
  );
}

/* Brand mark — minimal chapel: pointed arch + cross */
function Logo({ size = 38, radius, style }) {
  const r = radius != null ? radius : Math.round(size * 0.29);
  return (
    <span style={{ display: "inline-flex", flexShrink: 0, ...style }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect width="40" height="40" rx={r} fill="var(--primary)" />
        <g stroke="var(--primary-contrast)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 29V19a7 7 0 0 1 14 0v10" />
          <path d="M20 8.5v5" />
          <path d="M17.5 10.7h5" />
          <path d="M10.5 29h19" />
        </g>
      </svg>
    </span>
  );
}

function Wordmark({ size = 19, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Logo size={size * 2} />
      <span style={{ fontSize: size, fontWeight: 500, letterSpacing: "-.02em", color: light ? "var(--chrome-text)" : "var(--text)" }}>
        Churchora
      </span>
    </div>
  );
}

function Avatar({ name, size = 40, tone, ring = false }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const bg = tone || "var(--primary)";
  return (
    <span style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 500, letterSpacing: ".01em", flexShrink: 0,
      boxShadow: ring ? "0 0 0 2px var(--surface), 0 0 0 4px " + bg : "none",
      userSelect: "none",
    }}>{initials}</span>
  );
}

function Btn({ children, variant = "primary", size, icon, iconRight, onClick, type, disabled, style, className = "" }) {
  const sz = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  return (
    <button type={type || "button"} disabled={disabled} onClick={onClick}
      className={`btn btn-${variant} ${sz} ${className}`} style={style}>
      {icon && <Icon name={icon} size={size === "lg" ? 19 : 17} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 19 : 17} />}
    </button>
  );
}

function Pill({ children, kind = "neutral", dot = false, style }) {
  return (
    <span className={`pill pill-${kind}`} style={style}>
      {dot && <span className="pill-dot" style={{ background: "currentColor" }} />}
      {children}
    </span>
  );
}

function Eyebrow({ children, style }) {
  return <div className="eyebrow" style={style}>{children}</div>;
}

function IconChip({ name, size = 40, tone = "primary", style }) {
  const map = {
    primary: ["var(--primary-tint)", "var(--primary)"],
    accent: ["var(--accent-tint)", "var(--accent)"],
    success: ["var(--success-tint)", "var(--success)"],
    info: ["var(--info-tint)", "var(--info)"],
    warn: ["var(--warn-tint)", "var(--warn)"],
    danger: ["var(--danger-tint)", "var(--danger)"],
  };
  const [bg, fg] = map[tone] || map.primary;
  return (
    <span className="icon-chip" style={{ width: size, height: size, background: bg, color: fg, ...style }}>
      <Icon name={name} size={size * 0.5} />
    </span>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 999, border: "none", padding: 3,
      background: on ? "var(--primary)" : "var(--border-strong)",
      transition: "background var(--dur) var(--ease)", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: on ? "flex-end" : "flex-start",
    }}>
      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.3)", transition: "all var(--dur) var(--ease)" }} />
    </button>
  );
}

function Segmented({ options, value, onChange, style }) {
  return (
    <div style={{ display: "inline-flex", background: "var(--surface-2)", borderRadius: "var(--r-sm)", padding: 3, gap: 2, ...style }}>
      {options.map(o => {
        const v = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        const active = v === value;
        return (
          <button key={v} type="button" onClick={() => onChange(v)} style={{
            border: "none", background: active ? "var(--surface)" : "transparent",
            color: active ? "var(--text)" : "var(--text-muted)",
            fontFamily: "var(--font)", fontWeight: active ? 400 : 300, fontSize: ".85rem",
            padding: "7px 14px", borderRadius: "calc(var(--r-sm) - 3px)", whiteSpace: "nowrap",
            boxShadow: active ? "var(--shadow-sm)" : "none",
            transition: "all var(--dur) var(--ease)",
          }}>{label}</button>
        );
      })}
    </div>
  );
}

/* Tiny SVG sparkline/area chart */
function Sparkline({ data, width = 260, height = 70, stroke = "var(--primary)", fill = true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pad = 4;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${pts[pts.length-1][0].toFixed(1)} ${height} L ${pts[0][0].toFixed(1)} ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible", width: "100%" }} preserveAspectRatio="none">
      {fill && <path d={area} fill={stroke} opacity="0.1" />}
      <path d={line} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3.5" fill={stroke} />
    </svg>
  );
}

/* ── Viewport hook ── */
function useViewport() {
  const [w, setW] = React.useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  React.useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return {
    w,
    isMobile:  w < 768,
    isTablet:  w >= 768 && w < 1024,
    isDesktop: w >= 1024,
    isMobileOrTablet: w < 1024,
  };
}

/* ── Animated Hamburger → X ── */
function Hamburger({ open, size = 22, color = "currentColor" }) {
  const gap = Math.round(size * 0.27);   // gap between bars in flexbox
  const tx  = gap + 2;                   // translateY to align top/bottom bar to center
  const bar = (extra = {}) => ({
    display: "block", width: size, height: 2,
    background: color, borderRadius: 1,
    transition: "transform .28s cubic-bezier(.22,.61,.36,1), opacity .18s",
    ...extra,
  });
  return (
    <span style={{ display: "flex", flexDirection: "column", gap, width: size, lineHeight: 0 }}>
      <span style={bar({ transform: open ? `translateY(${tx}px) rotate(45deg)`  : "none" })} />
      <span style={bar({ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" })} />
      <span style={bar({ transform: open ? `translateY(-${tx}px) rotate(-45deg)` : "none" })} />
    </span>
  );
}

Object.assign(window, {
  Icon, Logo, Wordmark, Avatar, Btn, Pill, Eyebrow, IconChip, Toggle, Segmented, Sparkline,
  useViewport, Hamburger,
});

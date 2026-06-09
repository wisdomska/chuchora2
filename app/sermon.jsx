/* Churchora — Sermon live-sync (presenter console + projection + live transcript) */
const { Icon: SIcon, Btn: SBtn, Pill: SPill, Logo: SLogo, Eyebrow: SEyebrow } = window;

function Projection({ verse, blackout, big }) {
  return (
    <div style={{
      flex: 1, minHeight: 0, borderRadius: big ? "var(--r-lg)" : "var(--r-md)", overflow: "hidden",
      background: "#04070b", position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
      padding: big ? "8% 9%" : "10% 8%", textAlign: "center", boxShadow: "inset 0 0 120px rgba(0,0,0,.6)",
    }}>
      <div style={{ position: "absolute", bottom: "-30%", left: "50%", transform: "translateX(-50%)", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, var(--primary) 0%, transparent 68%)", opacity: .18 }} />
      {blackout ? (
        <div style={{ color: "rgba(255,255,255,.25)", fontSize: ".9rem", letterSpacing: ".2em", textTransform: "uppercase", position: "relative" }}>Screen blacked out</div>
      ) : (
        <div style={{ position: "relative", maxWidth: 900 }}>
          <div className="eyebrow" style={{ color: "var(--primary)", marginBottom: big ? 28 : 16, fontSize: big ? ".9rem" : ".72rem" }}>{verse.ref} · {verse.tr}</div>
          <p className="serif-verse" style={{ color: "#fff", fontSize: big ? "clamp(1.8rem, 3.4vw, 3.2rem)" : "1.5rem", lineHeight: 1.32, letterSpacing: "-.01em" }}>"{verse.text}"</p>
        </div>
      )}
    </div>
  );
}

/* ── Live transcript hook (Web Speech API) ── */
function useTranscript() {
  const [finalText, setFinalText] = React.useState("");
  const [interim, setInterim]     = React.useState("");
  const [listening, setListening] = React.useState(false);
  const [supported, setSupported] = React.useState(true);
  const recRef = React.useRef(null);
  const activeRef = React.useRef(false);

  React.useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  const start = React.useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let fin = "", inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + " ";
        else inter += e.results[i][0].transcript;
      }
      if (fin) setFinalText(t => (t + fin).slice(-1200));
      setInterim(inter);
    };
    rec.onend = () => { if (activeRef.current) rec.start(); };
    rec.onerror = (e) => { if (e.error !== "aborted") console.warn("SR error", e.error); };
    recRef.current = rec;
    activeRef.current = true;
    rec.start();
    setListening(true);
  }, []);

  const stop = React.useCallback(() => {
    activeRef.current = false;
    if (recRef.current) { try { recRef.current.stop(); } catch(e) {} }
    setListening(false);
    setInterim("");
  }, []);

  const clear = React.useCallback(() => {
    setFinalText("");
    setInterim("");
  }, []);

  return { finalText, interim, listening, supported, start, stop, clear };
}

/* ── Verse matcher: finds the best matching verse given a rolling transcript ── */
function matchVerseFromText(text) {
  if (!text || text.trim().split(/\s+/).length < 3) return null;
  const haystack = text.toLowerCase();
  let best = null, bestScore = 0;

  for (const v of CH.verses) {
    const vWords = v.text.toLowerCase().split(/\s+/);
    // slide a window of 3..8 words across the verse, check if transcript contains it
    for (let start = 0; start <= vWords.length - 3; start++) {
      for (let len = 3; len <= Math.min(8, vWords.length - start); len++) {
        const chunk = vWords.slice(start, start + len).join(" ");
        if (haystack.includes(chunk) && len > bestScore) {
          bestScore = len;
          best = v;
        }
      }
    }
  }
  // also check sermon queue verses
  for (const v of CH.sermonQueue) {
    const vWords = v.text.toLowerCase().split(/\s+/);
    for (let start = 0; start <= vWords.length - 3; start++) {
      for (let len = 3; len <= Math.min(8, vWords.length - start); len++) {
        const chunk = vWords.slice(start, start + len).join(" ");
        if (haystack.includes(chunk) && len > bestScore) {
          bestScore = len;
          best = v;
        }
      }
    }
  }
  return bestScore >= 3 ? { verse: best, score: bestScore } : null;
}

/* Highlight words in the verse that appear in the transcript */
function HighlightedVerse({ verseText, transcript }) {
  const hay = transcript.toLowerCase();
  const words = verseText.split(/(\s+)/);
  return (
    <span>
      {words.map((w, i) => {
        const clean = w.toLowerCase().replace(/[^a-z]/g, "");
        const hit = clean.length > 3 && hay.includes(clean);
        return (
          <span key={i} style={{
            background: hit ? "var(--primary-tint-2)" : "transparent",
            color: hit ? "var(--primary)" : "inherit",
            borderRadius: 3, padding: hit ? "0 2px" : 0,
            transition: "all .25s",
          }}>{w}</span>
        );
      })}
    </span>
  );
}

/* ── Transcript rail ── */
function TranscriptRail({ onPushVerse }) {
  const { finalText, interim, listening, supported, start, stop, clear } = useTranscript();
  const scrollRef = React.useRef(null);
  const [match, setMatch] = React.useState(null);
  const [pushedRefs, setPushedRefs] = React.useState(new Set());

  /* auto-scroll transcript */
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [finalText, interim]);

  /* run matcher whenever transcript changes */
  React.useEffect(() => {
    const combined = (finalText + " " + interim).trim();
    const result = matchVerseFromText(combined);
    setMatch(result || null);
  }, [finalText, interim]);

  const handlePush = () => {
    if (!match) return;
    onPushVerse(match.verse);
    setPushedRefs(s => new Set([...s, match.verse.ref]));
  };

  const displayText = finalText + interim;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>

      {/* mic control */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {!supported ? (
          <div style={{ fontSize: ".82rem", color: "var(--danger)", display: "flex", alignItems: "center", gap: 6 }}>
            <SIcon name="alert-triangle" size={14} />Speech recognition not supported in this browser
          </div>
        ) : (
          <>
            <button onClick={listening ? stop : start} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              border: "none", borderRadius: "var(--r-sm)", padding: "10px 14px",
              background: listening ? "var(--danger-tint)" : "var(--primary)",
              color: listening ? "var(--danger)" : "var(--primary-contrast)",
              fontFamily: "var(--font)", fontSize: ".88rem", fontWeight: 400, cursor: "pointer",
              transition: "all var(--dur) var(--ease)",
            }}>
              {listening
                ? <><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--danger)", animation: "pulse 1.4s infinite" }} />Stop listening</>
                : <><SIcon name="radio" size={16} />Start listening</>}
            </button>
            {(finalText || interim) && (
              <button onClick={clear} title="Clear transcript" style={{ width: 38, height: 38, border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "var(--chrome-muted)", borderRadius: "var(--r-sm)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <SIcon name="trash" size={15} />
              </button>
            )}
          </>
        )}
      </div>

      {/* matched verse card */}
      {match ? (
        <div className="anim-scale" style={{
          background: "var(--primary)", borderRadius: "var(--r-md)", padding: "14px 16px",
          border: "1px solid rgba(255,255,255,.12)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5dfc8a", boxShadow: "0 0 0 0 rgba(93,252,138,.5)", animation: "pulse 1.4s infinite" }} />
              <span style={{ fontSize: ".72rem", fontWeight: 500, color: "var(--primary-contrast)", opacity: .8, textTransform: "uppercase", letterSpacing: ".1em" }}>Verse detected</span>
            </div>
            <span style={{ fontSize: ".72rem", color: "var(--primary-contrast)", opacity: .65 }}>{match.score} words matched</span>
          </div>
          <p className="serif-verse" style={{ fontSize: "1rem", lineHeight: 1.45, color: "var(--primary-contrast)", marginBottom: 10 }}>
            "<HighlightedVerse verseText={match.verse.text} transcript={finalText + " " + interim} />"
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="mono" style={{ fontSize: ".78rem", color: "var(--primary-contrast)", opacity: .75 }}>{match.verse.ref} · {match.verse.tr}</span>
            <button onClick={handlePush} style={{
              border: "1px solid rgba(255,255,255,.3)", background: pushedRefs.has(match.verse.ref) ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.22)",
              color: "var(--primary-contrast)", borderRadius: "var(--r-xs)", padding: "5px 12px",
              fontFamily: "var(--font)", fontSize: ".78rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <SIcon name="monitor" size={13} />{pushedRefs.has(match.verse.ref) ? "Pushed" : "Push to screen"}
            </button>
          </div>
        </div>
      ) : listening ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(255,255,255,.04)", borderRadius: "var(--r-sm)", border: "1px dashed rgba(255,255,255,.1)" }}>
          <span style={{ fontSize: ".82rem", color: "var(--chrome-muted)" }}>Listening for scripture…</span>
          <div style={{ display: "flex", gap: 3, marginLeft: "auto" }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--primary)", opacity: .7, animation: `bounce 1.2s ${i * .2}s infinite` }} />)}
          </div>
        </div>
      ) : null}

      {/* transcript scroll area */}
      {displayText ? (
        <div ref={scrollRef} className="scroll-area" style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
          <div style={{ fontSize: ".82rem", lineHeight: 1.7, color: "var(--chrome-muted)" }}>
            <span>{finalText}</span>
            {interim && <span style={{ color: "rgba(255,255,255,.58)", fontStyle: "italic" }}>{interim}</span>}
          </div>
        </div>
      ) : !listening ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--chrome-muted)", textAlign: "center", padding: "0 8px" }}>
          <SIcon name="radio" size={28} />
          <div style={{ fontSize: ".84rem", lineHeight: 1.5 }}>
            Tap <b style={{ color: "var(--chrome-text)" }}>Start listening</b> and speak.<br />
            Churchora will detect scripture<br />as the preacher speaks.
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SermonMode({ go }) {
  const queue = CH.sermonQueue;
  const [idx, setIdx]         = React.useState(0);
  const [blackout, setBlackout] = React.useState(false);
  const [railTab, setRailTab] = React.useState("queue"); // "queue" | "transcript"
  const [liveQueue, setLiveQueue] = React.useState(queue);

  const next = () => setIdx(i => Math.min(i + 1, liveQueue.length - 1));
  const prev = () => setIdx(i => Math.max(i - 1, 0));

  React.useEffect(() => {
    const fn = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") prev();
      else if (e.key.toLowerCase() === "b") setBlackout(b => !b);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [liveQueue.length]);

  const pushVerse = (verse) => {
    // add to queue if not already there, and jump to it
    setLiveQueue(q => {
      const exists = q.find(v => v.ref === verse.ref);
      if (exists) {
        setIdx(q.indexOf(exists));
        return q;
      }
      const next = [...q, verse];
      setIdx(next.length - 1);
      return next;
    });
    setRailTab("queue");
    setBlackout(false);
  };

  const currentVerse = liveQueue[idx] || liveQueue[0];
  const nextVerse = liveQueue[idx + 1];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--chrome)", color: "var(--chrome-text)" }}>
      {/* header */}
      <div style={{ height: 58, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <button onClick={() => go("site")} style={{ display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0 }}>
          <SLogo size={28} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: ".95rem", fontWeight: 500 }}>The Lord is my Shepherd</div>
            <div style={{ fontSize: ".76rem", color: "var(--chrome-muted)" }}>Sunday service · Pastor Yaw</div>
          </div>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: ".8rem", fontWeight: 500, color: "#ff5d52" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5d52", boxShadow: "0 0 0 0 rgba(255,93,82,.6)", animation: "pulse 1.8s infinite" }} />LIVE
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: ".8rem", color: "var(--chrome-muted)" }}><SIcon name="wifi" size={15} />612 phones synced</span>
          <button onClick={() => go("cms")} style={{ border: "1px solid var(--chrome-muted)", background: "transparent", color: "var(--chrome-text)", borderRadius: "var(--r-sm)", padding: "7px 14px", fontFamily: "var(--font)", fontSize: ".85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}><SIcon name="x" size={15} />Exit</button>
        </div>
      </div>

      {/* body */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", padding: 20, gap: 20 }}>
        {/* presenter main */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SEyebrow style={{ color: "var(--chrome-muted)" }}>On screen now</SEyebrow>
            <span className="mono" style={{ fontSize: ".82rem", color: "var(--chrome-muted)" }}>{idx + 1} / {liveQueue.length}</span>
          </div>
          <Projection verse={currentVerse} blackout={blackout} big />

          {/* transport */}
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "var(--r-md)", padding: "12px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 200 }}>
              <button onClick={() => setBlackout(b => !b)} style={{ border: "1px solid " + (blackout ? "var(--primary)" : "rgba(255,255,255,.18)"), background: blackout ? "var(--primary)" : "transparent", color: blackout ? "var(--primary-contrast)" : "var(--chrome-text)", borderRadius: "var(--r-sm)", padding: "9px 14px", fontFamily: "var(--font)", fontSize: ".84rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <SIcon name={blackout ? "eye" : "eye-off"} size={16} />{blackout ? "Show" : "Black out"}
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <button onClick={prev} disabled={idx === 0} style={transportBtn(idx === 0)}><SIcon name="skip-back" size={20} /></button>
              <div style={{ textAlign: "center", minWidth: 110 }}>
                <div style={{ fontSize: ".72rem", color: "var(--chrome-muted)", textTransform: "uppercase", letterSpacing: ".1em" }}>Next</div>
                <div className="mono" style={{ fontSize: ".9rem", color: nextVerse ? "var(--chrome-text)" : "var(--chrome-muted)" }}>{nextVerse ? nextVerse.ref : "End of queue"}</div>
              </div>
              <button onClick={next} disabled={idx === liveQueue.length - 1} style={transportBtn(idx === liveQueue.length - 1, true)}><SIcon name="skip-forward" size={20} /></button>
            </div>
            <div style={{ minWidth: 200, textAlign: "right", fontSize: ".78rem", color: "var(--chrome-muted)" }}>
              <kbd style={kbd}>←</kbd> <kbd style={kbd}>→</kbd> to navigate · <kbd style={kbd}>B</kbd> blackout
            </div>
          </div>
        </div>

        {/* right rail — queue | transcript tabs */}
        <div style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0, gap: 12 }}>
          {/* tab switcher */}
          <div style={{ display: "flex", background: "rgba(255,255,255,.06)", borderRadius: "var(--r-sm)", padding: 3, gap: 3, flexShrink: 0 }}>
            {[["queue", "list", "Queue"], ["transcript", "radio", "Live Transcript"]].map(([id, icon, label]) => {
              const active = railTab === id;
              return (
                <button key={id} onClick={() => setRailTab(id)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  border: "none", background: active ? "var(--primary)" : "transparent",
                  color: active ? "var(--primary-contrast)" : "var(--chrome-muted)",
                  borderRadius: "calc(var(--r-sm) - 2px)", padding: "8px 10px",
                  fontFamily: "var(--font)", fontSize: ".82rem", fontWeight: active ? 400 : 300,
                  cursor: "pointer", transition: "all var(--dur) var(--ease)", whiteSpace: "nowrap",
                }}>
                  <SIcon name={icon} size={14} />{label}
                  {id === "transcript" && railTab !== "transcript" && (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--primary)", border: "2px solid var(--chrome)" }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* queue panel */}
          {railTab === "queue" && (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <SEyebrow style={{ color: "var(--chrome-muted)" }}>Verse queue</SEyebrow>
                <button style={{ border: "none", background: "rgba(255,255,255,.08)", color: "var(--chrome-text)", borderRadius: 7, padding: "5px 10px", fontSize: ".78rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}><SIcon name="plus" size={14} />Add</button>
              </div>
              <div className="scroll-area" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 9, paddingRight: 4 }}>
                {liveQueue.map((v, i) => {
                  const active = i === idx;
                  return (
                    <button key={v.ref + i} onClick={() => setIdx(i)} style={{
                      textAlign: "left", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
                      padding: "13px 14px", borderRadius: "var(--r-sm)",
                      background: active ? "var(--primary)" : "rgba(255,255,255,.05)",
                      color: active ? "var(--primary-contrast)" : "var(--chrome-text)",
                      border: "1px solid " + (active ? "var(--primary)" : "rgba(255,255,255,.08)"), transition: "all var(--dur) var(--ease)",
                    }}>
                      <span className="mono" style={{ fontSize: ".78rem", opacity: active ? .8 : .5, marginTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="mono" style={{ fontSize: ".82rem", fontWeight: 500, marginBottom: 3 }}>{v.ref} · {v.tr}</div>
                        <div style={{ fontSize: ".82rem", opacity: active ? .9 : .55, lineHeight: 1.4 }}>"{v.text.length > 64 ? v.text.slice(0, 64) + "…" : v.text}"</div>
                      </div>
                      {active && <span style={{ flexShrink: 0 }}><SIcon name="monitor" size={15} /></span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* transcript panel */}
          {railTab === "transcript" && (
            <TranscriptRail onPushVerse={pushVerse} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {0%{box-shadow:0 0 0 0 rgba(255,93,82,.55)}70%{box-shadow:0 0 0 7px rgba(255,93,82,0)}100%{box-shadow:0 0 0 0 rgba(255,93,82,0)}}
        @keyframes bounce {0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        kbd{font-family:var(--font)}
      `}</style>
    </div>
  );
}

function transportBtn(disabled, primary) {
  return {
    width: 52, height: 52, borderRadius: "50%", cursor: disabled ? "default" : "pointer",
    border: "none", display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: disabled ? "rgba(255,255,255,.06)" : primary ? "var(--primary)" : "rgba(255,255,255,.12)",
    color: disabled ? "rgba(255,255,255,.25)" : primary ? "var(--primary-contrast)" : "var(--chrome-text)",
    transition: "all var(--dur) var(--ease)",
  };
}
const kbd = { display: "inline-block", padding: "1px 6px", border: "1px solid rgba(255,255,255,.2)", borderRadius: 4, fontSize: ".72rem", margin: "0 1px" };

window.SermonMode = SermonMode;

"use client";

import { useEffect, useRef, useState } from "react";
import { useFaith } from "@/lib/device";

type Phase = "idle" | "in" | "hold" | "out" | "done";

const STEPS: { phase: Exclude<Phase, "idle" | "done">; label: string; seconds: number }[] = [
  { phase: "in", label: "Breathe in", seconds: 4 },
  { phase: "hold", label: "Hold", seconds: 4 },
  { phase: "out", label: "Breathe out", seconds: 6 },
];
const ROUNDS = 4;

/**
 * `prayer` is shown to people who chose Christian or haven't chosen a faith;
 * everyone else gets `reflection`, a closing thought without religious language.
 */
export function TakeAMoment({ prayer, reflection }: { prayer: string; reflection: string }) {
  const { faith } = useFaith();
  const usePrayer = faith === "" || faith === "christian";
  const closing = usePrayer ? prayer : reflection;
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [count, setCount] = useState(0);
  const [showPrayer, setShowPrayer] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function run(stepIndex: number, r: number) {
    if (r >= ROUNDS) {
      setPhase("done");
      return;
    }
    const step = STEPS[stepIndex];
    setPhase(step.phase);
    setRound(r);
    setCount(step.seconds);
    let left = step.seconds;
    const tick = () => {
      left -= 1;
      if (left > 0) {
        setCount(left);
        timer.current = setTimeout(tick, 1000);
      } else {
        const next = stepIndex + 1;
        if (next < STEPS.length) run(next, r);
        else run(0, r + 1);
      }
    };
    timer.current = setTimeout(tick, 1000);
  }

  function start() {
    if (timer.current) clearTimeout(timer.current);
    setShowPrayer(false);
    run(0, 0);
  }

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    setPhase("idle");
  }

  useEffect(() => {
    if (showPrayer) prayerRef.current?.focus();
  }, [showPrayer]);

  const current = STEPS.find((s) => s.phase === phase);
  const active = phase === "in" || phase === "hold" || phase === "out";

  return (
    <div className="card moment">
      {phase === "idle" && (
        <>
          <p>Find a quiet spot if you can: your car, a hallway, or a bench outside. Set your phone down or hold it loosely.</p>
          <p>We&apos;ll breathe together for about a minute.</p>
          <button type="button" className="btn gold" onClick={start}>Begin</button>
        </>
      )}

      {(active || phase === "done") && (
        <>
          <div className="breath" data-phase={phase === "done" ? "out" : phase} aria-hidden="true">
            <span>{current ? current.label : "Rest"}</span>
          </div>
          <p role="status" aria-live="polite" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {active && current ? `${current.label}… ${count}` : "Well done. Notice how you feel right now."}
          </p>
          {active && <p className="small muted">Breath {round + 1} of {ROUNDS}</p>}
          <div className="btn-row" style={{ justifyContent: "center" }}>
            {active ? (
              <button type="button" className="btn secondary" onClick={stop}>Stop</button>
            ) : (
              <>
                <button type="button" className="btn secondary" onClick={start}>Again</button>
                {!showPrayer && <button type="button" className="btn" onClick={() => setShowPrayer(true)}>{usePrayer ? "Pray with me" : "A closing thought"}</button>}
              </>
            )}
          </div>
        </>
      )}

      {phase !== "idle" && !active && showPrayer && (
        <div ref={prayerRef} tabIndex={-1} style={{ marginTop: 20, textAlign: "left" }}>
          <h2>{usePrayer ? "A short prayer" : "A closing thought"}</h2>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem" }}>{closing}</p>
        </div>
      )}

      {phase === "idle" && (
        <p className="small muted" style={{ marginTop: 16, marginBottom: 0 }}>
          Prefer to skip the breathing? <button type="button" className="linklike" onClick={() => { setPhase("done"); setShowPrayer(true); }} style={{ background: "none", border: 0, color: "var(--link)", textDecoration: "underline", font: "inherit", cursor: "pointer", padding: 0 }}>{usePrayer ? "Go straight to the prayer" : "Go straight to the closing thought"}</button>.
        </p>
      )}
    </div>
  );
}

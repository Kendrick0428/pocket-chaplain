"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "in" | "out";

const PACES = {
  steady: { label: "Steady", in: 4, out: 6 },
  slow: { label: "Slower", in: 5, out: 7 },
} as const;
type Pace = keyof typeof PACES;

type WakeLock = { release: () => Promise<void> };

/**
 * A circle that breathes with the person: it grows while they breathe in and
 * shrinks while they breathe out, and keeps going until they tap Stop.
 * Runs entirely on the device, so it works with no signal.
 */
export function BreatheWithMe() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("out");
  const [breaths, setBreaths] = useState(0);
  const [pace, setPace] = useState<Pace>("steady");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wake = useRef<WakeLock | null>(null);

  const p = PACES[pace];

  function clear() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }

  async function keepScreenOn(on: boolean) {
    try {
      if (on) {
        const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLock> } };
        if (nav.wakeLock && !wake.current) wake.current = await nav.wakeLock.request("screen");
      } else if (wake.current) {
        await wake.current.release();
        wake.current = null;
      }
    } catch {
      // Not supported or not allowed; the exercise still works.
    }
  }

  function breatheIn(paceKey: Pace) {
    setPhase("in");
    timer.current = setTimeout(() => breatheOut(paceKey), PACES[paceKey].in * 1000);
  }

  function breatheOut(paceKey: Pace) {
    setPhase("out");
    timer.current = setTimeout(() => {
      setBreaths((b) => b + 1);
      breatheIn(paceKey);
    }, PACES[paceKey].out * 1000);
  }

  function start(paceKey: Pace = pace) {
    clear();
    setBreaths(0);
    setRunning(true);
    keepScreenOn(true);
    // Let the circle settle at its small size before the first breath in.
    timer.current = setTimeout(() => breatheIn(paceKey), 50);
  }

  function stop() {
    clear();
    setRunning(false);
    setPhase("out");
    keepScreenOn(false);
  }

  function choosePace(next: Pace) {
    setPace(next);
    if (running) start(next);
  }

  useEffect(() => {
    // The browser drops the screen lock when the tab is hidden; ask again on return.
    const onVisible = () => { if (document.visibilityState === "visible" && running) keepScreenOn(true); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [running]);

  useEffect(() => () => { clear(); keepScreenOn(false); }, []);

  const seconds = phase === "in" ? p.in : p.out;
  const word = !running ? "Tap to begin" : phase === "in" ? "Breathe in" : "Breathe out";

  return (
    <div className="card breathe-card">
      <button
        type="button"
        className="breathe-circle"
        data-phase={running ? phase : "idle"}
        onClick={() => (running ? stop() : start())}
        aria-label={running ? "Stop breathing exercise" : "Start breathing exercise"}
      >
        <span className="breathe-disc" aria-hidden="true" style={{ transitionDuration: `${running ? seconds : 0.6}s` }}>
          <span className="breathe-ring" />
        </span>
        <span className="breathe-word" aria-hidden="true">{word}</span>
      </button>

      <p className="breathe-status" role="status" aria-live="polite">
        {running ? (phase === "in" ? `Breathe in… slowly, through your nose` : `Breathe out… slow and long`) : "When you're ready, tap the circle."}
      </p>
      <p className="small muted breathe-count">
        {running ? (breaths > 0 ? `${breaths} ${breaths === 1 ? "breath" : "breaths"}. Keep going as long as you need.` : "Follow the circle.") : " "}
      </p>

      <div className="btn-row" style={{ justifyContent: "center" }}>
        {running ? (
          <button type="button" className="btn secondary" onClick={stop}>Stop</button>
        ) : (
          <button type="button" className="btn gold" onClick={() => start()}>Begin</button>
        )}
      </div>

      <fieldset className="breathe-pace">
        <legend className="small muted">Pace</legend>
        {(Object.keys(PACES) as Pace[]).map((k) => (
          <label key={k} className={pace === k ? "on" : undefined}>
            <input type="radio" name="pace" value={k} checked={pace === k} onChange={() => choosePace(k)} />
            {PACES[k].label} <span className="muted">({PACES[k].in} in, {PACES[k].out} out)</span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDeviceValue } from "@/lib/device";
import { TOPICS, type TopicId } from "@/lib/types";

type Mood = "well" | "okay" | "stressed" | "tired" | "heavy" | "crisis";

const MOODS: { id: Mood; label: string; hint: string }[] = [
  { id: "well", label: "Doing well", hint: "Steady today" },
  { id: "okay", label: "Getting by", hint: "Not great, not bad" },
  { id: "stressed", label: "Stressed or on edge", hint: "A lot on my mind" },
  { id: "tired", label: "Worn out", hint: "Running on empty" },
  { id: "heavy", label: "Weighed down or grieving", hint: "Carrying something heavy" },
  { id: "crisis", label: "Not okay. I need someone now.", hint: "Show me who to call" },
];

const ON_MIND: { id: TopicId | "none"; label: string }[] = [
  { id: "stress", label: "A hard call or a tough shift" },
  { id: "grief", label: "A loss" },
  { id: "family", label: "Home or family" },
  { id: "burnout", label: "Exhaustion or burnout" },
  { id: "recovery", label: "Fear, or something that happened" },
  { id: "none", label: "Nothing in particular" },
];

const MOOD_TOPIC: Partial<Record<Mood, TopicId>> = { stressed: "stress", tired: "burnout", heavy: "grief" };

const MESSAGE: Record<Exclude<Mood, "crisis">, string> = {
  well: "Glad to hear it. Days like this are worth noticing. You might check on a partner today; someone near you may be carrying more than they show.",
  okay: "Getting by counts. Be patient with yourself today, and take a moment when you can.",
  stressed: "That's a lot to carry. You don't have to sort it out alone. A few slow breaths can help, and so can a short conversation with someone you trust.",
  tired: "Exhaustion is real, and rest is part of doing this job well. Be honest with yourself about what you need tonight.",
  heavy: "I'm sorry you're carrying this. You don't have to carry it alone. The chaplain is here for exactly this kind of day.",
};

const HARD: Mood[] = ["stressed", "tired", "heavy", "crisis"];

interface Entry {
  date: string;
  mood: Mood;
}

const moodLabel = (m: Mood) => MOODS.find((x) => x.id === m)?.label ?? m;

function ReachRow() {
  return (
    <div className="btn-row">
      <Link className="btn" href="/reach/chaplain">Reach a Chaplain</Link>
      <Link className="btn secondary" href="/reach/pastor">Reach My Pastor</Link>
      <Link className="btn secondary" href="/reach/friend">Reach a Friend</Link>
    </div>
  );
}

export function CheckIn() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [topic, setTopic] = useState<TopicId | "none" | null>(null);
  const [remember, setRemember, loaded] = useDeviceValue<boolean>("pc.checkin.remember", false);
  const [history, setHistory] = useDeviceValue<Entry[]>("pc.checkins", []);
  const resultRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLHeadingElement>(null);

  const done = mood === "crisis" || (mood !== null && topic !== null);

  useEffect(() => {
    if (done) resultRef.current?.focus();
    else if (mood) stepRef.current?.focus();
  }, [done, mood]);

  function chooseMood(m: Mood) {
    setMood(m);
    setTopic(null);
    if (remember) setHistory([{ date: new Date().toISOString(), mood: m }, ...history].slice(0, 30));
  }

  function restart() {
    setMood(null);
    setTopic(null);
  }

  function toggleRemember(on: boolean) {
    setRemember(on);
    if (!on) setHistory([]);
  }

  const recent = history.slice(0, 5);
  const hardDays = recent.filter((h) => HARD.includes(h.mood)).length;
  const suggestTopic = topic && topic !== "none" ? topic : mood ? MOOD_TOPIC[mood] : undefined;
  const topicName = suggestTopic ? TOPICS.find((t) => t.id === suggestTopic)?.label : undefined;

  return (
    <>
      {mood === null && (
        <fieldset className="card">
          <legend className="checkin-q">How are you doing right now?</legend>
          <div className="mood-grid">
            {MOODS.map((m) => (
              <button key={m.id} type="button" className={`mood-btn${m.id === "crisis" ? " crisis" : ""}`} onClick={() => chooseMood(m.id)}>
                <span className="t">{m.label}</span>
                <span className="s">{m.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {mood !== null && mood !== "crisis" && topic === null && (
        <div className="card">
          <h2 ref={stepRef} tabIndex={-1} className="checkin-q">Is anything in particular on your mind?</h2>
          <p className="small muted">Optional. Pick the closest one.</p>
          <div className="mood-grid">
            {ON_MIND.map((o) => (
              <button key={o.id} type="button" className="mood-btn" onClick={() => setTopic(o.id)}>
                <span className="t">{o.label}</span>
              </button>
            ))}
          </div>
          <div className="btn-row" style={{ marginTop: 14 }}>
            <button type="button" className="btn secondary small" onClick={restart}>Back</button>
          </div>
        </div>
      )}

      {done && mood === "crisis" && (
        <div ref={resultRef} tabIndex={-1} className="card crisis-card" role="region" aria-label="Get help now">
          <h2>Please reach out right now</h2>
          <p>You don&apos;t have to go through this alone. Talk to someone now.</p>
          <div className="btn-row two">
            <a className="btn" href="tel:988">Call 988</a>
            <a className="btn gold" href="sms:988">Text 988</a>
          </div>
          <p className="small" style={{ marginTop: 12 }}>
            988 is the Suicide &amp; Crisis Lifeline: free, confidential, and open 24/7 in the United States. If you or
            someone else is in immediate danger, call <a href="tel:911">911</a>.
          </p>
          <h3 style={{ marginTop: 18 }}>Or reach someone who knows you</h3>
          <ReachRow />
          <p className="small muted" style={{ marginTop: 14, marginBottom: 0 }}>
            This app isn&apos;t monitored, so the chaplain won&apos;t know you checked in unless you call or text.
          </p>
        </div>
      )}

      {done && mood !== "crisis" && mood !== null && (
        <div ref={resultRef} tabIndex={-1} className="card" role="region" aria-label="Suggestions for you">
          <p className="badge">You said: {moodLabel(mood)}</p>
          <p className="checkin-msg">{MESSAGE[mood]}</p>
          <h3>Some things that might help</h3>
          <ul className="suggest">
            <li><Link href="/pocket-chaplain/take-a-moment">Take a moment</Link>: one minute of slow breathing and a short prayer.</li>
            {suggestTopic ? (
              <li><Link href={`/pocket-chaplain?topic=${suggestTopic}`}>Prayers and readings for {topicName?.toLowerCase()}</Link></li>
            ) : (
              <li><Link href="/pocket-chaplain">Browse the Pocket Chaplain library</Link></li>
            )}
            {(mood === "stressed" || mood === "tired" || mood === "heavy") && (
              <li><Link href="/resources">Peer support, counseling, and other resources</Link></li>
            )}
            {mood === "well" && <li><Link href="/prayer">Send a prayer request for someone else</Link></li>}
          </ul>
          {mood !== "well" && (
            <>
              <h3>Talk to someone</h3>
              <ReachRow />
            </>
          )}
          <div className="btn-row" style={{ marginTop: 16 }}>
            <button type="button" className="btn secondary small" onClick={restart}>Check in again</button>
          </div>
        </div>
      )}

      {remember && hardDays >= 3 && (
        <div className="notice gold" style={{ marginTop: 16 }}>
          <p>
            Several of your recent check-ins have been hard ones. This could be a good week to sit down with your chaplain, your
            pastor, or a friend. <Link href="/reach/chaplain">Reach a Chaplain</Link>
          </p>
        </div>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <label className="choice">
          <input type="checkbox" checked={remember} disabled={!loaded} onChange={(e) => toggleRemember(e.target.checked)} />
          <span>
            <strong>Remember my check-ins on this device</strong>
            <span>Keeps your last few answers on this phone so you can notice patterns. Turning this off erases them.</span>
          </span>
        </label>
        {remember && recent.length > 0 && (
          <>
            <h3 style={{ marginTop: 16 }}>Your recent check-ins</h3>
            <ul className="history">
              {recent.map((h) => (
                <li key={h.date}>
                  <span className="muted">
                    {new Date(h.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>{" "}
                  {moodLabel(h.mood)}
                </li>
              ))}
            </ul>
            <button type="button" className="btn danger small" onClick={() => setHistory([])}>Clear history</button>
          </>
        )}
      </div>
    </>
  );
}

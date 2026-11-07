"use client";

import { useEffect, useId, useState } from "react";
import { isIOS, isStandalone, useDeviceValue } from "@/lib/device";

type Support = "checking" | "push" | "ios-install" | "none";

const hourLabel = (h: number) =>
  new Date(2000, 0, 1, h).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

/** A daily calendar event, built on this device. Nothing is sent anywhere. */
function downloadCalendarReminder(hour: number) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, 0);
  const local = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const end = new Date(start.getTime() + 5 * 60_000);
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const url = window.location.origin;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Pocket Chaplain//Daily reminder//EN",
    "BEGIN:VEVENT",
    `UID:daily-${stamp}@thepocketchaplain.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${local(start)}`,
    `DTEND:${local(end)}`,
    "RRULE:FREQ=DAILY",
    "SUMMARY:Today's encouragement · The Pocket Chaplain",
    `DESCRIPTION:Take a moment for today's prayer and encouragement: ${url}`,
    `URL:${url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Today's encouragement",
    "TRIGGER:PT0M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pocket-chaplain-daily-reminder.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function Reminder({ publicKey }: { publicKey: string }) {
  const [support, setSupport] = useState<Support>("checking");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [savedHour, setSavedHour] = useDeviceValue<number | null>("pc.reminder.hour", null);
  const [hour, setHour] = useState(7);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const id = useId();

  useEffect(() => {
    if (savedHour !== null) setHour(savedHour);
  }, [savedHour]);

  useEffect(() => {
    const canPush = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!publicKey) return setSupport("none");
    if (isIOS() && !isStandalone()) return setSupport("ios-install");
    if (!canPush) return setSupport("none");
    let cancelled = false;
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      if (cancelled) return;
      if (!reg) return setSupport("none");
      setSubscription(await reg.pushManager.getSubscription());
      setSupport("push");
    });
    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  async function save(sub: PushSubscription) {
    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON(), hour, tz: Intl.DateTimeFormat().resolvedOptions().timeZone }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Something went wrong.");
  }

  async function turnOn() {
    setBusy(true);
    setMessage(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage({
          ok: false,
          text: "Notifications are blocked for this site. You can allow them in your phone or browser settings, or use the calendar option below.",
        });
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) }));
      await save(sub);
      setSubscription(sub);
      setSavedHour(hour);
      setMessage({ ok: true, text: `You're set. Look for today's encouragement each day around ${hourLabel(hour)}.` });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function changeTime() {
    if (!subscription) return;
    setBusy(true);
    setMessage(null);
    try {
      await save(subscription);
      setSavedHour(hour);
      setMessage({ ok: true, text: `Updated. Your reminder now comes around ${hourLabel(hour)}.` });
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    if (!subscription) return;
    setBusy(true);
    setMessage(null);
    try {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      }).catch(() => {});
      await subscription.unsubscribe();
      setSubscription(null);
      setSavedHour(null);
      setMessage({ ok: true, text: "Daily reminder turned off." });
    } finally {
      setBusy(false);
    }
  }

  const timePicker = (
    <div className="form-field">
      <label htmlFor={`${id}-hour`}>What time works for you?</label>
      <span className="hint">Pick a time that fits your shift. You can change it any time.</span>
      <select id={`${id}-hour`} value={hour} onChange={(e) => setHour(Number(e.target.value))} style={{ maxWidth: 220 }}>
        {Array.from({ length: 24 }, (_, h) => (
          <option key={h} value={h}>{hourLabel(h)}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <div className="card">
        <h2>Notification on this phone</h2>
        {support === "checking" && <p className="muted" aria-busy="true">Checking what this device supports…</p>}

        {support === "push" && (
          <>
            {timePicker}
            {subscription ? (
              <div className="btn-row">
                <button type="button" className="btn" disabled={busy || hour === savedHour} onClick={changeTime}>Change time</button>
                <button type="button" className="btn danger" disabled={busy} onClick={turnOff}>Turn off</button>
              </div>
            ) : (
              <button type="button" className="btn gold" disabled={busy} onClick={turnOn}>Turn on daily reminder</button>
            )}
            {subscription && savedHour !== null && (
              <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>On: about {hourLabel(savedHour)} each day.</p>
            )}
          </>
        )}

        {support === "ios-install" && (
          <>
            <p>On iPhone and iPad, reminders work once The Pocket Chaplain is on your Home Screen:</p>
            <ol style={{ paddingLeft: 20 }}>
              <li>Tap the <strong>Share</strong> button in Safari.</li>
              <li>Choose <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
              <li>Open the app from your Home Screen and come back to this page.</li>
            </ol>
          </>
        )}

        {support === "none" && (
          <p style={{ marginBottom: 0 }}>
            Notifications aren&apos;t available on this device or browser yet. The calendar reminder below works
            everywhere.
          </p>
        )}

        {message && (
          <p className={message.ok ? "form-success small" : "form-error"} role="status" style={{ marginTop: 14, marginBottom: 0, padding: "10px 12px" }}>
            {message.text}
          </p>
        )}
      </div>

      <div className="card">
        <h2>Or add it to your calendar</h2>
        <p>
          Adds a short daily event to your phone&apos;s calendar with a link back here. It&apos;s created on your device,
          so nothing is sent to us.
        </p>
        {support !== "push" && timePicker}
        <button type="button" className="btn secondary" onClick={() => downloadCalendarReminder(hour)}>
          Add calendar reminder ({hourLabel(hour)})
        </button>
      </div>
    </>
  );
}

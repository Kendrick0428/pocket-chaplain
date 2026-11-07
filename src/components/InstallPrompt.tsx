"use client";

import { useEffect, useState } from "react";
import { isIOS, isStandalone, useDeviceValue } from "@/lib/device";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Offers to add the app to the home screen. Hidden once installed or dismissed. */
export function InstallPrompt() {
  const [dismissed, setDismissed, loaded] = useDeviceValue<boolean>("pc.install.dismissed", false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<"none" | "prompt" | "ios">("none");

  useEffect(() => {
    if (isStandalone()) return;
    if (isIOS()) setMode("ios");
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setMode("prompt");
    };
    const onInstalled = () => setMode("none");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!loaded || dismissed || mode === "none") return null;

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") setMode("none");
    setPromptEvent(null);
  }

  return (
    <section className="card install-card" aria-labelledby="install-h">
      <h2 id="install-h">Keep it on your home screen</h2>
      <p>
        Open The Pocket Chaplain like an app, with one tap. Prayers and your saved contacts work even without a
        signal.
      </p>
      {mode === "prompt" ? (
        <div className="btn-row">
          <button type="button" className="btn gold" onClick={install}>Add to home screen</button>
          <button type="button" className="btn secondary" onClick={() => setDismissed(true)}>Not now</button>
        </div>
      ) : (
        <>
          <ol className="small" style={{ paddingLeft: 20 }}>
            <li>Tap the <strong>Share</strong> button <span aria-hidden="true">(the square with an arrow)</span> in Safari.</li>
            <li>Choose <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
          </ol>
          <button type="button" className="btn secondary small" onClick={() => setDismissed(true)}>Got it</button>
        </>
      )}
    </section>
  );
}

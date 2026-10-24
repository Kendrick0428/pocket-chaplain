"use client";

import { useCallback, useEffect, useState } from "react";
import { FAITH_CHOICES, type FaithChoice } from "./types";

const FAITH_IDS = FAITH_CHOICES.map((c) => c.id) as string[];

/**
 * Small helpers for things kept ONLY in this browser (favorites, check-ins, reminder time).
 * Nothing here is ever sent to the server.
 */

const CHANGE_EVENT = "pc:device-storage";

export function readDevice<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeDevice(key: string, value: unknown) {
  try {
    if (value === null || value === undefined) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked (e.g. private window); the value just won't be remembered */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

/** A value saved on this device, kept in sync across components and tabs. `loaded` is false until it has been read. */
export function useDeviceValue<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => setValue(readDevice(key, fallback));
    sync();
    setLoaded(true);
    const onCustom = (e: Event) => (e as CustomEvent).detail === key && sync();
    const onStorage = (e: StorageEvent) => e.key === key && sync();
    window.addEventListener(CHANGE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback((next: T) => writeDevice(key, next), [key]);
  return [value, set, loaded] as const;
}

const FAVORITES_KEY = "pc.favorites";

export function useFavorites() {
  const [ids, setIds, loaded] = useDeviceValue<string[]>(FAVORITES_KEY, []);
  const toggle = useCallback(
    (id: string) => setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    [ids, setIds],
  );
  return { ids, toggle, loaded, has: (id: string) => ids.includes(id) };
}

/** True when the app was opened from the home screen rather than a browser tab. */
export function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIOS() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

/** The person's "My faith" choice. Saved only on this device; never sent to the server. */
export function useFaith() {
  const [raw, setFaith, loaded] = useDeviceValue<string>("pc.faith", "");
  const faith = (FAITH_IDS.includes(raw) ? raw : "") as FaithChoice;
  return { faith, setFaith: (f: FaithChoice) => setFaith(f), loaded };
}

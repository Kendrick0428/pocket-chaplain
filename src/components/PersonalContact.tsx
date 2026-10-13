"use client";

import { useEffect, useId, useRef, useState } from "react";
import { isUsablePhone } from "@/lib/phone";
import { CallTextButtons } from "./CallTextButtons";

interface Contact {
  name: string;
  phone: string;
}

/**
 * A personal contact (pastor or friend) saved ONLY in this browser's local storage.
 * It is never sent to the server, so administrators cannot see it.
 */
export function PersonalContact({ storageKey, role }: { storageKey: string; role: string }) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [storageOk, setStorageOk] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const id = useId();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setContact(JSON.parse(raw));
    } catch {
      setStorageOk(false);
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (editing) formRef.current?.querySelector("input")?.focus();
  }, [editing]);

  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim().slice(0, 80);
    const phone = String(fd.get("phone") || "").trim().slice(0, 30);
    if (!name) return setError(`Please enter your ${role}'s name.`);
    if (!isUsablePhone(phone)) return setError("Please enter a valid phone number.");
    const next = { name, phone };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageOk(true);
    } catch {
      setStorageOk(false);
    }
    setContact(next);
    setError("");
    setEditing(false);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function remove() {
    if (!window.confirm(`Remove your ${role}'s contact from this device?`)) return;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setContact(null);
    setEditing(false);
  }

  if (!loaded) return <div className="card" aria-busy="true" style={{ minHeight: 160 }} />;

  const showForm = editing || !contact;

  return (
    <div className="card contact-card">
      {!showForm && contact && (
        <>
          <h2 className="who" ref={headingRef} tabIndex={-1}>{contact.name}</h2>
          <p className="num">{contact.phone}</p>
          <CallTextButtons name={contact.name} phone={contact.phone} />
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button type="button" className="btn secondary small" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button type="button" className="btn danger small" onClick={remove}>
              Remove
            </button>
          </div>
        </>
      )}

      {showForm && (
        <form ref={formRef} onSubmit={save} noValidate>
          <h2>{contact ? `Update your ${role}` : `Add your ${role}`}</h2>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-field">
            <label htmlFor={`${id}-name`}>{role === "pastor" ? "Pastor's name" : "Friend's name"}</label>
            <input id={`${id}-name`} name="name" type="text" autoComplete="off" defaultValue={contact?.name} maxLength={80} required />
          </div>
          <div className="form-field">
            <label htmlFor={`${id}-phone`}>Phone number</label>
            <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="off" defaultValue={contact?.phone} maxLength={30} required />
          </div>
          <div className="btn-row">
            <button type="submit" className="btn">Save on this device</button>
            {contact && (
              <button type="button" className="btn secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <p className="small muted" style={{ marginTop: 14, marginBottom: 0 }}>
        🔒 Saved only on this device. It is never sent to the app&apos;s server, and administrators can&apos;t see it. If
        you clear your browser data or switch phones, you&apos;ll need to add it again.
        {!storageOk && " Your browser is blocking storage right now (for example, in a private window), so this contact won't be remembered after you close the page."}
      </p>
    </div>
  );
}



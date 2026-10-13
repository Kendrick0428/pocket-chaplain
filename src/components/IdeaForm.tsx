"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitIdea, type FormState } from "@/app/actions";
import { IDEA_CATEGORIES } from "@/lib/types";
import { Honeypot, SubmitButton } from "./SubmitButton";

export function IdeaForm() {
  const [state, action] = useActionState<FormState, FormData>(submitIdea, { ok: false });
  const [anonymous, setAnonymous] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.ok) doneRef.current?.focus();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="form-success" ref={doneRef} tabIndex={-1} role="status">
        <h2>Thank you for your idea</h2>
        <p style={{ margin: 0 }}>
          It has been sent privately to the app administrators, who will review it. Ideas aren&apos;t posted publicly.
        </p>
      </div>
    );
  }

  return (
    <form action={action}>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="form-field">
        <label htmlFor="idea-cat">What kind of idea is it?</label>
        <select id="idea-cat" name="category" defaultValue="prayer">
          {IDEA_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="idea-text">Your idea</label>
        <span className="hint" id="idea-hint">Please don&apos;t include sensitive personnel, case, or incident information.</span>
        <textarea id="idea-text" name="idea" required maxLength={1500} aria-describedby="idea-hint" />
      </div>
      <div className="form-field">
        <label className="choice">
          <input type="checkbox" name="anonymous" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
          <span>
            <strong>Submit anonymously</strong>
            <span>Your name won&apos;t be attached to the idea.</span>
          </span>
        </label>
      </div>
      {!anonymous && (
        <div className="form-field">
          <label htmlFor="idea-name">Your name <span className="muted">(optional)</span></label>
          <input id="idea-name" name="name" type="text" autoComplete="name" maxLength={80} />
        </div>
      )}
      <Honeypot />
      <SubmitButton>Send idea</SubmitButton>
    </form>
  );
}

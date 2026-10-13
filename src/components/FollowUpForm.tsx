"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFollowUp, type FormState } from "@/app/actions";
import { Honeypot, SubmitButton } from "./SubmitButton";

export function FollowUpForm() {
  const [state, action] = useActionState<FormState, FormData>(submitFollowUp, { ok: false });
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.ok) doneRef.current?.focus();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="form-success" ref={doneRef} tabIndex={-1} role="status">
        <h2>Request sent</h2>
        <p style={{ margin: 0 }}>
          Thank you. Your request has been passed to the chaplain team, who will reach out as soon as they can. This is
          not an emergency line: if you need help right now, call 911 or call or text 988.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate={false}>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <div className="form-field">
        <label htmlFor="fu-name">Your name</label>
        <input id="fu-name" name="name" type="text" autoComplete="name" required maxLength={80} />
      </div>
      <fieldset className="form-field">
        <legend>How should the chaplain reach you?</legend>
        <label className="choice"><input type="radio" name="contactMethod" value="call" defaultChecked /> <span><strong>Phone call</strong></span></label>
        <label className="choice"><input type="radio" name="contactMethod" value="text" /> <span><strong>Text message</strong></span></label>
        <label className="choice"><input type="radio" name="contactMethod" value="email" /> <span><strong>Email</strong></span></label>
      </fieldset>
      <div className="form-field">
        <label htmlFor="fu-contact">Phone number or email</label>
        <input id="fu-contact" name="contact" type="text" autoComplete="tel" required maxLength={120} />
      </div>
      <div className="form-field">
        <label htmlFor="fu-time">Best time to reach you <span className="muted">(optional)</span></label>
        <input id="fu-time" name="bestTime" type="text" maxLength={120} placeholder="e.g. weekday evenings" />
      </div>
      <div className="form-field">
        <label htmlFor="fu-note">
          Anything you&apos;d like the chaplain to know first? <span className="muted">(optional)</span>
        </label>
        <span className="hint" id="fu-note-hint">
          Keep it brief. Please don&apos;t include sensitive personnel, case, or incident details. You can share those in
          person.
        </span>
        <textarea id="fu-note" name="note" maxLength={500} aria-describedby="fu-note-hint" style={{ minHeight: 100 }} />
      </div>
      <Honeypot />
      <SubmitButton>Ask the chaplain to reach out</SubmitButton>
    </form>
  );
}

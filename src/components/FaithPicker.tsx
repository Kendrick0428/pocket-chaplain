"use client";

import Link from "next/link";
import { useId } from "react";
import { useFaith } from "@/lib/device";
import { faithLabel, hasOwnTradition } from "@/lib/faith";
import { FAITH_CHOICES, type FaithChoice } from "@/lib/types";

/**
 * "My faith": lets each person see prayers and scripture from their own tradition.
 * The choice is stored only on this device.
 */
export function FaithPicker({ available }: { available: string[] }) {
  const { faith, setFaith, loaded } = useFaith();
  const id = useId();
  const missing = faith && hasOwnTradition(faith) && !available.includes(faith);

  return (
    <div className="faith-picker">
      <div className="form-field" style={{ marginBottom: 6 }}>
        <label htmlFor={`${id}-faith`}>My faith</label>
        <span className="hint">Shows prayers and scripture from your tradition. Saved only on this device.</span>
        <select
          id={`${id}-faith`}
          value={faith}
          disabled={!loaded}
          onChange={(e) => setFaith(e.target.value as FaithChoice)}
          style={{ maxWidth: 320 }}
        >
          {FAITH_CHOICES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>
      {(missing || faith === "other") && (
        <p className="small notice" style={{ marginTop: 8 }}>
          {faith === "other" ? "Your tradition isn't listed yet." : `Prayers from the ${faithLabel(faith)} tradition are still being prepared with faith leaders.`}{" "}
          For now you&apos;ll see readings written for everyone. Your chaplain can also connect you with a leader of
          your own faith. <Link href="/reach/chaplain">Reach a Chaplain</Link>
        </p>
      )}
      {faith === "none" && (
        <p className="small muted" style={{ marginTop: 8 }}>You&apos;ll see reflections and encouragement without religious language.</p>
      )}
    </div>
  );
}

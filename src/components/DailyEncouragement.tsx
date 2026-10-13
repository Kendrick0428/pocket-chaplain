"use client";

import { useEffect, useState } from "react";
import type { Encouragement } from "@/lib/types";

function dayIndex(count: number, date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return count ? day % count : 0;
}

/** Picks the same encouragement for everyone on a given (local) day. */
export function DailyEncouragement({ items }: { items: Encouragement[] }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => setI(dayIndex(items.length)), [items.length]);

  if (!items.length) return null;
  const item = items[i ?? 0];

  return (
    <section className="card daily" aria-labelledby="daily-label">
      <p className="label" id="daily-label">Today&apos;s encouragement</p>
      <blockquote style={{ visibility: i === null ? "hidden" : "visible" }}>
        <p style={{ margin: 0 }}>{item.text}</p>
        {item.reference && <cite>{item.reference}</cite>}
      </blockquote>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dailyIndex } from "@/lib/daily";
import type { Encouragement } from "@/lib/types";

/** Picks the same encouragement for everyone on a given (local) day. */
export function DailyEncouragement({ items }: { items: Encouragement[] }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => setI(dailyIndex(items.length)), [items.length]);

  if (!items.length) return null;
  const item = items[i ?? 0];

  return (
    <section className="card daily" aria-labelledby="daily-label">
      <p className="label" id="daily-label">Today&apos;s encouragement</p>
      <blockquote style={{ visibility: i === null ? "hidden" : "visible" }}>
        <p style={{ margin: 0 }}>{item.text}</p>
        {item.reference && <cite>{item.reference}</cite>}
      </blockquote>
      <p className="small daily-more">
        <Link href="/reminder">Get this each day</Link>
      </p>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dailyIndex } from "@/lib/daily";
import { useFaith } from "@/lib/device";
import { matchesFaith } from "@/lib/faith";
import type { Encouragement } from "@/lib/types";

/** Picks the same encouragement for everyone on a given (local) day. */
export function DailyEncouragement({ items }: { items: Encouragement[] }) {
  const { faith, loaded } = useFaith();
  const mine = items.filter((e) => matchesFaith(e.tradition, faith));
  const list = mine.length ? mine : items;
  const [i, setI] = useState<number | null>(null);
  useEffect(() => setI(dailyIndex(list.length)), [list.length]);

  if (!list.length) return null;
  const item = list[Math.min(i ?? 0, list.length - 1)];

  return (
    <section className="card daily" aria-labelledby="daily-label">
      <p className="label" id="daily-label">Today&apos;s encouragement</p>
      <blockquote style={{ visibility: i === null || !loaded ? "hidden" : "visible" }}>
        <p style={{ margin: 0 }}>{item.text}</p>
        {item.reference && <cite>{item.reference}</cite>}
      </blockquote>
      <p className="small daily-more">
        <Link href="/reminder">Get this each day</Link>
      </p>
    </section>
  );
}

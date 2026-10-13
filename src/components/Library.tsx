"use client";

import { useMemo, useState } from "react";
import { ENTRY_TYPES, TOPICS, type LibraryEntry, type TopicId } from "@/lib/types";

const typeLabel = (t: string) => ENTRY_TYPES.find((x) => x.id === t)?.label ?? t;
const topicLabel = (t: string) => TOPICS.find((x) => x.id === t)?.label ?? t;

export function Library({ entries, initialTopic }: { entries: LibraryEntry[]; initialTopic?: string }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicId | "all">(
    TOPICS.some((t) => t.id === initialTopic) ? (initialTopic as TopicId) : "all",
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (topic !== "all" && !e.topics.includes(topic)) return false;
      if (!q) return true;
      const hay = [e.title, e.body, e.reference, typeLabel(e.type), ...e.topics.map(topicLabel)].join(" ").toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [entries, query, topic]);

  return (
    <>
      <div className="form-field" style={{ marginBottom: 4 }}>
        <label htmlFor="lib-search">Search prayers, scripture, and reflections</label>
        <input
          id="lib-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “sleep”, “courage”, or “family”"
          autoComplete="off"
        />
      </div>

      <div className="chips" role="group" aria-label="Filter by situation">
        <button type="button" className="chip" aria-pressed={topic === "all"} onClick={() => setTopic("all")}>
          All
        </button>
        {TOPICS.map((t) => (
          <button key={t.id} type="button" className="chip" aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <p className="small muted" role="status" aria-live="polite">
        {results.length === 1 ? "1 result" : `${results.length} results`}
      </p>

      {results.length === 0 ? (
        <div className="notice">
          <p>Nothing matched. Try a different word, or <a href="/reach/chaplain">reach your chaplain</a> to talk it through.</p>
        </div>
      ) : (
        <div>
          {results.map((e) => (
            <details key={e.id} className="entry">
              <summary>
                <span>
                  <span className="t">{e.title}</span>
                  <br />
                  <span className="meta">
                    {typeLabel(e.type)} · {e.topics.map(topicLabel).join(", ")}
                  </span>
                </span>
              </summary>
              <div className="body">
                {e.body.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {e.reference && <cite>{e.reference}</cite>}
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

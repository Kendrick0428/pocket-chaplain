"use client";

import { useMemo, useState } from "react";
import { useFaith, useFavorites } from "@/lib/device";
import { matchesFaith } from "@/lib/faith";
import { FaithPicker } from "./FaithPicker";
import { ENTRY_TYPES, TOPICS, type LibraryEntry, type TopicId } from "@/lib/types";

const typeLabel = (t: string) => ENTRY_TYPES.find((x) => x.id === t)?.label ?? t;
const topicLabel = (t: string) => TOPICS.find((x) => x.id === t)?.label ?? t;

type Filter = TopicId | "all" | "saved";

export function Library({
  entries,
  initialTopic,
  showFilters = true,
}: {
  entries: LibraryEntry[];
  initialTopic?: string;
  /** Hide the search box and situation chips, e.g. when the page already shows one situation. */
  showFilters?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Filter>(
    initialTopic === "saved" ? "saved" : TOPICS.some((t) => t.id === initialTopic) ? (initialTopic as TopicId) : "all",
  );
  const favorites = useFavorites();
  const { faith } = useFaith();
  const forMe = useMemo(() => entries.filter((e) => matchesFaith(e.tradition, faith)), [entries, faith]);
  const available = useMemo(() => [...new Set(entries.map((e) => e.tradition))], [entries]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return forMe.filter((e) => {
      if (topic === "saved" && !favorites.ids.includes(e.id)) return false;
      if (topic !== "all" && topic !== "saved" && !e.topics.includes(topic)) return false;
      if (!q) return true;
      const hay = [e.title, e.body, e.reference, typeLabel(e.type), ...e.topics.map(topicLabel)].join(" ").toLowerCase();
      return q.split(/\s+/).every((w) => hay.includes(w));
    });
  }, [forMe, query, topic, favorites.ids]);

  const savedCount = forMe.filter((e) => favorites.ids.includes(e.id)).length;

  return (
    <>
      {showFilters && (
        <>
          <FaithPicker available={available} />
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
            <button type="button" className="chip" aria-pressed={topic === "saved"} onClick={() => setTopic("saved")}>
              <span aria-hidden="true">★ </span>Saved{favorites.loaded && ` (${savedCount})`}
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
        </>
      )}

      {results.length === 0 ? (
        <div className="notice">
          {topic === "saved" && !query ? (
            <p>
              Nothing saved yet. Open any prayer or reading and tap <strong>Save</strong> to keep it here. Saved items
              stay on this device only.
            </p>
          ) : (
            <p>Nothing matched. Try a different word, or <a href="/reach/chaplain">reach your chaplain</a> to talk it through.</p>
          )}
        </div>
      ) : (
        <div>
          {results.map((e) => {
            const saved = favorites.has(e.id);
            return (
              <details key={e.id} className="entry">
                <summary>
                  <span>
                    <span className="t">
                      {e.title}
                      {saved && <span className="saved-star" title="Saved"> ★<span className="sr-only"> (saved)</span></span>}
                    </span>
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
                  <button
                    type="button"
                    className="btn secondary small save-btn"
                    aria-pressed={saved}
                    onClick={() => favorites.toggle(e.id)}
                  >
                    <span aria-hidden="true">{saved ? "★" : "☆"}</span> {saved ? "Saved" : "Save"}
                    <span className="sr-only"> {e.title}</span>
                  </button>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </>
  );
}

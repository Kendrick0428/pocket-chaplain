"use client";

import { useActionState, useId, useState } from "react";
import type { AdminState } from "@/app/admin/actions";
import { SaveFooter } from "./AdminForm";

export interface FieldDef {
  key: string;
  label: string;
  kind: "text" | "textarea" | "select" | "checks";
  hint?: string;
  options?: { id: string; label: string }[];
  required?: boolean;
}

type Item = Record<string, unknown> & { id: string };
type Action = (prev: AdminState, fd: FormData) => Promise<AdminState>;

function blank(fields: FieldDef[]): Item {
  const item: Item = { id: `new-${Math.random().toString(36).slice(2, 10)}` };
  for (const f of fields) {
    item[f.key] = f.kind === "checks" ? [] : f.kind === "select" ? f.options?.[0]?.id ?? "" : "";
  }
  return item;
}

/**
 * Edits a list of content items in the browser, then saves the whole list at once.
 * The server re-validates every field before storing it.
 */
export function ListEditor({
  initial,
  fields,
  titleKey,
  subtitleKey,
  action,
  noun,
  plural = `${noun}s`,
}: {
  initial: Item[];
  fields: FieldDef[];
  titleKey: string;
  subtitleKey?: string;
  action: Action;
  noun: string;
  plural?: string;
}) {
  const [items, setItems] = useState<Item[]>(initial);
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [state, formAction] = useActionState<AdminState, FormData>(action, { ok: false });
  const uid = useId();

  const update = (id: string, key: string, value: unknown) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [key]: value } : it)));

  const move = (index: number, dir: -1 | 1) =>
    setItems((list) => {
      const next = [...list];
      const j = index + dir;
      if (j < 0 || j >= next.length) return list;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });

  const add = () => {
    const item = blank(fields);
    setItems((list) => [item, ...list]);
    setOpenId(item.id);
    setFilter("");
  };

  const remove = (id: string) => {
    if (window.confirm(`Delete this ${noun}? It will be removed when you save.`)) {
      setItems((list) => list.filter((it) => it.id !== id));
    }
  };

  const optionLabel = (key: string, v: unknown) => {
    const f = fields.find((x) => x.key === key);
    if (!f?.options) return String(v ?? "");
    const ids = Array.isArray(v) ? v : [v];
    return ids.map((i) => f.options!.find((o) => o.id === i)?.label ?? i).join(", ");
  };

  const q = filter.trim().toLowerCase();
  const visible = items.filter((it) => !q || JSON.stringify(it).toLowerCase().includes(q));

  return (
    <form action={formAction}>
      <input type="hidden" name="payload" value={JSON.stringify(items)} />
      <div className="toolbar">
        <button type="button" className="btn gold small" onClick={add}>+ Add {noun}</button>
        <label className="sr-only" htmlFor={`${uid}-filter`}>Filter</label>
        <input id={`${uid}-filter`} type="search" placeholder="Filter…" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ maxWidth: 260 }} />
      </div>
      <p className="small muted">{items.length} {items.length === 1 ? noun : plural}. Changes go live after you press Save.</p>

      <div className="res-group">
        {visible.map((it) => {
          const index = items.indexOf(it);
          const isOpen = openId === it.id;
          const title = String(it[titleKey] || "").trim() || `(untitled ${noun})`;
          return (
            <div key={it.id} className="card editor-item">
              <div className="row">
                <span style={{ minWidth: 0, flex: 1 }}>
                  <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>{title.length > 110 ? `${title.slice(0, 110)}…` : title}</strong>
                  {subtitleKey && <span className="small muted">{optionLabel(subtitleKey, it[subtitleKey])}</span>}
                </span>
                <span className="btn-row">
                  <button type="button" className="btn secondary small" aria-expanded={isOpen} onClick={() => setOpenId(isOpen ? null : it.id)}>
                    {isOpen ? "Done" : "Edit"}
                  </button>
                  {!q && (
                    <>
                      <button type="button" className="btn secondary small" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${title} up`}>↑</button>
                      <button type="button" className="btn secondary small" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Move ${title} down`}>↓</button>
                    </>
                  )}
                  <button type="button" className="btn danger small" onClick={() => remove(it.id)}>Delete</button>
                </span>
              </div>

              {isOpen && (
                <div style={{ marginTop: 14 }}>
                  {fields.map((f) => {
                    const fid = `${uid}-${it.id}-${f.key}`;
                    const val = it[f.key];
                    if (f.kind === "checks") {
                      const arr = Array.isArray(val) ? (val as string[]) : [];
                      return (
                        <fieldset key={f.key} className="form-field">
                          <legend>{f.label}</legend>
                          <div className="checks">
                            {f.options!.map((o) => (
                              <label key={o.id}>
                                <input
                                  type="checkbox"
                                  checked={arr.includes(o.id)}
                                  onChange={(e) => update(it.id, f.key, e.target.checked ? [...arr, o.id] : arr.filter((x) => x !== o.id))}
                                />
                                {o.label}
                              </label>
                            ))}
                          </div>
                        </fieldset>
                      );
                    }
                    return (
                      <div key={f.key} className="form-field">
                        <label htmlFor={fid}>
                          {f.label} {!f.required && <span className="muted">(optional)</span>}
                        </label>
                        {f.hint && <span className="hint">{f.hint}</span>}
                        {f.kind === "textarea" ? (
                          <textarea id={fid} value={String(val ?? "")} onChange={(e) => update(it.id, f.key, e.target.value)} />
                        ) : f.kind === "select" ? (
                          <select id={fid} value={String(val ?? "")} onChange={(e) => update(it.id, f.key, e.target.value)}>
                            {f.options!.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                          </select>
                        ) : (
                          <input id={fid} type="text" value={String(val ?? "")} onChange={(e) => update(it.id, f.key, e.target.value)} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: "sticky", bottom: 0, background: "var(--bg)", paddingTop: 12, marginTop: 12 }}>
        <SaveFooter state={state} label={`Save ${plural}`} />
      </div>
    </form>
  );
}

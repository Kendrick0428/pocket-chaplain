import { isUsablePhone, smsHref, telHref } from "@/lib/phone";
import type { Resource } from "@/lib/types";
import { WithPlaceholders } from "./Placeholder";
import { LinkIcon, PhoneIcon, TextIcon } from "./Icons";

function safeUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function ResourceCard({ r }: { r: Resource }) {
  const url = r.url ? safeUrl(r.url) : null;
  return (
    <article className="card res">
      <h3><WithPlaceholders text={r.name} /></h3>
      {r.hours && <p className="small muted" style={{ marginBottom: 6 }}><WithPlaceholders text={r.hours} /></p>}
      <p style={{ marginBottom: 0 }}><WithPlaceholders text={r.description} /></p>
      {(isUsablePhone(r.phone) || isUsablePhone(r.text) || url) && (
        <div className="btn-row">
          {isUsablePhone(r.phone) && (
            <a className="btn small" href={telHref(r.phone)}><PhoneIcon size={18} /> Call {r.phone}</a>
          )}
          {isUsablePhone(r.text) && (
            <a className="btn small gold" href={smsHref(r.text)}><TextIcon size={18} /> Text {r.text}</a>
          )}
          {url && (
            <a className="btn small secondary" href={url} target="_blank" rel="noopener noreferrer">
              <LinkIcon size={18} /> Website<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </article>
  );
}

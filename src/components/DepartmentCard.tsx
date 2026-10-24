import { isUsablePhone, telHref } from "@/lib/phone";
import type { Settings } from "@/lib/types";
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

/** The department's own badge and contact details, if an administrator added any. */
export function DepartmentCard({ settings: s }: { settings: Settings }) {
  const url = s.departmentWebsite ? safeUrl(s.departmentWebsite) : null;
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s.departmentEmail) ? s.departmentEmail : "";
  const phone = isUsablePhone(s.departmentPhone) ? s.departmentPhone : "";
  if (!s.departmentAddress && !phone && !email && !url) return null;

  return (
    <section className="card dept-card" aria-labelledby="dept-h">
      {s.departmentLogo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.departmentLogo} alt="" width={64} height={64} />
      )}
      <div>
        <p className="label">Your department</p>
        <h2 id="dept-h"><WithPlaceholders text={s.departmentName} /></h2>
        {s.departmentAddress && <p className="addr">{s.departmentAddress}</p>}
        <div className="btn-row">
          {phone && <a className="btn small" href={telHref(phone)}><PhoneIcon size={18} /> Call {phone}</a>}
          {email && <a className="btn small secondary" href={`mailto:${email}`}><TextIcon size={18} /> Email</a>}
          {url && (
            <a className="btn small secondary" href={url} target="_blank" rel="noopener noreferrer">
              <LinkIcon size={18} /> Website<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminForm } from "@/components/admin/AdminForm";
import { getContent } from "@/lib/store";
import { saveChaplain } from "../actions";

export const metadata: Metadata = { title: "Chaplain contact", robots: { index: false } };

export default async function Page() {
  const { chaplain: c } = await getContent();
  return (
    <AdminShell current="/admin/chaplain">
      <div className="card narrow">
        <h2>Designated chaplain</h2>
        <p className="small muted">
          Shown on the Reach a Chaplain screen. Leave both phone numbers empty to show only the follow-up request form.
        </p>
        <AdminForm action={saveChaplain}>
          <div className="grid-2">
            <div className="form-field">
              <label htmlFor="c-name">Name</label>
              <input id="c-name" name="name" type="text" defaultValue={c.name} maxLength={120} />
            </div>
            <div className="form-field">
              <label htmlFor="c-title">Title</label>
              <input id="c-title" name="title" type="text" defaultValue={c.title} maxLength={80} />
            </div>
            <div className="form-field">
              <label htmlFor="c-phone">Phone for calls</label>
              <input id="c-phone" name="phone" type="tel" defaultValue={c.phone} maxLength={30} />
            </div>
            <div className="form-field">
              <label htmlFor="c-text">Phone for texts <span className="muted">(if different)</span></label>
              <input id="c-text" name="textPhone" type="tel" defaultValue={c.textPhone} maxLength={30} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="c-avail">Availability</label>
            <input id="c-avail" name="availability" type="text" defaultValue={c.availability} maxLength={300} />
          </div>
          <div className="form-field">
            <label htmlFor="c-note">Extra note <span className="muted">(optional)</span></label>
            <input id="c-note" name="note" type="text" defaultValue={c.note} maxLength={300} placeholder="e.g. If the chaplain is away, Chaplain [Name] is covering." />
          </div>
        </AdminForm>
      </div>
    </AdminShell>
  );
}

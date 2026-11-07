import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminForm } from "@/components/admin/AdminForm";
import { BadgeUpload } from "@/components/admin/BadgeUpload";
import { getContent } from "@/lib/store";
import { saveSettings } from "../actions";

export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default async function Page() {
  const { settings: s } = await getContent();
  return (
    <AdminShell current="/admin/settings">
      <div className="card narrow">
        <h2>Settings</h2>
        <AdminForm action={saveSettings}>
          <div className="form-field">
            <label htmlFor="s-app">App name</label>
            <input id="s-app" name="appName" type="text" defaultValue={s.appName} maxLength={80} />
          </div>
          <div className="form-field">
            <label htmlFor="s-dept">Department or agency name</label>
            <input id="s-dept" name="departmentName" type="text" defaultValue={s.departmentName} maxLength={120} />
          </div>
          <BadgeUpload initial={s.departmentLogo} />
          <h3 style={{ marginTop: 24 }}>Department contact</h3>
          <p className="small muted">Optional. Shown in a &ldquo;Your department&rdquo; box on the home and About pages. Leave blank to hide.</p>
          <div className="form-field">
            <label htmlFor="s-addr">Precinct or office address <span className="muted">(optional)</span></label>
            <textarea id="s-addr" name="departmentAddress" defaultValue={s.departmentAddress} maxLength={300} style={{ minHeight: 80 }} />
          </div>
          <div className="grid-2">
            <div className="form-field">
              <label htmlFor="s-phone">Main phone <span className="muted">(optional)</span></label>
              <input id="s-phone" name="departmentPhone" type="tel" defaultValue={s.departmentPhone} maxLength={30} />
            </div>
            <div className="form-field">
              <label htmlFor="s-email">Email <span className="muted">(optional)</span></label>
              <input id="s-email" name="departmentEmail" type="email" defaultValue={s.departmentEmail} maxLength={120} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="s-web">Website <span className="muted">(optional)</span></label>
            <input id="s-web" name="departmentWebsite" type="url" defaultValue={s.departmentWebsite} maxLength={300} placeholder="https://" />
          </div>
          <div className="form-field">
            <label className="choice">
              <input type="checkbox" name="prototypeMode" defaultChecked={s.prototypeMode} />
              <span>
                <strong>Show the prototype banner</strong>
                <span>Keep this on until secure storage and administrator accounts are set up (see LAUNCH.md).</span>
              </span>
            </label>
          </div>
        </AdminForm>
      </div>
    </AdminShell>
  );
}

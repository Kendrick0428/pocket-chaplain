import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminForm } from "@/components/admin/AdminForm";
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

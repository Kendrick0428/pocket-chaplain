import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ListEditor } from "@/components/admin/ListEditor";
import { getContent } from "@/lib/store";
import { saveEncouragements } from "../actions";
import { TRADITIONS } from "@/lib/types";

export const metadata: Metadata = { title: "Daily encouragement", robots: { index: false } };

export default async function Page() {
  const { encouragements } = await getContent();
  return (
    <AdminShell current="/admin/encouragements">
      <h2>Daily encouragement</h2>
      <p className="small muted">One of these appears on the home screen each day, in order, repeating through the list. People who choose a faith see that tradition&rsquo;s encouragements plus those for everyone.</p>
      <ListEditor
        initial={encouragements as never}
        noun="encouragement"
        titleKey="text"
        subtitleKey="reference"
        action={saveEncouragements}
        fields={[
          { key: "text", label: "Text", kind: "textarea", required: true },
          { key: "reference", label: "Reference or label", kind: "text", hint: "e.g. Psalm 46:1, or Shift prayer" },
          { key: "tradition", label: "Faith tradition", kind: "select", options: [...TRADITIONS], required: true, hint: "Daily reminders only send encouragements marked \"Everyone\"." },
        ]}
      />
    </AdminShell>
  );
}

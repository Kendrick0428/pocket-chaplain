import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ListEditor } from "@/components/admin/ListEditor";
import { getContent } from "@/lib/store";
import { ENTRY_TYPES, TOPICS } from "@/lib/types";
import { saveLibrary } from "../actions";

export const metadata: Metadata = { title: "Pocket Chaplain library", robots: { index: false } };

export default async function Page() {
  const { library } = await getContent();
  return (
    <AdminShell current="/admin/library">
      <h2>Pocket Chaplain library</h2>
      <p className="small muted">Prayers, scripture, reflections, and encouragement. Each entry needs a title, text, and at least one situation.</p>
      <ListEditor
        initial={library as never}
        noun="entry"
        plural="entries"
        titleKey="title"
        subtitleKey="type"
        action={saveLibrary}
        fields={[
          { key: "title", label: "Title", kind: "text", required: true },
          { key: "type", label: "Type", kind: "select", options: [...ENTRY_TYPES], required: true },
          { key: "topics", label: "Situations", kind: "checks", options: [...TOPICS] },
          { key: "body", label: "Text", kind: "textarea", required: true, hint: "Leave a blank line between paragraphs." },
          { key: "reference", label: "Scripture reference", kind: "text", hint: "e.g. Psalm 23:1–4" },
        ]}
      />
    </AdminShell>
  );
}

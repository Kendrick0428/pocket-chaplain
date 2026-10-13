import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ListEditor } from "@/components/admin/ListEditor";
import { getContent } from "@/lib/store";
import { RESOURCE_CATEGORIES } from "@/lib/types";
import { saveResources } from "../actions";

export const metadata: Metadata = { title: "Resources", robots: { index: false } };

export default async function Page() {
  const { resources } = await getContent();
  return (
    <AdminShell current="/admin/resources">
      <h2>Resources</h2>
      <p className="small muted">Text in [square brackets] is highlighted on the public page as a placeholder to replace.</p>
      <ListEditor
        initial={resources as never}
        noun="resource"
        titleKey="name"
        subtitleKey="category"
        action={saveResources}
        fields={[
          { key: "name", label: "Name", kind: "text", required: true },
          { key: "category", label: "Category", kind: "select", options: [...RESOURCE_CATEGORIES], required: true },
          { key: "description", label: "Description", kind: "textarea" },
          { key: "phone", label: "Phone for calls", kind: "text" },
          { key: "text", label: "Number for texts", kind: "text" },
          { key: "url", label: "Website", kind: "text", hint: "Full address starting with https://" },
          { key: "hours", label: "Hours", kind: "text" },
        ]}
      />
    </AdminShell>
  );
}

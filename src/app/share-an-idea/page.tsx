import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { IdeaForm } from "@/components/IdeaForm";

export const metadata: Metadata = { title: "Share an Idea" };

export default function Page() {
  return (
    <div className="container narrow page">
      <BackLink />
      <h1>Share an Idea</h1>
      <p className="page-intro">
        Suggest a prayer, a topic, a helpful resource, an event, or a way to make this app better. Ideas go privately to
        the app administrators for review.
      </p>
      <div className="card">
        <IdeaForm />
      </div>
    </div>
  );
}

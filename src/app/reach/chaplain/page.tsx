import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import { isUsablePhone } from "@/lib/phone";
import { BackLink } from "@/components/BackLink";
import { CallTextButtons } from "@/components/CallTextButtons";
import { FollowUpForm } from "@/components/FollowUpForm";
import { WithPlaceholders } from "@/components/Placeholder";

export const metadata: Metadata = { title: "Reach a Chaplain" };

export default async function ReachChaplain() {
  const { chaplain, settings } = await getContent();
  const hasDirect = isUsablePhone(chaplain.phone) || isUsablePhone(chaplain.textPhone);

  return (
    <div className="container narrow page">
      <BackLink />
      <h1>Reach a Chaplain</h1>
      <p className="page-intro">
        Your chaplain is here for you, whatever you&apos;re carrying. Calling or texting opens your phone&apos;s own
        call or messages screen, so you stay in control of when to connect.
      </p>

      {hasDirect ? (
        <section className="card contact-card" aria-labelledby="chap-name">
          <p className="badge gold">{chaplain.title || "Chaplain"}</p>
          <p className="who" id="chap-name"><WithPlaceholders text={chaplain.name} /></p>
          {chaplain.availability && <p className="muted"><WithPlaceholders text={chaplain.availability} /></p>}
          <CallTextButtons
            name={chaplain.name}
            phone={isUsablePhone(chaplain.phone) ? chaplain.phone : undefined}
            textPhone={isUsablePhone(chaplain.textPhone) ? chaplain.textPhone : undefined}
          />
          {chaplain.note && <p className="small muted" style={{ marginTop: 12, marginBottom: 0 }}>{chaplain.note}</p>}
        </section>
      ) : (
        <div className="notice gold">
          <p>
            A direct chaplain number hasn&apos;t been set up for <WithPlaceholders text={settings.departmentName} /> yet.
            Send a short request below and the chaplain team will reach out to you.
          </p>
        </div>
      )}

      <section className="card" style={{ marginTop: 20 }} aria-labelledby="followup-heading">
        <h2 id="followup-heading">{hasDirect ? "Prefer the chaplain reach out to you?" : "Request a chaplain follow-up"}</h2>
        <p className="muted small">
          Only the authorized chaplain team can see this request. See <a href="/privacy">Privacy</a> for how it&apos;s
          handled.
        </p>
        <FollowUpForm />
      </section>

      <p className="small muted" style={{ marginTop: 20 }}>
        This app helps you reach a real chaplain. It does not replace personal chaplain care, counseling, or emergency
        services.
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import { BackLink } from "@/components/BackLink";
import { EmergencyNotice } from "@/components/EmergencyNotice";
import { WithPlaceholders } from "@/components/Placeholder";
import { edition } from "@/lib/edition";

export const metadata: Metadata = { title: "Privacy" };

export default async function Privacy() {
  const { settings } = await getContent();

  return (
    <div className="container narrow page stack">
      <BackLink />
      <h1>Privacy</h1>
      <p className="page-intro">
        We collect only what&apos;s needed to provide the support you ask for. Here is what that means in plain language.
      </p>

      {settings.prototypeMode && (
        <div className="notice gold">
          <p>
            <strong>This is a prototype.</strong> Secure storage and administrator accounts are not fully set up yet.
            Please don&apos;t enter real personal, case, or incident information until this notice is removed.
          </p>
        </div>
      )}

      <EmergencyNotice />

      <section className="card">
        <h2>What stays on your device</h2>
        <p>
          <strong>Your pastor&apos;s and friend&apos;s names and phone numbers</strong> are saved only in your browser on
          this device. They are never sent to our server, and administrators cannot see them. When you tap Call or Text,
          your phone opens its own call or messages screen; the app doesn&apos;t place calls or send messages, and it
          doesn&apos;t see your conversations.
        </p>
        <p>
          <strong>Your saved prayers and your &ldquo;How am I doing?&rdquo; check-ins</strong> also stay only on this
          device. Check-in answers are kept only if you turn on &ldquo;Remember my check-ins,&rdquo; and turning it off
          erases them. Nobody, including the chaplain, is told that you checked in. Your &ldquo;My faith&rdquo; choice is also saved only on this device and is never sent to us.
        </p>
        <p style={{ marginBottom: 0 }}>
          To work without a signal, the app saves copies of its public pages (prayers, resources, and similar) on your
          device. Administrator pages and anything you send are never saved this way.
        </p>
      </section>

      <section className="card">
        <h2>Daily reminders (optional)</h2>
        <p>
          If you turn on the daily reminder, your browser gives us an anonymous delivery address for notifications,
          along with the time you picked and your time zone. We don&apos;t ask for your name, phone number, or email,
          and administrators can&apos;t see reminder settings. Turning the reminder off deletes this information. The
          notification is delivered through your phone or browser maker&apos;s notification service (for example,
          Apple or Google).
        </p>
        <p style={{ marginBottom: 0 }}>
          The calendar reminder option is created entirely on your device and sends nothing to us.
        </p>
      </section>

      <section className="card">
        <h2>What we collect when you send a form</h2>
        <ul>
          <li>
            <strong>Prayer requests:</strong> your request, your choice of who may see it, and your first name if you
            choose to give it. You can send it anonymously.
          </li>
          <li>
            <strong>Chaplain follow-up requests:</strong> your name, how you&apos;d like to be contacted, your phone
            number or email, a best time, and an optional short note. These can&apos;t be anonymous, because the chaplain
            needs a way to reach you.
          </li>
          <li>
            <strong>Ideas:</strong> your idea, its category, and your name if you choose to give it. You can submit
            anonymously.
          </li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          We don&apos;t ask for your {edition.workIds}, and we don&apos;t create user profiles. We
          don&apos;t use advertising or tracking cookies. Our server, like most websites, may briefly log technical data
          such as your IP address to keep the service secure and prevent abuse.
        </p>
      </section>

      <section className="card">
        <h2>Who can see submissions</h2>
        <ul>
          <li>Only authorized administrators on the chaplain team can read prayer requests, follow-up requests, and ideas.</li>
          <li>
            If you choose “chaplain team and an approved prayer group,” the chaplain team may share your prayer request
            with a small, approved prayer group. If you choose “chaplain team only,” it is not shared.
          </li>
          <li>Nothing you send is posted publicly. There are no public profiles, comments, or prayer feeds.</li>
          <li>Ideas stay private to administrators while they are reviewed.</li>
        </ul>
      </section>

      <section className="card">
        <h2>How it&apos;s handled</h2>
        <p>
          Submissions are handled with care and kept only as long as they&apos;re needed. Administrators can mark them as
          reviewed, archive them, or delete them.
        </p>
        <p>
          <strong>Please understand:</strong> no website or online form can promise complete confidentiality. Because
          this app is operated for <WithPlaceholders text={settings.departmentName} />, information you submit may be
          subject to department policy or legal requirements, including public records laws. That&apos;s why we ask you
          not to include sensitive personnel, case, or incident information. For a truly private conversation, speak with
          a chaplain in person.
        </p>
        <p style={{ marginBottom: 0 }}>
          This app is not therapy, medical care, or emergency response.
        </p>
      </section>

      <section className="card">
        <h2>Questions</h2>
        <p style={{ marginBottom: 0 }}>
          Contact <WithPlaceholders text="[Privacy contact name, email, or phone]" /> with questions about your
          information or to ask that something you sent be deleted.
        </p>
      </section>

      <p className="small muted">Last updated: <WithPlaceholders text="[Date]" /></p>
    </div>
  );
}

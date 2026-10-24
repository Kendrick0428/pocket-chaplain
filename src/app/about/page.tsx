import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/store";
import { BackLink } from "@/components/BackLink";
import { WithPlaceholders } from "@/components/Placeholder";
import { DepartmentCard } from "@/components/DepartmentCard";

export const metadata: Metadata = { title: "About" };

export default async function About() {
  const { settings } = await getContent();
  return (
    <div className="container narrow page stack">
      <BackLink />
      <h1>About {settings.appName}</h1>
      <p className="page-intro">
        {settings.appName} is for the officers, staff, and families of <WithPlaceholders text={settings.departmentName} />.
        It offers prayer, encouragement, and an easy way to reach the people who care about you.
      </p>
      <section className="card">
        <h2>What it is</h2>
        <p>
          A tool to assist and extend the chaplain&apos;s ministry. It helps you reach a real chaplain, your own pastor,
          and trusted friends, and it gives you short prayers and encouragement for hard days.
        </p>
        <h2>What it isn&apos;t</h2>
        <p style={{ marginBottom: 0 }}>
          It does not replace personal chaplain care, pastoral care, friendship, counseling, or emergency services. It is
          not therapy, medical care, or an emergency response service, and it is not monitored around the clock.
        </p>
      </section>
      <DepartmentCard settings={settings} />
      <p>
        Questions about your information? Read the <Link href="/privacy">privacy page</Link>.
      </p>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { CANDIDATE } from "@/lib/profile";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Source of truth</p>
        <h1 className="mt-1 font-display text-4xl font-medium">{CANDIDATE.name}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Operator: {CANDIDATE.operator}. This page is the corpus. Drafting may
          re-angle it. It may not invent from it.
        </p>
      </header>

      <section className="rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h2 className="font-display text-2xl">Locked decisions</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Item label="Position types" value={CANDIDATE.locked.positionTypes} />
          <Item label="Geography" value={CANDIDATE.locked.geography} />
          <Item label="Salary" value={CANDIDATE.locked.salaryFloor} />
          <Item label="Drafting" value={CANDIDATE.locked.drafting} />
          <Item label="Catholic mission" value={CANDIDATE.locked.catholicMission} />
          <Item label="Seton Hall" value={CANDIDATE.locked.shuAffinity} />
        </dl>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="Degrees">
          <ul className="space-y-2 text-sm leading-relaxed">
            {CANDIDATE.degrees.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Card>
        <Card title="Families (equal weight)">
          <ul className="space-y-2 text-sm leading-relaxed">
            {CANDIDATE.families.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Card>
        <Card title="Systems he has">
          <ul className="space-y-2 text-sm leading-relaxed">
            {CANDIDATE.systemsHave.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card title="Systems he does not have">
          <ul className="space-y-2 text-sm leading-relaxed">
            {CANDIDATE.systemsGap.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h2 className="font-display text-2xl">Attested experience</h2>
        <ul className="mt-4 space-y-4">
          {CANDIDATE.experience.map((e) => (
            <li key={e.org}>
              <p className="text-sm font-medium">{e.org}</p>
              <p className="text-sm leading-relaxed text-muted">{e.proof}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)] sm:p-8">
        <h2 className="font-display text-2xl">Voice</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          {CANDIDATE.voice.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-xl)] bg-bg p-6 sm:p-8">
        <h2 className="font-display text-2xl">What is next, not now</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted">
          <li>
            SharePoint as the long-term file home, once the new site is decided.
            GitHub stays the agent-readable copy.
          </li>
          <li>
            Alert intake from HigherEdJobs, Chronicle, and HERC — parse, dedupe,
            score, digest. Still approval-gated.
          </li>
          <li>
            Azure AI Foundry agents for scoring and drafting, with this desk as
            the human loop. Not a replacement for the corpus files.
          </li>
          <li>
            Browser-assisted apply (fill the ATS, stop before attest). Never
            auto-submit.
          </li>
        </ol>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-xl)] bg-bg-elevated p-6 shadow-[var(--shadow-border)]">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed">{value}</dd>
    </div>
  );
}

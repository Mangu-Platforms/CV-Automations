import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FitChip, StatusChip } from "@/components/status-chip";
import { FAMILY_LABEL, VARIANT_LABEL } from "@/lib/catalog";
import { displayInstitution } from "@/lib/institutions";
import { scoreBand, scoreRole } from "@/lib/score";
import { allRoles, nextRole, nextRoles, useDesk } from "@/lib/store";
import type { AppStatus, Role, Variant } from "@/lib/types";

export const Route = createFileRoute("/")({ component: DeskHome });

type FilterId = "next" | "in-scope" | "walking" | "submitted" | "out";
type FamilyFilter = "all" | Variant;

function DeskHome() {
  const progress = useDesk((s) => s.progress);
  const customRoles = useDesk((s) => s.customRoles);
  const getProgress = useDesk((s) => s.getProgress);
  const roles = allRoles(customRoles);
  const next = nextRole(roles, progress);
  const session = nextRoles(roles, progress, 3);
  const [filter, setFilter] = useState<FilterId>("next");
  const [family, setFamily] = useState<FamilyFilter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    let remaining = 0;
    let submitted = 0;
    let walking = 0;
    let out = 0;
    for (const role of roles) {
      const status = getProgress(role).status;
      if (status === "submitted" || status === "interview") submitted += 1;
      else if (status === "out-of-scope" || !role.inScope) out += 1;
      else if (status === "walking") walking += 1;
      else remaining += 1;
    }
    return { remaining, submitted, walking, out, total: roles.length };
  }, [roles, getProgress]);

  const visible = roles
    .filter((role) => {
      const status = getProgress(role).status;
      if (filter === "submitted") return status === "submitted" || status === "interview";
      if (filter === "out") return status === "out-of-scope" || !role.inScope;
      if (filter === "walking") return status === "walking";
      if (filter === "in-scope") return role.inScope && status !== "out-of-scope";
      return (
        role.inScope &&
        status !== "submitted" &&
        status !== "interview" &&
        status !== "skipped" &&
        status !== "out-of-scope"
      );
    })
    .filter((role) => (family === "all" ? true : role.variant === family))
    .filter((role) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const inst = displayInstitution(role);
      return (
        role.title.toLowerCase().includes(q) ||
        inst.name.toLowerCase().includes(q) ||
        inst.short.toLowerCase().includes(q) ||
        (role.jobNo ?? "").toLowerCase().includes(q) ||
        (role.campus ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => scoreRole(b).total - scoreRole(a).total);

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius-xl)] bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          Pipeline
        </p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-medium leading-tight text-fg sm:text-5xl">
          Walk one application. Finish the packet. You submit.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Drafted CVs and letters from the GitHub library, scored against the
          locked staff search. Portal fields are copy-paste. Never auto-submit.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm tabular-nums">
          <Stat n={counts.remaining} label="still to walk" />
          <Stat n={counts.walking} label="in progress" />
          <Stat n={counts.submitted} label="submitted" />
          <Stat n={counts.out} label="out of scope" />
        </div>
        {query.trim() ? null : next ? (
          <div className="mt-8 rounded-[var(--radius-lg)] bg-bg p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Next up</p>
            <RoleRow role={next} status={getProgress(next).status} featured />
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted">
            Nothing left in the in-scope queue. Open Library or add a posting.
          </p>
        )}
      </section>

      {!query.trim() && session.length > 1 && (
        <section>
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Today's walk</p>
          <h2 className="mt-1 font-display text-2xl">Three packets, in score order</h2>
          <ol className="mt-4 space-y-3">
            {session.map((role, i) => (
              <li
                key={role.id}
                className="rounded-[var(--radius-lg)] bg-bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  {i + 1} of {session.length}
                </p>
                <RoleRow role={role} status={getProgress(role).status} />
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center gap-2 text-muted">
          <Filter className="size-4" />
          <span className="text-xs uppercase tracking-[0.14em]">Filter</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["next", "To walk"],
              ["walking", "In progress"],
              ["in-scope", "In scope"],
              ["submitted", "Submitted"],
              ["out", "Out of scope"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={
                filter === id
                  ? "h-11 rounded-full bg-accent px-4 text-sm text-accent-fg"
                  : "h-11 rounded-full bg-bg-elevated px-4 text-sm text-muted shadow-[var(--shadow-border)]"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["all", "All variants"],
              ["admissions", "Admissions"],
              ["ops", "Academic ops"],
              ["budget", "Budget"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFamily(id)}
              className={
                family === id
                  ? "h-11 rounded-full bg-bg-subtle px-4 text-sm text-fg"
                  : "h-11 rounded-full px-4 text-sm text-muted"
              }
            >
              {label}
            </button>
          ))}
        </div>
        <label className="relative mt-4 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, school, job number…"
            className="pl-10"
            aria-label="Search roles"
          />
        </label>
        <ul className="mt-5 space-y-3">
          {visible.map((role) => (
            <li
              key={role.id}
              className="rounded-[var(--radius-lg)] bg-bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5"
            >
              <RoleRow role={role} status={getProgress(role).status} />
            </li>
          ))}
          {visible.length === 0 && (
            <li className="rounded-[var(--radius-lg)] bg-bg-elevated p-6 text-sm text-muted shadow-[var(--shadow-border)]">
              Nothing in this filter.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-medium tabular-nums">{n}</div>
      <div className="text-xs uppercase tracking-[0.12em] text-muted">{label}</div>
    </div>
  );
}

function RoleRow({
  role,
  status,
  featured = false,
}: {
  role: Role;
  status: AppStatus;
  featured?: boolean;
}) {
  const inst = displayInstitution(role);
  const score = scoreRole(role);
  const band = scoreBand(score.total);
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-medium leading-snug">{role.title}</h2>
          <StatusChip status={status} />
          <FitChip fit={role.fitLabel} />
        </div>
        <p className="mt-1 text-sm text-muted">
          {inst.name}
          {role.campus ? ` · ${role.campus}` : ""} · {FAMILY_LABEL[role.family]} ·{" "}
          {VARIANT_LABEL[role.variant]} · score {score.total}
          {band === "top" ? " · top tier" : ""}
        </p>
      </div>
      <Button asChild size={featured ? "lg" : "default"}>
        <Link to="/apply/$id" params={{ id: role.id }}>
          {status === "walking" ? "Continue" : "Walk through"}
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}

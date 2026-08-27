import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FAMILY_LABEL, ROLES, VARIANT_LABEL } from "@/lib/catalog";
import { displayInstitution } from "@/lib/institutions";
import { githubUrl } from "@/lib/packet";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function LibraryPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const match = (role: Role) => {
    if (!q) return true;
    const inst = displayInstitution(role);
    return (
      role.title.toLowerCase().includes(q) ||
      inst.name.toLowerCase().includes(q) ||
      inst.short.toLowerCase().includes(q) ||
      (role.jobNo ?? "").toLowerCase().includes(q)
    );
  };

  const groups = useMemo(
    () => ({
      admissions: ROLES.filter((r) => r.variant === "admissions" && r.inScope && match(r)),
      ops: ROLES.filter((r) => r.variant === "ops" && r.inScope && match(r)),
      budget: ROLES.filter((r) => r.variant === "budget" && r.inScope && match(r)),
      parked: ROLES.filter((r) => !r.inScope && match(r)),
    }),
    [q],
  );

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Materials</p>
        <h1 className="mt-1 font-display text-4xl font-medium">Packet library</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          Three CV variants seed every draft: admissions, academic ops, budget.
          Word originals live in the GitHub repo; this desk is the walking copy.
        </p>
        <label className="relative mt-5 block max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search packets…"
            className="pl-10"
            aria-label="Search packets"
          />
        </label>
      </header>

      <section className="rounded-[var(--radius-xl)] bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-7">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Master files</p>
        <h2 className="mt-1 font-display text-2xl">Great CV and CL templates</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Preview the actual template, edit a section, export PDF or Word into a
          named folder. When it looks right, build the packet on a role walk.
        </p>
        <Button asChild className="mt-4">
          <Link to="/templates">
            Open templates
            <ArrowRight />
          </Link>
        </Button>
      </section>

      <VariantBlock id="admissions" title="Admissions / enrollment" roles={groups.admissions} />
      <VariantBlock id="ops" title="Academic operations" roles={groups.ops} />
      <VariantBlock id="budget" title="Budget / finance" roles={groups.budget} />
      <VariantBlock id="parked" title="Parked — faculty, adjunct, exec" roles={groups.parked} />
    </div>
  );
}

function VariantBlock({
  title,
  roles,
}: {
  id: string;
  title: string;
  roles: Role[];
}) {
  return (
    <section>
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-muted">{roles.length} packets</p>
      <ul className="mt-4 divide-y divide-border rounded-[var(--radius-xl)] bg-bg-elevated shadow-[var(--shadow-border)]">
        {roles.length === 0 && (
          <li className="px-5 py-4 text-sm text-muted">Nothing in this group.</li>
        )}
        {roles.map((role) => {
          const inst = displayInstitution(role);
          return (
            <li key={role.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">{role.title}</p>
                <p className="text-xs text-muted">
                  {inst.short}
                  {role.campus ? ` · ${role.campus}` : ""} · {FAMILY_LABEL[role.family]} ·{" "}
                  {VARIANT_LABEL[role.variant]} · {role.batch}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {role.cvFile && (
                  <a className="underline" href={githubUrl(role.cvFile)} target="_blank" rel="noreferrer">
                    CV
                  </a>
                )}
                {role.clFile && (
                  <a className="underline" href={githubUrl(role.clFile)} target="_blank" rel="noreferrer">
                    Letter
                  </a>
                )}
                <Link to="/apply/$id" params={{ id: role.id }} className="underline">
                  Walk
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

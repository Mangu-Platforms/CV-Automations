import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AtsSheet } from "@/components/ats-sheet";
import { PacketStudio } from "@/components/packet-studio";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { FitChip, StatusChip } from "@/components/status-chip";
import { FAMILY_LABEL, getRole, VARIANT_LABEL } from "@/lib/catalog";
import { displayInstitution } from "@/lib/institutions";
import { checklistFor, githubUrl } from "@/lib/packet";
import { scoreBand, scoreRole } from "@/lib/score";
import { allRoles, useDesk } from "@/lib/store";
import type { Role, RoleProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/apply/$id")({
  component: ApplyWalk,
});

const STEPS = ["Role", "Fit", "Packet", "Checklist", "Portal", "Submit"] as const;

function ApplyWalk() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const customRoles = useDesk((s) => s.customRoles);
  const getProgress = useDesk((s) => s.getProgress);
  const setStep = useDesk((s) => s.setStep);
  const setStatus = useDesk((s) => s.setStatus);
  const setNotes = useDesk((s) => s.setNotes);
  const toggleCheck = useDesk((s) => s.toggleCheck);
  const resetRole = useDesk((s) => s.resetRole);
  const progressMap = useDesk((s) => s.progress);

  const role = useMemo(() => {
    return getRole(id) ?? customRoles.find((r) => r.id === id);
  }, [id, customRoles]);

  if (!role) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl">Role not found</h1>
        <Button asChild variant="secondary">
          <Link to="/">Back to desk</Link>
        </Button>
      </div>
    );
  }

  const progress = getProgress(role);
  const step = Math.min(progress.step, STEPS.length - 1);
  const inst = displayInstitution(role);
  const score = scoreRole(role);
  const items = checklistFor(role);
  const checked = items.filter((i) => progress.checklist[i.id]).length;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, next));
    setStep(role.id, clamped);
  };

  const queue = allRoles(customRoles);
  const remaining = queue.filter((r) => {
    const st = (progressMap[r.id] ?? getProgress(r)).status;
    return (
      r.inScope &&
      r.id !== role.id &&
      st !== "submitted" &&
      st !== "interview" &&
      st !== "skipped" &&
      st !== "out-of-scope"
    );
  });

  return (
    <WalkBody
      role={role}
      instName={`${inst.short}${role.campus ? ` · ${role.campus}` : ""}`}
      step={step}
      progress={progress}
      score={score}
      items={items}
      checked={checked}
      remainingId={remaining[0]?.id}
      go={go}
      setNotes={setNotes}
      toggleCheck={toggleCheck}
      setStatus={setStatus}
      resetRole={resetRole}
      navigateTo={(nid) => navigate({ to: "/apply/$id", params: { id: nid } })}
    />
  );
}

function WalkBody({
  role,
  instName,
  step,
  progress,
  score,
  items,
  checked,
  remainingId,
  go,
  setNotes,
  toggleCheck,
  setStatus,
  resetRole,
  navigateTo,
}: {
  role: Role;
  instName: string;
  step: number;
  progress: RoleProgress;
  score: ReturnType<typeof scoreRole>;
  items: ReturnType<typeof checklistFor>;
  checked: number;
  remainingId?: string;
  go: (n: number) => void;
  setNotes: (id: string, notes: string) => void;
  toggleCheck: (id: string, itemId: string) => void;
  setStatus: (id: string, status: "submitted" | "skipped" | "interview") => void;
  resetRole: (role: Role) => void;
  navigateTo: (id: string) => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowRight") go(step + 1);
      if (event.key === "ArrowLeft") go(step - 1);
      if (event.key >= "1" && event.key <= String(STEPS.length)) {
        go(Number(event.key) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, step]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 text-sm text-muted no-underline hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Desk
        </Link>
        <div className="flex flex-wrap gap-2">
          <StatusChip status={progress.status} />
          <FitChip fit={role.fitLabel} />
        </div>
      </div>

      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {instName} · {FAMILY_LABEL[role.family]}
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium leading-tight sm:text-4xl">
          {role.title}
        </h1>
      </header>

      <Progress value={((step + 1) / STEPS.length) * 100} />

      <ol className="flex gap-1 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <li key={label} className="min-w-[4.5rem] flex-1">
            <button
              type="button"
              onClick={() => go(i)}
              className={cn(
                "flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] text-xs sm:text-sm",
                i === step
                  ? "bg-accent text-accent-fg"
                  : i < step
                    ? "bg-bg-subtle text-fg"
                    : "bg-bg-elevated text-muted shadow-[var(--shadow-border)]",
              )}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <section
        className={cn(
          "rounded-[var(--radius-xl)] bg-bg-elevated p-5 shadow-[var(--shadow-border)] sm:p-7",
          step === 2 && "sm:p-6",
        )}
      >
        {step === 0 && <RoleStep role={role} />}
        {step === 1 && <FitStep role={role} score={score} />}
        {step === 2 && <PacketStep role={role} />}
        {step === 3 && (
          <ChecklistStep
            role={role}
            notes={progress.notes}
            onNotes={(n) => setNotes(role.id, n)}
            checked={progress.checklist}
            onToggle={(itemId) => toggleCheck(role.id, itemId)}
          />
        )}
        {step === 4 && <AtsSheet role={role} />}
        {step === 5 && (
          <SubmitStep
            role={role}
            checkedCount={checked}
            total={items.length}
            onSubmit={() => {
              setStatus(role.id, "submitted");
              toast.success("Marked submitted. You did that — not a bot.");
            }}
            onSkip={() => {
              setStatus(role.id, "skipped");
              toast.message("Skipped. Still in the library.");
            }}
            onInterview={() => {
              setStatus(role.id, "interview");
              toast.success("Interview noted.");
            }}
            nextId={remainingId}
            onNext={(nid) => navigateTo(nid)}
          />
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => resetRole(role)} className="text-muted">
          <RotateCcw />
          Reset packet
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <p className="hidden text-xs text-subtle sm:block">1–6 steps · ← →</p>
          <Button variant="secondary" disabled={step === 0} onClick={() => go(step - 1)}>
            Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button onClick={() => go(step + 1)}>
              Continue
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function RoleStep({ role }: { role: Role }) {
  const inst = displayInstitution(role);
  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl">The posting</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        <Fact label="Institution" value={`${inst.name} · Tier ${inst.tier}`} />
        <Fact label="ATS" value={inst.ats} />
        <Fact label="Family" value={FAMILY_LABEL[role.family]} />
        <Fact label="CV variant" value={VARIANT_LABEL[role.variant]} />
        <Fact
          label="Salary"
          value={
            role.salaryMin && role.salaryMax
              ? `$${role.salaryMin.toLocaleString()}–$${role.salaryMax.toLocaleString()}`
              : "Not in the packet — verify on the posting (NJ requires it)"
          }
        />
        <Fact label="Job no." value={role.jobNo ?? "Not captured"} />
      </dl>
      {!role.inScope && (
        <p className="rounded-[var(--radius-md)] bg-bad/8 p-4 text-sm text-bad">
          This failed a hard filter (faculty, adjunct-deferred, or director-and-above).
          Walk it only with an operator override.
        </p>
      )}
      <p className="text-sm leading-relaxed text-muted">{role.angle}</p>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <a href={role.applyUrl} target="_blank" rel="noreferrer">
            Open posting
            <ExternalLink />
          </a>
        </Button>
        {role.cvFile && (
          <Button asChild variant="ghost">
            <a href={githubUrl(role.cvFile)} target="_blank" rel="noreferrer">
              GitHub CV
              <ExternalLink />
            </a>
          </Button>
        )}
        {role.clFile && (
          <Button asChild variant="ghost">
            <a href={githubUrl(role.clFile)} target="_blank" rel="noreferrer">
              GitHub letter
              <ExternalLink />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

function FitStep({
  role,
  score,
}: {
  role: Role;
  score: ReturnType<typeof scoreRole>;
}) {
  const band = scoreBand(score.total);
  const rows: [string, number, number][] = [
    ["Skills & systems", score.skills, 30],
    ["Archetype", score.archetype, 25],
    ["Salary band", score.salary, 15],
    ["Institution", score.institution, 10],
    ["Commute / modality", score.commute, 10],
    ["Trajectory", score.trajectory, 10],
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl">Fit against the rubric</h2>
        <div className="text-right">
          <div className="font-display text-4xl tabular-nums">{score.total}</div>
          <div className="text-xs uppercase tracking-[0.14em] text-muted">
            {band === "top" ? "Top tier" : band === "digest" ? "Digest" : "Logged only"}
          </div>
        </div>
      </div>
      <ul className="space-y-3">
        {rows.map(([label, value, max]) => (
          <li key={label}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{label}</span>
              <span className="tabular-nums text-muted">
                {value}/{max}
              </span>
            </div>
            <Progress value={(value / max) * 100} />
          </li>
        ))}
      </ul>
      {score.deductions > 0 && (
        <p className="text-sm text-bad">Deductions: −{score.deductions}</p>
      )}
      <div>
        <h3 className="text-xs uppercase tracking-[0.14em] text-muted">Gaps to name</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {role.gaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-[0.14em] text-muted">Angle</h3>
        <p className="mt-2 text-sm leading-relaxed">{role.angle}</p>
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-[0.14em] text-muted">Why this score</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          {score.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PacketStep({ role }: { role: Role }) {
  const stored = useDesk((s) => s.packetDocs[role.id]);
  const setDocs = useDesk((s) => s.setDocs);
  const masterCv = useDesk((s) => s.masterCv);
  const masterCl = useDesk((s) => s.masterCl);
  const current = stored ?? { cv: masterCv, cl: masterCl, built: false };

  return (
    <PacketStudio
      role={role}
      cv={current.cv}
      cl={current.cl}
      built={current.built}
      masterCv={masterCv}
      masterCl={masterCl}
      onChange={(cv, cl) => setDocs(role.id, cv, cl)}
      onBuilt={(cv, cl) => setDocs(role.id, cv, cl, true)}
    />
  );
}

function ChecklistStep({
  role,
  notes,
  onNotes,
  checked,
  onToggle,
}: {
  role: Role;
  notes: string;
  onNotes: (n: string) => void;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const items = checklistFor(role);
  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl">Submission checklist</h2>
      <p className="text-sm text-muted">
        You apply in the institution's ATS. This list is the human gate.
      </p>
      <ul className="space-y-2">
        {items.map((item) => {
          const on = Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onToggle(item.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[var(--radius-md)] p-3 text-left",
                  on ? "bg-good/8" : "bg-bg",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[4px] border",
                    on ? "border-good bg-good text-accent-fg" : "border-border",
                  )}
                >
                  {on && <Check className="size-3" />}
                </span>
                <span>
                  <span className="block text-sm">{item.label}</span>
                  {item.hint && (
                    <span className="block text-xs text-muted">{item.hint}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-muted" htmlFor="notes">
          Notes
        </label>
        <Textarea
          id="notes"
          className="mt-2 min-h-28"
          placeholder="Portal quirks, salary field, confirmation number…"
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
        />
      </div>
    </div>
  );
}

function SubmitStep({
  role,
  checkedCount,
  total,
  onSubmit,
  onSkip,
  onInterview,
  nextId,
  onNext,
}: {
  role: Role;
  checkedCount: number;
  total: number;
  onSubmit: () => void;
  onSkip: () => void;
  onInterview: () => void;
  nextId?: string;
  onNext: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const inst = displayInstitution(role);

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl">You submit. The desk does not.</h2>
      <p className="text-sm leading-relaxed text-muted">
        Checklist {checkedCount}/{total}. Open {inst.ats}, paste from the fill
        sheet, attest as yourself. Browser auto-apply is a later phase — and
        only as a helper, never a silent sender.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={role.applyUrl} target="_blank" rel="noreferrer">
            Open ATS
            <ExternalLink />
          </a>
        </Button>
        {!confirming ? (
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Mark submitted
          </Button>
        ) : (
          <>
            <Button
              onClick={() => {
                setConfirming(false);
                onSubmit();
              }}
            >
              Yes — I submitted in {inst.ats}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Not yet
            </Button>
          </>
        )}
        <Button variant="outline" onClick={onInterview}>
          Got an interview
        </Button>
        <Button variant="ghost" onClick={onSkip}>
          Skip this role
        </Button>
      </div>
      {confirming && (
        <p className="rounded-[var(--radius-md)] bg-bg p-4 text-sm text-muted">
          This only records it on the desk. It does not send anything to{" "}
          {inst.name}.
        </p>
      )}
      {nextId && (
        <Button variant="outline" onClick={() => onNext(nextId)}>
          Next role
          <ArrowRight />
        </Button>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

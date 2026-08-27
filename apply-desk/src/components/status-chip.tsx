import { Badge } from "@/components/ui/badge";
import type { AppStatus, FitLabel } from "@/lib/types";

const STATUS: Record<AppStatus, { label: string; tone: "neutral" | "accent" | "good" | "warn" | "bad" }> = {
  queued: { label: "Queued", tone: "neutral" },
  walking: { label: "In walkthrough", tone: "accent" },
  ready: { label: "Packet ready", tone: "accent" },
  submitted: { label: "Submitted", tone: "good" },
  interview: { label: "Interview", tone: "good" },
  skipped: { label: "Skipped", tone: "warn" },
  "out-of-scope": { label: "Out of scope", tone: "bad" },
};

const FIT: Record<FitLabel, { label: string; tone: "good" | "warn" | "bad" }> = {
  strong: { label: "Strong fit", tone: "good" },
  moderate: { label: "Moderate", tone: "warn" },
  "long-shot": { label: "Long shot", tone: "bad" },
};

export function StatusChip({ status }: { status: AppStatus }) {
  const s = STATUS[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function FitChip({ fit }: { fit: FitLabel }) {
  const s = FIT[fit];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

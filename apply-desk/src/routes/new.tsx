import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { tailorPacket } from "@/lib/ai";
import { defaultCl, defaultCv } from "@/lib/packet";
import { useDesk, type CustomRole } from "@/lib/store";
import type { FitLabel, JobFamily, Variant } from "@/lib/types";
import { slugify } from "@/lib/utils";

export const Route = createFileRoute("/new")({ component: NewPosting });

function NewPosting() {
  const navigate = useNavigate();
  const addCustomRole = useDesk((s) => s.addCustomRole);
  const setPacket = useDesk((s) => s.setPacket);
  const [posting, setPosting] = useState("");
  const [busy, setBusy] = useState(false);

  const ingest = async () => {
    const text = posting.trim();
    if (text.length < 40) {
      toast.error("Paste a fuller posting — title, institution, and duties.");
      return;
    }
    setBusy(true);
    try {
      const result = await tailorPacket({
        data: {
          mode: "score-posting",
          title: "",
          institution: "",
          family: "other",
          variant: "ops",
          angle: "",
          gaps: [],
          posting: text,
          currentCv: "",
          currentCl: "",
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const title = result.title || "Untitled posting";
      const institution = result.institution || "Unknown institution";
      const family = (result.family || "other") as JobFamily;
      const variant = (result.variant || "ops") as Variant;
      const fitLabel = (result.fitLabel || "moderate") as FitLabel;
      const gaps = result.gaps;
      const angle = result.angle || "Score from the pasted posting.";
      const inScope = result.inScope;
      const id = `custom-${slugify(institution)}-${slugify(title)}`.slice(0, 80);

      const role: CustomRole = {
        id,
        title,
        institutionId: slugify(institution).slice(0, 24) || "custom",
        institutionName: institution,
        family,
        positionType:
          family === "faculty"
            ? "faculty"
            : family === "adjunct"
              ? "adjunct"
              : "staff-ft",
        variant,
        modality: "onsite",
        batch: "inbox",
        githubDir: "",
        applyUrl: "",
        fitLabel,
        gaps,
        angle,
        recommend: result.recommend,
        inScope,
        hasPacket: false,
        postingText: text,
      };

      addCustomRole(role);
      setPacket(role.id, defaultCv(role), defaultCl(role));
      toast.success("Scored and queued. Walk the packet next.");
      navigate({ to: "/apply/$id", params: { id: role.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not score posting");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">Inbox</p>
        <h1 className="mt-1 font-display text-4xl font-medium">Paste a posting</h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Grok scores it against the locked fit profile, suggests a CV variant,
          and opens the walkthrough. Nothing is submitted.
        </p>
      </header>
      <label className="block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="posting">
        Posting text
      </label>
      <Textarea
        id="posting"
        value={posting}
        onChange={(e) => setPosting(e.target.value)}
        placeholder="Title, institution, salary, duties, requirements…"
        className="min-h-64"
      />
      <div className="flex flex-wrap gap-2">
        <Button onClick={ingest} disabled={busy}>
          {busy ? "Scoring…" : "Score and queue"}
        </Button>
      </div>
      <p className="text-sm text-muted">
        Alert intake from HigherEdJobs and the Chronicle is Phase 2. This is the
        manual door.
      </p>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { PacketStudio } from "@/components/packet-studio";
import { Button } from "@/components/ui/button";
import { useDesk } from "@/lib/store";

export const Route = createFileRoute("/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  const masterCv = useDesk((s) => s.masterCv);
  const masterCl = useDesk((s) => s.masterCl);
  const setMaster = useDesk((s) => s.setMaster);
  const resetMaster = useDesk((s) => s.resetMaster);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Great CV and CL templates
          </p>
          <h1 className="mt-1 font-display text-4xl font-medium">Templates</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            The same resume and letter files from the repo, as a live page.
            Tweak a section, export PDF or Word, then build a packet on a role
            when it looks right.
          </p>
        </div>
        <Button variant="ghost" className="text-muted" onClick={resetMaster}>
          <RotateCcw />
          Reset to original
        </Button>
      </header>
      <PacketStudio
        cv={masterCv}
        cl={masterCl}
        onChange={setMaster}
        masterCv={masterCv}
        masterCl={masterCl}
      />
      <p className="text-sm text-muted">
        Ready? Walk a role from the{" "}
        <Link to="/" className="underline">
          desk
        </Link>{" "}
        and use Build CV & letter on the packet step.
      </p>
    </div>
  );
}

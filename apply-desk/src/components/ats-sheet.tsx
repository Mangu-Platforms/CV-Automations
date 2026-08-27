import { Copy } from "lucide-react";
import { toast } from "sonner";
import { CopyRow } from "@/components/copy-row";
import { Button } from "@/components/ui/button";
import { atsPlaybook, fillSheet } from "@/lib/ats";
import { displayInstitution } from "@/lib/institutions";
import type { Role } from "@/lib/types";

export function AtsSheet({ role }: { role: Role }) {
  const inst = displayInstitution(role);
  const groups = fillSheet(role);
  const playbook = atsPlaybook(role);

  const copyAllIdentity = async () => {
    const identity = groups.find((g) => g.id === "identity");
    if (!identity) return;
    const block = identity.fields.map((f) => `${f.label}: ${f.value}`).join("\n");
    await navigator.clipboard.writeText(block);
    toast.success("Identity block copied");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Portal fill sheet</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            {inst.ats} at {inst.name}. Copy a field, paste in the ATS, stop
            before you attest. This desk does not submit.
          </p>
        </div>
        <Button variant="outline" onClick={copyAllIdentity}>
          <Copy />
          Copy identity
        </Button>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
        {playbook.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      {groups.map((group) => (
        <section key={group.id} className="space-y-2">
          <h3 className="font-display text-xl">{group.title}</h3>
          {group.note && <p className="text-xs text-muted">{group.note}</p>}
          <div className="space-y-2">
            {group.fields.map((field) => (
              <CopyRow
                key={field.id}
                label={field.label}
                value={field.value}
                hint={field.hint}
                copyable={field.copyable}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyRow({
  label,
  value,
  hint,
  copyable = true,
}: {
  label: string;
  value: string;
  hint?: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!copyable) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`Copied ${label}`);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-md)] bg-bg p-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
      {copyable && (
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className={cn(
            "inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-bg-subtle hover:text-fg",
            copied && "text-good",
          )}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      )}
    </div>
  );
}

import { Copy, Download, Hammer, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PacketPaper, type FieldKey, type PaperKind } from "@/components/packet-paper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { tailorPacket } from "@/lib/ai";
import { displayInstitution } from "@/lib/institutions";
import {
  applyRewrite,
  buildPacket,
  clToText,
  cloneDoc,
  cvToText,
  defaultExportNames,
  MASTER_CL,
  MASTER_CV,
  type ClDoc,
  type CvDoc,
} from "@/lib/docs";
import { exportPacket, type ExportFormat } from "@/lib/export-packet";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

type StudioProps = {
  role?: Role;
  cv: CvDoc;
  cl: ClDoc;
  built?: boolean;
  onChange: (cv: CvDoc, cl: ClDoc) => void;
  onBuilt?: (cv: CvDoc, cl: ClDoc) => void;
  masterCv?: CvDoc;
  masterCl?: ClDoc;
};

export function PacketStudio({
  role,
  cv,
  cl,
  built = false,
  onChange,
  onBuilt,
  masterCv = MASTER_CV,
  masterCl = MASTER_CL,
}: StudioProps) {
  const [kind, setKind] = useState<PaperKind>("cv");
  const [selected, setSelected] = useState<FieldKey>("cv.profile");
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const names = useMemo(() => defaultExportNames(role), [role]);
  const [cvName, setCvName] = useState(names.cv);
  const [clName, setClName] = useState(names.cl);
  const [folderName, setFolderName] = useState(names.folder);
  const [inFolder, setInFolder] = useState(true);
  const [format, setFormat] = useState<ExportFormat>("docx");
  const inst = role ? displayInstitution(role) : null;

  useEffect(() => {
    setCvName(names.cv);
    setClName(names.cl);
    setFolderName(names.folder);
  }, [names]);

  const copy = async () => {
    const text = kind === "cv" ? cvToText(cv) : clToText(cl);
    await navigator.clipboard.writeText(text);
    toast.success(kind === "cv" ? "CV copied" : "Letter copied");
  };

  const build = () => {
    if (!role) return;
    const packet = buildPacket(
      role,
      built ? masterCv : cv,
      built ? masterCl : cl,
    );
    onBuilt?.(packet.cv, packet.cl);
    onChange(packet.cv, packet.cl);
    setKind("cl");
    setSelected("cl.body");
    toast.success("Packet built in the template. Read it, then export.");
  };

  const rewrite = async () => {
    if (!role || !inst) return;
    setBusy(true);
    try {
      const result = await tailorPacket({
        data: {
          mode: "packet",
          title: role.title,
          institution: inst.name,
          family: role.family,
          variant: role.variant,
          angle: role.angle,
          gaps: role.gaps,
          posting: "",
          currentCv: cvToText(cv),
          currentCl: clToText(cl),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const next = applyRewrite(cv, cl, {
        cvText: result.cv,
        clText: result.cl,
      });
      onChange(next.cv, next.cl);
      toast.success("Draft rewritten into the template. Read it before you send anything.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rewrite failed");
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    setExporting(true);
    try {
      await exportPacket({
        cv,
        cl,
        format,
        cvName,
        clName,
        folderName,
        inFolder,
      });
      toast.success(
        inFolder
          ? `Folder downloaded as ${folderName}.zip`
          : `${format.toUpperCase()} files downloaded`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">
            {role ? "The packet" : "Master templates"}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            Same layout as the Great CV and CL files. Click a section on the
            page to edit it. {role ? "Build fills this role; export when it reads true." : "Export a clean copy, or use it as the base when you build a packet."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {role && (
            <Button onClick={build} disabled={busy}>
              <Hammer />
              {built ? "Rebuild for this role" : "Build CV & letter"}
            </Button>
          )}
          {role && (
            <Button variant="secondary" onClick={rewrite} disabled={busy}>
              <Sparkles />
              {busy ? "Rewriting…" : "Rewrite with Grok"}
            </Button>
          )}
          <Button variant="outline" onClick={copy}>
            <Copy />
            Copy
          </Button>
        </div>
      </div>

      {role && (
        <p
          className={cn(
            "rounded-[var(--radius-md)] px-4 py-3 text-sm",
            built ? "bg-good/8 text-good" : "bg-bg-subtle text-muted",
          )}
        >
          {built
            ? `Built for ${role.title}${inst ? ` at ${inst.name}` : ""}. Edit any section, then export.`
            : "This is the template. When it looks right, build the CV and letter for this role."}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setKind("cv");
            setSelected("cv.profile");
          }}
          className={cn(
            "h-11 rounded-[var(--radius-sm)] px-4 text-sm",
            kind === "cv" ? "bg-accent text-accent-fg" : "bg-bg-subtle text-muted",
          )}
        >
          CV
        </button>
        <button
          type="button"
          onClick={() => {
            setKind("cl");
            setSelected("cl.body");
          }}
          className={cn(
            "h-11 rounded-[var(--radius-sm)] px-4 text-sm",
            kind === "cl" ? "bg-accent text-accent-fg" : "bg-bg-subtle text-muted",
          )}
        >
          Cover letter
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <div className="order-2 lg:order-1">
          <FieldEditor
            cv={cv}
            cl={cl}
            selected={selected}
            onChange={onChange}
          />
        </div>
        <div className="order-1 overflow-auto rounded-[var(--radius-lg)] bg-bg-subtle p-3 sm:p-5 lg:order-2">
          <div className="paper-zoom mx-auto">
            <PacketPaper
              cv={cv}
              cl={cl}
              kind={kind}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
      </div>

      <section className="rounded-[var(--radius-lg)] bg-bg p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl">Export</h3>
            <p className="mt-1 text-sm text-muted">
              Name the files first. Default is a folder with both the CV and the letter.
            </p>
          </div>
          <div className="flex gap-2">
            {(["docx", "pdf"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFormat(id)}
                className={cn(
                  "h-11 rounded-[var(--radius-sm)] px-4 text-sm uppercase",
                  format === id
                    ? "bg-accent text-accent-fg"
                    : "bg-bg-elevated text-muted shadow-[var(--shadow-border)]",
                )}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
              CV file name
            </span>
            <Input value={cvName} onChange={(e) => setCvName(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
              Letter file name
            </span>
            <Input value={clName} onChange={(e) => setClName(e.target.value)} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
              Folder name
            </span>
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              disabled={!inFolder}
            />
          </label>
        </div>
        <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={inFolder}
            onChange={(e) => setInFolder(e.target.checked)}
            className="mt-1 size-4 accent-[var(--color-accent)]"
          />
          <span className="text-sm leading-relaxed">
            Download CV and letter in a folder
            <span className="mt-0.5 block text-xs text-muted">
              On: one zip that unpacks to a folder. Off: two separate files.
            </span>
          </span>
        </label>
        <Button className="mt-4" onClick={download} disabled={exporting}>
          <Download />
          {exporting
            ? "Building files…"
            : inFolder
              ? `Download ${format.toUpperCase()} folder`
              : `Download ${format.toUpperCase()} files`}
        </Button>
      </section>
    </div>
  );
}

function FieldEditor({
  cv,
  cl,
  selected,
  onChange,
}: {
  cv: CvDoc;
  cl: ClDoc;
  selected: FieldKey;
  onChange: (cv: CvDoc, cl: ClDoc) => void;
}) {
  const setCv = (next: CvDoc) => onChange(next, cl);
  const setCl = (next: ClDoc) => onChange(cv, next);

  let title = "Section";
  let body: React.ReactNode = (
    <p className="text-sm text-muted">Click a block on the page to edit it.</p>
  );

  if (selected === "cv.name") {
    title = "Name";
    body = (
      <Input value={cv.name} onChange={(e) => setCv({ ...cv, name: e.target.value })} />
    );
  } else if (selected === "cv.tagline") {
    title = "Tagline";
    body = (
      <Textarea
        value={cv.tagline}
        onChange={(e) => setCv({ ...cv, tagline: e.target.value })}
        className="min-h-24"
      />
    );
  } else if (selected === "cv.contact") {
    title = "Contact line";
    body = (
      <Textarea
        value={cv.contact}
        onChange={(e) => setCv({ ...cv, contact: e.target.value })}
        className="min-h-24"
      />
    );
  } else if (selected === "cv.profile") {
    title = "Profile";
    body = (
      <Textarea
        value={cv.profile.join("\n\n")}
        onChange={(e) =>
          setCv({
            ...cv,
            profile: e.target.value
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean),
          })
        }
        className="min-h-48"
      />
    );
  } else if (selected.startsWith("cv.edu.")) {
    const i = Number(selected.slice("cv.edu.".length));
    const edu = cv.education[i];
    if (edu) {
      title = "Education";
      body = (
        <div className="space-y-3">
          <Input
            value={edu.degree}
            onChange={(e) => {
              const education = [...cv.education];
              education[i] = { ...edu, degree: e.target.value };
              setCv({ ...cv, education });
            }}
          />
          <Input
            value={edu.dates}
            onChange={(e) => {
              const education = [...cv.education];
              education[i] = { ...edu, dates: e.target.value };
              setCv({ ...cv, education });
            }}
          />
          <Input
            value={edu.school}
            onChange={(e) => {
              const education = [...cv.education];
              education[i] = { ...edu, school: e.target.value };
              setCv({ ...cv, education });
            }}
          />
          <Textarea
            value={(edu.extras ?? []).join("\n")}
            onChange={(e) => {
              const education = [...cv.education];
              education[i] = {
                ...edu,
                extras: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
              };
              setCv({ ...cv, education });
            }}
            className="min-h-24"
          />
        </div>
      );
    }
  } else if (selected.startsWith("cv.job.")) {
    const [, , si, ji] = selected.split(".");
    const section = cv.sections[Number(si)];
    const job = section?.jobs[Number(ji)];
    if (section && job) {
      title = job.title;
      body = (
        <div className="space-y-3">
          <Input
            value={job.title}
            onChange={(e) => patchJob(cv, setCv, Number(si), Number(ji), { title: e.target.value })}
          />
          <Input
            value={job.dates}
            onChange={(e) => patchJob(cv, setCv, Number(si), Number(ji), { dates: e.target.value })}
          />
          <Input
            value={job.org}
            onChange={(e) => patchJob(cv, setCv, Number(si), Number(ji), { org: e.target.value })}
          />
          <Textarea
            value={job.bullets.join("\n\n")}
            onChange={(e) =>
              patchJob(cv, setCv, Number(si), Number(ji), {
                bullets: e.target.value
                  .split(/\n\s*\n/)
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
            className="min-h-48"
          />
        </div>
      );
    }
  } else if (selected.startsWith("cv.note.")) {
    const i = Number(selected.slice("cv.note.".length));
    const section = cv.sections[i];
    if (section) {
      title = "Note";
      body = (
        <Textarea
          value={section.note ?? ""}
          onChange={(e) => {
            const sections = cloneDoc(cv.sections);
            sections[i] = { ...sections[i], note: e.target.value };
            setCv({ ...cv, sections });
          }}
          className="min-h-32"
        />
      );
    }
  } else if (selected === "cv.skills") {
    title = "Skills";
    body = (
      <Textarea
        value={cv.skills.join("\n")}
        onChange={(e) =>
          setCv({
            ...cv,
            skills: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
          })
        }
        className="min-h-48"
      />
    );
  } else if (selected === "cv.certs") {
    title = "Certifications";
    body = (
      <Textarea
        value={cv.certs.join("\n")}
        onChange={(e) =>
          setCv({
            ...cv,
            certs: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
          })
        }
        className="min-h-32"
      />
    );
  } else if (selected === "cv.additional") {
    title = "Additional";
    body = (
      <Textarea
        value={cv.additional}
        onChange={(e) => setCv({ ...cv, additional: e.target.value })}
        className="min-h-24"
      />
    );
  } else if (selected === "cl.name") {
    title = "Name";
    body = (
      <Input value={cl.name} onChange={(e) => setCl({ ...cl, name: e.target.value })} />
    );
  } else if (selected === "cl.contact") {
    title = "Contact line";
    body = (
      <Textarea
        value={cl.contact}
        onChange={(e) => setCl({ ...cl, contact: e.target.value })}
        className="min-h-24"
      />
    );
  } else if (selected === "cl.date") {
    title = "Date";
    body = (
      <Input value={cl.date} onChange={(e) => setCl({ ...cl, date: e.target.value })} />
    );
  } else if (selected === "cl.recipient") {
    title = "Recipient";
    body = (
      <Textarea
        value={cl.recipient.join("\n")}
        onChange={(e) =>
          setCl({
            ...cl,
            recipient: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
          })
        }
        className="min-h-32"
      />
    );
  } else if (selected === "cl.re") {
    title = "Re line";
    body = (
      <Textarea
        value={cl.re}
        onChange={(e) => setCl({ ...cl, re: e.target.value })}
        className="min-h-24"
      />
    );
  } else if (selected === "cl.greeting") {
    title = "Greeting";
    body = (
      <Input value={cl.greeting} onChange={(e) => setCl({ ...cl, greeting: e.target.value })} />
    );
  } else if (selected === "cl.body") {
    title = "Letter body";
    body = (
      <Textarea
        value={cl.body.join("\n\n")}
        onChange={(e) =>
          setCl({
            ...cl,
            body: e.target.value
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean),
          })
        }
        className="min-h-64"
      />
    );
  } else if (selected === "cl.closing") {
    title = "Closing";
    body = (
      <Textarea
        value={cl.closing}
        onChange={(e) => setCl({ ...cl, closing: e.target.value })}
        className="min-h-32"
      />
    );
  } else if (selected === "cl.signoff" || selected === "cl.signature") {
    title = "Sign-off";
    body = (
      <div className="space-y-3">
        <Input value={cl.signoff} onChange={(e) => setCl({ ...cl, signoff: e.target.value })} />
        <Input
          value={cl.signature}
          onChange={(e) => setCl({ ...cl, signature: e.target.value })}
        />
      </div>
    );
  }

  return (
    <aside className="rounded-[var(--radius-lg)] bg-bg-elevated p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">Edit</p>
      <h3 className="mt-1 font-display text-xl leading-snug">{title}</h3>
      <div className="mt-3">{body}</div>
    </aside>
  );
}

function patchJob(
  cv: CvDoc,
  setCv: (cv: CvDoc) => void,
  si: number,
  ji: number,
  patch: Partial<CvDoc["sections"][0]["jobs"][0]>,
) {
  const sections = cloneDoc(cv.sections);
  sections[si].jobs[ji] = { ...sections[si].jobs[ji], ...patch };
  setCv({ ...cv, sections });
}

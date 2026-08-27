import type { ClDoc, CvDoc } from "@/lib/docs";
import { cn } from "@/lib/utils";

export type PaperKind = "cv" | "cl";
export type FieldKey = string;

type PaperProps = {
  cv: CvDoc;
  cl: ClDoc;
  kind: PaperKind;
  selected?: FieldKey;
  onSelect?: (key: FieldKey) => void;
};

function Block({
  k,
  selected,
  onSelect,
  className,
  children,
}: {
  k: FieldKey;
  selected?: FieldKey;
  onSelect?: (key: FieldKey) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const active = selected === k;
  return (
    <button
      type="button"
      data-k={k}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(k);
      }}
      className={cn(
        "block w-full rounded-sm px-1 text-left transition-colors duration-150",
        onSelect && "hover:bg-paper-ink/4",
        active && "bg-paper-ink/6 ring-1 ring-paper-ink/20",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function PacketPaper({ cv, cl, kind, selected, onSelect }: PaperProps) {
  return (
    <article className="paper">
      {kind === "cv" ? (
        <CvPages cv={cv} selected={selected} onSelect={onSelect} />
      ) : (
        <ClPages cl={cl} selected={selected} onSelect={onSelect} />
      )}
    </article>
  );
}

function CvPages({
  cv,
  selected,
  onSelect,
}: {
  cv: CvDoc;
  selected?: FieldKey;
  onSelect?: (key: FieldKey) => void;
}) {
  return (
    <>
      <Block k="cv.name" selected={selected} onSelect={onSelect}>
        <p className="paper-name">{cv.name}</p>
      </Block>
      <Block k="cv.tagline" selected={selected} onSelect={onSelect}>
        <p className="paper-tagline">{cv.tagline}</p>
      </Block>
      <Block k="cv.contact" selected={selected} onSelect={onSelect}>
        <p className="paper-contact">{cv.contact}</p>
      </Block>

      <h3 className="paper-h">PROFILE</h3>
      <Block k="cv.profile" selected={selected} onSelect={onSelect}>
        {cv.profile.map((p) => (
          <p key={p.slice(0, 40)} className="paper-body">
            {p}
          </p>
        ))}
      </Block>

      <h3 className="paper-h">EDUCATION</h3>
      {cv.education.map((edu, i) => (
        <Block key={`${edu.degree}-${i}`} k={`cv.edu.${i}`} selected={selected} onSelect={onSelect}>
          <p className="paper-job">
            <span>{edu.degree}</span>
            <span className="paper-dates">{edu.dates}</span>
          </p>
          <p className="paper-org">{edu.school}</p>
          {edu.extras?.map((x) => (
            <p key={x} className="paper-bullet">
              {x}
            </p>
          ))}
        </Block>
      ))}

      {cv.sections.map((section, si) => (
        <div key={section.heading}>
          <h3 className="paper-h">{section.heading}</h3>
          {section.jobs.map((job, ji) => (
            <Block
              key={`${job.title}-${ji}`}
              k={`cv.job.${si}.${ji}`}
              selected={selected}
              onSelect={onSelect}
            >
              <p className="paper-job">
                <span>{job.title}</span>
                <span className="paper-dates">{job.dates}</span>
              </p>
              <p className="paper-org">{job.org}</p>
              {job.bullets.map((b) => (
                <p key={b.slice(0, 48)} className="paper-bullet">
                  {b}
                </p>
              ))}
            </Block>
          ))}
          {section.note && (
            <Block k={`cv.note.${si}`} selected={selected} onSelect={onSelect}>
              <p className="paper-note">
                {section.heading.startsWith("RESEARCH")
                  ? section.note
                  : `Earlier roles: ${section.note}`}
              </p>
            </Block>
          )}
        </div>
      ))}

      <h3 className="paper-h">{cv.skillsHeading}</h3>
      <Block k="cv.skills" selected={selected} onSelect={onSelect}>
        {cv.skills.map((s) => (
          <p key={s} className="paper-skill">
            {s}
          </p>
        ))}
      </Block>

      <h3 className="paper-h">{cv.certsHeading}</h3>
      <Block k="cv.certs" selected={selected} onSelect={onSelect}>
        {cv.certs.map((c) => (
          <p key={c} className="paper-bullet">
            {c}
          </p>
        ))}
      </Block>

      <h3 className="paper-h">{cv.additionalHeading}</h3>
      <Block k="cv.additional" selected={selected} onSelect={onSelect}>
        <p className="paper-body">{cv.additional}</p>
      </Block>
    </>
  );
}

function ClPages({
  cl,
  selected,
  onSelect,
}: {
  cl: ClDoc;
  selected?: FieldKey;
  onSelect?: (key: FieldKey) => void;
}) {
  return (
    <>
      <Block k="cl.name" selected={selected} onSelect={onSelect}>
        <p className="paper-name">{cl.name}</p>
      </Block>
      <Block k="cl.contact" selected={selected} onSelect={onSelect}>
        <p className="paper-contact">{cl.contact}</p>
      </Block>
      <Block k="cl.date" selected={selected} onSelect={onSelect} className="mt-5">
        <p className="paper-letter">{cl.date}</p>
      </Block>
      <Block k="cl.recipient" selected={selected} onSelect={onSelect} className="mt-3">
        {cl.recipient.map((line) => (
          <p key={line} className="paper-letter">
            {line}
          </p>
        ))}
      </Block>
      <Block k="cl.re" selected={selected} onSelect={onSelect} className="mt-4">
        <p className="paper-letter font-semibold">{cl.re}</p>
      </Block>
      <Block k="cl.greeting" selected={selected} onSelect={onSelect} className="mt-4">
        <p className="paper-letter">{cl.greeting}</p>
      </Block>
      <Block k="cl.body" selected={selected} onSelect={onSelect} className="mt-3">
        {cl.body.map((p) => (
          <p key={p.slice(0, 48)} className="paper-letter paper-indent">
            {p}
          </p>
        ))}
      </Block>
      <Block k="cl.closing" selected={selected} onSelect={onSelect}>
        <p className="paper-letter paper-indent">{cl.closing}</p>
      </Block>
      <Block k="cl.signoff" selected={selected} onSelect={onSelect} className="mt-5">
        <p className="paper-letter">{cl.signoff}</p>
      </Block>
      <Block k="cl.signature" selected={selected} onSelect={onSelect} className="mt-6">
        <p className="paper-letter">{cl.signature}</p>
      </Block>
    </>
  );
}

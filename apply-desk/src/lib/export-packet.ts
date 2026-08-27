import type { ClDoc, CvDoc } from "./docs";
import { safeFilename } from "./docs";

export type ExportFormat = "pdf" | "docx";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function pdfSafe(text: string) {
  return text
    .replace(/[—–]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/·/g, " | ")
    .replace(/•/g, "-")
    .replace(/é/g, "e")
    .replace(/É/g, "E")
    .replace(/ó/g, "o")
    .replace(/á/g, "a")
    .replace(/à/g, "a")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ä/g, "a")
    .replace(/ç/g, "c")
    .replace(/ñ/g, "n")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, " ");
}

type PdfDoc = {
  addPage: () => void;
  setFont: (face: string, style: string) => void;
  setFontSize: (n: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setLineWidth: (n: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  splitTextToSize: (text: string, width: number) => string[];
  text: (text: string | string[], x: number, y: number, opts?: { align?: string }) => void;
  output: (type: "blob") => Blob;
};

async function makePdf(): Promise<PdfDoc> {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ unit: "pt", format: "letter" }) as unknown as PdfDoc;
}

class Writer {
  doc: PdfDoc;
  y = 48;
  margin = 54;
  width = 612 - 108;
  pageH = 792;

  constructor(doc: PdfDoc) {
    this.doc = doc;
  }

  ensure(h: number) {
    if (this.y + h > this.pageH - 48) {
      this.doc.addPage();
      this.y = 48;
    }
  }

  gap(n: number) {
    this.y += n;
  }

  text(
    value: string,
    opts: {
      size: number;
      bold?: boolean;
      italic?: boolean;
      color?: [number, number, number];
      align?: "left" | "center";
      after?: number;
    },
  ) {
    const text = pdfSafe(value);
    if (!text) {
      this.y += opts.after ?? 0;
      return;
    }
    this.doc.setFont("times", opts.bold ? "bold" : opts.italic ? "italic" : "normal");
    this.doc.setFontSize(opts.size);
    const [r, g, b] = opts.color ?? [26, 26, 26];
    this.doc.setTextColor(r, g, b);
    const lines = this.doc.splitTextToSize(text, this.width);
    const lineH = opts.size + 3;
    this.ensure(lines.length * lineH);
    for (const line of lines) {
      const x =
        opts.align === "center" ? this.margin + this.width / 2 : this.margin;
      this.doc.text(line, x, this.y, opts.align === "center" ? { align: "center" } : undefined);
      this.y += lineH;
    }
    this.y += opts.after ?? 1;
  }

  splitRow(left: string, right: string, size: number, bold = true) {
    this.doc.setFont("times", bold ? "bold" : "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(26, 26, 26);
    const rightW = this.doc.splitTextToSize(pdfSafe(right), 140)[0]?.length
      ? this.doc.splitTextToSize(pdfSafe(right), 160)
      : [pdfSafe(right)];
    const leftLines = this.doc.splitTextToSize(pdfSafe(left), this.width - 150);
    this.ensure(Math.max(leftLines.length, 1) * (size + 3));
    const y0 = this.y;
    this.doc.text(pdfSafe(right), this.margin + this.width, y0, { align: "right" });
    for (const line of leftLines) {
      this.doc.text(line, this.margin, this.y);
      this.y += size + 3;
    }
    this.y = Math.max(this.y, y0 + size + 3) + 1;
    void rightW;
  }

  heading(label: string) {
    this.gap(8);
    this.doc.setFont("times", "bold");
    this.doc.setFontSize(9);
    this.doc.setTextColor(26, 26, 26);
    this.ensure(16);
    this.doc.text(pdfSafe(label), this.margin, this.y);
    this.y += 4;
    this.doc.setDrawColor(26, 26, 26);
    this.doc.setLineWidth(0.6);
    this.doc.line(this.margin, this.y, this.margin + this.width, this.y);
    this.y += 12;
  }

  bullet(value: string) {
    const size = 10;
    this.doc.setFont("times", "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(26, 26, 26);
    const lines = this.doc.splitTextToSize(pdfSafe(value), this.width - 14);
    this.ensure(lines.length * (size + 2) + 2);
    this.doc.text("•", this.margin + 2, this.y);
    for (const line of lines) {
      this.doc.text(line, this.margin + 12, this.y);
      this.y += size + 2;
    }
    this.y += 2;
  }
}

export async function cvToPdf(cv: CvDoc): Promise<Blob> {
  const doc = await makePdf();
  const w = new Writer(doc);
  w.text(cv.name, { size: 18, bold: true, after: 2 });
  w.text(cv.tagline, { size: 9.5, italic: true, color: [98, 98, 98], after: 1 });
  w.text(cv.contact, { size: 9, color: [98, 98, 98], after: 6 });
  w.heading("PROFILE");
  for (const p of cv.profile) w.text(p, { size: 10, after: 6 });
  w.heading("EDUCATION");
  for (const e of cv.education) {
    w.splitRow(e.degree, e.dates, 11);
    w.text(e.school, { size: 9.5, italic: true, color: [98, 98, 98], after: 2 });
    for (const extra of e.extras ?? []) w.bullet(extra);
    w.gap(4);
  }
  for (const section of cv.sections) {
    w.heading(section.heading);
    for (const job of section.jobs) {
      w.splitRow(job.title, job.dates, 11);
      w.text(job.org, { size: 9.5, italic: true, color: [98, 98, 98], after: 3 });
      for (const b of job.bullets) w.bullet(b);
      w.gap(4);
    }
    if (section.note) {
      w.text(
        section.heading === "RESEARCH & SCHOLARLY ENGAGEMENT"
          ? section.note
          : `Earlier roles: ${section.note}`,
        { size: 10, italic: true, after: 4 },
      );
    }
  }
  w.heading(cv.skillsHeading);
  for (const s of cv.skills) w.text(s, { size: 9.5, after: 1 });
  w.heading(cv.certsHeading);
  for (const c of cv.certs) w.bullet(c);
  w.heading(cv.additionalHeading);
  w.text(cv.additional, { size: 10, after: 0 });
  return doc.output("blob");
}

export async function clToPdf(cl: ClDoc): Promise<Blob> {
  const doc = await makePdf();
  const w = new Writer(doc);
  w.text(cl.name, { size: 20, bold: true, after: 2 });
  w.text(cl.contact, { size: 9, color: [95, 95, 95], after: 12 });
  w.text(cl.date, { size: 11, after: 10 });
  for (const line of cl.recipient) w.text(line, { size: 11, after: 1 });
  w.gap(8);
  w.text(cl.re, { size: 11, bold: true, after: 10 });
  w.text(cl.greeting, { size: 11, after: 8 });
  for (const p of cl.body) w.text(p, { size: 11, after: 8 });
  w.text(cl.closing, { size: 11, after: 14 });
  w.text(cl.signoff, { size: 11, after: 14 });
  w.text(cl.signature, { size: 11, after: 0 });
  return doc.output("blob");
}

async function cvToDocx(cv: CvDoc): Promise<Blob> {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    Packer,
    Paragraph,
    Tab,
    TabStopPosition,
    TabStopType,
    TextRun,
  } = await import("docx");

  const ink = "1A1A1A";
  const muted = "626262";
  const rule = {
    border: {
      bottom: { color: ink, space: 1, style: BorderStyle.SINGLE, size: 6 },
    },
  };

  const heading = (text: string) =>
    new Paragraph({
      spacing: { before: 200, after: 80 },
      ...rule,
      children: [
        new TextRun({
          text,
          bold: true,
          size: 17,
          font: "Cambria",
          color: ink,
        }),
      ],
    });

  const body = (text: string, extra?: { italics?: boolean; size?: number; color?: string; before?: number }) =>
    new Paragraph({
      spacing: { after: 80, before: extra?.before ?? 0 },
      children: [
        new TextRun({
          text,
          italics: extra?.italics,
          size: extra?.size ?? 20,
          font: "Cambria",
          color: extra?.color ?? ink,
        }),
      ],
    });

  const split = (left: string, right: string) =>
    new Paragraph({
      spacing: { before: 80, after: 0 },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      children: [
        new TextRun({ text: left, bold: true, size: 22, font: "Cambria", color: ink }),
        new TextRun({ children: [new Tab()], font: "Cambria" }),
        new TextRun({ text: right, size: 19, font: "Cambria", color: muted }),
      ],
    });

  const bullet = (text: string) =>
    new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { after: 40 },
      children: [new TextRun({ text, size: 20, font: "Cambria", color: ink })],
    });

  const children = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({ text: cv.name, size: 36, font: "Cambria", color: ink })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: cv.tagline,
          italics: true,
          size: 19,
          font: "Cambria",
          color: muted,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 160 },
      children: [new TextRun({ text: cv.contact, size: 18, font: "Cambria", color: muted })],
    }),
    heading("PROFILE"),
    ...cv.profile.map((p) => body(p)),
    heading("EDUCATION"),
    ...cv.education.flatMap((e) => [
      split(e.degree, e.dates),
      body(e.school, { italics: true, size: 19, color: muted }),
      ...(e.extras ?? []).map((x) => bullet(x)),
    ]),
    ...cv.sections.flatMap((section) => [
      heading(section.heading),
      ...section.jobs.flatMap((job) => [
        split(job.title, job.dates),
        body(job.org, { italics: true, size: 19, color: muted }),
        ...job.bullets.map((b) => bullet(b)),
      ]),
      ...(section.note
        ? [
            body(
              section.heading.startsWith("RESEARCH")
                ? section.note
                : `Earlier roles: ${section.note}`,
              { italics: true, size: 20 },
            ),
          ]
        : []),
    ]),
    heading(cv.skillsHeading),
    ...cv.skills.map((s) => body(s, { size: 19 })),
    heading(cv.certsHeading),
    ...cv.certs.map((c) => bullet(c)),
    heading(cv.additionalHeading),
    body(cv.additional, { size: 20 }),
  ];

  const document = new Document({
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: "bullet",
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 220, hanging: 140 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(document);
}

async function clToDocx(cl: ClDoc): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");
  const ink = "1A1A1A";
  const muted = "5F5F5F";
  const p = (text: string, extra?: { bold?: boolean; size?: number; color?: string; after?: number; before?: number }) =>
    new Paragraph({
      spacing: { after: extra?.after ?? 120, before: extra?.before ?? 0 },
      children: [
        new TextRun({
          text,
          bold: extra?.bold,
          size: extra?.size ?? 21,
          font: "Cambria",
          color: extra?.color ?? ink,
        }),
      ],
    });

  const document = new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 864, right: 864 } },
        },
        children: [
          p(cl.name, { size: 40, after: 40 }),
          p(cl.contact, { size: 18, color: muted, after: 280 }),
          p(cl.date, { after: 200 }),
          ...cl.recipient.map((line, i) =>
            p(line, { after: i === cl.recipient.length - 1 ? 200 : 0 }),
          ),
          p(cl.re, { bold: true, after: 200 }),
          p(cl.greeting, { after: 200 }),
          ...cl.body.map((para) => p(para, { after: 200 })),
          p(cl.closing, { after: 280 }),
          p(cl.signoff, { after: 280 }),
          p(cl.signature, { after: 0 }),
        ],
      },
    ],
  });
  return Packer.toBlob(document);
}

export async function blobFor(
  kind: "cv" | "cl",
  format: ExportFormat,
  cv: CvDoc,
  cl: ClDoc,
): Promise<Blob> {
  if (kind === "cv") return format === "pdf" ? cvToPdf(cv) : cvToDocx(cv);
  return format === "pdf" ? clToPdf(cl) : clToDocx(cl);
}

export async function exportPacket(opts: {
  cv: CvDoc;
  cl: ClDoc;
  format: ExportFormat;
  cvName: string;
  clName: string;
  folderName: string;
  inFolder: boolean;
}) {
  const ext = opts.format;
  const cvFile = `${safeFilename(opts.cvName)}.${ext}`;
  const clFile = `${safeFilename(opts.clName)}.${ext}`;
  const cvBlob = await blobFor("cv", opts.format, opts.cv, opts.cl);
  const clBlob = await blobFor("cl", opts.format, opts.cv, opts.cl);

  if (opts.inFolder) {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const folder = zip.folder(safeFilename(opts.folderName)) ?? zip;
    folder.file(cvFile, cvBlob);
    folder.file(clFile, clBlob);
    const packed = await zip.generateAsync({ type: "blob" });
    saveBlob(packed, `${safeFilename(opts.folderName)}.zip`);
    return;
  }

  saveBlob(cvBlob, cvFile);
  await new Promise((r) => setTimeout(r, 400));
  saveBlob(clBlob, clFile);
}

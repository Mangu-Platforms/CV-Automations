import { createServerFn } from "@tanstack/react-start";
import { CORPUS_TEXT } from "./profile";

type TailorInput = {
  title: string;
  institution: string;
  family: string;
  variant: string;
  angle: string;
  gaps: string[];
  posting: string;
  currentCv: string;
  currentCl: string;
  mode: "packet" | "score-posting";
};

export type TailorResult =
  | {
      ok: true;
      cv: string;
      cl: string;
      title: string;
      institution: string;
      family: string;
      variant: string;
      fitLabel: string;
      gaps: string[];
      angle: string;
      recommend: boolean;
      inScope: boolean;
      reasons: string[];
    }
  | { ok: false; error: string };

function emptySuccess(): Extract<TailorResult, { ok: true }> {
  return {
    ok: true,
    cv: "",
    cl: "",
    title: "",
    institution: "",
    family: "",
    variant: "",
    fitLabel: "",
    gaps: [],
    angle: "",
    recommend: false,
    inScope: false,
    reasons: [],
  };
}

export const tailorPacket = createServerFn({ method: "POST" })
  .validator((input: TailorInput) => input)
  .handler(async ({ data }): Promise<TailorResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "AI is not available in this environment." };
    }

    const system = `You are the packet drafter for Max Mihir Oza's higher-ed staff job search. Operator: Renee.

HARD RULES:
- Never invent employers, titles, dates, degrees, systems, or numbers.
- Use ONLY facts in the corpus below.
- Name every gap the operator listed. Do not hedge.
- One-page CV. One-page letter. ATS-sane. No tables, no text boxes.
- Drafting is for human review. Never tell anyone to auto-submit.
- Voice: direct, specific, analogue-not-title.

CORPUS:
${CORPUS_TEXT}`;

    const user =
      data.mode === "score-posting"
        ? `Score this posting against the locked staff/admin search (admissions, academic ops, budget/finance; N/C NJ + remote; no faculty, no adjunct unless noted, no AVP+).

Return JSON only:
{
  "title": "",
  "institution": "",
  "family": "admissions|academic-ops|budget|registrar|student-services|advising|faculty|adjunct|other",
  "inScope": true,
  "variant": "admissions|ops|budget",
  "fitLabel": "strong|moderate|long-shot",
  "gaps": [],
  "angle": "",
  "recommend": true,
  "reasons": []
}

POSTING:
${data.posting}`
        : `Rewrite the CV and cover letter for this role. Keep facts inside the corpus. Take the given angle. Name the gaps.

Role: ${data.title} at ${data.institution}
Family: ${data.family}
Variant: ${data.variant}
Angle: ${data.angle}
Gaps: ${data.gaps.join("; ")}
${data.posting ? `\nPosting notes:\n${data.posting}` : ""}

Current CV (may be empty):
${data.currentCv}

Current letter (may be empty):
${data.currentCl}

Return JSON only:
{ "cv": "...", "cl": "..." }`;

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 2200,
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `xAI API error ${res.status}` };
    }

    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const text = body.choices[0]?.message.content ?? "";
    const json = extractJson(text);
    if (!json) {
      return { ok: false, error: "The model did not return usable JSON." };
    }

    const success = emptySuccess();
    if (data.mode === "packet") {
      success.cv = asString(json.cv);
      success.cl = asString(json.cl);
    } else {
      success.title = asString(json.title);
      success.institution = asString(json.institution);
      success.family = asString(json.family);
      success.variant = asString(json.variant);
      success.fitLabel = asString(json.fitLabel);
      success.gaps = asStringArray(json.gaps);
      success.angle = asString(json.angle);
      success.recommend = Boolean(json.recommend);
      success.inScope = Boolean(json.inScope);
      success.reasons = asStringArray(json.reasons);
    }
    return success;
  });

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function extractJson(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

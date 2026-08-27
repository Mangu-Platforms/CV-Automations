# Apply Desk

The walkthrough tool for this materials library. One packet at a time. **Never auto-submit.**

The running app is hosted in Grok. This folder is the product source so agents and humans can read the same catalog, corpus, scoring, and portal fill sheet across workstations.

## Walk

`Role → Fit → Packet → Checklist → Portal → Submit`

1. Confirm the posting and the GitHub Word originals.
2. Read the rubric score and the gaps the letter must name.
3. Build the CV and letter in the Great-template layout. Export Word or PDF. Rewrite with Grok only from the corpus.
4. Human checklist, including ATS-specific gates (PageUp, Workday, PeopleAdmin).
5. Copy portal fields from the fill sheet. Do not invent work authorization, supervisors, or EEO answers.
6. Open the ATS yourself. Mark submitted on the desk only after you attested.

## Source map

| Path | What it is |
|---|---|
| `src/lib/catalog.ts` | Indexed packets (Aug 25 NJ staff + SHU v1–v4) |
| `src/lib/profile.ts` | Locked fit profile and corpus text |
| `src/lib/docs.ts` | Master CV / letter structure (Great templates) |
| `src/lib/score.ts` | Rubric scorer |
| `src/lib/ats.ts` | Portal fill sheet — copy-paste, never send |
| `src/lib/packet.ts` | Submission checklist |
| `src/routes/apply.$id.tsx` | The one-at-a-time walk |

## Rules (same as root `AGENTS.md`)

- Never auto-submit.
- Never invent employers, titles, dates, degrees, systems, or numbers.
- Name every gap in the letter.
- Staff / administrative only unless Renee overrides.

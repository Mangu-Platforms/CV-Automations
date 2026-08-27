# CV-Automations — agent map

This repository is a **materials library and tracker** for Max Mihir Oza's higher-ed staff job search. Operator: **Renee**. It is not primarily a code repo. GitHub is the cross-workstation store until SharePoint is decided.

If you are an agent: **read this file, then `knowledge/INDEX.md`, then `fit-profile.md` and `rubric.md`, then `knowledge/corpus.md`.** Do not invent a parallel process.

## Non-negotiable rules

1. **Never auto-submit an application.** ATS attestation is a human act.
2. **Never invent** employers, titles, dates, degrees, systems, numbers, or credentials. Every claim must trace to `knowledge/corpus.md` (and the master CV once it is filed under `materials/master/`).
3. **Name gaps in the letter.** Do not hedge. Do not claim Slate, Banner, Cognos, Unimarket, or Formstack.
4. **Staff / administrative only** for the live search (FT and PT). Adjunct is deferred. No full-time faculty. No director-and-above unless assistant/associate director.
5. **Draft after approval.** Discovery produces a tailoring brief. Packets are written when the operator says yes.
6. **Do not scrape walled portals** (PageUp, PeopleAdmin, Workday, NEOGOV). Use sanctioned alert/RSS channels. Weekly human sweep of SHU, Rutgers, CCM, NJIT.

## Read order

| File | Why |
|---|---|
| `knowledge/INDEX.md` | Map of every packet and which folder it lives in today |
| `knowledge/LAYOUT.md` | Target folder layout (do not mass-move binaries unless asked) |
| `knowledge/corpus.md` | Facts you may use |
| `fit-profile.md` | Hard filters and locked decisions (Aug 19, 2026) |
| `rubric.md` | 0–100 scoring after filters |
| `job-search-automation-design_1.md` | Architecture: alerts in, judgment in the middle, files out |

## Where things are *today* (legacy dump)

Do not rename these until a dedicated migrate pass. Agents should **index**, not shuffle.

| Path | What it is |
|---|---|
| `1 - Aug 25 apps/` | 37 NJ staff packets (CV + CL Word pairs) + `progress.json` + `Roles-Apply.xlsx` |
| `SetonHall-Apps-v1` … `v4/` | Numbered SHU packets: Resume, Cover Letter, `Fit Note.md` |
| `Great CV and CL templates/` | Master Word templates |
| `Cv Max Oza.docx` / `Cl Max Oza.docx` | Root copies of the master pair (also inside Aug 25) |
| `Roles-shu.xlsx` | SHU tracker spreadsheet |
| `job-search-automation-design_1.md` | Design doc (duplicate `_2` is identical — ignore `_2`) |
| `job-search-workflow_1.mermaid` | Architecture diagram (duplicate `_2` — ignore `_2`) |
| `transcript.pdf` / `PDF document.pdf` | Credentials — **PII; do not paste into public apps** |
| `Senior Budget Analyst-South .textClipping` | macOS clipping of a posting snapshot |

## Packet convention (going forward)

```
applications/<yyyy-mm>-<inst-slug>/<nn>-<role-slug>/
  Fit Note.md
  Resume - Max Oza - <Role>.docx
  Cover Letter - Max Oza - <Role>.docx
```

`Fit Note.md` schema (already used at SHU):

```
# <nn> — <Title> (Job No. <id>)
**URL:**
**Fit:** Strong | Moderate | Long shot
**Hard requirements Max does not meet:**
**Angle taken:**
**Recommend applying:** Yes | No | Only if casting wide
```

## Three CV variants

Equal weight. Pick one per posting; do not invent a fourth unless the operator asks.

- **admissions** — recruitment, enrollment ops, CRM, events, yield
- **ops** — course scheduling, vendor payments, honoraria, adjunct hiring support, accreditation
- **budget** — budget development, variance, forecasting, position budgeting, monthly close, dashboards

## Status lifecycle

`discovered → digested → approved → drafting → ready_for_review → submitted → interview | rejected | ghosted`

Also: `watchlist`, `dismissed`, `expired`, `archived` (failed hard filters).

## Tooling that already exists

- **Apply Desk** (Grok app): one-at-a-time walkthrough of each packet — role, fit, CV/CL, checklist, mark submitted.
- **Phase 2:** alert parser + daily digest (HigherEdJobs, Chronicle, HERC).
- **Phase 3:** Azure AI Foundry agents + browser-assisted ATS fill. Still never auto-submit. SharePoint as file home once chosen.

## If you are generating a packet

1. Confirm the posting passes `fit-profile.md` hard filters.
2. Score with `rubric.md`. Attach salary, deadline, variant, angle.
3. Wait for operator approval unless they already asked you to draft this role.
4. Write one-page CV + one-page letter from `knowledge/corpus.md`.
5. Drop files in the packet folder with a `Fit Note.md`.
6. Do not apply.

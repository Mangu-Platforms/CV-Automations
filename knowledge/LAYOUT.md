# Target layout

Do **not** mass-move the existing Word files in a casual commit. Index first (this branch). Migrate in a dedicated pass with a script and a checked tree.

```
AGENTS.md
README.md
fit-profile.md
rubric.md
knowledge/
  INDEX.md
  LAYOUT.md
  corpus.md
  phases.md
apply-desk/          ← walkthrough tool source (not the Word packets)
materials/
  master/          ← Cv Max Oza.docx, Cl Max Oza.docx, transcript (private)
  templates/       ← Great CV and CL templates
  variants/
    admissions/
    ops/
    budget/
applications/
  2026-08-shu/<nn>-<slug>/
  2026-08-nj-staff/<slug>/
tracker/
  progress.json
  roles.csv
docs/
  job-search-automation-design.md
  job-search-workflow.mermaid
snapshots/         ← full text of pursued postings (they vanish)
```

Until migrate: treat `1 - Aug 25 apps/` and `SetonHall-Apps-v*` as the live `applications/` tree.

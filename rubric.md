# Scoring Rubric — v1 (Aug 19, 2026)

Applies **after** hard filters (fit-profile.md). Scoring ranks and annotates; it never silently discards. 0–100.

## Dimensions and weights

| Dimension | Weight | Scoring guidance |
|---|---|---|
| **Skills & systems overlap** | 30 | Named systems from the profile (Slate, Banner, Cognos, Unimarket, Formstack) or their obvious equivalents (Workday Student, PeopleSoft, Colleague) appearing in the posting = strong points; duty-level overlap with the three package archetypes = the rest. Quote the overlapping phrases in `score_reasons` |
| **Role-archetype match** | 25 | How closely the posting matches one of the three package archetypes (admissions/enrollment · academic ops · budget/finance) — equal credit across the three per locked decision; adjacent families (registrar, advising, student services, bursar) cap at ~18/25 |
| **Salary band** | 15 | Against the three SHU benchmarks ($47–57K admissions · $52–71K ops · assume ~$65–85K analyst): midpoint ≥ benchmark midpoint = full; below benchmark floor = low; **missing salary in an NJ posting = 5/15 + `salary-missing` flag** (it's legally required — absence is itself signal) |
| **Institution tier & familiarity** | 10 | Tier 1 = 10 · Tier 2 = 7 · Tier 3 = 4; +bonus note (not points) if SHU — existing tailored materials cut drafting time |
| **Commute / modality** | 10 | ≤30 min or fully remote = 10 · 30–60 min = 6 · hybrid-with-long-commute = 4. (Uses home ZIP — TODO in profile; until set, score modality only and flag) |
| **Career trajectory** | 10 | Level appropriate (coordinator → assistant director band) = 10; lateral-but-broadening = 7; below current level = 3 unless institution is Tier 1 |

**Red-flag deductions (annotate, don't hide):** repost of a previously seen search (−5, note why it might be *good* — failed search can mean a lower bar) · pooled/evergreen posting (−10) · NJ Civil Service classified title (−5, different application channel — note it) · "internal candidate identified" signals (−15) · deadline <72h from digest time (−0 but mark **URGENT**).

## Tiers → routing

| Score | Tier | Routing |
|---|---|---|
| ≥ 80 | **Top** | Digest top section + **phone push** + tailoring brief (variant, angle, salary, deadline) |
| 50–79 | Digest | Ranked line in daily digest (salary · deadline · family · one-line why) |
| < 50 but passed hard filters | Logged | Tracker only; appears in Sunday weekly rollup table |
| Failed hard filters | Archived | Tracker `archived`, no surfacing |

Digest hard cap 15 items/day; overflow (lowest scores first) rolls to Sunday.

## Feedback loop

Renee's ratings ("worth seeing" / "why did this surface" / approve / dismiss) are logged per item. Sunday review reports precision (% of digest items rated worth seeing) and proposes **one** rubric change per week at most (a weight tweak, a hard-filter tightening, a mute). Rubric edits are made to this file with a dated changelog line below. Target: ≥60% precision by end of pilot; escalation rule (draft-ahead for top tier) triggers only at ≥70% approval of top-tier items for 3 consecutive weeks.

## Changelog

- **v1 — Aug 19, 2026:** initial rubric from design doc + locked decisions (equal family weighting; no salary floor; adjunct deferred).

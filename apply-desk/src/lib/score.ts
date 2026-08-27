import { getInstitution } from "./institutions";
import type { Role, ScoreBreakdown } from "./types";

const ARCHETYPE = new Set(["admissions", "academic-ops", "budget"]);
const ADJACENT = new Set(["registrar", "student-services", "advising"]);

export function scoreRole(role: Role): ScoreBreakdown {
  const inst = getInstitution(role.institutionId);
  const reasons: string[] = [];
  const flags: string[] = [];

  let skills = 12;
  if (role.gaps.some((g) => /slate|banner|cognos|unimarket|formstack/i.test(g))) {
    skills = 16;
    reasons.push("Posting names systems in the profile gap list — overlap is duty-level, not tool-level.");
  } else {
    skills = 20;
    reasons.push("Duty-level overlap with an attested analogue, without a named-system miss.");
  }
  if (role.fitLabel === "strong") skills = Math.min(30, skills + 8);
  if (role.fitLabel === "long-shot") skills = Math.max(6, skills - 8);

  let archetype = 8;
  if (ARCHETYPE.has(role.family)) {
    archetype = 22;
    reasons.push(`Matches a locked family: ${role.family}.`);
  } else if (ADJACENT.has(role.family)) {
    archetype = 16;
    reasons.push(`Adjacent family (${role.family}) — cap below the three archetypes.`);
  } else {
    archetype = 6;
    flags.push("family-weak");
  }

  let salary = 5;
  if (role.salaryMin != null && role.salaryMax != null) {
    const mid = (role.salaryMin + role.salaryMax) / 2;
    const bench =
      role.family === "budget" ? 75000 : role.family === "admissions" ? 52000 : 61500;
    salary = mid >= bench ? 15 : mid >= bench * 0.85 ? 11 : 7;
  } else {
    flags.push("salary-missing");
    salary = 5;
  }

  const institution = inst.tier === 1 ? 10 : inst.tier === 2 ? 7 : 4;
  if (role.institutionId === "shu") {
    reasons.push("SHU — existing tailored materials cut drafting time.");
  }

  const commute = role.modality === "remote" ? 10 : 6;

  let trajectory = 7;
  if (role.positionType === "exec" || role.positionType === "faculty") {
    trajectory = 3;
    flags.push("level-high");
  } else if (
    /assistant director|associate director|coordinator|analyst|counselor|advisor|coach|specialist|buyer/i.test(
      role.title,
    )
  ) {
    trajectory = 10;
  } else if (/assistant to|admin asst|staff accountant/i.test(role.title)) {
    trajectory = 6;
    flags.push("level-low");
  }

  let deductions = 0;
  if (!role.inScope) {
    deductions += 15;
    flags.push("out-of-scope");
  }
  if (role.positionType === "adjunct") {
    deductions += 10;
    flags.push("adjunct-deferred");
  }

  const total = Math.max(
    0,
    Math.min(100, skills + archetype + salary + institution + commute + trajectory - deductions),
  );

  return {
    total,
    skills,
    archetype,
    salary,
    institution,
    commute,
    trajectory,
    deductions,
    reasons,
    flags,
  };
}

export function scoreBand(total: number): "top" | "digest" | "logged" {
  if (total >= 80) return "top";
  if (total >= 50) return "digest";
  return "logged";
}

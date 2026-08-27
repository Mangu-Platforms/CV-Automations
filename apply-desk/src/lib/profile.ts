export const CANDIDATE = {
  name: "Max Mihir Oza",
  operator: "Renee",
  target:
    "Higher-ed staff and administrative roles in North/Central New Jersey, plus fully remote U.S. higher-ed roles.",
  degrees: [
    "Ph.D. in Higher Education Leadership, Management and Policy — Seton Hall University, enrolled Fall 2026",
    "MBA — Organizational Management, Eastern University, expected Fall 2026, GPA 3.87; concentrations in HR, AI, Sustainable Development",
    "B.S. Business Administration / Marketing — Drexel University, 2010",
  ],
  families: [
    "Admissions / enrollment",
    "Academic operations",
    "Budget / finance",
  ] as const,
  systemsHave: [
    "Salesforce",
    "Microsoft Dynamics 365",
    "SAP",
    "Microsoft 365 / SharePoint / Excel / Teams",
    "Canvas / Brightspace LMS administration",
    "KPI dashboards and reporting (Power BI, Tableau)",
    "CRM / ERP administration",
    "Workflow, form, and intake automation",
    "Records and document infrastructure",
    "Maximo",
    "Active Directory",
  ],
  systemsGap: [
    "Technolutions Slate",
    "Ellucian Banner / Banner Finance",
    "Cognos",
    "Unimarket",
    "Formstack",
  ],
  experience: [
    {
      org: "Eastern University — Graduate Assistant, Academic & Course Support (May–Dec 2025)",
      proof:
        "Full course lifecycle for two high-enrollment courses (200+ students/semester): LMS admin, enrollment monitoring, textbook procurement, student-inquiry triage, records, at-risk trend reports.",
    },
    {
      org: "HCL Americas (BD & BMS)",
      proof:
        "Submission/approval automation across 49 business lines; $10M documented annual savings; three cloud migrations and a 10,000-user client migration; centralized KPI dashboards.",
    },
    {
      org: "Interpublic (IPG)",
      proof:
        "600-user Salesforce / Dynamics / Maximo / AD rollout with onboarding, access, training; migrations 75% ahead of schedule.",
    },
    {
      org: "Mangu Publishers",
      proof:
        "Resource-matching platform with 50+ stakeholders and 12 enhancements; records infrastructure retiring 30+ outdated materials, 50% retrieval improvement.",
    },
    {
      org: "Société Générale",
      proof:
        "Federally mandated regulatory reports six weeks early inside a $1.5M budget; scaled a team from 6 to 55 with $800K operational savings.",
    },
    {
      org: "Millennium Systems International — budget committee chair",
      proof:
        "$50M annual budget, quarterly review cadence, vendor commitments, 90% quarterly deliverable completion.",
    },
  ],
  locked: {
    positionTypes: "Staff / administrative only (FT and PT). Adjunct deferred. No full-time faculty. No director-and-above unless assistant/associate director.",
    geography: "North/Central NJ commutable + remote higher-ed anywhere in the US.",
    salaryFloor: "None — salary ranks, it does not filter.",
    drafting: "Approval-gated. Never auto-submit.",
    catholicMission: "Fine. Address affirmatively when the institution is Catholic.",
    shuAffinity: "Incoming SHU doctoral student — use as a familiarity angle at SHU only. Not a substitute for unmet requirements.",
  },
  voice: [
    "Direct. Name gaps in the letter; do not hedge.",
    "Lead with analogue operational proof, not unearned titles.",
    "One page. ATS-sane. No invented employers, dates, systems, or degrees.",
    "Every factual claim must trace to this corpus.",
  ],
};

export const CORPUS_TEXT = `CANDIDATE: ${CANDIDATE.name}
OPERATOR: ${CANDIDATE.operator}
TARGET: ${CANDIDATE.target}

DEGREES:
${CANDIDATE.degrees.map((d) => `- ${d}`).join("\n")}

ATTESTED EXPERIENCE (only these facts may appear):
${CANDIDATE.experience.map((e) => `- ${e.org}: ${e.proof}`).join("\n")}

SYSTEMS HE HAS:
${CANDIDATE.systemsHave.map((s) => `- ${s}`).join("\n")}

SYSTEMS HE DOES NOT HAVE — never claim these; name the gap if the posting requires them. In the letter they may be framed as onboarding tasks, not obstacles, when that is the angle:
${CANDIDATE.systemsGap.map((s) => `- ${s}`).join("\n")}

LOCKED DECISIONS:
- ${CANDIDATE.locked.positionTypes}
- ${CANDIDATE.locked.geography}
- ${CANDIDATE.locked.salaryFloor}
- ${CANDIDATE.locked.drafting}
- Catholic-mission institutions: ${CANDIDATE.locked.catholicMission}
- SHU: ${CANDIDATE.locked.shuAffinity}

VOICE:
${CANDIDATE.voice.map((v) => `- ${v}`).join("\n")}
`;

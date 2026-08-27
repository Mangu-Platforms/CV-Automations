import { displayInstitution } from "./institutions";
import type { Role, Variant } from "./types";

export type JobBlock = {
  title: string;
  dates: string;
  org: string;
  bullets: string[];
};

export type EduBlock = {
  degree: string;
  dates: string;
  school: string;
  extras?: string[];
};

export type CvSection = {
  heading: string;
  jobs: JobBlock[];
  note?: string;
};

export type CvDoc = {
  name: string;
  tagline: string;
  contact: string;
  profile: string[];
  education: EduBlock[];
  sections: CvSection[];
  skillsHeading: string;
  skills: string[];
  certsHeading: string;
  certs: string[];
  additionalHeading: string;
  additional: string;
};

export type ClDoc = {
  name: string;
  contact: string;
  date: string;
  recipient: string[];
  re: string;
  greeting: string;
  body: string[];
  closing: string;
  signoff: string;
  signature: string;
};

export const CANDIDATE_CONTACT = {
  name: "Max Mihir Oza",
  nameCaps: "MAX MIHIR OZA",
  location: "Parsippany, NJ",
  phone: "(201) 247-1371",
  phonePlain: "201 247 1371",
  email: "ozamihir@shu.edu",
  linkedin: "linkedin.com/in/mihir-oza",
};

export const TAGLINE: Record<Variant, string> = {
  ops: "Academic Operations & Higher Education Administration  |  Scholar-Practitioner",
  admissions:
    "Enrollment Operations & Higher Education Administration  |  Scholar-Practitioner",
  budget:
    "Budget, Finance & Higher Education Administration  |  Scholar-Practitioner",
};

const SKILLS_OPS = [
  "Academic Operations & Course Lifecycle Support",
  "LMS & Student Platforms (Canvas, Brightspace, Moodle)",
  "Registration, Enrollment & Student Inquiry Triage",
  "Microsoft 365, SharePoint, Excel, Teams",
  "Procurement, Budget Tracking & Vendor Coordination",
  "Data Analysis & Reporting (Power BI, Tableau)",
  "HR & Staffing Workflows (Hiring, Onboarding, Timekeeping)",
  "CRM / ERP Systems (Salesforce, MS Dynamics 365, SAP)",
  "SOPs, Trackers & Process Documentation",
  "Project Management (Agile, Scrum, Waterfall; PMP in progress)",
  "Confidential & FERPA-Sensitive Records Handling",
  "Event, Open House & Program Coordination",
  "Stakeholder, Faculty & Executive Communication",
  "Applied Institutional Analytics & Research Design",
];

const SKILLS_BUDGET = [
  "Budget Analysis, Financial Planning & Institutional Reporting",
  "Procurement, Budget Tracking & Vendor Coordination",
  "CRM / ERP / Financial Systems (Salesforce, MS Dynamics 365, SAP, Workday Financials)",
  "Data Analysis & Reporting (Power BI, Tableau)",
  "NJ OMB Reporting Contexts, Board-Level Financial Presentation",
  "Microsoft 365, SharePoint, Excel, Teams",
  "SOPs, Trackers & Process Documentation",
  "LMS & Student Data Platforms (Canvas, Brightspace)",
  "Enrollment & Headcount Analysis, Statistical Data Reporting",
  "HR & Staffing Workflows (Hiring, Onboarding, Timekeeping)",
  "Project Management (Agile, Scrum, Waterfall; PMP in progress)",
  "Confidential & FERPA-Sensitive Records Handling",
  "Stakeholder, Faculty & Executive Communication",
  "Applied Institutional Analytics & Research Design",
];

const SKILLS_ADMISSIONS = [
  "Registration, Enrollment & Student Inquiry Triage",
  "CRM / ERP Systems (Salesforce, MS Dynamics 365, SAP)",
  "Event, Open House & Program Coordination",
  "LMS & Student Platforms (Canvas, Brightspace, Moodle)",
  "Microsoft 365, SharePoint, Excel, Teams",
  "Stakeholder, Faculty & Executive Communication",
  "Academic Operations & Course Lifecycle Support",
  "Data Analysis & Reporting (Power BI, Tableau)",
  "SOPs, Trackers & Process Documentation",
  "Confidential & FERPA-Sensitive Records Handling",
  "HR & Staffing Workflows (Hiring, Onboarding, Timekeeping)",
  "Procurement, Budget Tracking & Vendor Coordination",
  "Project Management (Agile, Scrum, Waterfall; PMP in progress)",
  "Applied Institutional Analytics & Research Design",
];

export const SKILLS_FOR: Record<Variant, string[]> = {
  ops: SKILLS_OPS,
  budget: SKILLS_BUDGET,
  admissions: SKILLS_ADMISSIONS,
};

export function cloneDoc<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

export const MASTER_CV: CvDoc = {
  name: CANDIDATE_CONTACT.nameCaps,
  tagline: TAGLINE.ops,
  contact: `${CANDIDATE_CONTACT.location}  ·  ${CANDIDATE_CONTACT.phone}  ·  ${CANDIDATE_CONTACT.email}  ·  ${CANDIDATE_CONTACT.linkedin}`,
  profile: [
    "Higher education professional and incoming Seton Hall doctoral student with 13+ years of progressive experience in operations, program management, procurement, budget oversight, and stakeholder coordination across enterprise, financial, and healthcare environments — now applied to academic department administration. Direct experience supporting the full course lifecycle for high-enrollment courses: LMS administration, enrollment monitoring, records management, textbook procurement, and student-facing inquiry triage for 200+ students per semester. Currently completing an MBA with a 3.87 GPA.",
    "Known for turning informal departmental practice into documented, repeatable process — SOPs, trackers, and reporting that hold up under audit, accreditation review, and staff turnover — while exercising discretion with confidential student, personnel, and financial information. Work is grounded in a core question: how do leadership practices, organizational structures, and operational systems shape an institution’s capacity to serve its students equitably and effectively?",
  ],
  education: [
    {
      degree: "Ph.D. in Higher Education Leadership, Management and Policy",
      dates: "Enrolled Fall 2026",
      school: "Seton Hall University  ·  South Orange, NJ",
    },
    {
      degree: "Master of Business Administration, Organizational Management",
      dates: "Expected Fall 2026",
      school: "Eastern University  ·  St. Davids, PA  ·  GPA: 3.87 / 4.0",
      extras: [
        "Concentrations: Human Resources, Artificial Intelligence, Sustainable Development",
        "Relevant coursework: Organizational Change & Development, Data Analytics for Decision-Making, Technology Strategy, Research Methods in Organizational Studies",
      ],
    },
    {
      degree: "Bachelor of Science in Business Administration, Marketing Concentration",
      dates: "2010",
      school: "Drexel University  ·  Philadelphia, PA",
    },
  ],
  sections: [
    {
      heading: "HIGHER EDUCATION EXPERIENCE",
      jobs: [
        {
          title: "Graduate Assistant — Academic & Course Support",
          dates: "May 2025 – Dec 2025",
          org: "Eastern University  •  St. Davids, PA",
          bullets: [
            "Managed full course lifecycle operations across two high-enrollment courses (200+ students per semester) — LMS administration (Canvas / Brightspace), section setup and enrollment monitoring, textbook and materials procurement, and maintenance of academic records",
            "Served as first point of contact for student inquiries, triaging routine questions on requirements, deadlines, and forms; escalated complex cases to faculty and coordinated referrals to advising and support offices, tracking each item through resolution",
            "Supported assessment design, grading workflows, grade-change documentation, and academic progress monitoring in close collaboration with course faculty",
            "Handled student records and performance data with strict confidentiality; analyzed trends to surface at-risk students and produced formal reports and recommendations that informed targeted instructional interventions",
          ],
        },
      ],
    },
    {
      heading: "OPERATIONS & ADMINISTRATIVE EXPERIENCE",
      jobs: [
        {
          title: "Senior PM & Technical Lead",
          dates: "Jan 2023 – Dec 2025",
          org: "Mangu Publishers  •  Parsippany, NJ",
          bullets: [
            "Led full lifecycle implementation of a resource-matching platform; conducted intake and requirements sessions with 50+ stakeholders, prioritized needs, and delivered 12 enhancements across six cycles",
            "Built standardized knowledge management and records infrastructure — retiring 30+ outdated materials and improving information retrieval efficiency by 50%",
          ],
        },
        {
          title: "Technical Project Manager",
          dates: "2023",
          org: "Interpublic Group of Companies  •  Jersey City, NJ",
          bullets: [
            "Coordinated enterprise system implementations (Salesforce, Microsoft Dynamics 365, Maximo, Active Directory) for 600 users across multiple subsidiary agencies, including onboarding, access provisioning, and end-user training",
            "Delivered platform migration projects 75% ahead of schedule; facilitated monthly executive briefings and maintained status trackers for product, technology, and senior leadership stakeholders",
          ],
        },
        {
          title: "Program Manager",
          dates: "Apr 2021 – Aug 2022",
          org: "HCL Americas (Becton Dickinson & Bristol Myers Squibb)  •  Franklin Lakes, NJ",
          bullets: [
            "Designed and implemented submission and approval automation across 49 business lines, eliminating manual intake processes and generating $10M in documented annual savings",
            "Directed three cloud migration projects and a 10,000-user client migration; established centralized KPI reporting dashboards supporting executive data-informed decision-making",
          ],
        },
        {
          title: "Senior Project Manager",
          dates: "Nov 2019 – Dec 2020",
          org: "Millennium Systems International  •  Parsippany, NJ",
          bullets: [
            "Chaired a $50M annual budget committee overseeing system development — reviewing spend, vendor commitments, and funding priorities; achieved 90% quarterly deliverable completion, enabling key contract wins",
            "Increased development productivity 45% through workflow and tooling optimization; served as Scrum Master across three annual releases",
          ],
        },
        {
          title: "Senior Technical Product Manager",
          dates: "Sep 2017 – Oct 2019",
          org: "Société Générale  •  New York, NY",
          bullets: [
            "Delivered federally mandated regulatory reports six weeks ahead of schedule within a $1.5M budget",
            "Scaled a team from 6 to 55 — managing hiring documentation, onboarding, coverage planning, and timekeeping follow-through — realizing $800K in operational savings",
          ],
        },
      ],
      note: "Technical Project Manager, progressive responsibilities — Mizuho Bank, Jersey City, NJ (2016–2017)  ·  L’Oréal USA, Berkeley Heights, NJ (2015)  ·  Investors Bank, Short Hills, NJ (2013–2015)  ·  Financial Executives International, Morristown, NJ (2011–2013)",
    },
    {
      heading: "RESEARCH & SCHOLARLY ENGAGEMENT",
      jobs: [
        {
          title: "Graduate Research — MBA Program",
          dates: "2024 – Present",
          org: "Eastern University  •  St. Davids, PA",
          bullets: [
            "Conducted applied research on technology adoption and engagement patterns among adult learners within Learning Management System environments; findings informed recommendations on institutional effectiveness and platform optimization",
            "Executed systematic literature reviews on organizational change, digital transformation, and student success frameworks in postsecondary education",
            "Developed data-informed policy recommendations integrating quantitative usage data with qualitative stakeholder analysis to improve support delivery and enrollment outcomes for non-traditional students",
          ],
        },
      ],
      note: "Research interests: academic operations and institutional effectiveness · data-informed decision-making and continuous improvement · non-traditional student persistence and service delivery equity · digital transformation in postsecondary institutions",
    },
  ],
  skillsHeading: "SKILLS & SYSTEMS",
  skills: SKILLS_OPS,
  certsHeading: "CERTIFICATIONS & PROFESSIONAL AFFILIATIONS",
  certs: [
    "Project Management Institute (PMI) — NJ Chapter Member & Volunteer, 2024–Present",
    "Software Engineering Bootcamp — General Assembly, 2025",
    "Goode Education Group — Clean Energy Program Fellow, 2024",
    "Building Science Principles — Building Performance Institute",
  ],
  additionalHeading: "ADDITIONAL",
  additional:
    "Martial Arts — Jeet Kune Do (Fist of Interception Institute), Level 3 student under Vincent Benitez",
};

export const MASTER_CL: ClDoc = {
  name: CANDIDATE_CONTACT.nameCaps,
  contact: `Parsippany, New Jersey  |  ${CANDIDATE_CONTACT.phonePlain}  |  ${CANDIDATE_CONTACT.email}  |  ${CANDIDATE_CONTACT.linkedin}`,
  date: "August 14, 2026",
  recipient: [
    "Search Committee",
    "Office of the Dean, College of Arts and Sciences",
    "Seton Hall University",
    "South Orange, New Jersey",
  ],
  re: "Re: Academic Operations Coordinator, College of Arts and Sciences (Job No. 497377)",
  greeting: "Dear Search Committee,",
  body: [
    "I am pleased to apply for the Academic Operations Coordinator position with the College of Arts and Sciences at Seton Hall University. As I prepare to begin my Ph.D. in Higher Education Leadership, Management and Policy here this fall, I am drawn to the opportunity to support department chairs, faculty, and students through the day-to-day operations that make an academic unit work. The role is especially compelling because academic operations is where institutional intent becomes student experience: a course schedule that opens on time, a registration hold resolved before add/drop closes, a reimbursement processed without a second follow-up, and a student who receives a clear answer rather than another referral.",
    "As a Graduate Assistant at Eastern University, where I am completing an MBA in Organizational Management with a 3.87 GPA, I supported the full lifecycle of two high-enrollment courses serving more than 200 students per semester — LMS administration, enrollment monitoring, textbook procurement, grading and academic progress tracking, and maintenance of student records handled with appropriate confidentiality. I also served as the first point of contact for students navigating requirements, forms, and referrals. In one instance, an adult student could not access a required feature for his economics coursework after the issue had been overlooked. I scheduled a call, reviewed the course and platform context, identified a technical glitch, guided him through the solution, documented the steps, and followed up to ensure he could move forward. That intake-triage-resolve-document-follow-up pattern is precisely what I would bring to student inquiries, registration and advising triage, and faculty support in your departments.",
    "I would also bring more than 13 years of experience running the administrative and financial machinery behind complex organizations. Across roles at Interpublic Group, HCL Americas, Millennium Systems International, Société Générale, and Mangu Publishers, I have chaired a $50 million annual budget committee, tracked spend and vendor documentation against policy, coordinated purchasing and procurement workflows, managed hiring and onboarding as I scaled a team from 6 to 55, and built the trackers, SOPs, and reporting that keep distributed work accountable. At Mangu Publishers I rebuilt a knowledge management infrastructure, retiring more than 30 outdated materials and improving retrieval efficiency by 50 percent — the same discipline that turns scattered departmental practice into documented, repeatable process.",
    "On systems and discretion: I work fluently in Microsoft 365 and SharePoint, have administered enterprise platforms including Salesforce, Microsoft Dynamics 365, and SAP, and have consistently been the person who learns a new institutional system quickly and then teaches it to everyone else — so Banner, Cognos, Unimarket, and Formstack are onboarding tasks, not obstacles. I have handled confidential personnel, financial, and student information throughout my career and understand the care that FERPA-protected records, personnel matters, and escalation practices require. I am equally comfortable preparing materials for open houses, speaker events, and assessment or accreditation documentation, and carrying each item through to completion rather than to handoff.",
    "My interest in higher education centers on how institutions build environments in which students can see a pathway, access meaningful opportunities, and persist toward ambitious goals. Seton Hall’s commitment to servant leadership and to educating the whole student resonates strongly with that focus, and my doctoral study here gives me a standing interest in the College’s operational effectiveness well beyond any single semester. As both an incoming doctoral student and an experienced practitioner, I would be proud to help chairs, faculty, and students spend less time on process and more time on the work that brought them here.",
  ],
  closing:
    "Thank you for your consideration. I would welcome the opportunity to bring my operations experience, systems fluency, student-support orientation, and follow-through to the College of Arts and Sciences.",
  signoff: "Sincerely,",
  signature: CANDIDATE_CONTACT.name,
};

export function todayLong() {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export function fileBase(path?: string) {
  if (!path) return "";
  const name = path.split("/").pop() ?? "";
  return name.replace(/\.docx$/i, "");
}

export function defaultExportNames(role?: Role) {
  if (!role) {
    return {
      cv: "Cv Max Oza",
      cl: "Cl Max Oza",
      folder: "Max Oza packet",
    };
  }
  const inst = displayInstitution(role);
  const stem = `${role.title} - ${inst.short}`;
  const folder = role.githubDir.split("/").pop() || stem;
  return {
    cv: fileBase(role.cvFile) || `CV - ${stem}`,
    cl: fileBase(role.clFile) || `CL - ${stem}`,
    folder,
  };
}

export function safeFilename(name: string) {
  const trimmed = name.trim() || "document";
  return trimmed.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").replace(/\s+/g, " ");
}

export function cvToText(cv: CvDoc) {
  const parts = [
    cv.name,
    cv.tagline,
    cv.contact,
    "",
    "PROFILE",
    ...cv.profile,
    "",
    "EDUCATION",
    ...cv.education.flatMap((e) => [
      `${e.degree}  ${e.dates}`,
      e.school,
      ...(e.extras ?? []),
    ]),
    "",
    ...cv.sections.flatMap((s) => [
      s.heading,
      ...s.jobs.flatMap((j) => [
        `${j.title}  ${j.dates}`,
        j.org,
        ...j.bullets.map((b) => `• ${b}`),
      ]),
      s.note ? `Earlier / notes: ${s.note}` : "",
    ]),
    "",
    cv.skillsHeading,
    ...cv.skills.map((s) => `• ${s}`),
    "",
    cv.certsHeading,
    ...cv.certs.map((s) => `• ${s}`),
    "",
    cv.additionalHeading,
    cv.additional,
  ];
  return parts.filter((p) => p !== undefined).join("\n").trim();
}

export function clToText(cl: ClDoc) {
  return [
    cl.name,
    cl.contact,
    "",
    cl.date,
    ...cl.recipient,
    cl.re,
    "",
    cl.greeting,
    "",
    ...cl.body,
    "",
    cl.closing,
    "",
    cl.signoff,
    cl.signature,
  ].join("\n");
}

function campusLine(role: Role) {
  return role.campus ? ` (${role.campus})` : "";
}

function jobRef(role: Role) {
  return role.jobNo ? ` (Job No. ${role.jobNo})` : "";
}

export function buildPacket(
  role: Role,
  masterCv: CvDoc = MASTER_CV,
  masterCl: ClDoc = MASTER_CL,
): { cv: CvDoc; cl: ClDoc } {
  const inst = displayInstitution(role);
  const cv = cloneDoc(masterCv);
  cv.tagline = TAGLINE[role.variant];
  cv.skills = [...SKILLS_FOR[role.variant]];
  if (role.variant === "budget") {
    cv.certsHeading = "CERTIFICATIONS & AFFILIATIONS";
  }

  const cl = cloneDoc(masterCl);
  cl.date = todayLong();
  cl.recipient = [
    "Search Committee",
    inst.name,
    role.campus ? `${role.campus} campus` : "",
    inst.id === "shu" ? "South Orange, New Jersey" : "",
  ].filter(Boolean);
  cl.re = `Re: ${role.title}${campusLine(role)}${jobRef(role)}`;
  cl.greeting = "Dear Search Committee,";
  cl.body = letterBody(role);
  cl.closing = `Thank you for your consideration. I would welcome the opportunity to bring my operations experience, systems fluency, student-support orientation, and follow-through to ${inst.name}.`;
  return { cv, cl };
}

function letterBody(role: Role): string[] {
  const inst = displayInstitution(role);
  const at = `${role.title} role at ${inst.name}${campusLine(role)}`;
  const shu =
    inst.id === "shu"
      ? ` As I prepare to begin my Ph.D. in Higher Education Leadership, Management and Policy here this fall, I am drawn to the opportunity to contribute to the institution I am joining as a doctoral student.`
      : ` As I prepare to begin my Ph.D. in Higher Education Leadership, Management and Policy at Seton Hall this fall, I am looking for administrative work that sits next to that study — not as a title, as a practice.`;

  const open = `I am pleased to apply for the ${at}.${shu} ${role.angle} The work I care about is where institutional intent becomes student experience: a schedule that opens on time, a hold resolved before add/drop closes, a reimbursement processed without a second follow-up, and a student who receives a clear answer rather than another referral.`;

  const ga =
    "As a Graduate Assistant at Eastern University, where I am completing an MBA in Organizational Management with a 3.87 GPA, I supported the full lifecycle of two high-enrollment courses serving more than 200 students per semester — LMS administration, enrollment monitoring, textbook procurement, grading and academic progress tracking, and maintenance of student records handled with appropriate confidentiality. I also served as the first point of contact for students navigating requirements, forms, and referrals. In one instance, an adult student could not access a required feature for his economics coursework after the issue had been overlooked. I scheduled a call, reviewed the course and platform context, identified a technical glitch, guided him through the solution, documented the steps, and followed up to ensure he could move forward. That intake-triage-resolve-document-follow-up pattern is precisely what I would bring to inquiries, triage, and faculty support in this role.";

  const ops =
    role.variant === "budget"
      ? "I would also bring more than 13 years of experience running the administrative and financial machinery behind complex organizations. Across roles at Interpublic Group, HCL Americas, Millennium Systems International, Société Générale, and Mangu Publishers, I have chaired a $50 million annual budget committee, tracked spend and vendor documentation against policy, coordinated purchasing and procurement workflows, managed hiring and onboarding as I scaled a team from 6 to 55, and built the trackers, SOPs, and reporting that keep distributed work accountable. At HCL I automated intake across 49 business lines with $10 million in documented annual savings; at Société Générale I delivered federally mandated reporting six weeks early inside a $1.5 million budget. That is the analogue I am offering here."
      : "I would also bring more than 13 years of experience running the administrative and financial machinery behind complex organizations. Across roles at Interpublic Group, HCL Americas, Millennium Systems International, Société Générale, and Mangu Publishers, I have chaired a $50 million annual budget committee, tracked spend and vendor documentation against policy, coordinated purchasing and procurement workflows, managed hiring and onboarding as I scaled a team from 6 to 55, and built the trackers, SOPs, and reporting that keep distributed work accountable. At Mangu Publishers I rebuilt a knowledge management infrastructure, retiring more than 30 outdated materials and improving retrieval efficiency by 50 percent — the same discipline that turns scattered departmental practice into documented, repeatable process.";

  const gapBits = role.gaps.map((g) => g.replace(/\.$/, ""));
  const systemsNamed = gapBits.filter((g) =>
    /slate|banner|cognos|unimarket|formstack/i.test(g),
  );
  const otherGaps = gapBits.filter(
    (g) => !/slate|banner|cognos|unimarket|formstack/i.test(g),
  );
  const learn =
    systemsNamed.length > 0
      ? ` I want to be precise about systems: ${systemsNamed.join("; ")}. I have consistently been the person who learns a new institutional platform quickly and then teaches it to everyone else — so those are onboarding tasks, not obstacles.`
      : " I have consistently been the person who learns a new institutional system quickly and then teaches it to everyone else — so Banner, Cognos, Unimarket, and Formstack are onboarding tasks, not obstacles.";
  const named =
    otherGaps.length > 0
      ? ` I also want to be precise about fit. ${otherGaps.join("; ")}. I am applying because the operational analogue is real, not because those gaps are imaginary.`
      : "";

  const systems = `On systems and discretion: I work fluently in Microsoft 365 and SharePoint, have administered enterprise platforms including Salesforce, Microsoft Dynamics 365, and SAP, and handle confidential personnel, financial, and student information with the care that FERPA-protected records, personnel matters, and escalation practices require.${learn}${named} I am equally comfortable preparing materials for open houses, speaker events, and assessment or accreditation documentation, and carrying each item through to completion rather than to handoff.`;

  const catholic =
    inst.id === "shu" || inst.id === "caldwell" || inst.id === "felician"
      ? ` ${inst.name}’s Catholic mission and commitment to educating the whole student is a feature of the work for me, not a footnote.`
      : "";
  const shuClose =
    inst.id === "shu"
      ? " My doctoral study here gives me a standing interest in the university’s operational effectiveness well beyond any single semester. As both an incoming doctoral student and an experienced practitioner, I would be proud to help chairs, faculty, and students spend less time on process and more time on the work that brought them here."
      : " My interest in higher education centers on how institutions build environments in which students can see a pathway, access meaningful opportunities, and persist toward ambitious goals. As both an incoming doctoral student and an experienced practitioner, I would be proud to help this office spend less time on process and more time on the work that brought people here.";

  const close = `My interest in higher education centers on how institutions actually run.${catholic}${shuClose}`;

  return [open, ga, ops, systems, close];
}

export function applyRewrite(
  cv: CvDoc,
  cl: ClDoc,
  patch: {
    tagline?: string;
    profile?: string[];
    re?: string;
    greeting?: string;
    body?: string[];
    closing?: string;
    cvText?: string;
    clText?: string;
  },
): { cv: CvDoc; cl: ClDoc } {
  const nextCv = cloneDoc(cv);
  const nextCl = cloneDoc(cl);
  if (patch.tagline) nextCv.tagline = patch.tagline;
  if (patch.profile?.length) nextCv.profile = patch.profile;
  if (patch.re) nextCl.re = patch.re.startsWith("Re:") ? patch.re : `Re: ${patch.re}`;
  if (patch.greeting) nextCl.greeting = patch.greeting;
  if (patch.body?.length) nextCl.body = patch.body;
  if (patch.closing) nextCl.closing = patch.closing;
  if (!patch.body?.length && patch.clText) {
    const paras = patch.clText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .filter(
        (p) =>
          !/^dear /i.test(p) &&
          !/^sincerely/i.test(p) &&
          !/^max /i.test(p) &&
          !/^re:/i.test(p),
      );
    if (paras.length) nextCl.body = paras;
  }
  return { cv: nextCv, cl: nextCl };
}

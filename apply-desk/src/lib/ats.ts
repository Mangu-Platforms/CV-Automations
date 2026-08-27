import { CANDIDATE_CONTACT, MASTER_CV } from "./docs";
import { displayInstitution } from "./institutions";
import { CANDIDATE } from "./profile";
import type { Role } from "./types";

export type FillField = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  copyable: boolean;
};

export type FillGroup = {
  id: string;
  title: string;
  note?: string;
  fields: FillField[];
};

export function salaryRehearsal(role: Role) {
  if (role.salaryMin && role.salaryMax) {
    return `If asked, use the posted range: $${role.salaryMin.toLocaleString()}–$${role.salaryMax.toLocaleString()}. Do not invent a number.`;
  }
  return "If asked, request the posted range. New Jersey requires salary in the posting. Do not invent a number.";
}

export function atsPlaybook(role: Role) {
  const inst = displayInstitution(role);
  const ats = inst.ats.toLowerCase();
  if (ats.includes("pageup")) {
    return [
      "PageUp often walls bots and private windows. Apply in a normal browser session you are logged into.",
      "Search by job number if the posting is hard to find.",
      "Resume parse is messy — walk every job block against the CV before you attest.",
    ];
  }
  if (ats.includes("workday")) {
    return [
      "Workday will parse the resume, then ask you to confirm each job as structured fields.",
      "Dates, titles, and employers must match the CV. Do not let the parser invent a supervisor.",
      "Leave supervisor name/phone blank unless it is in the corpus.",
    ];
  }
  if (ats.includes("peopleadmin")) {
    return [
      "Upload the CV and letter as separate files. PeopleAdmin rarely keeps a pasted letter.",
      "Unofficial transcript is sometimes required — that file is PII in the GitHub repo; attach it yourself, this desk will not.",
      "EEO survey at the end: decline to self-identify unless Max has already decided.",
    ];
  }
  if (ats.includes("cornerstone")) {
    return [
      "Cornerstone wants structured employment history. Copy each job from this sheet, do not free-type from memory.",
      "Match month/year to the CV. Skip supervisor if not attested.",
    ];
  }
  return [
    "Snapshot the posting first if it might vanish.",
    "Upload the exported CV and letter. Paste answers from this sheet — do not retype from memory.",
    "Stop before the attest/submit button. That click is yours.",
  ];
}

export function fillSheet(role: Role): FillGroup[] {
  const inst = displayInstitution(role);
  const jobs = MASTER_CV.sections.flatMap((section) =>
    section.jobs.map((job) => ({
      id: `job-${job.title}-${job.dates}`,
      label: job.title,
      value: `${job.title}\n${job.org}\n${job.dates}\n${job.bullets.map((b) => `• ${b}`).join("\n")}`,
      hint: job.org,
      copyable: true,
    })),
  );

  const education = MASTER_CV.education.map((edu, i) => ({
    id: `edu-${i}`,
    label: edu.degree,
    value: [edu.degree, edu.school, edu.dates, ...(edu.extras ?? [])].join("\n"),
    hint: edu.dates,
    copyable: true,
  }));

  return [
    {
      id: "identity",
      title: "Identity",
      fields: [
        {
          id: "legal-name",
          label: "Legal name",
          value: CANDIDATE_CONTACT.name,
          copyable: true,
        },
        {
          id: "email",
          label: "Email",
          value: CANDIDATE_CONTACT.email,
          copyable: true,
        },
        {
          id: "phone",
          label: "Phone",
          value: CANDIDATE_CONTACT.phone,
          copyable: true,
        },
        {
          id: "location",
          label: "City, state",
          value: CANDIDATE_CONTACT.location,
          copyable: true,
        },
        {
          id: "linkedin",
          label: "LinkedIn",
          value: `https://${CANDIDATE_CONTACT.linkedin}`,
          copyable: true,
        },
      ],
    },
    {
      id: "role",
      title: "This posting",
      fields: [
        {
          id: "job-title",
          label: "Job title",
          value: role.title,
          copyable: true,
        },
        {
          id: "job-no",
          label: "Job number",
          value: role.jobNo ?? "Not captured — copy from the posting",
          copyable: Boolean(role.jobNo),
        },
        {
          id: "heard",
          label: "How did you hear",
          value: `${inst.name} careers site (${inst.ats})`,
          hint: "Do not claim employee referral unless it is true.",
          copyable: true,
        },
        {
          id: "salary",
          label: "Salary expectation",
          value: salaryRehearsal(role),
          copyable: true,
        },
        {
          id: "commute",
          label: "Location / commute",
          value: CANDIDATE.locked.geography,
          copyable: true,
        },
        {
          id: "why",
          label: "Why this role (essay)",
          value: `${role.angle}\n\nGaps to name: ${role.gaps.join("; ")}`,
          copyable: true,
        },
      ],
    },
    {
      id: "education",
      title: "Education",
      note: "Copy one block per school. Do not add degrees that are not here.",
      fields: education,
    },
    {
      id: "work",
      title: "Employment history",
      note: "Paste in this order. Skip supervisor name/phone — not in the corpus.",
      fields: jobs,
    },
    {
      id: "do-not-invent",
      title: "Leave blank unless Max confirms",
      note: "These are not in the corpus. Inventing them is a hard fail.",
      fields: [
        {
          id: "work-auth",
          label: "Work authorization",
          value: "Not in the corpus. Confirm with Max before the portal.",
          copyable: false,
        },
        {
          id: "supervisor",
          label: "Supervisor name / phone",
          value: "Not attested. Leave blank or 'available upon request'.",
          copyable: false,
        },
        {
          id: "eeo",
          label: "EEO / veteran / disability",
          value: "Decline to self-identify unless Max has already decided.",
          copyable: false,
        },
        {
          id: "refs",
          label: "References",
          value: "Do not volunteer early. Ready only if the portal requires them.",
          copyable: false,
        },
      ],
    },
  ];
}

import { displayInstitution } from "./institutions";
import { buildPacket, clToText, cvToText } from "./docs";
import type { ChecklistItem, Role } from "./types";

export function defaultCv(role: Role) {
  return cvToText(buildPacket(role).cv);
}

export function defaultCl(role: Role) {
  return clToText(buildPacket(role).cl);
}

export function checklistFor(role: Role): ChecklistItem[] {
  const inst = displayInstitution(role);
  const items: ChecklistItem[] = [
    {
      id: "account",
      label: `ATS account exists (${inst.ats})`,
      hint: inst.careersUrl,
    },
    {
      id: "posting",
      label: "Posting is still live — snapshot if it might vanish",
    },
    {
      id: "cv",
      label: "CV is one page, ATS-sane, and matches the letter's claims",
    },
    {
      id: "cl",
      label: "Cover letter names every gap and takes a real angle",
    },
    {
      id: "facts",
      label: "Every fact traces to the master corpus — nothing invented",
    },
    {
      id: "fill-sheet",
      label: "Portal fields copied from the fill sheet — not from memory",
    },
    {
      id: "salary",
      label: "Salary-expectation field rehearsed (use the posted band if asked)",
    },
    {
      id: "supervisor",
      label: "Supervisor name/phone left blank unless attested in the corpus",
    },
    {
      id: "refs",
      label: "References ready if the portal asks (do not volunteer early)",
    },
    {
      id: "submit",
      label: "Submitted by a human — never a bot. Attestation is yours.",
    },
  ];
  const ats = inst.ats.toLowerCase();
  if (ats.includes("pageup")) {
    items.splice(1, 0, {
      id: "pageup",
      label: "PageUp often walls bots — apply in a normal browser session",
    });
  }
  if (ats.includes("workday")) {
    items.splice(1, 0, {
      id: "workday",
      label: "Workday job blocks match the CV dates and titles after parse",
    });
  }
  if (ats.includes("peopleadmin")) {
    items.splice(1, 0, {
      id: "peopleadmin",
      label: "CV and letter uploaded as separate files (not only pasted)",
    });
  }
  if (!role.inScope) {
    items.unshift({
      id: "override",
      label: "Operator override: this role failed a hard filter. Confirm before submitting.",
    });
  }
  return items;
}

export function githubUrl(path: string) {
  return `https://github.com/Mangu-Platforms/CV-Automations/blob/main/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

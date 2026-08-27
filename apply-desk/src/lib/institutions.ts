import type { Institution, Role } from "./types";

export const INSTITUTIONS: Record<string, Institution> = {
  shu: {
    id: "shu",
    name: "Seton Hall University",
    short: "SHU",
    tier: 1,
    ats: "PageUp",
    careersUrl: "https://jobs.shu.edu",
  },
  montclair: {
    id: "montclair",
    name: "Montclair State University",
    short: "Montclair",
    tier: 1,
    ats: "Workday",
    careersUrl:
      "https://montclair.wd1.myworkdayjobs.com/en-US/JobOpportunities",
  },
  ccm: {
    id: "ccm",
    name: "County College of Morris",
    short: "CCM",
    tier: 1,
    ats: "PeopleAdmin",
    careersUrl: "https://jobs.ccm.edu",
  },
  rutgers: {
    id: "rutgers",
    name: "Rutgers University",
    short: "Rutgers",
    tier: 1,
    ats: "PeopleAdmin",
    careersUrl: "https://jobs.rutgers.edu",
  },
  fdu: {
    id: "fdu",
    name: "Fairleigh Dickinson University",
    short: "FDU",
    tier: 2,
    ats: "PeopleAdmin",
    careersUrl: "https://jobs.fdu.edu",
  },
  kean: {
    id: "kean",
    name: "Kean University",
    short: "Kean",
    tier: 2,
    ats: "Workday",
    careersUrl: "https://kean.wd1.myworkdayjobs.com/en-US/Kean",
  },
  njit: {
    id: "njit",
    name: "New Jersey Institute of Technology",
    short: "NJIT",
    tier: 2,
    ats: "Cornerstone",
    careersUrl: "https://njit.csod.com",
  },
  caldwell: {
    id: "caldwell",
    name: "Caldwell University",
    short: "Caldwell",
    tier: 3,
    ats: "Custom HTML",
    careersUrl: "https://www.caldwell.edu/offices/human-resources/",
  },
  felician: {
    id: "felician",
    name: "Felician University",
    short: "Felician",
    tier: 3,
    ats: "Institution site",
    careersUrl: "https://felician.edu/about/careers-at-felician/",
  },
  hccc: {
    id: "hccc",
    name: "Hudson County Community College",
    short: "Hudson CC",
    tier: 3,
    ats: "Institution site",
    careersUrl: "https://www.hccc.edu/administration/hr/job-opportunities.html",
  },
};

export function getInstitution(id: string): Institution {
  return (
    INSTITUTIONS[id] ?? {
      id,
      name: id,
      short: id,
      tier: 3,
      ats: "Unknown",
      careersUrl: "",
    }
  );
}

export function displayInstitution(role: Pick<Role, "institutionId" | "institutionName">): Institution {
  const inst = getInstitution(role.institutionId);
  if (!role.institutionName) return inst;
  return { ...inst, name: role.institutionName, short: role.institutionName };
}

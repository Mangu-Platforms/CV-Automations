export type JobFamily =
  | "admissions"
  | "academic-ops"
  | "budget"
  | "registrar"
  | "student-services"
  | "advising"
  | "faculty"
  | "adjunct"
  | "other";

export type PositionType =
  | "staff-ft"
  | "staff-pt"
  | "adjunct"
  | "faculty"
  | "temp"
  | "exec";

export type Variant = "admissions" | "ops" | "budget";

export type Modality = "onsite" | "hybrid" | "remote";

export type FitLabel = "strong" | "moderate" | "long-shot";

export type AppStatus =
  | "queued"
  | "walking"
  | "ready"
  | "submitted"
  | "interview"
  | "skipped"
  | "out-of-scope";

export type Institution = {
  id: string;
  name: string;
  short: string;
  tier: 1 | 2 | 3;
  ats: string;
  careersUrl: string;
};

export type Role = {
  id: string;
  title: string;
  institutionId: string;
  institutionName?: string;
  campus?: string;
  family: JobFamily;
  positionType: PositionType;
  variant: Variant;
  modality: Modality;
  batch: string;
  githubDir: string;
  cvFile?: string;
  clFile?: string;
  applyUrl: string;
  jobNo?: string;
  salaryMin?: number;
  salaryMax?: number;
  fitLabel: FitLabel;
  gaps: string[];
  angle: string;
  recommend: boolean;
  inScope: boolean;
  hasPacket: boolean;
};

export type ScoreBreakdown = {
  total: number;
  skills: number;
  archetype: number;
  salary: number;
  institution: number;
  commute: number;
  trajectory: number;
  deductions: number;
  reasons: string[];
  flags: string[];
};

export type ChecklistItem = {
  id: string;
  label: string;
  hint?: string;
};

export type RoleProgress = {
  status: AppStatus;
  step: number;
  cv: string;
  cl: string;
  notes: string;
  checklist: Record<string, boolean>;
  updatedAt: string;
};

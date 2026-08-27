import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ROLES } from "./catalog";
import {
  cloneDoc,
  clToText,
  cvToText,
  MASTER_CL,
  MASTER_CV,
  type ClDoc,
  type CvDoc,
} from "./docs";
import { defaultCl, defaultCv } from "./packet";
import { scoreRole } from "./score";
import type { AppStatus, Role, RoleProgress } from "./types";

export type CustomRole = Role & { postingText?: string };

export type PacketDocs = {
  cv: CvDoc;
  cl: ClDoc;
  built: boolean;
};

type DeskState = {
  hydrated: boolean;
  progress: Record<string, RoleProgress>;
  customRoles: CustomRole[];
  masterCv: CvDoc;
  masterCl: ClDoc;
  packetDocs: Record<string, PacketDocs>;
  markHydrated: () => void;
  getProgress: (role: Role) => RoleProgress;
  getDocs: (role: Role) => PacketDocs;
  setStep: (id: string, step: number) => void;
  setStatus: (id: string, status: AppStatus) => void;
  setPacket: (id: string, cv: string, cl: string) => void;
  setDocs: (id: string, cv: CvDoc, cl: ClDoc, built?: boolean) => void;
  setMaster: (cv: CvDoc, cl: ClDoc) => void;
  resetMaster: () => void;
  setNotes: (id: string, notes: string) => void;
  toggleCheck: (id: string, itemId: string) => void;
  addCustomRole: (role: CustomRole) => void;
  resetRole: (role: Role) => void;
};

function seed(role: Role): RoleProgress {
  const status: AppStatus = !role.inScope
    ? "out-of-scope"
    : role.hasPacket
      ? "ready"
      : "queued";
  return {
    status,
    step: 0,
    cv: defaultCv(role),
    cl: defaultCl(role),
    notes: "",
    checklist: {},
    updatedAt: "",
  };
}

export const useDesk = create<DeskState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      progress: {},
      customRoles: [],
      masterCv: cloneDoc(MASTER_CV),
      masterCl: cloneDoc(MASTER_CL),
      packetDocs: {},
      markHydrated: () => set({ hydrated: true }),
      getProgress: (role) => get().progress[role.id] ?? seed(role),
      getDocs: (role) =>
        get().packetDocs[role.id] ?? {
          cv: cloneDoc(get().masterCv),
          cl: cloneDoc(get().masterCl),
          built: false,
        },
      setStep: (id, step) =>
        set((s) => {
          const current = s.progress[id] ?? seedPlaceholder(id);
          return {
            progress: {
              ...s.progress,
              [id]: {
                ...current,
                step,
                status:
                  current.status === "ready" || current.status === "queued"
                    ? "walking"
                    : current.status,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
      setStatus: (id, status) =>
        set((s) => {
          const current = s.progress[id] ?? seedPlaceholder(id);
          return {
            progress: {
              ...s.progress,
              [id]: { ...current, status, updatedAt: new Date().toISOString() },
            },
          };
        }),
      setPacket: (id, cv, cl) =>
        set((s) => {
          const current = s.progress[id] ?? seedPlaceholder(id);
          return {
            progress: {
              ...s.progress,
              [id]: { ...current, cv, cl, updatedAt: new Date().toISOString() },
            },
          };
        }),
      setDocs: (id, cv, cl, built) =>
        set((s) => {
          const current = s.progress[id] ?? seedPlaceholder(id);
          const prev = s.packetDocs[id];
          return {
            packetDocs: {
              ...s.packetDocs,
              [id]: {
                cv,
                cl,
                built: built ?? prev?.built ?? false,
              },
            },
            progress: {
              ...s.progress,
              [id]: {
                ...current,
                cv: cvToText(cv),
                cl: clToText(cl),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
      setMaster: (cv, cl) => set({ masterCv: cv, masterCl: cl }),
      resetMaster: () =>
        set({ masterCv: cloneDoc(MASTER_CV), masterCl: cloneDoc(MASTER_CL) }),
      setNotes: (id, notes) =>
        set((s) => {
          const current = s.progress[id] ?? seedPlaceholder(id);
          return {
            progress: {
              ...s.progress,
              [id]: { ...current, notes, updatedAt: new Date().toISOString() },
            },
          };
        }),
      toggleCheck: (id, itemId) =>
        set((s) => {
          const current = s.progress[id] ?? seedPlaceholder(id);
          return {
            progress: {
              ...s.progress,
              [id]: {
                ...current,
                checklist: {
                  ...current.checklist,
                  [itemId]: !current.checklist[itemId],
                },
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),
      addCustomRole: (role) =>
        set((s) => ({
          customRoles: [role, ...s.customRoles.filter((r) => r.id !== role.id)],
          progress: {
            ...s.progress,
            [role.id]: seed(role),
          },
        })),
      resetRole: (role) =>
        set((s) => {
          const nextDocs = { ...s.packetDocs };
          delete nextDocs[role.id];
          return {
            progress: { ...s.progress, [role.id]: seed(role) },
            packetDocs: nextDocs,
          };
        }),
    }),
    {
      name: "apply-desk-v1",
      partialize: (s) => ({
        progress: s.progress,
        customRoles: s.customRoles,
        masterCv: s.masterCv,
        masterCl: s.masterCl,
        packetDocs: s.packetDocs,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<{
          progress: DeskState["progress"];
          customRoles: DeskState["customRoles"];
          masterCv: CvDoc;
          masterCl: ClDoc;
          packetDocs: DeskState["packetDocs"];
        }>;
        return {
          ...current,
          progress: p.progress ?? current.progress,
          customRoles: p.customRoles ?? current.customRoles,
          masterCv: p.masterCv ?? current.masterCv,
          masterCl: p.masterCl ?? current.masterCl,
          packetDocs: p.packetDocs ?? current.packetDocs,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

function seedPlaceholder(id: string): RoleProgress {
  const role = ROLES.find((r) => r.id === id);
  if (role) return seed(role);
  return {
    status: "queued",
    step: 0,
    cv: "",
    cl: "",
    notes: "",
    checklist: {},
    updatedAt: "",
  };
}

export function allRoles(custom: CustomRole[]): Role[] {
  const ids = new Set(custom.map((r) => r.id));
  return [...custom, ...ROLES.filter((r) => !ids.has(r.id))];
}

export function nextRoles(
  roles: Role[],
  progress: Record<string, RoleProgress>,
  n = 3,
): Role[] {
  const open = roles.filter((r) => {
    const status = (progress[r.id] ?? seed(r)).status;
    return (
      r.inScope &&
      status !== "submitted" &&
      status !== "interview" &&
      status !== "skipped" &&
      status !== "out-of-scope"
    );
  });
  open.sort((a, b) => {
    const pa = progress[a.id] ?? seed(a);
    const pb = progress[b.id] ?? seed(b);
    const walking = Number(pb.status === "walking") - Number(pa.status === "walking");
    if (walking) return walking;
    return scoreRole(b).total - scoreRole(a).total;
  });
  return open.slice(0, n);
}

export function nextRole(
  roles: Role[],
  progress: Record<string, RoleProgress>,
): Role | undefined {
  return nextRoles(roles, progress, 1)[0];
}

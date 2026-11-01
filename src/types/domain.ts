export const CATEGORIES = [
  { value: "manufacture", label: "Manufacture" },
  { value: "service-unit", label: "Service Unit" },
  { value: "repair-part", label: "Repair Part" },
  { value: "other", label: "Other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["value"];

export const STEPS = [
  { key: "work-order-release", title: "Work Order Release" },
  { key: "work-plan", title: "Work Plan" },
  { key: "itp", title: "ITP" },
] as const;

export interface Project {
  id: string;
  category: CategoryId;
  workOrderRelease: { number: string };
  createdAt: string;
}

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

// Library data shape
export interface LibraryData {
  job: {
    "work-order-release": string[];
    "work-plan": string[];
    itp: string[];
  };
}

export function buildLibrary(projects: Project[]): LibraryData {
  return {
    job: {
      "work-order-release": projects.map((p) => p.workOrderRelease.number),
      "work-plan": [],
      itp: [],
    },
  };
}

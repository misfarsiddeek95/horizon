export type PillarId = "restore" | "inspire" | "excite" | "uplift" | "innovate";

export type CrroId = 1 | 2 | 3 | 4;

export type SectionId = "intro" | "activate" | "climate";

export type StatusTone = "progressing" | "ontrack" | "acceleration" | "achieved";

export interface Impact {
  value: string;
  label: string;
}

export interface ProgressItem {
  label: string;
  pct: number;
}

export interface Commitment {
  name: string;
  current: string;
  note?: string;
  target: string;
  status: string;
  tone: StatusTone;
  pct?: number;
}

export interface V2Pillar {
  id: PillarId;
  name: string;
  accent: string;
  descriptor: string;
  desc: string;
  overview: string;
  standout: string;
  standoutText: string;
  impacts: [Impact, Impact, Impact];
  progress?: ProgressItem[];
  commitments?: Commitment[];
  story: string;
  storyText: string;
  page: string;
}

export interface FactorPair {
  title: string;
  text: string;
}

export interface V2Crro {
  id: CrroId;
  kind: "Risk" | "Opportunity";
  tabTitle: string;
  tabType: string;
  title: string;
  desc: string;
  color: string;
  factors: FactorPair[];
  meaning: FactorPair[];
  driver: string;
  driverSubtitle: string;
  driverAxis: string;
  driverUnit: string;
  driverFormat: "percent" | "number" | "multiple";
  driverSingleEstimate?: boolean;
  finance: string;
  financeSubtitle: string;
  financeAxis: string;
  financeUnit: string;
  financeFormat: "percent" | "number" | "multiple";
  financeSingleEstimate?: boolean;
  upper: [number, number, number];
  lower: [number, number, number];
  finU: [number, number, number];
  finL: [number, number, number];
  lens: string;
  net: string;
  div: string;
}

export const STATUS_TONE_COLOR: Record<StatusTone, string> = {
  progressing: "var(--color-v2-status-progressing)",
  ontrack: "var(--color-v2-status-ontrack)",
  acceleration: "var(--color-v2-status-acceleration)",
  achieved: "var(--color-v2-status-achieved)",
};

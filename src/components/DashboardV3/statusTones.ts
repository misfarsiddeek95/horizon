import type { StatusTone } from "@/data/dashboardV2/types";

export const STATUS_TONE_TEXT_V3: Record<StatusTone, string> = {
  progressing: "text-cyan-300",
  ontrack: "text-emerald-300",
  acceleration: "text-amber-400",
  achieved: "text-green-400",
};

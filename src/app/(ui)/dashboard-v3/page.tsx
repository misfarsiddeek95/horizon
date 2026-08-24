import type { Metadata } from "next";
import DashboardPageV3 from "@/components/DashboardV3/DashboardPageV3";

export const metadata: Metadata = {
  title: "Dashboard V3 | HeyCarb",
  description:
    "ACTIVATE 2030 progress and the S1 & S2 Climate Outlook in a premium glass experience.",
};

export default function DashboardV3Page() {
  return <DashboardPageV3 />;
}

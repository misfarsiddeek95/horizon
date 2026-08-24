import type { Metadata } from "next";
import DashboardPageV2 from "@/components/DashboardV2/DashboardPageV2";

export const metadata: Metadata = {
  title: "Dashboard V2 | HeyCarb",
  description:
    "ACTIVATE 2030 progress and the S1 & S2 Climate Risk & Opportunity Outlook in one connected view.",
};

export default function DashboardV2Page() {
  return <DashboardPageV2 />;
}

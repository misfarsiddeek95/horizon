import type { Metadata } from "next";
import DashboardPageV2 from "@/components/Dashboard/DashboardPageV2";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "ACTIVATE 2030 progress and the S1 & S2 Climate Risk & Opportunity Outlook in one connected view.",
};

export default function DashboardPage() {
  return <DashboardPageV2 />;
}

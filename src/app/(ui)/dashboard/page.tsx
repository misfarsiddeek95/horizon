import type { Metadata } from "next";
import ActivateDashboardPage from "@/components/Dashboard/ActivateDashboardPage";

export const metadata: Metadata = {
  title: "Activate Dashboard | HeyCarb",
  description:
    "ACTIVATE 2030 Progress — track sustainability targets and FY2025/26 highlights.",
};

export default function DashboardPage() {
  return <ActivateDashboardPage />;
}

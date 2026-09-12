import type { Metadata } from "next";
import DashboardPageV2 from "@/components/Dashboard/DashboardPageV2";

export const metadata: Metadata = {
  title: { absolute: "Haycarb Annual Report 2025/26 | Sustainability Dashboard" },
  description: "Explore Haycarb’s sustainability performance, ESG metrics, ACTIVATE 2030 progress and climate related insights for 2025/26.",
};

export default function DashboardPage() {
  return <DashboardPageV2 />;
}

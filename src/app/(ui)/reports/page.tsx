import type { Metadata } from "next";
import ReportGenerator from "@/components/ReportGenerator";

export const metadata: Metadata = {
  title: "Generate Your Report | Haycarb PLC",
  description:
    "Create personalized summaries by selecting specific sections from Haycarb PLC's Annual Report.",
};

export default function ReportsPage() {
  return <ReportGenerator />;
}

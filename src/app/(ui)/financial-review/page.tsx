import type { Metadata } from "next";
import FinancialReviewPage from "@/components/FinancialReview/FinancialReviewPage";

export const metadata: Metadata = {
  title: {
    absolute: "Haycarb Annual Report 2025/26 | Financial & Non-Financial Review",
  },
  description:
    "Explore Haycarb’s financial performance and non-financial value creation through a connected, visual review of the year.",
};

export default function FinancialReview() {
  return <FinancialReviewPage />;
}

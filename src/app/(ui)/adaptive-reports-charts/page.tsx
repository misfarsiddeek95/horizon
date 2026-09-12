import type { Metadata } from "next";
import TailorMadeForYouPage from "@/components/TailorMadeForYou/TailorMadeForYouPage";

export const metadata: Metadata = {
  title: "Tailor Made for You",
  description: "Explore performance data through customizable, interactive charts.",
};

export default function TailorMadeForYou() {
  return <TailorMadeForYouPage />;
}

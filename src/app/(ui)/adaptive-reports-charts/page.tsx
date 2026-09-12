import type { Metadata } from "next";
import TailorMadeForYouPage from "@/components/TailorMadeForYou/TailorMadeForYouPage";

export const metadata: Metadata = {
  title: { absolute: "Haycarb Annual Report 2025/26 | Adaptive Reports & Charts" },
  description: "Explore Haycarb’s Annual Report 2025/26 through customisable charts and tailored reports, with flexible content selection and downloadable outputs.",
};

export default function TailorMadeForYou() {
  return <TailorMadeForYouPage />;
}

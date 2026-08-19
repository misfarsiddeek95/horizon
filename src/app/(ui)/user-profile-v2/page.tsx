import type { Metadata } from "next";
import UserProfilePageV2 from "@/components/UserProfileV2/UserProfilePageV2";

export const metadata: Metadata = {
  title: "User Profiles V2 | Horizon",
  description:
    "Explore Haycarb through the lens that matters to you — performance, strategy, and sustainable value creation for every stakeholder.",
};

export default function UserProfileV2() {
  return <UserProfilePageV2 />;
}

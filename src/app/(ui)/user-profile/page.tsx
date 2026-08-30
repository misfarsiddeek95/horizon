import type { Metadata } from "next";
import UserProfilePage from "@/components/UserProfile/UserProfilePage";

export const metadata: Metadata = {
  title: "User Profiles",
  description:
    "Explore Haycarb through the lens that matters to you — performance, strategy, and sustainable value creation for every stakeholder.",
};

export default function UserProfile() {
  return <UserProfilePage />;
}

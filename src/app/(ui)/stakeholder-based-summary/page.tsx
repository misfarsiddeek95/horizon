import type { Metadata } from "next";
import UserProfilePage from "@/components/UserProfile/UserProfilePage";

export const metadata: Metadata = {
  title: { absolute: "Haycarb Annual Report 2025/26 | Stakeholder Based Summary" },
  description: "Discover relevant Annual Report 2025/26 insights through stakeholder based summaries designed for quick and easy access to key information.",
};

export default function UserProfile() {
  return <UserProfilePage />;
}

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { absolute: "Haycarb Annual Report 2025/26 | AI-Guided Exploration" },
  description: "Explore Haycarb’s Annual Report 2025/26 with AI-guided insights, multilingual responses, stakeholder-tailored answers, visualisations and downloadable PDFs.",
};

export const viewport: Viewport = {
  themeColor: "#081F2B",
  colorScheme: "dark",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

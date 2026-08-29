import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "AI Chat Assistant",
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

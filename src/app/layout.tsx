import type { Metadata } from "next";
import "./globals.css";
import GlobalHeader from "@/components/GlobalHeader";

export const metadata: Metadata = {
  title: {
    template: "%s | Haycarb",
    default: "Haycarb",
  },
  description: "Haycarb Annual Report 2025/26",
  icons: {
    icon: "/images/fav.png",
    shortcut: "/images/fav.png",
    apple: "/images/fav.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}

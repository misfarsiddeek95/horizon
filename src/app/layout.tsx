import type { Metadata } from "next";
import Script from "next/script";
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
        {/* Accessibly (accessiblyapp.com) accessibility widget — loads
            after hydration so it never blocks first paint. Rendered in the
            root layout, so it is present on every route. */}
        <Script
          id="accessibly-widget"
          src="https://dash.accessibly.app/widget/0198cc9a-8a1c-7166-ae34-0700f160961f/autoload.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

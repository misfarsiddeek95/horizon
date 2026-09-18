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
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NL9P6FQQ');
          `}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NL9P6FQQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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

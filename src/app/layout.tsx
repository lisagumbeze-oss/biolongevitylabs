import React from "react";
import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingProgress from "@/components/LoadingProgress";
import ConsentModal from "@/components/ConsentModal";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biolongevitylabss.com"),
  title: {
    default: "BioLongevity Labs | Premium Research Compounds",
    template: "%s | BioLongevity Labs"
  },
  description: "Highest purity BPC-157, TB-500, and research peptides. USA-made, lab-tested, and research-compliant biotechnology.",
  keywords: ["BPC-157", "TB-500", "Research Peptides", "BioLongevity Labs", "Biotech research"],
  authors: [{ name: "BioLongevity Labs" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://biolongevitylabss.com",
    siteName: "BioLongevity Labs",
    title: "BioLongevity Labs | Premium Research Peptides & Bioregulators",
    description: "Highest purity BPC-157, TB-500, and advanced research compounds. 99%+ purity, US-manufactured, and lab-tested for scientific excellence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BioLongevity Labs - Premium Research Compounds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@biolongevity",
    creator: "@biolongevity",
    title: "BioLongevity Labs | Premium Research Peptides",
    description: "Empowering breakthrough research with highest purity peptides and bioregulators.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <Providers>
          <React.Suspense fallback={null}>
            <LoadingProgress />
          </React.Suspense>
          <ConsentModal />
          <Navbar />
          <main className="grow pb-24 md:pb-0">
            {children}
          </main>
          <BottomNav />
          <CartDrawer />
          <Footer />
        </Providers>

        {process.env.NEXT_PUBLIC_SMARTSUPP_KEY && (
          <Script
            id="smartsupp-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window._smartsupp = window._smartsupp || {};
                window._smartsupp.key = '${process.env.NEXT_PUBLIC_SMARTSUPP_KEY}';
                // Move widget up on mobile to avoid BottomNav
                if (window.innerWidth < 768) {
                  window._smartsupp.offsetY = 100;
                  window._smartsupp.offsetX = 20;
                }
                window.smartsupp||(function(d) {
                  var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                  s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                  c.type='text/javascript';c.charset='utf-8';c.async=true;
                  c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
                })(document);
              `
            }}
          />
        )}

        {/* Global JSON-LD Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BioLongevity Labs",
              "url": "https://biolongevitylabss.com",
              "logo": "https://biolongevitylabss.com/logo.png",
              "sameAs": [
                "https://twitter.com/biolongevitylabs",
                "https://facebook.com/biolongevitylabs"
              ]
            })
          }}
        />

        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BioLongevity Labs",
              "url": "https://biolongevitylabss.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://biolongevitylabss.com/shop?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}

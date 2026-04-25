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
import SmartsuppWidget from "@/components/SmartsuppWidget";
import LivePulse from "@/components/LivePulse";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biolongevitylabss.com"),
  title: {
    default: "BioLongevity Labs | Research Grade Peptides & Scientific Bioregulators",
    template: "%s | BioLongevity Labs"
  },
  description: "USA-made, lab-tested research grade peptides. Buy BPC-157, TB-500, and advanced bioregulators for scientific investigation. 99%+ purity guaranteed with third-party testing.",
  keywords: ["Research Grade Peptides", "Buy BPC-157", "TB-500 Research", "Peptide Synthesis USA", "Bioregulator Peptides", "Scientific Research Compounds"],
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
// KeepAlive removed as it's no longer needed for Vercel

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-white text-slate-900 transition-colors duration-300`}
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
          <LivePulse />
          <Footer />
        </Providers>

        <SmartsuppWidget />


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

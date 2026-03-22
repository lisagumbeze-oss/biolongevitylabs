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
    title: "BioLongevity Labs | Premium Research Compounds",
    description: "Highest purity research peptides and biotechnology solutions.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BioLongevity Labs | Premium Research Compounds",
    description: "Highest purity research peptides and biotechnology solutions.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
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
      </body>
    </html>
  );
}

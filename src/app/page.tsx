import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import HomeLcpPreload from "@/components/HomeLcpPreload";
import { SITE_URL, OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Research Grade Peptides for Sale",
  description:
    "Where to buy research peptides online: USA-made BPC-157, TB-500, thymulin & bioregulators. 99%+ purity, third-party COA, fast lab fulfillment. Research use only.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Research Grade Peptides for Sale | BioLongevity Labs",
    description:
      "Buy research-grade peptides online with batch COA verification. BPC-157, TB-500, bioregulators & more for laboratory study.",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research Grade Peptides for Sale | BioLongevity Labs",
    description:
      "Buy research-grade peptides online with batch COA verification. BPC-157, TB-500, bioregulators & more for laboratory study.",
    images: [OG_IMAGE.url],
  },
};

export default function Page() {
  return (
    <>
      <HomeLcpPreload />
      <HomePage />
    </>
  );
}

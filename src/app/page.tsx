import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import HomeLcpPreload from "@/components/HomeLcpPreload";
import { SITE_URL, OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Buy Research Peptides in USA | BioLongevity Labs",
  description:
    "Where can I buy research peptides in USA? How much for BPC-157, TB-500, thymulin & bioregulators? USA fulfillment, batch COA. Research use only.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "How to Buy Research Peptides in USA | BioLongevity Labs",
    description:
      "Where can I buy research peptides in California, Texas, or Florida? Order COA-verified catalog SKUs with USA shipping. Research use only.",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Buy Research Peptides in USA | BioLongevity Labs",
    description:
      "Where can I buy research peptides in USA? How much for BPC-157 blends & bioregulators? Batch COA, USA fulfillment. Research use only.",
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

import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Research Grade Peptides for Sale",
  description:
    "Where to buy research peptides online: USA-made BPC-157, TB-500, thymulin & bioregulators. 99%+ purity, third-party COA, fast lab fulfillment. Research use only.",
  openGraph: {
    title: "Research Grade Peptides for Sale | BioLongevity Labs",
    description:
      "Buy research-grade peptides online with batch COA verification. BPC-157, TB-500, bioregulators & more for laboratory study.",
    url: "https://biolongevitylabss.com",
  },
};

export default function Page() {
  return <HomePage />;
}

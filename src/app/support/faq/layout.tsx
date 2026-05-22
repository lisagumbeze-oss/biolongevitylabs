import { Metadata } from "next";
import { canonicalPath } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Research Peptide FAQ | Ordering, COA & RUO Policy",
  description:
    "Frequently asked questions about buying research peptides online: COA verification, USA shipping, storage, refunds, and research-use-only compliance.",
  alternates: canonicalPath("/support/faq"),
  openGraph: {
    title: "Research Peptide FAQ | BioLongevity Labs",
    description:
      "Answers on research peptide ordering, batch COAs, shipping, and laboratory RUO policy.",
    url: "https://biolongevitylabss.com/support/faq",
    siteName: "BioLongevity Labs",
    type: "website",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

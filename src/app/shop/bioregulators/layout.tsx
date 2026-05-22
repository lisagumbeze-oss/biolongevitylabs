import { Metadata } from "next";
import { canonicalPath } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Bioregulator Peptides for Research | Vials, Capsules & Creams",
  description:
    "Shop Khavinson-class bioregulator peptides for laboratory research: lyophilized vials, organ-specific capsules, and topical creams with batch COA verification. USA fulfillment, RUO only.",
  alternates: canonicalPath("/shop/bioregulators"),
  openGraph: {
    title: "Bioregulator Peptides for Research | BioLongevity Labs",
    description:
      "Browse bioregulator vials, capsules, and creams for in vitro and cell-model research with documented purity.",
    url: "https://biolongevitylabss.com/shop/bioregulators",
    siteName: "BioLongevity Labs",
    type: "website",
  },
};

export default function BioregulatorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

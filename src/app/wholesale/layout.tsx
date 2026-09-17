import { Metadata } from "next";
import { canonicalPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wholesale Research Peptides",
  description:
    "Request wholesale pricing for research-grade peptides and bioregulators. USA fulfillment. Laboratory research use only, not for human or veterinary administration.",
  alternates: canonicalPath("/wholesale"),
  openGraph: {
    title: "Wholesale Research Peptides | BioLongevity Labs",
    description: "Wholesale inquiries for USA-made research peptides. Research use only.",
    url: `${SITE_URL}/wholesale`,
    siteName: "BioLongevity Labs",
    type: "website",
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

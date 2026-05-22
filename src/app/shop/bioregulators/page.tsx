import Link from "next/link";
import AnswerCapsule from "@/components/AnswerCapsule";
import BioregulatorsShop from "@/components/BioregulatorsShop";

export default function BioregulatorsPage() {
  return (
    <div className="bg-white min-h-screen pt-8 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://biolongevitylabss.com/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: "https://biolongevitylabss.com/shop" },
              {
                "@type": "ListItem",
                position: 3,
                name: "Bioregulators",
                item: "https://biolongevitylabss.com/shop/bioregulators",
              },
            ],
          }),
        }}
      />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 space-y-6">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Bioregulator Peptides for Research
          </h1>
          <AnswerCapsule>
            Bioregulator peptides are short peptide sequences studied for organ- and tissue-specific
            gene-expression patterns in cell models—available as lyophilized vials, capsules, and
            research creams with batch COA verification from BioLongevity Labs.
          </AnswerCapsule>
          <article className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
            <p>
              Khavinson-class and related bioregulators support targeted in vitro studies across
              vascular, immune, cartilage, and metabolic pathways. Unlike general repair peptides such
              as BPC-157, bioregulators are often selected by organ system—browse{" "}
              <Link href="/research/what-is-a-bioregulator" className="text-primary font-semibold hover:underline">
                what is a bioregulator
              </Link>{" "}
              for definitions, or compare{" "}
              <Link href="/product/thymulin-peptide-10mg" className="text-primary font-semibold hover:underline">
                thymulin
              </Link>{" "}
              and{" "}
              <Link href="/product/vesugen-peptide-20mg" className="text-primary font-semibold hover:underline">
                vesugen
              </Link>{" "}
              in your procurement SOP.
            </p>
            <p>
              All listings are research-use only (RUO). Verify batch COAs using our{" "}
              <Link href="/research/how-to-read-peptide-coa" className="text-primary font-semibold hover:underline">
                COA guide
              </Link>{" "}
              before receiving material into your lab.
            </p>
          </article>
        </header>
        <BioregulatorsShop />
      </div>
    </div>
  );
}

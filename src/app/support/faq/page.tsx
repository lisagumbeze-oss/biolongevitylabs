import Link from "next/link";
import AnswerCapsule from "@/components/AnswerCapsule";
import { HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Who can purchase from BioLongevity Labs?",
    a: "Qualified researchers, institutions, and laboratories that accept our research-use-only (RUO) terms at checkout. Products are not for human or veterinary administration.",
  },
  {
    q: "Do you provide a certificate of analysis (COA)?",
    a: "Yes. Batch-specific COA documentation with HPLC purity and identity testing is provided for catalog peptides. See our guide on how to read a peptide COA.",
    href: "/research/how-to-read-peptide-coa",
  },
  {
    q: "How fast do orders ship?",
    a: "Orders placed before the published cutoff on business days typically ship the same day. See shipping and payments for carrier details.",
    href: "/shipping-and-payments",
  },
  {
    q: "Are your peptides for human use?",
    a: "No. All products are research chemicals for in vitro and qualified non-clinical laboratory work only.",
  },
  {
    q: "How should lyophilized peptides be stored?",
    a: "Refrigerate lyophilized powder; after reconstitution, aliquot and freeze per your laboratory SOP.",
    href: "/research/peptide-reconstitution-guide",
  },
  {
    q: "Can I return research compounds?",
    a: "Opened RUO materials may be restricted to preserve batch integrity. Review our refund policy before ordering.",
    href: "/refunds",
  },
  {
    q: "Where can I compare BPC-157 and TB-500?",
    a: "See our comparison article and dosage guide for research-model context—not clinical dosing.",
    href: "/research/bpc-157-vs-tb-500",
  },
  {
    q: "How do I choose a bioregulator peptide?",
    a: "Start with our bioregulator definition article, then browse vials, capsules, and creams in the bioregulator shop category.",
    href: "/research/what-is-a-bioregulator",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function ResearchFaqPage() {
  return (
    <main className="grow flex flex-col items-center py-16 px-4 md:px-10 lg:px-40 w-full mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-[900px] w-full flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <HelpCircle className="w-7 h-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Research Peptide FAQ
            </h1>
          </div>
          <AnswerCapsule>
            BioLongevity Labs sells research-grade peptides with batch COAs, USA fulfillment,
            and strict RUO policy acceptance at checkout—never for human consumption or medical
            treatment.
          </AnswerCapsule>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {FAQ_ITEMS.map((item) => (
            <article
              key={item.q}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-200"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-3">{item.q}</h2>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {item.a}
                {item.href && (
                  <>
                    {" "}
                    <Link href={item.href} className="text-primary font-semibold hover:underline">
                      Learn more →
                    </Link>
                  </>
                )}
              </p>
            </article>
          ))}
        </div>

        <nav className="flex flex-wrap gap-4 text-sm font-semibold text-primary pt-4 border-t border-slate-200">
          <Link href="/shop">Research catalog</Link>
          <Link href="/research/where-to-buy-research-peptides">Where to buy (USA)</Link>
          <Link href="/support">Contact support</Link>
          <Link href="/protocol-finder">Protocol finder</Link>
        </nav>
      </div>
    </main>
  );
}

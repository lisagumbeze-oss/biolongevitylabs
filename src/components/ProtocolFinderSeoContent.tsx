import Link from "next/link";
import AnswerCapsule from "@/components/AnswerCapsule";

const FAQS = [
  {
    question: "What is the BioLongevity Labs Protocol Finder?",
    answer:
      "It is an interactive questionnaire that maps your stated research goals to relevant peptide and bioregulator SKUs in our catalog, with links to COA-backed products. It does not provide medical or dosing advice.",
  },
  {
    question: "Who should use the protocol finder?",
    answer:
      "Principal investigators, lab managers, and qualified research staff planning in vitro or non-clinical studies who need a starting point for compound selection. All products remain research-use only.",
  },
  {
    question: "Does the tool replace literature review?",
    answer:
      "No. Use it alongside peer-reviewed sources, institutional SOPs, and our Research hub articles such as the BPC-157 dosage guide and peptide reconstitution guide.",
  },
  {
    question: "Can I purchase compounds directly from recommendations?",
    answer:
      "Yes. Recommended SKUs link to product detail pages where you can review batch documentation and add items to cart for laboratory fulfillment.",
  },
  {
    question: "Is personal health information collected?",
    answer:
      "The finder stores selections locally in your session for navigation purposes only. Do not enter patient identifiers or clinical data.",
  },
];

export function getProtocolFinderFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default function ProtocolFinderSeoContent() {
  return (
    <>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <AnswerCapsule>
          The Protocol Finder matches your laboratory research goal—such as tissue repair signaling,
          immune models, or bioregulator studies—to catalog peptides with third-party COA documentation.
          It is a discovery tool for scientists, not a clinical recommendation engine.
        </AnswerCapsule>
      </section>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-10 prose prose-slate max-w-none text-slate-600">
        <h2 className="text-2xl font-black text-slate-900 not-prose">
          How does the research protocol finder work?
        </h2>
        <p>
          You answer a short series of questions about your study focus. The tool filters our database of
          USA-manufactured research peptides and bioregulators, then surfaces SKUs commonly referenced in
          related literature—such as{" "}
          <Link href="/product/prod_105727" className="text-primary font-semibold hover:underline">
            BPC-157 &amp; TB-500 blends
          </Link>
          ,{" "}
          <Link href="/product/prod_201099" className="text-primary font-semibold hover:underline">
            thymulin
          </Link>
          , or{" "}
          <Link href="/research/what-is-a-bioregulator" className="text-primary font-semibold hover:underline">
            Khavinson-class bioregulators
          </Link>
          .
        </p>

        <h2 className="text-2xl font-black text-slate-900 not-prose">
          When should laboratories use this tool?
        </h2>
        <p>
          Use it during grant planning, inventory onboarding, or when expanding into a new model system.
          Pair results with our{" "}
          <Link href="/research" className="text-primary font-semibold hover:underline">
            research articles
          </Link>
          ,{" "}
          <Link href="/peptide-guide" className="text-primary font-semibold hover:underline">
            peptide handling guide
          </Link>
          , and{" "}
          <Link href="/shop" className="text-primary font-semibold hover:underline">
            full catalog
          </Link>
          .
        </p>

        <h2 className="text-2xl font-black text-slate-900 not-prose">
          What compliance rules apply?
        </h2>
        <p>
          All compounds are for in vitro and qualified non-clinical research only—not for human
          consumption, diagnosis, or treatment. Verify age and RUO policy acceptance before checkout.
        </p>
      </article>

      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>
        <dl className="space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <dt className="font-bold text-slate-900 dark:text-white mb-2">{faq.question}</dt>
              <dd className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

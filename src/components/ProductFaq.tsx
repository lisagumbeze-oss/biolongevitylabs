import React from "react";
import type { ProductFaq as FaqItem } from "@/lib/product-seo";

interface ProductFaqProps {
  faqs: FaqItem[];
}

export default function ProductFaq({ faqs }: ProductFaqProps) {
  if (!faqs.length) return null;

  return (
    <section id="faq" className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800 text-left">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-slate-950">
        Frequently asked questions
      </h2>
      <p className="mb-8 text-sm text-slate-600">
        Common questions about this research compound and ordering from BioLongevity Labs.
      </p>
      <dl className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <dt className="mb-2 text-base font-semibold text-slate-950">{faq.question}</dt>
            <dd className="text-sm leading-relaxed text-slate-700">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

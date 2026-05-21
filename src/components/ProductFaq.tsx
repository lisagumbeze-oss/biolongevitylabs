import React from "react";
import type { ProductFaq as FaqItem } from "@/lib/product-seo";

interface ProductFaqProps {
  faqs: FaqItem[];
}

export default function ProductFaq({ faqs }: ProductFaqProps) {
  if (!faqs.length) return null;

  return (
    <section id="faq" className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800 text-left">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 uppercase">
        Frequently Asked Questions
      </h2>
      <p className="text-sm text-slate-500 font-medium mb-8">
        Common questions about this research compound and ordering from BioLongevity Labs.
      </p>
      <dl className="space-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-6"
          >
            <dt className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.question}</dt>
            <dd className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

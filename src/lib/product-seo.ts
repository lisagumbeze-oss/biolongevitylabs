import { SITE_URL } from "@/lib/seo";
import { productPath } from "@/lib/product-slug";
import type { Product } from "@/data/products";

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductSeoConfig = {
  metaTitle: string;
  metaDescription: string;
  answerCapsule: string;
  faqs: ProductFaq[];
};

const RUO_FOOTER =
  "All compounds are for laboratory research use only (RUO), not for human or veterinary consumption.";

/** Sprint B — top PDPs by search demand and catalog availability */
export const PRODUCT_SEO: Record<string, ProductSeoConfig> = {
  prod_105727: {
    metaTitle: "BPC-157 & TB-500 Research Blend (30mg) for Sale",
    metaDescription:
      "Buy Regeno Blend with BPC-157, TB-500, and Cartalax for in vitro research. 99%+ purity, USA-made, batch COA included. Research use only.",
    answerCapsule:
      "Regeno Blend combines BPC-157, TB-500, and Cartalax in a single 30mg research vial for connective-tissue and regeneration studies. BioLongevity Labs verifies each batch with third-party HPLC testing before release.",
    faqs: [
      {
        question: "What is included in the Regeno Blend research vial?",
        answer:
          "Each vial provides 10mg BPC-157, 10mg TB-500, and 10mg Cartalax lyophilized powder for laboratory preparation. " + RUO_FOOTER,
      },
      {
        question: "Is a certificate of analysis (COA) provided?",
        answer:
          "Yes. Batch-specific COA documentation with HPLC purity data ships with your order and is available on request for institutional records.",
      },
      {
        question: "How should this blend be stored for research?",
        answer:
          "Store lyophilized material refrigerated (2–8°C). After reconstitution, follow your lab SOP; aliquot and freeze if holding beyond immediate use. " + RUO_FOOTER,
      },
      {
        question: "Can I buy BPC-157 and TB-500 together for one study?",
        answer:
          "This blend is formulated for labs comparing synergistic signaling in tissue-repair models. Single-compound SKUs are also listed in our peptide catalog.",
      },
    ],
  },
  prod_201099: {
    metaTitle: "Thymulin Peptide (10mg) for Research",
    metaDescription:
      "Thymulin peptide for immune and thymic hormone research. USA-synthesized, HPLC-verified, 10mg lyophilized vial. Research use only.",
    answerCapsule:
      "Thymulin is a thymic peptide studied for immune cell differentiation and endocrine signaling in vitro. This 10mg vial is third-party tested and intended exclusively for qualified laboratory research.",
    faqs: [
      {
        question: "What research applications use thymulin peptide?",
        answer:
          "Literature focuses on thymic hormone pathways, T-cell differentiation models, and immune senescence assays in controlled cell cultures. " + RUO_FOOTER,
      },
      {
        question: "What purity standard does this thymulin batch meet?",
        answer:
          "We target ≥99% purity by HPLC with mass spectrometry confirmation documented on the batch COA.",
      },
      {
        question: "How do I reconstitute a 10mg thymulin vial?",
        answer:
          "Use bacteriostatic water or your lab-approved diluent per protocol. See our peptide reconstitution guide in the Research hub for general lyophilized handling steps.",
      },
    ],
  },
  prod_230039: {
    metaTitle: "Follistatin (FLGR242) 10mg Research Peptide",
    metaDescription:
      "Follistatin FLGR242 10mg for myostatin-pathway and muscle research models. Lab-tested purity, USA fulfillment. Research use only.",
    answerCapsule:
      "Follistatin (FLGR242) is supplied as a 10mg lyophilized research peptide for investigating myostatin-related signaling in vitro. Each unit includes batch verification suitable for institutional lab workflows.",
    faqs: [
      {
        question: "What is Follistatin FLGR242 used for in research?",
        answer:
          "Researchers employ follistatin family peptides to study activin/myostatin pathway modulation in cell and tissue models—not for performance or human use. " + RUO_FOOTER,
      },
      {
        question: "Is this product the same as consumer follistatin supplements?",
        answer:
          "No. This is a defined research-grade peptide SKU with analytical testing, not a dietary supplement.",
      },
      {
        question: "Do you provide COA documentation?",
        answer:
          "Yes—HPLC and identity testing results are tied to the batch number on your order confirmation.",
      },
    ],
  },
  prod_26974: {
    metaTitle: "Vesugen Bioregulator Peptide (20mg) for Research",
    metaDescription:
      "Vesugen 20mg bioregulator peptide for vascular and cellular aging research. USA-made, COA-verified. Research use only.",
    answerCapsule:
      "Vesugen is a Khavinson-class bioregulator peptide used in vascular and longevity-related in vitro research. BioLongevity Labs provides 20mg lyophilized material with documented batch purity.",
    faqs: [
      {
        question: "What is a bioregulator peptide like Vesugen?",
        answer:
          "Bioregulators are short peptides studied for organ-specific gene expression patterns in cell models. They are research tools, not approved therapeutics. " + RUO_FOOTER,
      },
      {
        question: "How does Vesugen differ from standard growth peptides?",
        answer:
          "Vesugen is positioned for vascular/endothelial research contexts, whereas peptides like BPC-157 are commonly used in tissue-repair signaling studies.",
      },
      {
        question: "Where can I learn more about bioregulator research?",
        answer:
          "Visit our Research hub and peptide guide for educational overviews and handling protocols.",
      },
    ],
  },
  prod_4103: {
    metaTitle: "Cartalax Peptide (20mg) for Research",
    metaDescription:
      "Cartalax 20mg research peptide for cartilage and connective tissue studies. Third-party tested, USA shipping. Research use only.",
    answerCapsule:
      "Cartalax is a bioregulator-associated peptide used in cartilage and extracellular matrix research models. This 20mg vial is batch-tested for identity and purity before fulfillment.",
    faqs: [
      {
        question: "What research models use Cartalax?",
        answer:
          "Preclinical literature references connective tissue, chondrocyte, and matrix remodeling assays. " + RUO_FOOTER,
      },
      {
        question: "Can Cartalax be combined with BPC-157 or TB-500?",
        answer:
          "Some labs stack compounds in controlled studies; our Regeno Blend SKU combines Cartalax with BPC-157 and TB-500 in defined ratios.",
      },
      {
        question: "Is this peptide for human joint treatment?",
        answer:
          "No. It is sold strictly for in vitro and non-clinical laboratory investigation by qualified professionals.",
      },
    ],
  },
};

export function getProductSeo(productId: string): ProductSeoConfig | undefined {
  return PRODUCT_SEO[productId];
}

export function buildFaqPageSchema(faqs: ProductFaq[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
    url: pageUrl,
  };
}

export function productPageUrl(product: Pick<Product, "id" | "slug">) {
  return `${SITE_URL}${productPath(product)}`;
}

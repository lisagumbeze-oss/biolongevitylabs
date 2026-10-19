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
    metaTitle: "How to Buy Regeno Blend in USA | BPC-157 & TB-500 (30mg)",
    metaDescription:
      "Where can I buy Regeno Blend in USA? How much for Regeno Blend in California or Texas? Research BPC-157, TB-500 & Cartalax blend with batch COA. Research use only.",
    answerCapsule:
      "Looking for where can I buy Regeno Blend in USA? Regeno Blend combines BPC-157, TB-500, and Cartalax (10mg each) in a 30mg research vial for connective-tissue studies. How to buy in California, Texas, or Florida: order from this page with USA fulfillment. How much for Regeno Blend in USA? See live pricing below. Each batch is HPLC-verified before release.",
    faqs: [
      {
        question: "Where can I buy Regeno Blend in the USA?",
        answer:
          "BioLongevity Labs ships Regeno Blend research vials to qualified buyers across the United States. Order directly from this product page for nationwide fulfillment. " +
          RUO_FOOTER,
      },
      {
        question: "How to buy Regeno Blend in Texas, California, or Florida?",
        answer:
          "Select the vial option, complete checkout, and we ship to research buyers in Texas, California, Florida, and other U.S. states. The same catalog flow applies for New York, Illinois, and Arizona labs.",
      },
      {
        question: "How much for Regeno Blend in USA?",
        answer:
          "Current pricing is shown on this page and may update with batch availability. Compare options before ordering; institutional buyers can contact support for procurement questions.",
      },
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
    ],
  },
  prod_201099: {
    metaTitle: "How to Buy Thymulin Peptide in USA (10mg)",
    metaDescription:
      "Where can I buy thymulin in USA? How much for thymulin in California or Texas? 10mg research vial, HPLC-verified. Research use only.",
    answerCapsule:
      "Looking for where can I buy thymulin peptide in USA? This 10mg vial supports immune and thymic hormone research in vitro. How to buy in California, Texas, or Florida: order from this page with USA fulfillment. How much for thymulin in USA? See live pricing below.",
    faqs: [
      {
        question: "Where can I buy thymulin peptide in the USA?",
        answer:
          "Order from this BioLongevity Labs product page for nationwide research fulfillment. " + RUO_FOOTER,
      },
      {
        question: "How to buy thymulin in Texas, California, or New York?",
        answer:
          "Select the vial, complete RUO checkout, and we ship to research buyers across U.S. states including Texas, California, and New York.",
      },
      {
        question: "How much for thymulin peptide in USA?",
        answer:
          "Current pricing is shown on this page and may update with batch availability.",
      },
      {
        question: "What research applications use thymulin peptide?",
        answer:
          "Literature focuses on thymic hormone pathways, T-cell differentiation models, and immune senescence assays in controlled cell cultures. " + RUO_FOOTER,
      },
    ],
  },
  prod_230039: {
    metaTitle: "Where to Buy Follistatin FLGR242 in USA (10mg)",
    metaDescription:
      "How to buy Follistatin FLGR242 in USA? How much for FLGR242 in Florida or Illinois? 10mg research peptide, USA fulfillment. Research use only.",
    answerCapsule:
      "Where can I buy Follistatin (FLGR242) in USA? This 10mg lyophilized research peptide supports myostatin-pathway studies in vitro. How to buy in Florida, Illinois, or Arizona: complete checkout on this page. How much for FLGR242 in USA? See pricing below.",
    faqs: [
      {
        question: "Where can I buy Follistatin FLGR242 in the USA?",
        answer:
          "This catalog page is the direct listing for qualified laboratory buyers with USA shipping. " + RUO_FOOTER,
      },
      {
        question: "How much for Follistatin FLGR242 in California?",
        answer:
          "Live pricing is listed on this page for all U.S. research buyers, including California.",
      },
      {
        question: "What is Follistatin FLGR242 used for in research?",
        answer:
          "Researchers employ follistatin family peptides to study activin/myostatin pathway modulation in cell and tissue models—not for performance or human use. " + RUO_FOOTER,
      },
      {
        question: "Do you provide COA documentation?",
        answer:
          "Yes—HPLC and identity testing results are tied to the batch number on your order confirmation.",
      },
    ],
  },
  prod_26974: {
    metaTitle: "How Much for Vesugen Peptide in USA (20mg)",
    metaDescription:
      "Where can I buy Vesugen in USA? How to buy Vesugen in Ohio or Georgia? 20mg bioregulator, COA-verified. Research use only.",
    answerCapsule:
      "How much for Vesugen in USA? See live pricing on this page. Where can I buy Vesugen bioregulator in USA? Order this 20mg vial for vascular and cellular aging research with USA fulfillment to Ohio, Georgia, Pennsylvania, and nationwide.",
    faqs: [
      {
        question: "Where can I buy Vesugen in the USA?",
        answer:
          "BioLongevity Labs ships this bioregulator vial to qualified U.S. research buyers from this product page. " + RUO_FOOTER,
      },
      {
        question: "How to buy Vesugen in Ohio, Georgia, or Pennsylvania?",
        answer:
          "Choose the vial option, complete RUO checkout, and we fulfill to research addresses in those states and across the USA.",
      },
      {
        question: "What is a bioregulator peptide like Vesugen?",
        answer:
          "Bioregulators are short peptides studied for organ-specific gene expression patterns in cell models. They are research tools, not approved therapeutics. " + RUO_FOOTER,
      },
    ],
  },
  prod_4103: {
    metaTitle: "How to Buy Cartalax Peptide in USA (20mg)",
    metaDescription:
      "Where can I buy Cartalax in USA? How much for Cartalax in Washington or Colorado? 20mg research peptide, USA shipping. Research use only.",
    answerCapsule:
      "Looking for where can I buy Cartalax in USA? This 20mg vial supports cartilage and extracellular-matrix research. How to buy in Washington, Colorado, or Michigan: order below. How much for Cartalax in USA? Pricing is listed on this page.",
    faqs: [
      {
        question: "Where can I buy Cartalax peptide in the USA?",
        answer:
          "Order from this product page for USA research fulfillment. " + RUO_FOOTER,
      },
      {
        question: "How much for Cartalax in USA?",
        answer:
          "Current price appears on this page and updates with batch availability.",
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
  prod_439: {
    metaTitle: "Where to Buy A-15 Ovary Peptide Bioregulator in USA",
    metaDescription:
      "How to buy Zhenoluten A-15 ovary peptide bioregulator in USA? How much for 60 capsules in New York? Research use only.",
    answerCapsule:
      "Where can I buy A-15 ovary peptide bioregulator in USA? Zhenoluten capsules, including a 60-capsule option, ship to research buyers nationwide. How much for Zhenoluten in USA? See live pricing on this page.",
    faqs: [
      {
        question: "Where can I buy A-15 ovary peptide bioregulator in the USA?",
        answer:
          "Select the capsule count on this Zhenoluten A-15 product page for USA research shipping. " + RUO_FOOTER,
      },
      {
        question: "How much for A-15 ovary peptide bioregulator in USA?",
        answer:
          "Pricing for each capsule count is shown at checkout on this page.",
      },
      {
        question: "Is this ovary peptide bioregulator for human use?",
        answer:
          "No. It is supplied for laboratory research only and is not for human or veterinary administration.",
      },
    ],
  },
};

function researchSku(name: string, phrase: string, loc = "USA"): ProductSeoConfig {
  return {
    metaTitle: `How to Buy ${phrase} in ${loc}`,
    metaDescription: `Where can I buy ${phrase} in USA? How much for ${phrase}? Batch documentation on request. Research use only.`.slice(0, 160),
    answerCapsule: `Looking for where can I buy ${phrase} in USA? ${name} is listed here for laboratory research with USA fulfillment. How much for ${phrase} in ${loc}? See pricing on this page. Confirm the vial label and COA before use in a study.`,
    faqs: [
      {
        question: `Where can I buy ${phrase} in the USA?`,
        answer: `On this product page with nationwide research fulfillment. ${RUO_FOOTER}`,
      },
      {
        question: `How much for ${phrase} in USA?`,
        answer: "Live pricing is listed on this page and may update with batch availability.",
      },
      {
        question: "Is this for human use?",
        answer: "No. It is supplied for laboratory research only.",
      },
    ],
  };
}

Object.assign(PRODUCT_SEO, {
  prod_4101: researchSku("Bronchogen (20mg)", "Bronchogen peptide", "California"),
  prod_4102: researchSku("Cardiogen (20mg)", "Cardiogen peptide", "Texas"),
  prod_4104: researchSku("Chonluten (20mg)", "Chonluten peptide", "Florida"),
  prod_26970: researchSku("Testagen Peptide (20mg)", "Testagen peptide", "New York"),
  prod_26969: researchSku("Prostamax Peptide (20mg)", "Prostamax peptide", "Illinois"),
  prod_26964: researchSku("Ovagen Peptide (20mg)", "Ovagen peptide", "Arizona"),
  prod_26963: researchSku("Livagen Peptide (20mg)", "Livagen peptide", "Ohio"),
  prod_26962: researchSku("Vilon peptide", "Vilon peptide", "Georgia"),
  prod_440: researchSku("Bonomarlot A-20", "Bonomarlot peptide bioregulator", "Pennsylvania"),
  prod_52438: researchSku("BioPineal A-8 Endoluten", "Endoluten pineal peptide bioregulator", "Washington"),
});

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

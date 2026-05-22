import type { Product } from "@/data/products";
import { productPath } from "@/lib/product-slug";

const RUO =
  "For laboratory research use only (RUO)—not for human or veterinary consumption, diagnosis, or treatment.";

type CompoundKey =
  | "bpc157"
  | "tb500"
  | "thymulin"
  | "follistatin"
  | "cartalax"
  | "vesugen"
  | "mk677"
  | "blend";

function detectCompound(name: string): CompoundKey | null {
  const n = name.toLowerCase();
  if (n.includes("bpc") && n.includes("tb")) return "blend";
  if (n.includes("bpc-157") || n.includes("bpc 157")) return "bpc157";
  if (n.includes("tb-500") || n.includes("tb 500") || n.includes("thymosin")) return "tb500";
  if (n.includes("thymulin")) return "thymulin";
  if (n.includes("follistatin")) return "follistatin";
  if (n.includes("cartalax")) return "cartalax";
  if (n.includes("vesugen") || n.includes("vesilute")) return "vesugen";
  if (n.includes("mk-677") || n.includes("mk677")) return "mk677";
  return null;
}

function isBioregulator(product: Product): boolean {
  return product.category.toLowerCase().includes("bioregulator");
}

function relatedLinksHtml(product: Product): string {
  const links: string[] = [
    `<a href="/shop">research peptide catalog</a>`,
    `<a href="/research/how-to-read-peptide-coa">how to read a peptide COA</a>`,
    `<a href="/research/peptide-reconstitution-guide">peptide reconstitution guide</a>`,
  ];
  if (isBioregulator(product)) {
    links.push(`<a href="/shop/bioregulators">bioregulator peptides</a>`);
    links.push(`<a href="/research/what-is-a-bioregulator">what is a bioregulator</a>`);
  }
  const compound = detectCompound(product.name);
  if (compound === "bpc157" || compound === "tb500" || compound === "blend") {
    links.push(`<a href="/research/bpc-157-vs-tb-500">BPC-157 vs TB-500 comparison</a>`);
    links.push(`<a href="/research/bpc-157-dosage-guide">BPC-157 dosage guide (research)</a>`);
    links.push(`<a href="/research/best-peptides-for-healing">tissue repair research peptides</a>`);
  }
  if (compound === "thymulin") {
    links.push(`<a href="/research/thymulin-research-overview">thymulin research overview</a>`);
  }
  return `<p>Related resources: ${links.join(", ")}.</p>`;
}

function compoundSection(name: string, key: CompoundKey | null): string {
  if (!key) return "";
  const blocks: Record<CompoundKey, string> = {
    blend: `<h2>BPC-157, TB-500 &amp; Cartalax in one research vial</h2>
<p>Multi-peptide blends allow laboratories to study combined signaling in connective-tissue and matrix-remodeling models without preparing separate reconstitution steps for each compound. BPC-157 literature emphasizes cytoprotection and fibroblast migration assays; TB-500 (Thymosin β4) research focuses on actin dynamics and cell migration; Cartalax is discussed in cartilage and extracellular-matrix contexts.</p>
<p>When designing a study, document the exact blend ratio on your batch COA, aliquot reconstituted material to avoid freeze-thaw degradation, and cite batch numbers in ELN records. ${RUO}</p>`,
    bpc157: `<h2>BPC-157 in laboratory research</h2>
<p>Body Protection Compound 157 is widely cited in preclinical literature for gastric cytoprotection, tendon and ligament fibroblast models, and angiogenesis assays. Researchers use defined concentrations in cell culture and ex vivo tissue systems—always calibrated to your validated SOP, not consumer dosing narratives.</p>
<p>Pair procurement with identity-confirmed material: HPLC purity plus mass spectrometry on the same batch you receive. ${RUO}</p>`,
    tb500: `<h2>TB-500 (Thymosin β4) research context</h2>
<p>TB-500 research peptides model Thymosin β4–related pathways involved in actin sequestration, cell migration, and wound-healing assays in controlled systems. Studies span dermal fibroblasts, cardiac repair models, and vascularization readouts in vitro.</p>
<p>Separate from cosmetic marketing claims, laboratory work requires batch-verified sequence identity and sterile handling after reconstitution. ${RUO}</p>`,
    thymulin: `<h2>Thymulin peptide biology</h2>
<p>Thymulin is a zinc-dependent nonapeptide associated with thymic epithelial signaling and T-cell differentiation research. Active versus apothymulin distinctions matter in experimental design—coordinate zinc cofactors where your protocol requires them.</p>
<p>Institutional buyers often archive thymulin COAs alongside immune-panel study IDs. ${RUO}</p>`,
    follistatin: `<h2>Follistatin / myostatin-pathway research</h2>
<p>Follistatin family peptides are tools for studying activin and myostatin pathway modulation in muscle and metabolic cell lines. This is defined research material with analytical testing—not a dietary supplement category.</p>
<p>Document receptor endpoints and batch purity in publication methods sections. Include lot numbers in supplementary files for multi-figure studies. ${RUO}</p>`,
    cartalax: `<h2>Cartalax &amp; connective-tissue models</h2>
<p>Cartalax appears in cartilage, chondrocyte, and extracellular-matrix remodeling literature as a bioregulator-associated research sequence. Labs compare Cartalax alone versus combination stacks such as BPC-157/TB-500 blends for matrix readouts.</p>
<p>All work remains non-clinical and in vitro unless your institution approves broader qualified models. ${RUO}</p>`,
    vesugen: `<h2>Vesugen bioregulator research</h2>
<p>Vesugen (Lys-Glu-Asp) is a Khavinson-class tripeptide studied in vascular and endothelial cell models, often alongside broader cellular aging research programs. Bioregulators are selected by organ-system hypothesis—not interchangeable with general repair peptides.</p>
<p>Review bioregulator fundamentals before ordering multi-SKU programs. ${RUO}</p>`,
    mk677: `<h2>MK-677 (ibutamoren) in non-clinical research</h2>
<p>MK-677 is investigated as a growth hormone secretagogue mimetic in receptor and signaling studies. Tablet and solution formulations in our catalog are strictly for qualified laboratory research workflows with institutional oversight.</p>
<p>Do not conflate research chemicals with athletic or anti-aging consumer products. ${RUO}</p>`,
  };
  return blocks[key];
}

function formHandlingSection(product: Product): string {
  const form = product.form;
  if (form === "Capsule" || form === "Tablet") {
    return `<h2>Capsule &amp; tablet handling for research programs</h2>
<p>Oral-dosage-form research SKUs are supplied for laboratory investigation of peptide bioregulator complexes and related formulations—not for human ingestion outside approved institutional protocols. Store sealed containers cool and dry; protect from humidity that can affect capsule integrity.</p>
<p>Document lot numbers on receipt; opened containers may be excluded from returns under RUO integrity policies. Weigh or extract material per your analytical SOP if the study requires solubilized peptide rather than whole capsule testing.</p>
<p>USA fulfillment supports predictable receiving for university and CRO procurement teams. ${RUO}</p>`;
  }
  if (form === "Cream") {
    return `<h2>Topical research cream storage &amp; use</h2>
<p>Bioregulator creams in the catalog are positioned for dermal and soft-tissue research models investigating localized peptide delivery—not for consumer cosmetic claims. Store at labeled conditions; avoid contamination of jar surfaces during lab handling.</p>
<p>Batch documentation should be reviewed before introducing material into skin explant or permeation assays. ${RUO}</p>`;
  }
  return `<h2>Lyophilized vial storage &amp; reconstitution</h2>
<p>Lyophilized research peptides should be stored refrigerated (2–8°C) before reconstitution. Use bacteriostatic water or institution-approved diluent; gentle swirling only—no vigorous shaking that can denature sensitive sequences.</p>
<p>Aliquot after reconstitution to limit freeze-thaw cycles. Calculate volumes with our <a href="/resources/peptide-calculator">peptide calculator</a> and follow the <a href="/research/peptide-reconstitution-guide">reconstitution guide</a> for general handling principles.</p>
<p>Dispose of lab waste per your institutional chemical hygiene plan. ${RUO}</p>`;
}

function categorySection(product: Product): string {
  const cat = product.category;
  const name = product.name;

  if (cat === "Flagship Products") {
    return `<h2>Flagship research peptide SKU</h2>
<p>${name} is a high-demand line in the BioLongevity Labs catalog, selected for laboratories running tissue repair, signaling, and regeneration-focused assays. Flagship SKUs receive priority batch testing documentation and are commonly referenced in multi-compound study designs.</p>
<p>Institutions standardizing on a single vendor often pair flagship peptides with shared COA review workflows—HPLC purity targets of 99%+, identity confirmation by mass spectrometry, and batch numbers that match vial labels.</p>`;
  }
  if (cat === "Bioregulator Vials") {
    return `<h2>Bioregulator lyophilized vials</h2>
<p>${name} belongs to our bioregulator vial family: short peptide sequences studied for organ- and tissue-specific gene-expression patterns in cell models. Khavinson-class and related bioregulators differ from general repair peptides (e.g., BPC-157) in how labs frame hypotheses around vascular, immune, metabolic, or CNS endpoints.</p>
<p>Use the <a href="/shop/bioregulators">bioregulator shop</a> to compare vials, capsules, and creams within the same research program.</p>`;
  }
  if (cat === "Bioregulator Capsules") {
    return `<h2>Organ-specific bioregulator capsules</h2>
<p>${name} is part of the A-series bioregulator capsule line derived from tissue-specific peptide complexes used in longevity and organ-support research models. Capsules provide convenient dosing units for studies that measure peptide stability in oral-dosage-form matrices—not for over-the-counter supplement use.</p>
<p>Match capsule selection to your model system (thyroid, thymus, liver, vascular, etc.) and cross-reference published bioregulator literature in our Research hub.</p>`;
  }
  if (cat === "Bioregulator Creams") {
    return `<h2>Bioregulator topical research creams</h2>
<p>${name} supports localized delivery research—soft tissue, dermal, and cosmetic-adjacent assay systems that require topical matrices rather than injectable lyophilized powder. Cream SKUs combine bioregulator concepts with formulation research relevant to permeation and tissue response endpoints.</p>`;
  }
  if (cat === "Peptide Capsules") {
    return `<h2>Research peptide capsules</h2>
<p>${name} is offered in capsule form for laboratories studying oral peptide stability, bioavailability models, and convenience dosing in non-human research systems. Capsule integrity and fill uniformity should be verified per your incoming QC checklist.</p>`;
  }
  if (cat === "SARMS") {
    return `<h2>SARM research compounds</h2>
<p>${name} is listed for non-clinical laboratory investigation of selective androgen receptor modulator pathways. Handle under institutional chemical hygiene standards with appropriate PPE and storage segregation from unrelated peptide work when required by your SOP.</p>`;
  }
  return `<h2>Research-grade catalog listing</h2>
<p>${name} is manufactured and tested for qualified research buyers who require documented purity and identity before material enters cell culture or in vivo non-clinical models. ${RUO}</p>`;
}

const COA_SECTION = `<h2>Certificate of analysis (COA) &amp; quality verification</h2>
<p>Every release should be tied to a batch-specific certificate of analysis—not a generic marketing PDF. BioLongevity Labs targets ≥99% purity by HPLC where applicable, with mass spectrometry confirmation of sequence or molecular weight on lyophilized peptides.</p>
<p>On receipt, verify that the batch number on the COA matches the vial or container label, archive the document in your ELN/LIMS, and reject material that lacks identity data. Read our <a href="/research/how-to-read-peptide-coa">COA interpretation guide</a> for red flags and institutional procurement checklists.</p>
<p>Third-party or qualified in-house testing should be cited in publication methods. Do not assume prior batches apply to new experiments.</p>`;

const PROCUREMENT_SECTION = `<h2>Ordering, fulfillment &amp; institutional procurement</h2>
<p>BioLongevity Labs fulfills research orders from USA facilities with documented RUO acceptance at checkout. Business-day cutoffs apply for same-day shipping on qualifying orders—see <a href="/shipping-and-payments">shipping and payments</a> for carrier and cutoff details.</p>
<p>Qualified laboratories, universities, and CROs may contact <a href="/support">support</a> for batch traceability questions. Wholesale inquiries route through <a href="/wholesale">wholesale</a>. For peptide selection by research goal, use the <a href="/protocol-finder">protocol finder</a>.</p>
<p>Returns on opened research material may be restricted to preserve chain-of-custody—review <a href="/refunds">refund policy</a> before ordering.</p>`;

const METHODOLOGY_SECTION = `<h2>Study design &amp; methodology recommendations</h2>
<p>Structure experiments with pre-registered endpoints, power analysis, and batch-randomized treatment arms. Include vehicle controls, positive controls where available, and blinded readouts when feasible. Document incubator conditions, passage number, serum lot, and media composition—environmental variables often dominate peptide response magnitude in cell systems.</p>
<p>For multi-dose studies, prepare a master stock at the highest planned concentration, then serially dilute with the same solvent lot to reduce preparation error. Log vial IDs, reconstitution timestamps, and storage duration on the bench sheet. When combining peptides, add combination arms only if specified a priori; otherwise confounding undermines interpretability.</p>
<p>Replicate across biological replicates (distinct wells, animals, or tissue isolations) rather than technical duplicates alone. Report effect sizes with confidence intervals, not only p-values. If results are null, publish or archive them to reduce literature bias in peptide research.</p>`;

const DOCUMENTATION_SECTION = `<h2>Documentation for publications &amp; audits</h2>
<p>Methods sections should name the commercial source (BioLongevity Labs), catalog identifier, lot/batch number, stated purity, analytical methods cited on the COA, solvent, and storage between use. Link internal ELN entries to the exact PDF COA received with the shipment.</p>
<p>During institutional audits, auditors expect traceability from purchase order → receiving record → bench use → disposal. Maintain temperature logs for refrigerators storing lyophilized material. Flag any vial with compromised stopper or label illegibility before use.</p>
<p>Do not cite consumer forum dosing as rationale for laboratory concentrations. Use peer-reviewed primary literature or pilot titrations in your model system.</p>`;

const COMPARISON_SECTION = `<h2>Comparing vendors &amp; material qualification</h2>
<p>When qualifying a new supplier, run side-by-side identity checks (HPLC/MS), endotoxin screening if required by your facility, and a minimal bioassay relevant to your lab. Reject material with template COAs lacking batch numbers or chromatogram traces.</p>
<p>BioLongevity Labs competes on documentation transparency, USA-oriented fulfillment, and a broad catalog spanning repair peptides, bioregulators, and specialty research lines. See <a href="/research/where-to-buy-research-peptides">where to buy research peptides (USA)</a> for procurement criteria and <a href="/support/faq">research FAQ</a> for ordering policies.</p>`;

const BIOREGULATOR_EXTRA = `<h2>Bioregulator research primer</h2>
<p>Bioregulator peptides are short sequences studied for organ-specific gene-expression effects in cell and tissue models—distinct from broad-spectrum repair peptides. Khavinson-class compounds appear across vascular, immune, metabolic, and CNS research literature with model-specific endpoints.</p>
<p>Capsule lines (A-series) reflect tissue-derived peptide complexes used in aging and organ-support research framing; lyophilized vials suit precise mass-based dosing in culture. Choose formulation based on how your protocol delivers peptide to the biological system under study.</p>`;

const ABOUT_PRODUCT_INTRO = (product: Product) => {
  const plainDesc = product.description
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const lead =
    plainDesc.length > 40
      ? `<p>${plainDesc}</p>`
      : `<p>${product.name} is supplied as a research-grade ${product.form.toLowerCase()} in the ${product.category} category for qualified laboratory use.</p>`;
  return `<h2>Overview</h2>
${lead}
<p>BioLongevity Labs synthesizes and distributes this SKU for in vitro and qualified non-clinical research. Buyers must be 18+ and accept research-use-only terms. The compound is not approved as a drug, medical device, or dietary supplement for human use.</p>
<p>SKU path: <a href="${productPath(product)}">${product.name}</a>. Compare alternatives in the <a href="/shop">full shop</a> or browse <a href="/research">research articles</a> for handling and mechanism primers.</p>`;
};

/** Per-product overrides with 800+ words (Sprint B top PDPs + high-traffic SKUs). */
const PRODUCT_BODY_OVERRIDES: Record<string, string> = {
  prod_105727: `<h2>Regeno Blend — BPC-157, TB-500 &amp; Cartalax (30mg)</h2>
<p>Regeno Blend combines three research peptides—10mg BPC-157, 10mg TB-500, and 10mg Cartalax—in one lyophilized vial for laboratories studying connective-tissue signaling, matrix remodeling, and synergistic regeneration pathways in controlled models.</p>
<h2>Why labs choose a multi-peptide blend</h2>
<p>Combining BPC-157 and TB-500 reduces preparation variables when comparing migration, angiogenesis, and fibroblast proliferation readouts against Cartalax-inclusive matrix assays. Document the exact milligram ratio in methods sections and tie results to the batch COA shipped with your order.</p>
<p>Single-compound SKUs remain available if your IRB or study design requires monotherapy arms. ${RUO}</p>
<h2>Quality &amp; batch documentation</h2>
<p>Each batch is released with HPLC-documented purity and identity testing suitable for institutional receiving. Verify batch numbers on the vial against the COA before reconstitution; archive PDFs in your ELN.</p>
<h2>Reconstitution &amp; storage</h2>
<p>Store lyophilized powder at 2–8°C. Reconstitute with bacteriostatic water per SOP; aliquot to avoid repeated freeze-thaw. See the <a href="/research/peptide-reconstitution-guide">reconstitution guide</a> and <a href="/resources/peptide-calculator">calculator</a>.</p>
<h2>Research literature themes</h2>
<p>BPC-157: cytoprotection, tendon/ligament fibroblast studies. TB-500: Thymosin β4–related actin and migration models. Cartalax: cartilage and extracellular-matrix research. None of these applications constitute human treatment claims.</p>
<h2>Procurement</h2>
<p>Order from the USA catalog with RUO checkout attestation. Questions: <a href="/support">support</a>. Related: <a href="/research/bpc-157-vs-tb-500">BPC-157 vs TB-500</a>, <a href="/research/best-peptides-for-healing">healing research peptides</a>.</p>`,
  prod_201099: `<h2>Thymulin peptide (10mg) for immune research</h2>
<p>Thymulin is a zinc-dependent nonapeptide produced by thymic epithelial cells, used in immune cell differentiation, T-cell maturation, and neuroendocrine–immune interaction studies. This 10mg lyophilized vial is intended for qualified laboratory research only.</p>
<h2>Mechanistic background</h2>
<p>Active thymulin requires zinc coordination; apothymulin forms may differ in bioactivity in cell assays. Design experiments with appropriate cofactors and controls. Distinguish thymulin (defined sequence) from thymalin (multi-component extracts) in your protocol narrative.</p>
<p>Literature spans thymic involution models, T-cell subset profiling, and cytokine co-regulation experiments. Align concentrations to pilot titrations rather than unverified non-research dosing tables.</p>
<h2>COA &amp; identity</h2>
<p>Batch-specific HPLC and mass spectrometry documentation accompanies release. Match batch IDs to vial labels on receipt. <a href="/research/how-to-read-peptide-coa">How to read a COA</a>.</p>
<h2>Handling</h2>
<p>Refrigerate lyophilized material; reconstitute per institutional SOP. Aliquot after first thaw. ${RUO}</p>
<h2>Related research</h2>
<p><a href="/research/thymulin-research-overview">Thymulin overview</a>, <a href="/research/what-is-a-bioregulator">bioregulators</a>, <a href="/shop/bioregulators">bioregulator catalog</a>.</p>`,
  prod_230039: `<h2>Follistatin (FLGR242) 10mg — myostatin-pathway research</h2>
<p>Follistatin FLGR242 is supplied as a lyophilized research peptide for laboratories investigating activin/myostatin signaling, muscle cell models, and related metabolic pathways. This SKU is analytical-grade research material, not a consumer supplement.</p>
<h2>Experimental framing</h2>
<p>Define whether your study measures receptor binding, gene expression, protein secretion, or phenotypic differentiation. Follistatin-related tools require context-specific controls because pathway effects vary by cell type and serum conditions.</p>
<p>Serum lot and differentiation state strongly modulate readouts; block with appropriate pathway inhibitors where your design requires causal inference. Archive COA batch IDs with each figure panel.</p>
<p>Document batch purity and solvent composition in methods. For combination studies, cite each peptide batch independently in supplementary tables. Subscription and one-time SKUs share the same analytical release standards when batch numbers match. ${RUO}</p>`,
  prod_26974: `<h2>Vesugen bioregulator (20mg) — vascular &amp; aging research</h2>
<p>Vesugen (Lys-Glu-Asp) is a Khavinson-class tripeptide bioregulator used in endothelial, vascular, and cellular aging research programs. The 20mg lyophilized format supports precise mass-based preparation for in vitro systems.</p>
<p>Compare Vesugen hypotheses against general repair peptides (BPC-157, TB-500) only when your protocol explicitly tests different mechanism classes. Bioregulators target organ-specific expression research questions.</p>
<p>Endothelial barrier, angiogenesis sprouting, and senescence-associated secretory phenotype assays appear frequently in related literature—select endpoints that match your tissue source.</p>`,
  prod_4103: `<h2>Cartalax peptide (20mg) — cartilage &amp; matrix research</h2>
<p>Cartalax is used in connective-tissue, chondrocyte, and extracellular-matrix remodeling studies. Researchers pair Cartalax with matrix assays and co-culture systems; combination blends such as Regeno (BPC-157/TB-500/Cartalax) exist for multi-arm designs.</p>
<p>Verify batch COA before introduction to culture; store lyophilized vials cold. ${RUO}</p>`,
};

function wrapSections(sections: string[]): string {
  return sections.filter(Boolean).join("\n");
}

/**
 * Returns HTML body copy targeting 800+ words for PDP SEO.
 * Composes category + compound + quality blocks; top SKUs use full overrides.
 */
function sharedTailSections(product: Product): string {
  return wrapSections([
    COA_SECTION,
    formHandlingSection(product),
    METHODOLOGY_SECTION,
    DOCUMENTATION_SECTION,
    COMPARISON_SECTION,
    isBioregulator(product) ? BIOREGULATOR_EXTRA : "",
    `<h2>Compliance &amp; safety in the lab</h2>
<p>Handle research chemicals with appropriate PPE, engineering controls, and waste disposal per your chemical hygiene plan. Train staff on lyophilized peptide handling, sharps, and spill response. ${RUO}</p>
<p>BioLongevity Labs does not provide medical, legal, or dosing advice. Buyers represent that use is solely for research.</p>`,
    PROCUREMENT_SECTION,
    relatedLinksHtml(product),
  ]);
}

export function getExpandedProductBody(product: Product): string {
  const override = PRODUCT_BODY_OVERRIDES[product.id];
  if (override) {
    return override + sharedTailSections(product);
  }

  const compound = detectCompound(product.name);
  return wrapSections([
    ABOUT_PRODUCT_INTRO(product),
    compoundSection(product.name, compound),
    categorySection(product),
    `<h2>Research program design notes</h2>
<p>Define primary and secondary endpoints before ordering: cell viability, migration, qPCR panels, or secretome profiling. Use vehicle controls and batch-matched reference material. Power studies for expected effect sizes rather than duplicating anecdotal dosing from non-research forums.</p>
<p>When publishing, include vendor name, catalog identifier, batch number, purity method, and reconstitution solvent. Transparent methods support reproducibility and institutional audit readiness.</p>
<p>Pair ${product.name} with complementary SKUs only when your protocol pre-specifies combination arms—avoid post-hoc stacking that confounds interpretation.</p>`,
    sharedTailSections(product),
  ]);
}

export function expandedBodyWordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

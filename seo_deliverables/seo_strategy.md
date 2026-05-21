# SEO + GEO Strategy: BioLongevity Labs

**Site:** https://biolongevitylabss.com  
**Stack:** Next.js (App Router) on Vercel  
**Niche:** Research-grade peptides & bioregulators (B2B/research e-commerce, USA)  
**Primary geography:** United States (English)  
**Local SEO:** Not primary (online fulfillment; no GBP requirement unless adding physical lab tours)

---

## Executive Summary

BioLongevity Labs has a solid technical foundation: dynamic sitemap, robots.txt, product/research JSON-LD, and Core Web Vitals passing on key URLs. The largest risks are **incorrect global canonical tags** (every page may inherit `canonical: /`), **missing high-intent content** (6+ keyword gaps in `keyword_map.csv`), **thin utility pages** (`/protocol-finder`), and **unverified analytics** (GSC/GA4 unknown).

This plan follows the [SEO_GEO_Master_Prompt.md](../SEO_GEO_Master_Prompt.md) execution order over ~90 days.

| Phase | Focus | Timeline | Priority |
|-------|--------|----------|----------|
| 0 | Audit (done — see `seo_deliverables/`) | Week 1 | **Critical** |
| 1 | Keyword mapping & gaps | Week 1–2 | **Critical** |
| 2 | Technical SEO fixes | Week 2–3 | **Critical** |
| 3 | On-page + internal links | Week 3–5 | **High** |
| 4 | Schema expansion | Week 4–6 | **High** |
| 5 | GEO/AEO (answer blocks, llms.txt) | Week 5–7 | **High** |
| 6 | Content calendar (pillar posts) | Week 6–12 | **High** |
| 7 | Analytics + KPI dashboard | Week 2–4 | **Critical** |
| 8 | Link building (ongoing) | Month 2+ | Medium |

---

## Current State (Phase 0 — Complete)

### Strengths
- CWV baseline passes (LCP ≤ 2.5s on home, shop, about)
- Product pages: `Product` + `BreadcrumbList` schema
- Research hub with `BlogPosting`-capable content structure
- Cart/checkout correctly `noindex`
- Dynamic sitemap includes products + research posts
- Competitor set identified (Peptide Sciences, Core Peptides, etc.)

### Critical issues

| Issue | Impact | Fix |
|-------|--------|-----|
| Root `layout.tsx` sets `canonical: "/"` for all routes | **Critical** — duplicate/canonicalization risk | Remove global canonical; set per-route `alternates.canonical` |
| Missing `/og-image.png` in `public/` | **High** — broken social previews | Add 1200×630 branded OG asset |
| 6 keyword-mapped URLs have `Gap: Y` | **High** — lost organic traffic | Publish research articles (see calendar) |
| `robots.ts` lacks explicit AI crawler rules | **Medium** — GEO crawl clarity | Allow GPTBot, ClaudeBot, PerplexityBot |
| No `llms.txt` | **Medium** — AI discovery | Add to `public/llms.txt` |
| Sitemap omits `/protocol-finder`, `/peptide-guide`, `/support`, `/wholesale`, calculator | **Medium** — crawl gaps | Extend `sitemap.ts` |
| `/protocol-finder` thin (~200 words) | **Medium** | Add indexable copy + FAQ schema |
| GSC/GA4 | GSC verified (DNS); GA4 in codebase — link properties + submit sitemap | **High** |

### Audit artifacts (already in repo)
- `audit_report.json`, `crawl_inventory.csv`, `core_web_vitals_baseline.json`
- `seo_baseline.json`, `competitor_report.csv`, `keyword_map.csv`

---

## Phase 1 — Keyword Strategy

### Primary clusters (from `keyword_map.csv`)

| Cluster | Primary keyword | Target page | Status |
|---------|-----------------|-------------|--------|
| Brand + category | research peptides | `/` | Live — optimize H1/meta |
| Transactional | buy bpc 157, tb 500 for sale | Product PDPs | Live — enrich titles |
| Commercial | bioregulator peptides | `/shop?category=...` | Live — category landing copy |
| Informational | bpc 157 dosage, how to reconstitute | `/research/*` | **Gap — create posts** |
| Comparison | bpc 157 vs tb 500 | `/research/bpc-157-vs-tb-500` | **Gap** |
| Definition | what is a bioregulator | `/research/what-is-a-bioregulator` | **Gap** |

### GEO conversational targets (add to content briefs)
- "What are research-grade peptides?"
- "How do you reconstitute lyophilized peptides for lab use?"
- "BPC-157 vs TB-500 — which is used for which research models?"
- "Where to buy peptides online with third-party COAs?"

### Negative keywords (avoid over-targeting)
- Human consumption, bodybuilding dosing, "steroids," prescription pharmacy terms

---

## Phase 2 — Technical SEO (Implementation Checklist)

### Week 2 — Code changes (agent-implementable)
- [x] Remove site-wide `canonical: "/"` from root layout
- [ ] Add `alternates.canonical` on each public layout (`/shop`, `/about`, `/research`, etc.)
- [ ] Per-route metadata on product `generateMetadata` (include `canonical`, `robots`)
- [ ] Extend `robots.ts` with AI bot allow rules
- [ ] Add `public/llms.txt`
- [ ] Extend `sitemap.ts` with utility + resource URLs
- [ ] Add `public/og-image.png` (design asset — **needs brand file**)
- [ ] `noindex` on `/emails-preview`, `/access-denied`, admin (verify)
- [ ] Block faceted/filter query URLs in robots (`/shop?*` optional — evaluate index strategy)

### Week 2–3 — Infrastructure
- [ ] Security headers via `next.config` (HSTS, X-Content-Type-Options, Referrer-Policy)
- [ ] Preload LCP hero image on homepage
- [ ] Defer Smartsupp chat (`lazyOnload`) if INP regresses
- [ ] CI: Lighthouse + schema validation workflow (Section 11 of master prompt)

---

## Phase 3 — On-Page SEO

### Homepage (`/`)
- **Title:** `Research Grade Peptides for Sale | BioLongevity Labs` (≤60 chars)
- **H1:** Already strong — "Buy Research Peptides for Sale Online"
- **Answer capsule (GEO):** 40–60 word block in first 200 words with `id="answer"`
- **Internal links:** Pillar links to `/shop`, `/research`, `/about`, top 3 PDPs

### Shop (`/shop`)
- Unique meta (partially done in `shop/layout.tsx`)
- Add 300+ words category intro above grid (research use, COA standards)
- Canonical: `https://biolongevitylabss.com/shop` (not filtered URLs unless dedicated landing pages)

### Product PDPs
- Title pattern: `{Product Name} for Research | BioLongevity Labs`
- Expand descriptions to 800+ words where thin
- FAQ section per top SKU → `FAQPage` schema
- `AggregateRating` only when real review data exists

### About
- Fix H1 (audit noted duplicate "Welcome" pattern on some pages — verify live DOM)
- Target: `peptide synthesis usa`, US manufacturing, third-party testing

### Protocol finder
- Add 600+ words: how tool works, research disclaimers, links to related products
- `FAQPage` schema for top 5 questions

---

## Phase 4 — Structured Data Roadmap

| Page type | Schema | Status |
|-----------|--------|--------|
| Global | Organization, WebSite | Done |
| Product PDP | Product, BreadcrumbList | Done — add `Offer` validation |
| Research article | BlogPosting, BreadcrumbList | Partial — verify on `[slug]` |
| FAQ hubs | FAQPage | Not done |
| Peptide calculator | WebApplication or HowTo | Not done |
| Comparison posts | Article + FAQ | Pending content |

Validate all URLs in [Google Rich Results Test](https://search.google.com/test/rich-results) after deploy.

---

## Phase 5 — GEO / AEO

1. **Answer capsules** on homepage, shop intro, top 10 PDPs, all new research posts  
2. **Question-first H2s** on new content ("How do you reconstitute BPC-157 for research?")  
3. **`llms.txt`** at site root — brand summary + key URLs  
4. **AI crawlers** allowed in robots.txt  
5. **E-E-A-T:** Author bios on research posts, visible "Last updated," COA methodology page  
6. **Future pages:** Glossary (`/research/glossary`), FAQ hub (`/support/faq`), comparison articles  

---

## Phase 6 — Content Strategy (90 Days)

### Content gaps → priority articles

| Publish (target) | Slug | Primary keyword | Words |
|------------------|------|-----------------|-------|
| Week 2 | `bpc-157-dosage-guide` | bpc 157 dosage | 1,500+ |
| Week 3 | `peptide-reconstitution-guide` | how to reconstitute peptides | 1,500+ |
| Week 4 | `bpc-157-vs-tb-500` | bpc 157 vs tb 500 | 2,000+ |
| Week 5 | `what-is-a-bioregulator` | what is a bioregulator | 1,200+ |
| Week 6 | `best-peptides-for-healing` | best peptides for healing | 2,500+ |

### Existing research (4 posts)
- Expand internal links to matching PDPs
- Add `dateModified`, author schema, answer capsule at top

### Content mix (90 days)
- 60% informational (research hub)
- 20% commercial (category/PDP copy)
- 20% trust (about, COA process, shipping)

See `content_calendar.csv` and `internal_linking_plan.csv` in this folder.

---

## Phase 7 — Analytics & KPIs

### Setup (Week 1–2)
1. Google Search Console — DNS verification for `biolongevitylabss.com`
2. GA4 property + GTM container
3. Link GSC ↔ GA4
4. Conversion events: `purchase`, `begin_checkout`, `generate_lead` (wholesale form), `click` (tel/email)
5. Submit sitemap; enable email alerts for coverage/CWV issues

### KPI targets (6 months)

| KPI | Baseline | Target | Source |
|-----|----------|--------|--------|
| Organic sessions | TBD | +30% @ 90d | GA4 |
| Top-10 keywords | Low/new | 2× | GSC / Ahrefs |
| Avg position (brand + commercial) | TBD | < 15 | GSC |
| CTR | TBD | > 3% | GSC |
| LCP | Pass | ≤ 2.5s | GSC CWV |
| Referring domains | Low | +10/mo | Ahrefs |
| AI citation rate | 0% tracked | Establish baseline | Manual weekly spot-check |

---

## Phase 8 — Off-Page SEO

### Competitor backlink gap (from `competitor_report.csv`)
Prioritize editorial links from: lab supply blogs, longevity research newsletters, peptide comparison roundups.

### Tier 1 tactics (Month 2+)
- Unlinked mention outreach
- HARO / Qwoted expert quotes (research compliance angle)
- Original data: "2026 COA transparency survey" — extend existing industry report post

### Do not
- Buy links, PBNs, or keyword-stuffed guest posts

---

## Implementation Order (Next 2 Weeks)

### Sprint A — Technical (Days 1–3)
1. Canonical + robots + llms.txt + sitemap (in progress)
2. OG image asset
3. GSC/GA4 verification

### Sprint C — Content (Week 2–6) ✅ First batch live
1. Five gap articles published in `researchPostsSprintC.ts` (dosage, reconstitution, comparison, bioregulator, healing pillar)
2. Blog API merges static + dynamic posts (`mergeResearchPosts`)
3. Research articles include answer capsules, internal links, BlogPosting schema

### Sprint B — On-page (Days 4–10) ✅ Implemented
1. Homepage answer capsule + metadata (`page.tsx`, `HomePage.tsx`)
2. Shop category copy + H1 (`shop/page.tsx`, `shop/layout.tsx`)
3. Top 5 PDP meta + FAQ blocks (`product-seo.ts`: prod_105727, prod_201099, prod_230039, prod_26974, prod_4103)

### Sprint C — Content (Days 10–21)
1. First gap article: BPC-157 dosage guide
2. Internal linking pass per `internal_linking_plan.csv`

---

## Risks & Assumptions

> **Confirmed:** Production domain is `https://biolongevitylabss.com` (double “s”). All canonicals, sitemap, GA4, and GSC should use this host only.  
> **Assumption:** Products are for research use only — all copy must maintain RUO/disclaimer compliance.  
> **Risk:** Peptide niche faces YMYL-adjacent scrutiny — prioritize E-E-A-T and accurate COA claims.  
> **Risk:** Filter URLs (`/shop?category=`) may create duplicate content — use canonical or noindex on parameterized views.  
> **Unspecified:** GSC/GA4 access — required for baseline KPIs.

---

## Deliverables Checklist

| File | Status |
|------|--------|
| `audit_report.json` | Done |
| `crawl_inventory.csv` | Done |
| `core_web_vitals_baseline.json` | Done |
| `keyword_map.csv` | Done |
| `competitor_report.csv` | Done |
| `seo_strategy.md` | This document |
| `internal_linking_plan.csv` | Done |
| `content_calendar.csv` | Done |
| `content_briefs/` | Pending (generate per sprint) |
| `llms.txt` (live at `/llms.txt`) | Done |
| `analytics_setup.md` | Done |
| `schema_validation_report.json` | Pending post-deploy |
| `link_gap_opportunities.csv` | Pending Ahrefs access |

---

## Handoff: What You Need to Provide

1. ~~**GSC verification**~~ — Done (DNS). Submit sitemap + link GA4 in GSC/GA4 UI  
2. **Branded OG image** (1200×630 PNG)  
3. **Social profile URLs** for Organization `sameAs` (LinkedIn, X, etc.)  
4. **Approval** for first 3 research articles (RUO-compliant copy)  
5. **Optional:** Ahrefs/SEMrush API for automated rank tracking  

---

*Strategy aligned with SEO_GEO_Master_Prompt.md (2026 Edition). Update this doc as sprints complete.*

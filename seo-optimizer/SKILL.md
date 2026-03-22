---
name: seo-optimizer
description: Perform a comprehensive SEO audit and optimization for any website. Use this skill whenever the user mentions SEO, search rankings, technical audits, on-page optimization, or keywords. This skill should be used to scan the codebase for missing metadata, alt tags, and structural issues, and to propose or apply fixes to improve search engine visibility and performance.
---

# SEO Optimizer

A comprehensive skill for auditing and improving website search engine optimization (SEO). 

This skill covers technical SEO, on-page content optimization, media accessibility, and off-page strategy.

## Core Workflows

### 1. Technical SEO Audit
Run an automated scan of the project to identify underlying technical issues.
- **Tools**: Use `scripts/seo_audit.py` (if available) to scan for missing metadata and alt tags.
- **Checklist**:
  - `robots.txt`: Ensure it’s present and configured correctly.
  - `sitemap.xml`: Verify it includes all key pages and is referenced in `robots.txt`.
  - Canonical tags: Ensure each page has a canonical URL to prevent duplicate content issues.
  - Page Speed: Check for large unoptimized images or render-blocking scripts.

### 2. On-Page Optimization
Review and improve individual page elements.
- **Metadata**:
  - **Titles**: 50–60 characters, include primary keywords near the beginning.
  - **Descriptions**: 150–160 characters, compelling call-to-action, includes keywords.
  - **Keywords**: Define 1–3 primary keywords per page.
- **Content Structure**:
  - **H1**: Exactly one per page, containing the primary keyword.
  - **Headers (H2-H6)**: Sequential hierarchy; use for subtopics.
  - **Internal Linking**: Link to related pages within the site using descriptive anchor text.

### 3. Media & Accessibility
Ensure all visual assets contribute to SEO.
- **Alt Text**: Every image must have a descriptive `alt` attribute that includes context and keywords where relevant.
- **Image Formats**: Prefer modern formats like WebP or Avif.
- **Filenames**: Use hyphenated, descriptive filenames (e.g., `premium-peptide-bpc157.webp`).

### 4. Schema & Structured Data
Implement JSON-LD schema to help search engines understand page content.
- **Common Types**: `Product`, `Article`, `Organization`, `BreadcrumbList`.
- **Implementation**: Add `<script type="application/ld+json">` to the head or via framework-specific metadata components.

## Best Practices

- **Mobile First**: Ensure the site is responsive and performs well on mobile devices.
- **Semantic HTML**: Use tags like `<main>`, `<article>`, `<nav>`, and `<footer>` rather than generic `<div>`s.
- **URL Structure**: Keep URLs clean, descriptive, and short (e.g., `/shop/peptides` instead of `/p?id=123`).

## Strategy: Off-Page SEO
Provide guidance on building authority.
- **Backlink Profiling**: Suggest high-authority industry sites for outreach.
- **Social Signals**: Recommend social sharing strategies for blog content.
- **E-E-A-T**: Focus on Experience, Expertise, Authoritativeness, and Trustworthiness in content.

---

## Technical Audit Script
When asked to perform a "technical audit", use the following command if available in the skill's scripts directory:
```bash
python scripts/seo_audit.py
```
If the script is not present, perform a manual grep search for `<img` without `alt`, and pages without `metadata`.

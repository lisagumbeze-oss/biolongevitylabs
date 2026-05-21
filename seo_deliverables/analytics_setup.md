# Analytics Setup — BioLongevity Labs

## Google Analytics 4

| Setting | Value |
|---------|--------|
| Measurement ID | `G-0SF8MTQP01` |
| Implementation | `src/components/GoogleAnalytics.tsx` (Next.js `Script`, `afterInteractive`) |
| Env override | `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional) |
| Excluded routes | `/admin/*` (not loaded in browser) |

### Verify after deploy

1. Open site in Chrome → DevTools → Network → filter `google-analytics` or `collect`
2. GA4 → **Reports → Realtime** — confirm active user
3. Link property to **Google Search Console** (GA4 Admin → Product links)

### Ecommerce events (implemented in code)

| Event | Trigger | Source |
|-------|---------|--------|
| `add_to_cart` | Any `useCart.addItem()` | `src/store/useCart.ts` + `src/lib/analytics.ts` |
| `begin_checkout` | Checkout page load (once per visit) | `src/app/checkout/page.tsx` |
| `purchase` | Successful order submit | `src/app/checkout/page.tsx` |
| `purchase` (backup) | Order confirmation if primary missed | `src/app/order-confirmation/page.tsx` |

Events send `currency: USD`, line items (`item_id`, `item_name`, `price`, `quantity`, `item_variant`), and volume-discount pricing aligned with cart totals.

Mark `purchase` as a **conversion** in GA4 Admin → Events.

### Optional GA4 events (not yet coded)

| Event | Trigger |
|-------|---------|
| `generate_lead` | Wholesale form submit |
| `view_item` | Product page view |

### Google Search Console

| Setting | Status |
|---------|--------|
| Property | `biolongevitylabss.com` (Domain) |
| Verification | **Done** — domain name provider (DNS) |
| Code needed in codebase | **No** — DNS verification does not use a site snippet |

**No verification code is required from you.** GSC ownership is already established.

#### Do these in the GSC UI (no code to share)

1. **Sitemaps** → Submit: `https://biolongevitylabss.com/sitemap.xml`
2. **Settings → Associations** → Link your GA4 property (`G-0SF8MTQP01`)
3. **Settings → Users** — only add people who need access
4. After deploy, check **Pages** / **Indexing** for coverage issues

Optional later: Search Console API for automated reports (service account JSON in `.env` — only if you want agent/automation access; not required for SEO).

### Next steps

- [ ] Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-0SF8MTQP01` to Vercel production env (optional if using default)
- [x] GSC domain verification
- [ ] Submit sitemap in GSC (manual, one-time)
- [ ] Link GA4 ↔ GSC in both products
- [ ] Enable enhanced measurement in GA4 property settings

# Domain 8: SEO & Metadata Management

## Features to Build

### Global SEO Settings `/admin/settings/seo`
- Site title template: `%page_title% | %site_name%`
- Default meta description
- Default OG image (fallback for all pages)
- Robots.txt editor (textarea with save)
- Sitemap: auto-generate on publish, show last generated, manual regenerate button
- Google Search Console verification code field
- Social profiles (Facebook, Twitter/X, Instagram) for schema

### Per-Content SEO
Every post/product/page/category has an SEO tab (see blog-cms.md and products.md):
- Meta title (60 char counter, red when over)
- Meta description (155 char counter)
- Focus keyword → content analysis (keyword in title, URL, first paragraph, image alt)
- OG title + OG description (default to meta fields)
- OG image uploader
- Twitter card preview
- Canonical URL (default to page URL, override for syndicated content)
- noindex toggle (exclude from search engines)

### Redirects Manager `/admin/seo/redirects`
- Table: source URL, destination URL, type (301/302), status, hit count
- Add redirect (manual or bulk import CSV)
- Auto-suggest: if a published post/product slug changes, offer to create redirect
- Detect redirect chains and loops (warning)

### Schema / Structured Data
- Auto-apply schema types by content type:
  - Products → `Product` schema (price, availability, reviews)
  - Blog posts → `Article` schema (author, date, image)
  - Pages → `WebPage` schema
  - Organization → `Organization` schema (set in global settings)
- Preview JSON-LD output per page
- Custom schema block (advanced raw JSON-LD editor)

---

# Domain 9: Settings & Configuration

## Features to Build

### General Settings `/admin/settings/general`
- Store/site name, tagline, description
- Logo upload (header + favicon)
- Contact: email, phone, address
- Timezone selector
- Currency (code, symbol, position, decimal separator, thousands separator)
- Language / locale
- Date format + time format

### Payment Settings `/admin/settings/payments`
- Payment gateway toggles: Stripe / Paystack / Flutterwave / PayPal / manual bank transfer
- Per-gateway: API keys, webhook URL (show, copy), test mode toggle
- Payment method labels shown at checkout
- Minimum order amount

### Email / SMTP Settings `/admin/settings/email`
- SMTP host, port, username, password, encryption
- From name, from email, reply-to
- Test email button (sends to admin email)
- Email template theme: logo, brand color, footer text

### Shipping Settings `/admin/settings/shipping`
- See Domain 14 (shipping.md)

### Tax Settings `/admin/settings/taxes`
- See Domain 15 (taxes.md)

### Notification Settings `/admin/settings/notifications`
- Toggle: email me when (new order / low stock / new customer / new review / failed payment)
- Notify email addresses (multiple, comma-separated)
- Low stock threshold (global default)

### Store Hours / Maintenance
- Store hours (optional: open/close times per day)
- Maintenance mode toggle: enable with custom message, allowed IPs
- Coming soon mode toggle

### Danger Zone
- Clear all cache
- Export all data (GDPR)
- Delete all test orders
- Reset demo data

---

# Domain 10: Reviews & Moderation

## Features to Build

### Review List `/admin/reviews`
- Table: product image/name, reviewer name, rating (stars), review text snippet, date, status, verified purchase badge
- Filters: status (approved/pending/spam/trash), rating (1–5 stars), verified only, date range
- Search: reviewer name, email, product name, review text
- Bulk: approve, mark spam, delete
- "Approve" / "Reject" / "Reply" quick actions inline

### Review Detail
- Full review text
- Reviewer: name, email, link to customer profile
- Product link
- Admin reply editor (appears as "Store response" on frontend)
- Status controls
- Flag reason (spam / inappropriate / fake)

### Moderation Settings
- Auto-approve: verified purchasers only / all / manual only
- Require admin approval before publishing
- Profanity filter: keyword blocklist
- Minimum review length (e.g., at least 20 characters)
- Allow media: photos / videos in reviews toggle

### Rating Summary Widget (per product)
- Overall score, rating distribution bar chart (5★ → 1★)
- Verified vs unverified count

---

# Domain 11: Email & Notifications

## Features to Build

### Transactional Email Templates `/admin/email/templates`
Templates to manage (each with subject line + HTML body editor):
- Order Confirmation
- Order Shipped (includes tracking info)
- Order Delivered
- Order Cancelled
- Refund Issued
- Account Created / Welcome
- Password Reset
- Email Verification
- Abandoned Cart Recovery (series: 1hr, 24hr, 72hr)
- Low Stock Alert (internal)
- New Order Alert (internal)
- Review Request (sent after delivery)

Editor features:
- Visual block editor OR raw HTML
- Template variables: `{{customer_name}}`, `{{order_number}}`, `{{tracking_url}}`
- Preview with test data
- Send test email button
- Mobile preview toggle

### Newsletter / Broadcast `/admin/email/broadcast`
- Compose: subject, preview text, body (block editor)
- Audience: all subscribers / specific segment / imported list
- Schedule: send now or schedule date/time
- A/B test: two subject lines, split 50/50, pick winner after X hours
- Metrics post-send: open rate, click rate, unsubscribes, bounces

### Subscriber List `/admin/email/subscribers`
- Table: email, name, status (subscribed/unsubscribed), source, join date
- Bulk import CSV
- Manual add
- Export filtered list
- Unsubscribe management (honor + log date)

---

# Domain 12: Roles & Permissions

## Features to Build

### Roles List `/admin/roles`
- Built-in roles: Super Admin, Admin, Editor, Support, Analyst (not deletable)
- Custom roles: create, edit, delete
- Permission matrix: rows = permissions, columns = roles, toggle checkboxes

### Permission Categories
```
Dashboard: view_dashboard
Products: view_products, create_products, edit_products, delete_products, publish_products
Orders: view_orders, edit_orders, cancel_orders, issue_refunds
Customers: view_customers, edit_customers, ban_customers, delete_customers
Blog: view_posts, create_posts, edit_posts, delete_posts, publish_posts
Media: view_media, upload_media, delete_media
Coupons: view_coupons, create_coupons, edit_coupons, delete_coupons
Analytics: view_analytics, export_reports
Settings: view_settings, edit_settings
Roles: view_roles, manage_roles
```

### Admin Activity Log `/admin/activity`
- Every admin action logged: who, what action, what resource, timestamp, IP, result
- Filters: by admin user, action type, date range, resource type
- Retention policy setting (e.g., keep 90 days)

---

# Domain 14: Shipping & Logistics

## Features to Build

### Shipping Zones `/admin/settings/shipping/zones`
- Zone: name + list of countries/states/postal codes it covers
- Multiple zones (e.g., "Domestic Nigeria", "West Africa", "International")
- Fallback zone: "Rest of World"

### Shipping Methods (per zone)
- Flat rate: fixed cost (e.g., ₦2,000 per order)
- Free shipping: above minimum cart value
- Weight-based: cost per kg slab
- Per-item: cost × number of items
- Live rates: pull from carrier API (DHL, FedEx, UPS, GIG Logistics, etc.)

### Shipping Classes
- Define classes: Standard, Bulky, Fragile, Digital (no shipping)
- Assign to products
- Apply class surcharges per shipping method

---

# Domain 15: Taxes & Compliance

## Features to Build

### Tax Rates `/admin/settings/taxes`
- Tax classes: Standard / Reduced / Zero / Exempt
- Rate table: country, state/region, zip, class, rate %, compound toggle, priority
- Auto-calculate based on shipping or billing address (configurable)
- Display prices: tax inclusive or exclusive (configurable, shown at checkout)

### Invoice / Receipt Management
- Auto-generate invoice PDF per order
- Invoice numbering format: prefix + sequential number (e.g., INV-2024-0001)
- Company VAT/TIN number shown on invoice
- Download / resend invoice from order detail

---

# Domain 16: Affiliate & Referrals

## Features to Build

### Affiliate List `/admin/affiliates`
- Table: name, email, referral code, total referrals, total orders attributed, total commission earned, status
- Approve / reject applications
- Set commission rate per affiliate (override global)
- Payout history

### Affiliate Settings
- Commission type: percentage / fixed per order
- Default commission rate
- Cookie duration (days referral is tracked after click)
- Minimum payout threshold
- Payout method: manual / PayPal / bank transfer

---

# Domain 17: Support & Tickets

## Features to Build

### Ticket List `/admin/support`
- Table: ticket ID, subject, customer, priority, status, assigned agent, created date, last reply
- Filters: status (open/pending/resolved/closed), priority (low/medium/high/urgent), assigned agent, date range
- Bulk: assign, close, delete

### Ticket Detail
- Thread view: customer messages + admin replies in conversation style
- Reply editor (rich text, attach files)
- Assign to admin user
- Change priority, status
- Internal note (not visible to customer, in different color)
- Customer info sidebar (link to customer profile + their order history)
- Related orders: attach order to ticket for context

### Canned Responses
- Pre-written replies to common questions
- Insert into reply editor with single click
- Categorize by topic

---

# Domain 18: Forms & Lead Capture

## Features to Build

### Form Builder `/admin/forms`
- Drag-and-drop field builder:
  - Text, email, phone, URL, number
  - Textarea
  - Dropdown, checkbox group, radio group
  - Date picker, file upload
  - Star rating, range slider
  - Hidden field
  - Section header / divider

### Form Settings
- Confirmation message (shown after submit) or redirect URL
- Email notification: who receives submissions, what template
- Store submissions in DB (toggle)
- Spam protection: reCAPTCHA / honeypot
- Enable / disable form

### Submissions List
- Table: form name, submitter email, date, status (new/read/starred/spam)
- View full submission data
- Export submissions CSV
- Delete

### Survey Analytics (for survey forms)
- Per-question response breakdown: bar charts for choice fields, text list for open-ended
- Response rate, completion rate
- Date trend: submissions over time

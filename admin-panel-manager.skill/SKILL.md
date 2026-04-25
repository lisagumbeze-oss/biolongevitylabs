---
name: admin-panel-manager
description: >
  Build, scaffold, or manage any admin panel feature for any website or web application.
  Use this skill whenever the user mentions: admin dashboard, admin panel, CMS, backend
  management, product management, blog management, order management, user management,
  coupon/discount management, analytics dashboard, settings panel, media library, role
  permissions, SEO management, or any feature that an admin needs to control from a
  backend UI. Trigger even for partial requests like "add a product from admin", "manage
  orders", "create a coupon code", "moderate comments", "admin blog editor", "view site
  analytics", or "manage users". Always use this skill before building any admin-facing
  interface, panel, section, route, or CRUD screen — regardless of whether the user
  explicitly says "admin panel". If the user is building a full-stack app and mentions
  that they need a way for the site owner/operator to control content, always trigger
  this skill.
---

# Admin Panel Manager Skill

You are a senior full-stack engineer building the admin section of a web platform. Your
job is to architect, scaffold, and implement every management feature an admin user
needs — across e-commerce, CMS, SaaS, marketplaces, and content platforms.

This skill covers **every admin feature domain**. Read the relevant reference file(s)
for the domain(s) the user is working on, then implement with production-grade patterns.

---

## Step 1: Scope the Admin Build

Before building, establish:

1. **Platform type**: E-commerce / Blog-CMS / SaaS / Marketplace / Portfolio / Custom
2. **Stack**: React + Next.js (preferred) / Vue / plain HTML / other
3. **Backend/API**: REST / GraphQL / Supabase / Firebase / NestJS / Laravel / other
4. **Auth layer**: Who is the admin? Single super-admin, role-based team, or multi-tenant?
5. **Which domains**: See the Domain Index below — identify which sections to build
6. **Starting point**: New admin from scratch, or adding features to existing admin?

If the request is clear, skip questions and build with sensible defaults.
**Default stack**: Next.js App Router + Tailwind CSS + shadcn/ui + React Hook Form + Zod.

---

## Domain Index

These are all manageable admin domains. Read the matching reference file before
building any feature in that domain.

| # | Domain | Reference File | Trigger Keywords |
|---|--------|----------------|-----------------|
| 1 | Products & Catalog | `references/products.md` | products, inventory, SKU, variants, categories, collections |
| 2 | Orders & Fulfillment | `references/orders.md` | orders, shipping, fulfillment, returns, refunds, tracking |
| 3 | Users & Customers | `references/users.md` | users, customers, accounts, roles, permissions, bans |
| 4 | Blog & CMS | `references/blog-cms.md` | blog, posts, articles, pages, editor, drafts, categories, tags |
| 5 | Coupons & Promotions | `references/coupons.md` | coupons, discounts, promo codes, flash sales, vouchers |
| 6 | Media & Assets | `references/media.md` | images, media, uploads, gallery, file manager, CDN |
| 7 | Analytics & Reports | `references/analytics.md` | analytics, reports, revenue, traffic, metrics, KPIs, charts |
| 8 | SEO & Metadata | `references/seo.md` | SEO, meta tags, sitemap, canonical, schema, slugs |
| 9 | Settings & Config | `references/settings.md` | settings, configuration, store info, payment, email, notifications |
| 10 | Reviews & Moderation | `references/reviews.md` | reviews, ratings, comments, moderation, flags, spam |
| 11 | Email & Notifications | `references/email-notifications.md` | email templates, notifications, newsletters, SMTP, broadcasts |
| 12 | Roles & Permissions | `references/roles-permissions.md` | roles, permissions, access control, admin users, staff, RBAC |
| 13 | Subscriptions & Plans | `references/subscriptions.md` | subscriptions, plans, billing, SaaS, upgrades, trials |
| 14 | Shipping & Logistics | `references/shipping.md` | shipping zones, rates, carriers, delivery, logistics |
| 15 | Taxes & Compliance | `references/taxes.md` | taxes, VAT, GST, compliance, invoices, receipts |
| 16 | Affiliate & Referrals | `references/affiliates.md` | affiliates, referrals, commissions, partners, payouts |
| 17 | Support & Tickets | `references/support.md` | support tickets, help desk, chat, customer service, inquiries |
| 18 | Forms & Surveys | `references/forms.md` | forms, surveys, lead capture, contact submissions, responses |

---

## Step 2: Universal Admin Layout

Every admin panel must implement this shell before building domain-specific features.

### Layout Structure
```
AdminShell
├── Sidebar (collapsible)
│   ├── Logo / Brand
│   ├── Navigation (grouped by domain)
│   ├── Quick stats strip (optional)
│   └── Admin user avatar + logout
├── Topbar
│   ├── Breadcrumb / Page title
│   ├── Global search (Cmd+K)
│   ├── Notifications bell
│   └── Admin profile menu
└── Main Content Area
    ├── Page Header (title + primary action button)
    ├── Filters / Search bar
    ├── Data Table or Form
    └── Pagination / Bulk Actions bar
```

### Core React Shell (Next.js App Router)
```tsx
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Navigation Config Pattern
```ts
export const adminNav = [
  {
    group: "Store",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Customers", href: "/admin/customers", icon: Users },
    ]
  },
  {
    group: "Content",
    items: [
      { label: "Blog Posts", href: "/admin/blog", icon: FileText },
      { label: "Pages", href: "/admin/pages", icon: File },
      { label: "Media", href: "/admin/media", icon: Image },
    ]
  },
  {
    group: "Marketing",
    items: [
      { label: "Coupons", href: "/admin/coupons", icon: Tag },
      { label: "Email", href: "/admin/email", icon: Mail },
      { label: "Affiliates", href: "/admin/affiliates", icon: Share2 },
    ]
  },
  {
    group: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Roles", href: "/admin/roles", icon: ShieldCheck },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
    ]
  }
];
```

---

## Step 3: Universal CRUD Pattern

Every admin domain uses the same CRUD scaffold. Build it once, adapt per domain.

### Data Table (universal)
```tsx
// components/admin/DataTable.tsx
// Props: columns[], data[], onEdit, onDelete, onBulkAction, searchable, filterable
// Features: sort, paginate, bulk-select, row actions, export CSV

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: string;
  filters?: FilterConfig[];
  bulkActions?: BulkAction[];
  onRowAction?: (action: string, row: T) => void;
  isLoading?: boolean;
  pagination?: PaginationConfig;
}
```

Must-have table features:
- [ ] Column sort (asc/desc toggle)
- [ ] Global search input (debounced 300ms)
- [ ] Column-specific filters (dropdown/date range/boolean)
- [ ] Row checkbox selection → bulk action toolbar
- [ ] Inline row actions: Edit (pencil) / Delete (trash) / View (eye) / more (⋯)
- [ ] Pagination with page size selector (10 / 25 / 50 / 100)
- [ ] Export to CSV button
- [ ] Loading skeleton rows
- [ ] Empty state with CTA

### Form Modal (universal)
```tsx
// All create/edit forms use a Sheet (slide-over) or Dialog
// React Hook Form + Zod validation always
// Pattern:
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: editTarget ?? defaultValues,
});

// On submit: optimistic UI update → API call → toast success/error
```

### Toast Notifications
Always show feedback:
- **Success**: "Product saved ✓" / "Order updated ✓"
- **Error**: "Failed to save — please try again"
- **Confirm destructive**: Modal confirm before delete/ban/refund

---

## Step 4: Dashboard Home Page

The `/admin` root page must always include:

```
┌─────────────────────────────────────────────────────┐
│  KPI Cards Row                                       │
│  [Total Revenue] [Orders Today] [New Users] [Items] │
├──────────────────────────┬──────────────────────────┤
│  Revenue Chart (line)    │  Top Products (ranked)   │
│  Last 30 days            │  By sales volume         │
├──────────────────────────┼──────────────────────────┤
│  Recent Orders Table     │  Recent Signups          │
│  Last 10 orders          │  Last 5 customers        │
├──────────────────────────┴──────────────────────────┤
│  Quick Actions: [+ New Product] [+ Coupon] [Post]   │
└─────────────────────────────────────────────────────┘
```

KPI cards must show:
- Current value (large, bold)
- % change vs last period (green ↑ / red ↓)
- Sparkline or icon
- Link to the full section

---

## Step 5: Auth & Access Control

Every admin must be protected. Implement:

```ts
// middleware.ts (Next.js)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token');
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

// Role guard hook
function useRequireRole(role: AdminRole) {
  const { admin } = useAdminSession();
  if (!admin?.roles.includes(role)) redirect('/admin/unauthorized');
}
```

Role hierarchy (implement in order of need):
1. `super_admin` — full access, can manage other admins
2. `admin` — full content + order access, no billing/roles
3. `editor` — CMS / blog / media only
4. `support` — orders + customers read/write, no config
5. `analyst` — analytics read-only

---

## Step 6: API Integration Patterns

### REST (Express / NestJS / Laravel)
```ts
// Generic admin API hook
function useAdminResource<T>(endpoint: string) {
  const list = () => fetch(`/api/admin/${endpoint}`);
  const create = (data: Partial<T>) => fetch(`/api/admin/${endpoint}`, { method: 'POST', body: JSON.stringify(data) });
  const update = (id: string, data: Partial<T>) => fetch(`/api/admin/${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  const remove = (id: string) => fetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' });
  return { list, create, update, remove };
}
```

### Supabase
```ts
const { data, error } = await supabase
  .from('products')
  .select('*, categories(*), images(*)')
  .order('created_at', { ascending: false })
  .range(offset, offset + pageSize - 1);
```

### React Query (always use for admin data fetching)
```ts
const { data, isLoading } = useQuery({
  queryKey: ['admin', 'products', filters],
  queryFn: () => fetchProducts(filters),
  staleTime: 30_000,
});

const mutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    toast.success('Product updated');
  },
});
```

---

## Step 7: Design System for Admin

Admin panels must feel professional, not flashy. Rules:

### Typography
- Page titles: `text-2xl font-semibold text-gray-900`
- Section labels: `text-sm font-medium text-gray-500 uppercase tracking-wide`
- Table headers: `text-xs font-medium text-gray-500`
- Body: `text-sm text-gray-700`

### Color Usage
- Primary actions: blue (`bg-blue-600 hover:bg-blue-700`)
- Destructive: red (`bg-red-600`)
- Success badges: green (`bg-green-100 text-green-800`)
- Warning badges: amber (`bg-amber-100 text-amber-800`)
- Neutral: gray scale only
- Dark mode: always support (`dark:` variants via Tailwind)

### Component Defaults
- Inputs: `border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500`
- Buttons: always have loading state (`disabled + spinner` while mutating)
- Tables: zebra striping, hover row highlight
- Cards: `bg-white rounded-xl border border-gray-200 shadow-sm p-6`

### Status Badges (universal)
```tsx
const STATUS_BADGE = {
  active:    'bg-green-100 text-green-800',
  inactive:  'bg-gray-100 text-gray-600',
  pending:   'bg-yellow-100 text-yellow-800',
  banned:    'bg-red-100 text-red-800',
  draft:     'bg-gray-100 text-gray-500',
  published: 'bg-blue-100 text-blue-800',
  paid:      'bg-green-100 text-green-800',
  refunded:  'bg-purple-100 text-purple-800',
  shipped:   'bg-indigo-100 text-indigo-800',
};
```

---

## Delivery Checklist

Before shipping any admin feature:

- [ ] Protected by auth middleware (no public access)
- [ ] All CRUD operations wired (list, create, edit, delete)
- [ ] Form validation with helpful error messages
- [ ] Loading states on every async action
- [ ] Toast feedback on success and error
- [ ] Confirm modal on destructive actions (delete, ban, refund)
- [ ] Responsive — usable on tablet (not just desktop)
- [ ] Empty states with clear CTAs
- [ ] Search + filter on all list views
- [ ] Pagination on all list views
- [ ] Bulk actions where applicable
- [ ] Role guard protecting sensitive sections

---

## Reference Files

Read the relevant file(s) below before building any domain-specific feature.
Each file contains the full feature list, data models, UI patterns, and API structure
for that domain. You do not need to read all files — only those relevant to the request.

**Files in `references/`:**
- `products.md` — Domain 1: Products & Catalog
- `orders.md` — Domain 2: Orders & Fulfillment
- `users.md` — Domain 3: Users & Customers
- `blog-cms.md` — Domain 4: Blog & CMS
- `coupons.md` — Domain 5: Coupons & Promotions
- `media.md` — Domain 6: Media & Assets
- `analytics.md` — Domain 7: Analytics & Reports
- `remaining-domains.md` — Domains 8–18: SEO, Settings, Reviews, Email, Roles,
  Subscriptions, Shipping, Taxes, Affiliates, Support, Forms

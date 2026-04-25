# Domain 7: Analytics & Reports

## Features to Build

### Dashboard Overview `/admin/analytics`
**Date range picker** (global): Last 7 / 30 / 90 days, This month, Last month, Custom range. Comparison toggle: vs previous period.

**KPI Row (always visible)**
- Total Revenue (vs previous period %)
- Total Orders (vs previous period %)
- Conversion Rate (orders / sessions)
- Average Order Value (AOV)
- New Customers
- Returning Customers %

**Charts Section**

Revenue Chart (line):
- Daily revenue for selected period
- Overlay: orders count on secondary Y axis
- Tooltip: date, revenue, order count

Orders Funnel (bar or funnel chart):
- Sessions → Product views → Add to cart → Checkout started → Orders placed

Traffic Sources (donut chart):
- Organic / Direct / Social / Email / Paid / Referral

Top Products Table:
- Rank, product name/image, units sold, revenue, refund rate
- Sort by any column
- Drill down: click product → product-specific analytics

**Geographic Data**
- Revenue by country (choropleth map or ranked table)
- Top cities

### Sales Reports `/admin/analytics/sales`
- Revenue by day/week/month/year (toggle)
- Sales by category
- Sales by channel (website / app / POS)
- Net revenue (gross - discounts - refunds)
- Tax collected by region
- Downloadable as CSV / PDF

### Product Reports `/admin/analytics/products`
- Best sellers (by revenue and by units)
- Worst performers (slow-moving inventory alert)
- Products with most refunds (quality issue signal)
- Stock turnover rate
- Category performance breakdown

### Customer Reports `/admin/analytics/customers`
- New vs returning over time (stacked area chart)
- Cohort analysis: retention by registration month
- LTV distribution histogram
- Customer acquisition by source
- Repeat purchase rate

### Coupon Reports `/admin/analytics/coupons`
- Revenue attributed to each coupon
- Usage rate (used / issued)
- Discount amount given
- Average order value with vs without coupon

### Custom Report Builder
- Select: metric (revenue, orders, customers, products)
- Group by: day / week / month / product / category / country / channel
- Filters: date range, status, category
- Visualization: table / line / bar / pie
- Save as named report
- Schedule: email report PDF weekly/monthly

### Data Models
```ts
interface AnalyticsSummary {
  period: { start: Date; end: Date };
  revenue: number;
  revenuePrev: number;
  orders: number;
  ordersPrev: number;
  aov: number;
  newCustomers: number;
  returningCustomers: number;
  conversionRate: number;
}

interface RevenueDataPoint {
  date: string; // 'YYYY-MM-DD'
  revenue: number;
  orders: number;
  refunds: number;
}

interface TopProduct {
  productId: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
  refundRate: number;
  rank: number;
}
```

### Chart Library Recommendation
Use `recharts` for React:
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={revenueData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
    <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v.toLocaleString()}`} />
    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

### Key UI Patterns
- KPI card: value large, % change color-coded (green/red), sparkline in background
- Date picker: compact dropdown not full calendar (unless custom range)
- Chart tooltips: show exact values + comparison period value
- Export: CSV for raw data, PDF for formatted report with branding
- Loading states: skeleton charts (animated gradient bars), not blank whitespace

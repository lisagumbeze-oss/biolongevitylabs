# Domain 3: Users & Customers Management

## Features to Build

### Customer List Page `/admin/customers`
- Table: avatar, name, email, phone, location, total orders, total spent, last order date, registered date, status
- Filters: status (active/banned/unverified), country, spend tier, registration date range, has orders / no orders
- Search: name, email, phone
- Bulk actions: export CSV, send email, ban, delete

### Customer Profile Page `/admin/customers/[id]`
**Header**: Avatar, name, email, phone, join date, lifetime value badge, status badge + toggle (active/banned)

**Tab 1 — Overview**
- KPI cards: total orders, total spent, average order value, last active
- Recent orders mini-table (last 5 orders)
- Saved addresses list (editable)
- Tags/segments applied to this customer

**Tab 2 — Orders**
- Full order history table for this customer
- Filter by status, date
- Click row → opens order detail

**Tab 3 — Notes**
- Internal admin notes (timestamped, author)
- Add note textarea
- Pin important note

**Tab 4 — Account**
- Edit: name, email, phone, password reset trigger
- Verify email manually
- Merge accounts (dedup)
- Delete account (GDPR) with confirmation

### Admin User Management `/admin/team`
- List all admin users: name, email, role, last login, status
- Invite new admin by email + assign role
- Edit role of existing admin
- Revoke access / deactivate
- Activity log per admin: what actions they took, timestamps

### Segments & Groups
- Create customer segments by rules (e.g., "spent > $500 in last 90 days")
- Rule builder: AND/OR conditions on fields (total spend, country, order count, product purchased, tag)
- Use segments in email campaigns, coupons, or price rules

### Data Models
```ts
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'banned' | 'unverified';
  emailVerified: boolean;
  addresses: Address[];
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderAt?: Date;
  createdAt: Date;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'support' | 'analyst';
  status: 'active' | 'inactive';
  lastLoginAt?: Date;
  createdAt: Date;
  invitedBy: string;
}
```

### Key UI Patterns
- Customer profile header: large avatar (initials fallback), lifetime value badge (Bronze/Silver/Gold tiers)
- Ban modal: require reason, show duration option (temp 7/30 days or permanent)
- Activity log: timeline feed with actor, action, target, timestamp, IP
- Segment builder: drag-and-drop rule builder UI with live count preview ("This segment matches 142 customers")

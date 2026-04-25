# Domain 2: Orders & Fulfillment Management

## Features to Build

### Order List Page `/admin/orders`
- Table: order number, customer name, date, items count, total, payment status, fulfillment status, shipping method
- Filters: status, date range, payment method, shipping method, country, amount range
- Search: by order number, customer name, email, product name
- Bulk actions: mark as processing, print packing slips (batch PDF), export CSV, assign to fulfillment staff
- Live order counter badge in sidebar nav (auto-refresh every 30s)

### Order Detail Page `/admin/orders/[id]`
**Left column (70%)**
- Order timeline: placed → payment confirmed → processing → packed → shipped → delivered (visual stepper)
- Line items: product image, name, variant, unit price, qty, subtotal; editable qty for partial fulfillment
- Add items to order (manual add)
- Remove items + reason

**Right column (30%)**
- Order summary card: subtotal, discounts, shipping, taxes, total, amount paid, refund issued
- Payment status: paid / unpaid / partially refunded; button to mark paid manually
- Customer card: name, email, phone, total lifetime spend, link to customer profile
- Shipping address + billing address (editable inline)
- Fulfillment card: assigned courier, tracking number input, copy tracking link, mark as shipped

**Action buttons**
- Update order status (dropdown)
- Issue refund (partial or full)
- Resend order confirmation email
- Print invoice PDF
- Cancel order + restock inventory

### Fulfillment Workflow
- Picking list view: group orders by items to pick from warehouse
- Packing slip generator: print-optimized PDF per order
- Bulk label printing (integrates with Shippo / EasyPost / ShipStation)
- Assign orders to warehouse staff
- Mark as packed → mark as shipped (with tracking number)

### Returns & Refunds
- Create return request from order detail
- Return reason (dropdown + free text)
- Return status: requested → approved → received → refunded
- Refund amount (auto-calculate or manual override)
- Restock items toggle on return approval
- Issue refund via original payment method (Stripe/Paystack API call)

### Data Models
```ts
interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'unpaid' | 'paid' | 'partially_refunded' | 'refunded';
  paymentMethod: string;
  paymentReference?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string; // internal admin note
  customerNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
}

interface Refund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  items: { orderItemId: string; qty: number; amount: number }[];
  restockItems: boolean;
  createdBy: string; // admin user id
  createdAt: Date;
}
```

### Key UI Patterns
- Order status stepper: horizontal timeline, clickable steps, current step highlighted
- Refund modal: checkbox per line item + qty input + reason + total preview before confirm
- Tracking number input: on save, auto-generate tracking URL if courier is known
- Admin note field: internal sticky note (not visible to customer), timestamped
- Print invoice: generate via `@react-pdf/renderer` or server-side PDF endpoint

# Domain 5: Coupons & Promotions Management

## Features to Build

### Coupon List `/admin/coupons`
- Table: code, type, discount value, usage count / usage limit, expiry date, status, orders using this coupon
- Filters: status (active/expired/disabled), type, date range, minimum spend range
- Search: by code, description
- Bulk: activate, deactivate, delete, duplicate
- "Copy code" quick action on each row

### Create / Edit Coupon Form

**General**
- Coupon code (manual entry or auto-generate random code)
- Description (internal note)
- Status: Active / Inactive / Scheduled

**Discount Type**
- Percentage discount (e.g., 20% off)
- Fixed cart discount (e.g., $10 off)
- Fixed product discount (e.g., $5 off specific products)
- Free shipping
- Buy X Get Y (BXGY)

**Discount Value**
- Amount / percentage input
- For BXGY: buy quantity, get quantity, eligible products for buy/get

**Usage Restrictions**
- Minimum cart subtotal
- Maximum cart subtotal
- Individual use only (cannot be combined with other coupons)
- Exclude sale items
- Products: apply only to selected products / exclude selected products
- Categories: apply only to selected categories / exclude

**Usage Limits**
- Usage limit per coupon (total across all users)
- Usage limit per customer (e.g., once per customer)
- Start date + End date / expiry

**Customer Restrictions**
- All customers
- Specific customer emails (whitelist)
- Customer segment (e.g., "Gold tier" customers)
- First-order only toggle

### Flash Sales / Scheduled Promotions `/admin/promotions`
- Create sale: name, banner text, start/end datetime, discount rule
- Apply to: all products / category / collection / tagged products
- Priority (if multiple promotions overlap, which takes precedence?)
- Status: scheduled / active / ended

### Gift Cards `/admin/gift-cards`
- Issue gift card: amount, recipient email, optional sender name, message, expiry
- List all gift cards: code, value, balance remaining, recipient, status
- Bulk generate (e.g., for giveaway campaigns)
- Track redemptions per gift card

### Loyalty / Points Program
- Settings: points per dollar spent, redemption rate, expiry policy
- View customer point balances
- Manually add/deduct points with reason
- Bonus point events (double points weekends, etc.)

### Abandoned Cart Recovery
- List abandoned carts: customer, items, cart value, abandoned time
- Configure recovery email sequence (send after X hours, Y hours)
- Coupon to include in recovery email (auto-apply)
- Conversion tracking: recovered / unrecovered

### Data Models
```ts
interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed_cart' | 'fixed_product' | 'free_shipping' | 'bxgy';
  amount: number; // percentage or fixed value
  status: 'active' | 'inactive' | 'scheduled';
  startsAt?: Date;
  expiresAt?: Date;
  minSubtotal?: number;
  maxSubtotal?: number;
  usageLimitTotal?: number;
  usageLimitPerUser?: number;
  usageCount: number;
  individualUse: boolean;
  excludeSaleItems: boolean;
  eligibleProductIds?: string[];
  excludedProductIds?: string[];
  eligibleCategoryIds?: string[];
  excludedCategoryIds?: string[];
  restrictedEmails?: string[];
  firstOrderOnly: boolean;
  createdAt: Date;
}

interface GiftCard {
  id: string;
  code: string;
  initialAmount: number;
  balance: number;
  recipientEmail: string;
  recipientName?: string;
  senderName?: string;
  message?: string;
  expiresAt?: Date;
  status: 'active' | 'exhausted' | 'expired' | 'cancelled';
  createdAt: Date;
}
```

### Key UI Patterns
- Code generator: "Generate" button creates a random alphanumeric code (e.g., SAVE20XKJ)
- Usage meter: progress bar showing X / limit used
- Coupon preview: live summary card showing "20% off orders over $50, expires Dec 31"
- BXGY builder: two product selectors side by side ("Buy [2] of [product A] → Get [1] of [product B] free")
- Flash sale countdown: if a promotion is running, show countdown timer in list view

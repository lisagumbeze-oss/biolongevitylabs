# Domain 1: Products & Catalog Management

## Features to Build

### Product List Page `/admin/products`
- Data table with: image thumbnail, name, SKU, price, stock, category, status, date added
- Filters: category, status (active/draft/archived), stock level (in stock / low / out), price range
- Bulk actions: publish, unpublish, delete, duplicate, export CSV
- Quick inline edit: price, stock, status toggle without opening form
- Import products via CSV upload

### Product Create / Edit Form
**Tab 1 — General**
- Title (slug auto-generated, editable)
- Description (rich text editor: bold, italic, lists, headings, image insert)
- Short description / excerpt
- Product type: Simple / Variable / Digital / Subscription

**Tab 2 — Media**
- Drag-and-drop image upload (multi-image)
- Set featured image
- Reorder images via drag
- Video URL (YouTube/Vimeo embed or direct upload)

**Tab 3 — Pricing**
- Regular price
- Sale price + sale start/end date (scheduled sale)
- Cost price (internal, for margin calculation)
- Tax class (taxable / none / reduced)
- Wholesale price tiers (optional)

**Tab 4 — Inventory**
- SKU (auto-generate or manual)
- Barcode / ISBN / GTIN
- Stock management toggle
- Stock quantity
- Low stock threshold → email alert
- Backorders: allow / do not allow / allow but notify
- Sold individually toggle

**Tab 5 — Variants (Variable Products)**
- Define attributes: Color, Size, Material (custom or global)
- Generate all variant combinations
- Per-variant: SKU, price override, stock, image, weight
- Variant table with bulk edit

**Tab 6 — Shipping**
- Weight + dimensions (L × W × H)
- Shipping class
- Country-of-origin

**Tab 7 — SEO**
- Meta title (auto-populate from product name)
- Meta description (character counter, 155 char limit)
- Focus keyword
- OG image
- Canonical URL
- Structured data preview (Product schema)

**Tab 8 — Related**
- Linked products: Upsells (suggest on product page), Cross-sells (suggest in cart)
- Related by category (automatic, can override)
- Bundled products

### Categories & Tags
- Tree-view category manager (nested, drag to reorder)
- Create / rename / delete categories
- Category image + description
- Assign SEO meta per category
- Tag management (flat list, merge duplicates)

### Attributes & Options
- Global attribute manager (Size, Color, Material, etc.)
- Add values per attribute
- Mark as "used for variations" or "just for display"

### Collections / Groups
- Curated product collections (manual or rule-based)
- Rules: "all products in category X with price < $100"
- Display order

### Data Models
```ts
interface Product {
  id: string;
  title: string;
  slug: string;
  description: string; // HTML
  shortDescription?: string;
  type: 'simple' | 'variable' | 'digital' | 'subscription';
  status: 'active' | 'draft' | 'archived';
  price: number;
  salePrice?: number;
  saleDateStart?: Date;
  saleDateEnd?: Date;
  costPrice?: number;
  sku: string;
  barcode?: string;
  stockQty: number;
  lowStockThreshold: number;
  manageStock: boolean;
  backorders: 'no' | 'yes' | 'notify';
  weight?: number;
  dimensions?: { l: number; w: number; h: number };
  categoryIds: string[];
  tagIds: string[];
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>; // { Color: 'Red', Size: 'M' }
  price?: number;
  stockQty: number;
  image?: string;
}
```

### Key UI Patterns
- Slug field: auto-generate from title, editable, show live preview URL
- Rich text: use TipTap or Quill (avoid raw textarea for description)
- Image upload: show progress bar, preview grid, allow reorder
- Variant matrix: color-coded grid where each cell is a SKU/stock/price input
- Save states: "Saving..." → "Saved ✓" → auto-clear (not just a toast)

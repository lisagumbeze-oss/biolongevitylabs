import type { CartItem } from "@/store/useCart";

const CURRENCY = "USD";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/** Unit price after volume discounts (matches useCart.getTotal logic). */
export function getDiscountedUnitPrice(item: CartItem): number {
  let price = item.price;
  if (item.quantity >= 25) price *= 0.6;
  else if (item.quantity >= 10) price *= 0.75;
  else if (item.quantity >= 3) price *= 0.9;
  return price;
}

function formatVariant(item: CartItem): string | undefined {
  const parts: string[] = [];
  if (item.frequency && item.frequency !== "one-time") {
    parts.push(item.frequency);
  }
  if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
    parts.push(
      ...Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`)
    );
  }
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export function cartItemsToGa4Items(items: CartItem[]) {
  return items.map((item) => ({
    item_id: item.id,
    item_name: item.name,
    price: getDiscountedUnitPrice(item),
    quantity: item.quantity,
    ...(formatVariant(item) ? { item_variant: formatVariant(item) } : {}),
  }));
}

function cartItemsValue(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + getDiscountedUnitPrice(item) * item.quantity,
    0
  );
}

export function trackAddToCart(item: CartItem, quantityAdded: number) {
  const unitPrice = getDiscountedUnitPrice(item);
  gtag("event", "add_to_cart", {
    currency: CURRENCY,
    value: unitPrice * quantityAdded,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: unitPrice,
        quantity: quantityAdded,
        ...(formatVariant(item) ? { item_variant: formatVariant(item) } : {}),
      },
    ],
  });
}

export function trackBeginCheckout(
  items: CartItem[],
  value: number,
  coupon?: string
) {
  gtag("event", "begin_checkout", {
    currency: CURRENCY,
    value,
    ...(coupon ? { coupon } : {}),
    items: cartItemsToGa4Items(items),
  });
}

export type PurchasePayload = {
  transactionId: string;
  value: number;
  shipping: number;
  tax?: number;
  coupon?: string;
  items: CartItem[];
};

const PURCHASE_STORAGE_PREFIX = "biolongevity_ga_purchase_";
const PURCHASE_SENT_PREFIX = "biolongevity_ga_purchase_sent_";

export function persistPurchaseForConfirmation(payload: PurchasePayload) {
  if (typeof window === "undefined") return;
  const key = `${PURCHASE_STORAGE_PREFIX}${payload.transactionId}`;
  sessionStorage.setItem(key, JSON.stringify(payload));
}

export function trackPurchase(payload: PurchasePayload) {
  const { transactionId, value, shipping, tax = 0, coupon, items } = payload;
  const sentKey = `${PURCHASE_SENT_PREFIX}${transactionId}`;

  if (typeof window !== "undefined" && sessionStorage.getItem(sentKey)) {
    return;
  }

  gtag("event", "purchase", {
    transaction_id: transactionId,
    value,
    tax,
    shipping,
    currency: CURRENCY,
    ...(coupon ? { coupon } : {}),
    items: cartItemsToGa4Items(items),
  });

  if (typeof window !== "undefined") {
    sessionStorage.setItem(sentKey, "1");
    sessionStorage.removeItem(`${PURCHASE_STORAGE_PREFIX}${transactionId}`);
  }
}

/** Backup on order-confirmation if purchase fired before gtag loaded. */
export function trackPurchaseFromSession(transactionId: string) {
  if (typeof window === "undefined" || !transactionId) return;

  const sentKey = `${PURCHASE_SENT_PREFIX}${transactionId}`;
  if (sessionStorage.getItem(sentKey)) return;

  const raw = sessionStorage.getItem(`${PURCHASE_STORAGE_PREFIX}${transactionId}`);
  if (!raw) return;

  try {
    const payload = JSON.parse(raw) as PurchasePayload;
    trackPurchase(payload);
  } catch {
    // ignore invalid storage
  }
}

export function getCartSubtotal(items: CartItem[]): number {
  return cartItemsValue(items);
}

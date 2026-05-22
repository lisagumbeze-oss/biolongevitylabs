import type { Product, ProductVariation } from "@/data/products";

/** Normalize option labels and variation slugs for comparison. */
export function normalizeVariationValue(val: string): string {
    if (!val) return "";
    return String(val)
        .toLowerCase()
        .split(/\s+[-–]\s+/)[0]
        .replace(/\s*\(.*?\)\s*/g, " ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .trim();
}

/**
 * Comparable quantity key (e.g. "3-pair", "12-month") so display labels
 * like "6 Pairs (12 Vials) - Save 5%" match attribute slugs like "6-pairs".
 */
export function variationOptionKey(val: string): string {
    const n = normalizeVariationValue(val);
    if (!n) return "";

    const numMatch = n.match(/^(\d+)/);
    if (!numMatch) return n;
    const num = numMatch[1];

    if (/pai|pair/.test(n)) return `${num}-pair`;
    if (/month/.test(n)) return `${num}-month`;
    if (/vial/.test(n) && !/pai|pair/.test(n)) return `${num}-vial`;
    if (/mg|mcg|iu|tab|capsule|dose/.test(n)) return n;

    const rest = n.slice(num.length).replace(/^-+/, "").split("-")[0];
    if (rest) {
        const base = rest.replace(/s$/, "").replace(/-?new$/, "");
        return `${num}-${base}`;
    }
    return n;
}

function getAttributeValue(
    attributes: Record<string, string | number | boolean>,
    variableName: string
): string {
    const key = Object.keys(attributes).find(
        (k) => k.toLowerCase() === variableName.toLowerCase()
    );
    if (!key) return "";
    return String(attributes[key] ?? "");
}

function valuesMatch(attrValue: string, selectedValue: string): boolean {
    if (!attrValue || !selectedValue) return false;
    if (attrValue === selectedValue) return true;

    const vNorm = normalizeVariationValue(attrValue);
    const sNorm = normalizeVariationValue(selectedValue);
    if (vNorm && sNorm && vNorm === sNorm) return true;

    const vKey = variationOptionKey(attrValue);
    const sKey = variationOptionKey(selectedValue);
    return Boolean(vKey && sKey && vKey === sKey);
}

/** Find the variation that matches all currently selected variable options. */
export function findMatchingVariation(
    product: Product,
    selectedOptions: Record<string, string>
): ProductVariation | null {
    const variations = product.variations;
    if (!variations?.length) return null;

    const relevantOptions = Object.entries(selectedOptions).filter(
        ([name]) => !name.toLowerCase().includes("dutify")
    );

    if (relevantOptions.length === 0) {
        return variations[0] ?? null;
    }

    const exact = variations.find((v) =>
        relevantOptions.every(([name, value]) =>
            valuesMatch(getAttributeValue(v.attributes, name), value)
        )
    );
    if (exact) return exact;

    if (relevantOptions.length === 1) {
        const [name, value] = relevantOptions[0];
        const partial = variations.find((v) =>
            valuesMatch(getAttributeValue(v.attributes, name), value)
        );
        if (partial) return partial;
    }

    return null;
}

/** Only show variable options that resolve to a catalog variation (avoids orphan labels). */
export function getSellableOptions(product: Product, variableName: string): string[] {
    const variable = product.variables?.find(
        (v) => v.name.toLowerCase() === variableName.toLowerCase()
    );
    if (!variable) return [];

    if (!product.variations?.length) return variable.options;

    const sellable = variable.options.filter((opt) =>
        Boolean(findMatchingVariation(product, { [variable.name]: opt }))
    );

    if (sellable.length > 0) return sellable;

    return variable.options;
}

export function variationPrice(variation: ProductVariation | null, fallback: number): number {
    const raw = variation?.price ?? fallback;
    const n = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Default price fallback for variable products (min tier, not base SKU only). */
export function variableProductPriceFallback(product: Product): number {
    if (product.variations?.length && product.minPrice != null) {
        const min = Number(product.minPrice);
        if (Number.isFinite(min) && min > 0) return min;
    }
    return Number(product.price) || 0;
}

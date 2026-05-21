import type { Product, ProductVariation } from "@/data/products";

/** Normalize option labels and variation slugs for comparison. */
export function normalizeVariationValue(val: string): string {
    if (!val) return "";
    return String(val)
        .toLowerCase()
        .split(/\s+-\s+/)[0]
        .replace(/\s*\(.*?\)\s*/g, " ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .trim();
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

    const vSlug = normalizeVariationValue(attrValue);
    const sSlug = normalizeVariationValue(selectedValue);
    if (!vSlug || !sSlug) return false;

    return (
        vSlug === sSlug ||
        (vSlug.length > 2 && sSlug.includes(vSlug)) ||
        (sSlug.length > 2 && vSlug.includes(sSlug))
    );
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

    // Single-attribute products: match the first dimension only
    if (relevantOptions.length === 1) {
        const [name, value] = relevantOptions[0];
        const partial = variations.find((v) =>
            valuesMatch(getAttributeValue(v.attributes, name), value)
        );
        if (partial) return partial;
    }

    return null;
}

export function variationPrice(variation: ProductVariation | null, fallback: number): number {
    const raw = variation?.price ?? fallback;
    const n = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(n) ? n : fallback;
}

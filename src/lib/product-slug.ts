import type { Product } from "@/data/products";

/** URL-safe slug from product display name (no numeric prod_ id). */
export function slugifyProductName(name: string): string {
    return name
        .replace(/&#8211;/g, " ")
        .replace(/&#8212;/g, " ")
        .replace(/&[a-z]+;/gi, " ")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function isProductId(identifier: string): boolean {
    return /^prod_/i.test(identifier);
}

/** Assign unique SEO slugs to a product list. */
export function assignSlugsToProducts(products: Product[]): Product[] {
    const claimed = new Map<string, string>();

    return products.map((product) => {
        let slug = slugifyProductName(product.name);
        if (!slug) slug = product.id.replace(/^prod_/i, "");

        if (claimed.has(slug) && claimed.get(slug) !== product.id) {
            slug = `${slug}-${product.id.replace(/^prod_/i, "")}`;
        }
        claimed.set(slug, product.id);

        return { ...product, slug };
    });
}

export function productPath(
    product: Pick<Product, "id"> & Partial<Pick<Product, "slug" | "name">>
): string {
    const slug =
        product.slug ||
        (product.name ? slugifyProductName(product.name) : null) ||
        product.id.replace(/^prod_/i, "");
    return `/product/${slug}`;
}

export function findProductBySlugOrId(
    products: Product[],
    identifier: string
): Product | undefined {
    const withSlugs = assignSlugsToProducts(products);

    if (isProductId(identifier)) {
        return withSlugs.find((p) => p.id === identifier);
    }

    return withSlugs.find((p) => p.slug === identifier);
}

import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";
import type { Product, ProductVariation } from "@/data/products";
import { getSellableOptions } from "@/lib/variation-matching";
import {
    assignSlugsToProducts,
    findProductBySlugOrId,
    isProductId,
} from "@/lib/product-slug";

const PRODUCTS_JSON = path.join(process.cwd(), "src/data/products.json");

interface COARow {
    id: string;
    lab_name: string;
    purity_percentage: number | null;
    report_url: string;
    test_date: string | null;
    batch_number: string | null;
}

interface VariableRow {
    name: string;
    options: string[];
}

interface VariationRow {
    id: string;
    attributes: Record<string, string | number | boolean>;
    price: number;
    stock_status: string;
}

export interface ProductRow {
    id: string;
    name: string;
    price: number;
    min_price: number | null;
    max_price: number | null;
    image_url: string;
    category_name: string;
    form: string;
    description: string;
    stock_status: string;
    is_variable: boolean;
    is_sale: boolean;
    is_bestseller: boolean;
    is_new: boolean;
    product_variables?: VariableRow[];
    product_variations?: VariationRow[];
    product_coas?: COARow | COARow[];
}

function decodeEntities(text: string): string {
    return text
        .replace(/&#8211;/g, "–")
        .replace(/&#8212;/g, "—")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');
}

export function mapProductRow(p: ProductRow): Product {
    const variationPrices = (p.product_variations || [])
        .map((v) => Number(v.price))
        .filter((n) => !isNaN(n) && n > 0);

    const minPrice = p.min_price ?? (variationPrices.length > 0 ? Math.min(...variationPrices) : null);
    const maxPrice = p.max_price ?? (variationPrices.length > 0 ? Math.max(...variationPrices) : null);

    const variables =
        p.product_variables?.map((v) => ({
            name: v.name,
            options: v.options,
        })) || [];

    const mapped: Product = {
        id: p.id,
        name: decodeEntities(p.name),
        price: Number(p.price) || 0,
        minPrice,
        maxPrice,
        image: p.image_url,
        category: p.category_name as Product["category"],
        form: p.form as Product["form"],
        description: p.description,
        stockStatus: p.stock_status as Product["stockStatus"],
        isVariable: p.is_variable || (p.product_variations?.length ?? 0) > 0,
        isSale: p.is_sale,
        isBestseller: p.is_bestseller,
        isNew: p.is_new,
        variables,
        variations:
            p.product_variations?.map(
                (v): ProductVariation => ({
                    id: Number(v.id),
                    attributes: v.attributes as Record<string, string>,
                    price: Number(v.price) || 0,
                    stockStatus: v.stock_status,
                })
            ) || [],
        coa: p.product_coas
            ? Array.isArray(p.product_coas)
                ? p.product_coas.length > 0
                    ? {
                          id: p.product_coas[0].id,
                          labName: p.product_coas[0].lab_name,
                          purityPercentage: p.product_coas[0].purity_percentage || undefined,
                          reportUrl: p.product_coas[0].report_url,
                          testDate: p.product_coas[0].test_date || undefined,
                          batchNumber: p.product_coas[0].batch_number || undefined,
                      }
                    : undefined
                : {
                      id: (p.product_coas as COARow).id,
                      labName: (p.product_coas as COARow).lab_name,
                      purityPercentage: (p.product_coas as COARow).purity_percentage || undefined,
                      reportUrl: (p.product_coas as COARow).report_url,
                      testDate: (p.product_coas as COARow).test_date || undefined,
                      batchNumber: (p.product_coas as COARow).batch_number || undefined,
                  }
            : undefined,
    };

    if (mapped.variables?.length && mapped.variations?.length) {
        mapped.variables = mapped.variables.map((v) => ({
            ...v,
            options: getSellableOptions(mapped, v.name),
        }));
    }

    return mapped;
}

export function readProductsLocal(): Product[] {
    if (!fs.existsSync(PRODUCTS_JSON)) return [];
    const content = fs.readFileSync(PRODUCTS_JSON, "utf-8");
    return JSON.parse(content) as Product[];
}

export async function getAllProducts(): Promise<Product[]> {
    let products: Product[];
    if (supabase) {
        const { data, error } = await supabase
            .from("products")
            .select("*, product_variables(*), product_variations(*), product_coas(*)");

        if (error) throw error;
        products = (data as ProductRow[]).map(mapProductRow);
    } else {
        products = readProductsLocal();
    }
    return assignSlugsToProducts(products);
}

export async function getProductById(id: string): Promise<Product | null> {
    if (supabase) {
        const { data, error } = await supabase
            .from("products")
            .select("*, product_variables(*), product_variations(*), product_coas(*)")
            .eq("id", id)
            .maybeSingle();

        if (!error && data) {
            const product = mapProductRow(data as ProductRow);
            return assignSlugsToProducts([product])[0] ?? null;
        }
    }
    const local = readProductsLocal().find((p) => p.id === id);
    return local ? assignSlugsToProducts([local])[0] ?? null : null;
}

/** Resolve by SEO slug (preferred) or legacy `prod_*` id. */
export async function getProductBySlugOrId(identifier: string): Promise<Product | null> {
    if (isProductId(identifier)) {
        return getProductById(identifier);
    }

    const products = await getAllProducts();
    return findProductBySlugOrId(products, identifier) ?? null;
}

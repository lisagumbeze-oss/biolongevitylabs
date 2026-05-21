import { NextResponse } from "next/server";
import { getProductBySlugOrId } from "@/lib/catalog-product";

export const dynamic = "force-dynamic";

interface RouteContext {
    params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
    try {
        const { slug } = await context.params;
        const product = await getProductBySlugOrId(slug);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error: unknown) {
        console.error("API Error (GET product):", error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

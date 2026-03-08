import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const PRODUCTS_JSON = path.join(process.cwd(), 'src/data/products.json');

function readProductsLocal() {
    if (!fs.existsSync(PRODUCTS_JSON)) return [];
    const content = fs.readFileSync(PRODUCTS_JSON, 'utf-8');
    return JSON.parse(content);
}

function writeProductsLocal(products: unknown[]) {
    fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 4));
}

interface ProductRow {
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

export async function GET() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('products')
                .select('*, product_variables(*), product_variations(*)');

            if (error) throw error;

            // Map Supabase schema back to frontend expected format
            const products = (data as unknown as ProductRow[]).map((p: ProductRow) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                minPrice: p.min_price,
                maxPrice: p.max_price,
                image: p.image_url,
                category: p.category_name,
                form: p.form,
                description: p.description,
                stockStatus: p.stock_status,
                isVariable: p.is_variable,
                isSale: p.is_sale,
                isBestseller: p.is_bestseller,
                isNew: p.is_new,
                variables: p.product_variables?.map((v: VariableRow) => ({
                    name: v.name,
                    options: v.options
                })) || [],
                variations: p.product_variations?.map((v: VariationRow) => ({
                    id: v.id,
                    attributes: v.attributes,
                    price: v.price,
                    stockStatus: v.stock_status
                })) || []
            }));

            return NextResponse.json(products);
        } else {
            const products = readProductsLocal();
            return NextResponse.json(products);
        }
    } catch (error: unknown) {
        console.error('API Error (GET):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newProduct = await request.json();

        if (supabase) {
            // 1. Insert product
            const { error: pError } = await supabase.from('products').insert({
                id: newProduct.id,
                name: newProduct.name,
                price: newProduct.price,
                min_price: newProduct.minPrice,
                max_price: newProduct.maxPrice,
                image_url: newProduct.image,
                category_name: newProduct.category,
                form: newProduct.form,
                description: newProduct.description,
                stock_status: newProduct.stockStatus,
                is_variable: newProduct.isVariable,
                is_sale: newProduct.isSale,
                is_bestseller: newProduct.isBestseller,
                is_new: newProduct.isNew
            });

            if (pError) throw pError;

            // 2. Insert variables
            if (newProduct.variables?.length) {
                const { error: vError } = await supabase.from('product_variables').insert(
                    newProduct.variables.map((v: VariableRow) => ({
                        product_id: newProduct.id,
                        name: v.name,
                        options: v.options
                    }))
                );
                if (vError) throw vError;
            }

            // 3. Insert variations
            if (newProduct.variations?.length) {
                const { error: varError } = await supabase.from('product_variations').insert(
                    newProduct.variations.map((v: VariationRow) => ({
                        id: v.id,
                        product_id: newProduct.id,
                        attributes: v.attributes,
                        price: v.price,
                        stock_status: v.stock_status
                    }))
                );
                if (varError) throw varError;
            }

            return NextResponse.json(newProduct, { status: 201 });
        } else {
            const products = readProductsLocal();
            products.push(newProduct);
            writeProductsLocal(products);
            return NextResponse.json(newProduct, { status: 201 });
        }
    } catch (error: unknown) {
        console.error('API Error (POST):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedProduct = await request.json();

        if (supabase) {
            // 1. Update main product
            const { error: pError } = await supabase
                .from('products')
                .update({
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                    min_price: updatedProduct.minPrice,
                    max_price: updatedProduct.maxPrice,
                    image_url: updatedProduct.image,
                    category_name: updatedProduct.category,
                    form: updatedProduct.form,
                    description: updatedProduct.description,
                    stock_status: updatedProduct.stockStatus,
                    is_variable: updatedProduct.isVariable,
                    is_sale: updatedProduct.isSale,
                    is_bestseller: updatedProduct.isBestseller,
                    is_new: updatedProduct.isNew
                })
                .eq('id', updatedProduct.id);

            if (pError) throw pError;

            // Note: For simplicity in sync, we delete and re-insert variables/variations
            // In a production app, you might want more granular updates
            await supabase.from('product_variables').delete().eq('product_id', updatedProduct.id);
            await supabase.from('product_variations').delete().eq('product_id', updatedProduct.id);

            if (updatedProduct.variables?.length) {
                await supabase.from('product_variables').insert(
                    updatedProduct.variables.map((v: VariableRow) => ({
                        product_id: updatedProduct.id,
                        name: v.name,
                        options: v.options
                    }))
                );
            }

            if (updatedProduct.variations?.length) {
                await supabase.from('product_variations').insert(
                    updatedProduct.variations.map((v: VariationRow) => ({
                        id: v.id,
                        product_id: updatedProduct.id,
                        attributes: v.attributes,
                        price: v.price,
                        stock_status: v.stock_status
                    }))
                );
            }

            return NextResponse.json(updatedProduct);
        } else {
            const products = readProductsLocal();
            const index = products.findIndex((p: { id: string }) => p.id === updatedProduct.id);

            if (index === -1) {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            products[index] = updatedProduct;
            writeProductsLocal(products);
            return NextResponse.json(updatedProduct);
        }
    } catch (error: unknown) {
        console.error('API Error (PUT):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (supabase) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        } else {
            const products = readProductsLocal();
            const newProducts = products.filter((p: { id: string }) => p.id !== id);
            writeProductsLocal(newProducts);
            return NextResponse.json({ success: true });
        }
    } catch (error: unknown) {
        console.error('API Error (DELETE):', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

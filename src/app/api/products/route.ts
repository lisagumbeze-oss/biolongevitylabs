import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCTS_JSON = path.join(process.cwd(), 'src/data/products.json');

function readProducts() {
    if (!fs.existsSync(PRODUCTS_JSON)) return [];
    const content = fs.readFileSync(PRODUCTS_JSON, 'utf-8');
    return JSON.parse(content);
}

function writeProducts(products: any[]) {
    fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 4));
}

export async function GET() {
    try {
        const products = readProducts();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newProduct = await request.json();
        const products = readProducts();
        products.push(newProduct);
        writeProducts(products);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedProduct = await request.json();
        const products = readProducts();
        const index = products.findIndex((p: any) => p.id === updatedProduct.id);

        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        products[index] = updatedProduct;
        writeProducts(products);
        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const products = readProducts();
        const newProducts = products.filter((p: any) => p.id !== id);
        writeProducts(newProducts);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

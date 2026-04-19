import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const PRODUCTS_JSON = path.join(process.cwd(), 'src/data/products.json');

interface CsvRow {
    name: string;
    category: string;
    form: string;
    price: string;
    description: string;
    image: string;
    stockStatus: string;
    variations: string; // JSON string: [{"option":"5mg","price":49.99}]
}

interface ImportError {
    row: number;
    field: string;
    message: string;
    data?: string;
}

function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i++; // skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    fields.push(current.trim());
    return fields;
}

function parseCsv(text: string): CsvRow[] {
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return []; // Need header + at least one row

    const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, ''));
    const rows: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
        });

        rows.push({
            name: row['name'] || row['productname'] || '',
            category: row['category'] || 'Peptide Capsules',
            form: row['form'] || 'Capsule',
            price: row['price'] || '0',
            description: row['description'] || '',
            image: row['image'] || row['imageurl'] || '',
            stockStatus: row['stockstatus'] || row['stock'] || 'In Stock',
            variations: row['variations'] || '',
        });
    }

    return rows;
}

const VALID_CATEGORIES = ['Peptide Vials', 'Peptide Capsules', 'Bioregulator Capsules', 'Bioregulator Creams', 'Bioregulator Vials'];
const VALID_FORMS = ['Vial', 'Capsule', 'Cream', 'Solution'];
const VALID_STOCK = ['In Stock', 'Low Stock', 'Out of Stock', 'Coming Soon'];

function validateRow(row: CsvRow, rowNum: number): ImportError[] {
    const errors: ImportError[] = [];

    if (!row.name || row.name.trim().length === 0) {
        errors.push({ row: rowNum, field: 'name', message: 'Product name is required' });
    }

    const price = parseFloat(row.price);
    if (isNaN(price) || price < 0) {
        errors.push({ row: rowNum, field: 'price', message: `Invalid price: "${row.price}"` });
    }

    if (row.category && !VALID_CATEGORIES.includes(row.category)) {
        errors.push({ row: rowNum, field: 'category', message: `Invalid category: "${row.category}". Valid: ${VALID_CATEGORIES.join(', ')}`, data: row.category });
    }

    if (row.form && !VALID_FORMS.includes(row.form)) {
        errors.push({ row: rowNum, field: 'form', message: `Invalid form: "${row.form}". Valid: ${VALID_FORMS.join(', ')}` });
    }

    if (row.stockStatus && !VALID_STOCK.includes(row.stockStatus)) {
        errors.push({ row: rowNum, field: 'stockStatus', message: `Invalid stock status: "${row.stockStatus}"` });
    }

    // Validate variations JSON if provided
    if (row.variations && row.variations.trim().length > 0) {
        try {
            const parsed = JSON.parse(row.variations);
            if (!Array.isArray(parsed)) {
                errors.push({ row: rowNum, field: 'variations', message: 'Variations must be a JSON array' });
            }
        } catch {
            errors.push({ row: rowNum, field: 'variations', message: 'Invalid variations JSON' });
        }
    }

    return errors;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!file.name.endsWith('.csv')) {
            return NextResponse.json({ error: 'Only .csv files are accepted' }, { status: 400 });
        }

        const text = await file.text();
        const rows = parseCsv(text);

        if (rows.length === 0) {
            return NextResponse.json({ error: 'No data rows found in CSV' }, { status: 400 });
        }

        // Validate all rows first
        const allErrors: ImportError[] = [];
        rows.forEach((row, idx) => {
            const errors = validateRow(row, idx + 2); // +2 because row 1 is header
            allErrors.push(...errors);
        });

        // If critical errors (missing name/price), reject entirely
        const criticalErrors = allErrors.filter(e => e.field === 'name' || e.field === 'price');
        if (criticalErrors.length > 0) {
            return NextResponse.json({
                error: 'Validation failed',
                imported: 0,
                failed: criticalErrors.length,
                errors: allErrors,
            }, { status: 422 });
        }

        // Import valid rows
        let imported = 0;
        let failed = 0;
        const importErrors: ImportError[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 2;

            // Skip rows with critical validation errors
            const rowErrors = allErrors.filter(e => e.row === rowNum);
            if (rowErrors.some(e => e.field === 'name' || e.field === 'price')) {
                failed++;
                continue;
            }

            try {
                const productId = `prod_${Date.now()}_${i}`;
                const price = parseFloat(row.price) || 0;

                // Parse variations
                let variations: { id: number; attributes: Record<string, string>; price: number; stockStatus: string }[] = [];
                let variables: { name: string; options: string[] }[] = [];
                let minPrice: number | null = null;
                let maxPrice: number | null = null;

                if (row.variations && row.variations.trim().length > 0) {
                    try {
                        const parsed = JSON.parse(row.variations);
                        if (Array.isArray(parsed)) {
                            variations = parsed.map((v: { option?: string; price?: number }, idx: number) => ({
                                id: Date.now() + idx,
                                attributes: { 'Option': v.option || `Option ${idx + 1}` },
                                price: v.price || price,
                                stockStatus: 'In Stock'
                            }));

                            variables = [{
                                name: 'Option',
                                options: parsed.map((v: { option?: string }, idx: number) => v.option || `Option ${idx + 1}`)
                            }];

                            const varPrices = variations.map(v => v.price).filter(p => p > 0);
                            if (varPrices.length > 0) {
                                minPrice = Math.min(...varPrices);
                                maxPrice = Math.max(...varPrices);
                            }
                        }
                    } catch {
                        // Already validated above, shouldn't happen
                    }
                }

                const productData = {
                    id: productId,
                    name: row.name.trim(),
                    price,
                    minPrice,
                    maxPrice,
                    image: row.image || '',
                    gallery: [],
                    category: row.category || 'Peptide Capsules',
                    form: row.form || 'Capsule',
                    description: row.description || '',
                    stockStatus: row.stockStatus || 'In Stock',
                    isVariable: variations.length > 0,
                    variables,
                    variations,
                };

                if (supabase) {
                    // Insert product to Supabase
                    const { error: pError } = await supabase.from('products').insert({
                        id: productData.id,
                        name: productData.name,
                        price: productData.price,
                        min_price: productData.minPrice,
                        max_price: productData.maxPrice,
                        image_url: productData.image,
                        category_name: productData.category,
                        form: productData.form,
                        description: productData.description,
                        stock_status: productData.stockStatus,
                        is_variable: productData.isVariable,
                        is_sale: false,
                        is_bestseller: false,
                        is_new: true,
                    });

                    if (pError) throw pError;

                    // Insert variables
                    if (productData.variables.length > 0) {
                        await supabase.from('product_variables').insert(
                            productData.variables.map(v => ({
                                product_id: productData.id,
                                name: v.name,
                                options: v.options,
                            }))
                        );
                    }

                    // Insert variations
                    if (productData.variations.length > 0) {
                        await supabase.from('product_variations').insert(
                            productData.variations.map(v => ({
                                id: v.id,
                                product_id: productData.id,
                                attributes: v.attributes,
                                price: v.price,
                                stock_status: v.stockStatus,
                            }))
                        );
                    }

                    // Track source
                    try {
                        await supabase.from('scrape_sources').insert({
                            product_id: productData.id,
                            source_url: `csv_import:${file.name}`,
                            source_type: 'csv_import',
                        });
                    } catch {
                        // Table may not exist — skip silently
                    }
                } else {
                    // Local JSON fallback
                    const products = fs.existsSync(PRODUCTS_JSON)
                        ? JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'))
                        : [];
                    products.push(productData);
                    fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 4));
                }

                imported++;
            } catch (err: unknown) {
                failed++;
                importErrors.push({
                    row: rowNum,
                    field: 'general',
                    message: err instanceof Error ? err.message : String(err),
                });
            }
        }

        return NextResponse.json({
            imported,
            failed,
            total: rows.length,
            errors: [...allErrors.filter(e => e.field !== 'name' && e.field !== 'price'), ...importErrors],
        });

    } catch (error: unknown) {
        console.error('CSV Import Error:', error instanceof Error ? error.message : String(error));
        return NextResponse.json({ error: 'Failed to process CSV import' }, { status: 500 });
    }
}

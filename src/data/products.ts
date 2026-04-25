export interface ProductVariation {
    id: number;
    attributes: Record<string, string>;
    price: number | null;
    originalPrice?: number;
    stockStatus?: string;
}

export interface ProductVariable {
    name: string;
    options: string[];
}

export interface ProductCOA {
    id: string;
    labName: string;
    purityPercentage?: number;
    reportUrl: string;
    testDate?: string;
    batchNumber?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    minPrice?: number | null;
    maxPrice?: number | null;
    originalPrice?: number;
    image: string;
    gallery?: string[];
    category: "Peptide Vials" | "Peptide Capsules" | "Bioregulator Capsules" | "Bioregulator Creams" | "Bioregulator Vials";
    form: 'Vial' | 'Capsule' | 'Cream' | 'Solution';
    description: string;
    attributes?: { label: string; value: string }[];
    isSale?: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Coming Soon';
    isVariable?: boolean;
    variables?: ProductVariable[];
    variations?: ProductVariation[];
    coa?: ProductCOA;
    rating?: number;
    reviewCount?: number;
}

import productsData from './products.json';
export const products: Product[] = productsData as Product[];

export const categories = [
    "Peptide Vials",
    "Peptide Capsules",
    "Bioregulator Capsules",
    "Bioregulator Creams",
    "Bioregulator Vials"
];

export const forms = [
    "Vial",
    "Capsule",
    "Cream",
    "Solution"
];

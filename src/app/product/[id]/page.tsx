import { Metadata } from "next";
import { products } from "@/data/products";
import ProductDetailsView from "./ProductDetailsView";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    return {
        title: product.name,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.substring(0, 160),
            images: [product.image],
        },
    };
}

export default async function ProductDetailsPage({ params }: Props) {
    const { id } = await params;
    return <ProductDetailsView id={id} />;
}

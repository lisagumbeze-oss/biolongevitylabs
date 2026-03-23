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
    const product = products.find((p) => p.id === id);

    if (!product) return <ProductDetailsView id={id} key={id} />;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.name,
                        "image": product.image.startsWith("http") ? product.image : `https://biolongevitylabss.com${product.image}`,
                        "description": product.description,
                        "brand": {
                            "@type": "Brand",
                            "name": "BioLongevity Labs"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `https://biolongevitylabss.com/product/${product.id}`,
                            "priceCurrency": "USD",
                            "price": product.isVariable && product.minPrice ? product.minPrice : product.price,
                            "availability": "https://schema.org/InStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "BioLongevity Labs"
                            }
                        }
                    })
                }}
            />
            <ProductDetailsView id={id} key={id} />
        </>
    );
}

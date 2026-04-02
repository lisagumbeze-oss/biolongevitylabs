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
            url: `https://biolongevitylabss.com/product/${product.id}`,
            siteName: 'BioLongevity Labs',
            type: 'website',
            images: [
                {
                    url: product.image.startsWith("http") ? product.image : `https://biolongevitylabss.com${product.image}`,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description.substring(0, 160),
            images: [product.image.startsWith("http") ? product.image : `https://biolongevitylabss.com${product.image}`],
        },
    };
}

export default async function ProductDetailsPage({ params }: Props) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) return <ProductDetailsView id={id} key={id} />;

    return (
        <>
            {/* Breadcrumb Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://biolongevitylabss.com/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Shop",
                                "item": "https://biolongevitylabss.com/shop"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": product.name,
                                "item": `https://biolongevitylabss.com/product/${product.id}`
                            }
                        ]
                    })
                }}
            />

            {/* Product Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.name,
                        "image": product.image.startsWith("http") ? product.image : `https://biolongevitylabss.com${product.image}`,
                        "description": product.description,
                        "sku": product.id,
                        "mpn": product.id,
                        "brand": {
                            "@type": "Brand",
                            "name": "BioLongevity Labs"
                        },
                        "category": product.category,
                        "offers": {
                            "@type": "Offer",
                            "url": `https://biolongevitylabss.com/product/${product.id}`,
                            "priceCurrency": "USD",
                            "price": product.isVariable && product.minPrice ? product.minPrice : product.price,
                            "priceValidUntil": "2026-12-31",
                            "availability": "https://schema.org/InStock",
                            "itemCondition": "https://schema.org/NewCondition",
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

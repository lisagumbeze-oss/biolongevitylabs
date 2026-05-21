import { Metadata } from "next";
import { products } from "@/data/products";
import { canonicalPath } from "@/lib/seo";
import {
    getProductSeo,
    buildFaqPageSchema,
    productPageUrl,
} from "@/lib/product-seo";
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

    const seo = getProductSeo(product.id);
    const title = seo?.metaTitle ?? product.name;
    const plainDescription = product.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const description = seo?.metaDescription ?? plainDescription.substring(0, 160);

    return {
        title,
        description,
        alternates: canonicalPath(`/product/${product.id}`),
        openGraph: {
            title: `${title} | BioLongevity Labs`,
            description,
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
            title,
            description,
            images: [product.image.startsWith("http") ? product.image : `https://biolongevitylabss.com${product.image}`],
        },
    };
}

export default async function ProductDetailsPage({ params }: Props) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) return <ProductDetailsView id={id} key={id} />;

    const seo = getProductSeo(product.id);
    const pageUrl = productPageUrl(product.id);

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
            {seo?.faqs.length ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(buildFaqPageSchema(seo.faqs, pageUrl)),
                    }}
                />
            ) : null}
            <ProductDetailsView id={id} key={id} />
        </>
    );
}

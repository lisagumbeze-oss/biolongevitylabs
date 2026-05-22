import { Metadata } from "next";
import { redirect } from "next/navigation";
import { canonicalPath } from "@/lib/seo";
import { getProductBySlugOrId } from "@/lib/catalog-product";
import { isProductId, productPath } from "@/lib/product-slug";
import {
    getProductSeo,
    buildFaqPageSchema,
    productPageUrl,
} from "@/lib/product-seo";
import ProductDetailsView from "./ProductDetailsView";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlugOrId(slug);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    const seo = getProductSeo(product.id);
    const title =
        seo?.metaTitle ??
        (product.name.includes("for Research") ? product.name : `${product.name} for Research`);
    const plainDescription = product.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const description = seo?.metaDescription ?? plainDescription.substring(0, 160);
    const path = productPath(product);

    return {
        title,
        description,
        alternates: canonicalPath(path),
        openGraph: {
            title: `${title} | BioLongevity Labs`,
            description,
            url: `https://biolongevitylabss.com${path}`,
            siteName: "BioLongevity Labs",
            type: "website",
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
            card: "summary_large_image",
            title,
            description,
            images: [product.image.startsWith("http") ? product.image : `https://biolongevitylabss.com${product.image}`],
        },
    };
}

export default async function ProductDetailsPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlugOrId(slug);

    if (!product) return <ProductDetailsView slug={slug} key={slug} />;

    const canonicalSlug = product.slug!;
    if (slug !== canonicalSlug) {
        redirect(`/product/${canonicalSlug}`);
    }

    const seo = getProductSeo(product.id);
    const pageUrl = productPageUrl(product);
    const path = productPath(product);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 1,
                                name: "Home",
                                item: "https://biolongevitylabss.com/",
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                name: "Shop",
                                item: "https://biolongevitylabss.com/shop",
                            },
                            {
                                "@type": "ListItem",
                                position: 3,
                                name: product.name,
                                item: `https://biolongevitylabss.com${path}`,
                            },
                        ],
                    }),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: product.name,
                        image: product.image.startsWith("http") ? product.image : `https://biolongevitylabss.com${product.image}`,
                        description: product.description,
                        sku: product.id,
                        mpn: product.id,
                        brand: {
                            "@type": "Brand",
                            name: "BioLongevity Labs",
                        },
                        category: product.category,
                        offers: {
                            "@type": "Offer",
                            url: `https://biolongevitylabss.com${path}`,
                            priceCurrency: "USD",
                            price: product.isVariable && product.minPrice ? product.minPrice : product.price,
                            priceValidUntil: "2026-12-31",
                            availability: "https://schema.org/InStock",
                            itemCondition: "https://schema.org/NewCondition",
                            seller: {
                                "@type": "Organization",
                                name: "BioLongevity Labs",
                            },
                        },
                    }),
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
            <ProductDetailsView slug={canonicalSlug} key={canonicalSlug} />
        </>
    );
}

# Product Page Schema Markup Report (With Skill)

### Proposed Implementation for `src/app/product/[id]/page.tsx`:

```tsx
import { Metadata } from 'next';

// ... existing imports ...

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | BioLongevity Labs`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.name,
    'image': product.image,
    'description': product.description,
    'brand': {
      '@type': 'Brand',
      'name': 'BioLongevity Labs'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://biolongevitylabss.com/product/${product.id}`,
      'priceCurrency': 'USD',
      'price': product.price,
      'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'itemCondition': 'https://schema.org/NewCondition'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ... existing component JSX ... */}
    </>
  );
}
```

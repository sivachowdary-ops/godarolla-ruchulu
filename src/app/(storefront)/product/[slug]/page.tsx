import { getProductBySlug, getProducts } from '@/lib/services/productsService';
import { ProductDetailClient } from './ProductDetailClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  
  let relatedProducts: any[] = [];
  if (product) {
    const allProducts = await getProducts();
    relatedProducts = allProducts
      .filter((p) => p.category === product.category && p.slug !== product.slug && p.isActive)
      .slice(0, 4);
  }

  return <ProductDetailClient product={product || null} relatedProducts={relatedProducts} />;
}

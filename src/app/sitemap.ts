import { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Define static routes
  const routes = ['', '/products', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Define dynamic product detail routes
  const productRoutes = products
    .filter((p) => p.isActive)
    .map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  return [...routes, ...productRoutes];
}

import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Hide admin route from search engines
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

import type { MetadataRoute } from 'next';

// In a real app, this should be your production domain
const URL = 'https://nepaliapphub.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${URL}/sitemap.xml`,
  };
}

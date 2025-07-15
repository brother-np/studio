
import type { MetadataRoute } from 'next';

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

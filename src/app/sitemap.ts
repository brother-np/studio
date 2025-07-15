
import { MetadataRoute } from 'next';

const URL = 'https://nepaliapphub.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // For now, we only have a static homepage.
  // In the future, you could extend this to include dynamic pages for each app.
  const routes = [''].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return routes;
}

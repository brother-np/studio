import type { MetadataRoute } from 'next';
import { getApps } from '@/app/admin/dashboard/actions';

// In a real app, this should be your production domain
const URL = 'https://nepaliapphub.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // We are only including the homepage for now, as there are no other public-facing pages.
  const routes = ['/'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return routes;
}

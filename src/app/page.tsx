
'use server';

import { getApps, getCategories, getSettings } from '@/app/admin/dashboard/actions';
import { generateWebsiteDescription } from '@/ai/flows/generate-website-description';
import Header from '@/components/header';
import AppGrid from '@/components/app-grid';
import { AppCard } from '@/components/app-card';
import AdUnit from '@/components/ad-unit';

export default async function Home() {
  // Fetch data in parallel for better performance
  const appsPromise = getApps();
  const categoriesPromise = getCategories();
  const settingsPromise = getSettings();
  const descriptionPromise = generateWebsiteDescription({}).catch(err => {
    console.error("Failed to generate website description:", err);
    // Provide a fallback description
    return { description: 'Explore a curated collection of apps made for Nepal and by Nepalis.' };
  });

  const [apps, categories, settings, descriptionResult] = await Promise.all([
    appsPromise,
    categoriesPromise,
    settingsPromise,
    descriptionPromise,
  ]);
  
  const description = descriptionResult.description;
  const featuredApps = apps.slice(0, 3);
  const adClient = settings.adsensePublisherId;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-8 p-4 md:gap-12 md:p-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Discover Nepali Apps
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            {description}
          </p>
        </div>

        {adClient && (
          <AdUnit
            adSlot="2021831943"
            adClient={adClient}
          />
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-headline tracking-tight">Featured Apps</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>

        <AppGrid apps={apps} categories={categories} />

      </main>
      <footer className="flex items-center justify-center p-4 border-t">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} <span className="text-primary font-semibold">Nepali</span><span className="font-semibold text-accent">AppHub</span></p>
      </footer>
    </div>
  );
}

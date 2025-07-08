'use client';

import { useState, useMemo, useEffect } from 'react';
import type { App } from '@/lib/types';
import { apps as initialApps, categories } from '@/lib/data';
import { AppCard } from '@/components/app-card';
import Header from '@/components/header';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { generateWebsiteDescription } from '@/ai/flows/generate-website-description';

export default function Home() {
  const [apps, setApps] = useState<App[]>(initialApps);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [description, setDescription] = useState('Loading description...');

  useEffect(() => {
    async function fetchDescription() {
      try {
        const result = await generateWebsiteDescription({});
        setDescription(result.description);
      } catch (error) {
        console.error('Failed to generate website description:', error);
        setDescription('Explore a curated collection of apps made for Nepal and by Nepalis.');
      }
    }
    fetchDescription();
  }, []);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory =
        selectedCategory === 'All' || app.category === selectedCategory;
      const matchesSearch = app.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, searchTerm, selectedCategory]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
            Discover Nepali Apps
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            {description}
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-4xl items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative md:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for an app..."
              className="w-full rounded-lg bg-card pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full rounded-lg bg-card">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No apps found. Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
      <footer className="flex items-center justify-center p-4 border-t">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} <span className="text-primary font-semibold">Nepali</span><span className="font-semibold text-accent">AppHub</span></p>
      </footer>
    </div>
  );
}

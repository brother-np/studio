
'use client';

import { useState, useMemo } from 'react';
import type { App } from '@/lib/types';
import { AppCard } from '@/components/app-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AppGridProps {
  apps: App[];
  categories: string[];
}

export default function AppGrid({ apps, categories }: AppGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    <>
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
    </>
  );
}

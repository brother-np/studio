import type { App, AppSettings } from './types';

export const categories = [
  'Finance',
  'E-commerce',
  'Utilities',
  'Entertainment',
  'News',
  'Food & Drink',
];

export const apps: App[] = [
  {
    id: '1',
    name: 'eSewa',
    description: 'Nepal\'s first online payment gateway.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'Finance',
    tags: ['payment', 'wallet', 'finance'],
  },
  {
    id: '2',
    name: 'Daraz',
    description: 'The leading online shopping platform in Nepal.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'E-commerce',
    tags: ['shopping', 'online', 'store'],
  },
  {
    id: '3',
    name: 'Hamro Patro',
    description: 'A comprehensive Nepali calendar and utility app.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'Utilities',
    tags: ['calendar', 'news', 'tools'],
  },
  {
    id: '4',
    name: 'Foodmandu',
    description: 'Order food from your favorite restaurants.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'Food & Drink',
    tags: ['food', 'delivery', 'restaurant'],
  },
  {
    id: '5',
    name: 'NetTV',
    description: 'Watch live TV and movies on the go.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'Entertainment',
    tags: ['tv', 'movies', 'streaming'],
  },
  {
    id: '6',
    name: 'Setopati',
    description: 'Stay updated with the latest news from Nepal.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'News',
    tags: ['news', 'current affairs', 'journalism'],
  },
  {
    id: '7',
    name: 'Khalti',
    description: 'A popular digital wallet and payment service.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'Finance',
    tags: ['wallet', 'payment', 'finance'],
  },
  {
    id: '8',
    name: 'Sastodeal',
    description: 'Another great option for online shopping in Nepal.',
    icon: 'https://placehold.co/128x128.png',
    downloadLink: '#',
    category: 'E-commerce',
    tags: ['shopping', 'deals', 'online'],
  },
];

// In-memory store for site settings.
// In a real app, this would be in a database.
export let settings: AppSettings = {
  adsensePublisherId: '',
};

'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// In-memory store to simulate a database.
import { apps as appData, categories, settings } from '@/lib/data';
import type { App, AppSettings } from '@/lib/types';
import { suggestAppTags } from '@/ai/flows/suggest-app-tags';

let apps: App[] = [...appData]; // mutable copy

const AUTH_COOKIE_NAME = 'nepali-app-hub-auth';
const ADMIN_EMAIL = 'anukulkhatiwada888@gmail.com';
const ADMIN_PASSWORD = 'Sanu@123';

const AppSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().url('Must be a valid URL'),
  androidDownloadLink: z.string().url('Must be a valid URL or empty.').optional().or(z.literal('')),
  windowsDownloadLink: z.string().url('Must be a valid URL or empty.').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'At least one tag is required'),
}).refine(data => data.androidDownloadLink || data.windowsDownloadLink, {
  message: "At least one download link is required.",
  path: ["androidDownloadLink"],
});

const SettingsSchema = z.object({
  adsensePublisherId: z.string()
    .refine((val) => val === '' || /^ca-pub-\d{16}$/.test(val), {
      message: 'Invalid ID. Must be in ca-pub-XXXXXXXXXXXXXXXX format or empty.',
    })
    .optional(),
});


// --- Auth Actions ---

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    cookies().set(AUTH_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    redirect('/admin/dashboard');
  }

  return { error: 'Invalid credentials.' };
}

export async function logout() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect('/admin/login');
}


// --- App CRUD Actions ---

export async function getApps(): Promise<App[]> {
  // In a real app, this would query a database.
  return Promise.resolve(apps);
}

export async function addApp(formData: FormData) {
  const validatedFields = AppSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields. ' + validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { tags, androidDownloadLink, windowsDownloadLink, ...rest } = validatedFields.data;

  const newApp: App = {
    id: Date.now().toString(),
    ...rest,
    downloadLinks: {
      android: androidDownloadLink,
      windows: windowsDownloadLink,
    },
    tags: tags.split(',').map(tag => tag.trim()),
  };

  apps.unshift(newApp);
  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { success: true };
}

export async function updateApp(formData: FormData) {
  const validatedFields = AppSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success || !validatedFields.data.id) {
    return {
      error: 'Invalid fields or missing ID.',
    };
  }

  const { id, tags, androidDownloadLink, windowsDownloadLink, ...rest } = validatedFields.data;
  
  const appIndex = apps.findIndex(app => app.id === id);
  if (appIndex === -1) {
    return { error: 'App not found.' };
  }

  const updatedApp: App = {
    id,
    ...rest,
    downloadLinks: {
      android: androidDownloadLink,
      windows: windowsDownloadLink,
    },
    tags: tags.split(',').map(tag => tag.trim()),
  };
  
  apps[appIndex] = updatedApp;
  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { success: true };
}

export async function deleteApp(appId: string) {
  apps = apps.filter(app => app.id !== appId);
  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  return { success: true };
}

// --- AI Action ---

export async function suggestTagsAction(description: string) {
  if (!description) {
    return { error: 'Description cannot be empty.' };
  }
  try {
    const result = await suggestAppTags({ description });
    return { tags: result.tags };
  } catch (error) {
    console.error('AI Tag Suggestion Error:', error);
    return { error: 'Failed to suggest tags.' };
  }
}

// --- Settings Actions ---

export async function getSettings(): Promise<AppSettings> {
  return Promise.resolve(settings);
}

export async function updateSettings(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = SettingsSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.adsensePublisherId?.[0] || 'Invalid data.',
    };
  }
  
  settings.adsensePublisherId = validatedFields.data.adsensePublisherId || '';
  
  revalidatePath('/admin/dashboard');
  revalidatePath('/');

  return { success: true };
}


// --- Other Data Actions ---
export async function getCategories(): Promise<string[]> {
  return Promise.resolve(categories);
}

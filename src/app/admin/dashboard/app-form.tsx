
'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { App } from '@/lib/types';
import { addApp, updateApp, suggestTagsAction, getCategories } from './actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Upload, X } from 'lucide-react';
import Image from 'next/image';

const MAX_FILE_SIZE = 500000; // 500KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const appFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  icon: z.any().refine((value) => {
    return (typeof value === 'string' && value !== '') || (value instanceof FileList && value.length > 0)
  }, 'An app icon is required.'),
  androidDownloadLink: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')).optional(),
  windowsDownloadLink: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')).optional(),
  category: z.string({ required_error: 'Please select a category.' }),
  tags: z.string().min(1, { message: 'Please enter at least one tag.' }),
}).refine(data => data.androidDownloadLink || data.windowsDownloadLink, {
  message: "At least one download link must be provided.",
  path: ["androidDownloadLink"],
});

type AppFormValues = z.infer<typeof appFormSchema>;

interface AppFormProps {
  app?: App | null;
  onSuccess: () => void;
}

export default function AppForm({ app, onSuccess }: AppFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [iconPreview, setIconPreview] = useState<string | null>(app?.icon || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<AppFormValues>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      id: app?.id || '',
      name: app?.name || '',
      description: app?.description || '',
      icon: app?.icon || '',
      androidDownloadLink: app?.downloadLinks?.android || '',
      windowsDownloadLink: app?.downloadLinks?.windows || '',
      category: app?.category || '',
      tags: app?.tags?.join(', ') || '',
    },
  });
  
  const iconValue = form.watch('icon');

  useEffect(() => {
    if (iconValue instanceof FileList && iconValue.length > 0) {
      const file = iconValue[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (typeof iconValue === 'string') {
      setIconPreview(iconValue);
    } else {
      setIconPreview(null);
    }
  }, [iconValue]);

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getCategories();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const defaultIcon = app?.icon || '';
    form.reset({
      id: app?.id || '',
      name: app?.name || '',
      description: app?.description || '',
      icon: defaultIcon,
      androidDownloadLink: app?.downloadLinks?.android || '',
      windowsDownloadLink: app?.downloadLinks?.windows || '',
      category: app?.category || '',
      tags: app?.tags?.join(', ') || '',
    });
    setIconPreview(defaultIcon);
  }, [app, form]);
  
  const handleSuggestTags = async () => {
    const description = form.getValues('description');
    if (!description) {
      toast({
        title: 'Cannot Suggest Tags',
        description: 'Please enter a description first.',
        variant: 'destructive'
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestTagsAction(description);
      if(result.tags) {
        form.setValue('tags', result.tags.join(', '));
        toast({
          title: 'Tags Suggested!',
          description: 'AI has suggested some tags based on your description.',
        });
      } else if (result.error) {
        toast({
          title: 'Error Suggesting Tags',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (e) {
       toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
    setIsSuggesting(false);
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(data: AppFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();

    let iconData = data.icon;
    if (data.icon instanceof FileList && data.icon.length > 0) {
      try {
        iconData = await fileToDataUrl(data.icon[0]);
      } catch (error) {
        toast({ title: 'Error processing image', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }
    }
    
    const submissionData = {...data, icon: iconData };

    Object.entries(submissionData).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    const result = app?.id ? await updateApp(formData) : await addApp(formData);
    
    if (result.success && result.app) {
      toast({
        title: `App ${app?.id ? 'Updated' : 'Added'}`,
        description: `The app "${data.name}" has been successfully ${app?.id ? 'updated' : 'added'}.`,
      });
      onSuccess();
    } else {
      toast({
        title: 'An error occurred',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  }

  const handleRemoveImage = () => {
    form.setValue('icon', '');
    setIconPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Nepali App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the app's features and purpose."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field: { onChange, value, ...rest }}) => (
            <FormItem>
              <FormLabel>App Icon</FormLabel>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg border border-dashed flex items-center justify-center bg-muted/50">
                  {iconPreview ? (
                     <div className="relative w-full h-full">
                        <Image src={iconPreview} alt="Icon preview" layout="fill" objectFit="contain" className="rounded-lg" />
                         <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={handleRemoveImage}>
                           <X className="h-4 w-4" />
                         </Button>
                      </div>
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                   <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*"
                        {...rest}
                        ref={fileInputRef}
                        onChange={(e) => onChange(e.target.files)}
                      />
                  </FormControl>
                  <FormDescription>Upload a PNG, JPG, or WEBP file (max 500KB).</FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="androidDownloadLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Android Download Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://play.google.com/store/apps/details?id=..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="windowsDownloadLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Windows Download Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://apps.microsoft.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Tags</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggesting}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {isSuggesting ? 'Suggesting...' : 'Suggest with AI'}
                </Button>
              </div>
              <FormControl>
                <Input placeholder="e.g., finance, wallet, payment" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated tags for better searchability.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save App'}
        </Button>
      </form>
    </Form>
  );
}

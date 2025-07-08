'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Wand2 } from 'lucide-react';

const appFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  icon: z.string().url({ message: 'Please enter a valid icon URL.' }),
  downloadLink: z.string().url({ message: 'Please enter a valid download link URL.' }),
  category: z.string({ required_error: 'Please select a category.' }),
  tags: z.string().min(1, { message: 'Please enter at least one tag.' }),
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
  
  const form = useForm<AppFormValues>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      id: app?.id || '',
      name: app?.name || '',
      description: app?.description || '',
      icon: app?.icon || '',
      downloadLink: app?.downloadLink || '',
      category: app?.category || '',
      tags: app?.tags?.join(', ') || '',
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getCategories();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    form.reset({
      id: app?.id || '',
      name: app?.name || '',
      description: app?.description || '',
      icon: app?.icon || '',
      downloadLink: app?.downloadLink || '',
      category: app?.category || '',
      tags: app?.tags?.join(', ') || '',
    });
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
    const result = await suggestTagsAction(description);
    if(result.tags) {
      form.setValue('tags', result.tags.join(', '));
      toast({
        title: 'Tags Suggested!',
        description: 'AI has suggested some tags based on your description.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
    setIsSuggesting(false);
  };

  async function onSubmit(data: AppFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    const result = app?.id ? await updateApp(formData) : await addApp(formData);
    
    if (result.success) {
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
                    <Input placeholder="e.g., Mero App" {...field} />
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/icon.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="downloadLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download Link</FormLabel>
              <FormControl>
                <Input placeholder="https://play.google.com/store/apps/details?id=..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { AppSettings } from '@/lib/types';
import { updateSettings } from './actions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { Settings } from 'lucide-react';

const settingsFormSchema = z.object({
  adsensePublisherId: z.string()
    .refine((val) => val === '' || /^ca-pub-\d{16}$/.test(val), {
      message: 'Invalid ID. Must be in ca-pub-XXXXXXXXXXXXXXXX format or empty.',
    })
    .optional()
    .default(''),
  googleSiteVerification: z.string().optional().default(''),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsDialogProps {
  initialSettings: AppSettings;
}

export default function SettingsDialog({ initialSettings }: SettingsDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      adsensePublisherId: initialSettings?.adsensePublisherId || '',
      googleSiteVerification: initialSettings?.googleSiteVerification || '',
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('adsensePublisherId', data.adsensePublisherId || '');
    formData.append('googleSiteVerification', data.googleSiteVerification || '');

    const result = await updateSettings(formData);

    if (result.success) {
      toast({
        title: 'Settings Updated',
        description: 'Your Google settings have been saved.',
      });
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Google Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Google Settings</DialogTitle>
          <DialogDescription>
            Manage your Google integrations like AdSense and Search Console.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="adsensePublisherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AdSense Publisher ID</FormLabel>
                  <FormControl>
                    <Input placeholder="ca-pub-XXXXXXXXXXXXXXXX" {...field} />
                  </FormControl>
                  <FormDescription>
                    You can find this ID in your AdSense account. Leave blank to disable.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="googleSiteVerification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Site Verification</FormLabel>
                  <FormControl>
                    <Input placeholder="Your verification code" {...field} />
                  </FormControl>
                  <FormDescription>
                    Paste the content from the HTML tag verification method in Google Search Console.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

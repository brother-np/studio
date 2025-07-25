
'use client';

import { useState } from 'react';
import type { App } from '@/lib/types';
import { getApps, deleteApp } from './actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, PlusCircle, Trash2 } from 'lucide-react';
import AppForm from './app-form';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

interface AppTableProps {
  initialApps: App[];
}

export default function AppTable({ initialApps }: AppTableProps) {
  const [apps, setApps] = useState(initialApps);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const { toast } = useToast();

  const refreshApps = async () => {
    const updatedApps = await getApps();
    setApps(updatedApps);
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingApp(null);
    refreshApps();
  };

  const openEditForm = (app: App) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingApp(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (appId: string) => {
    const result = await deleteApp(appId);
    if (result.success) {
      setApps(apps.filter(app => app.id !== appId));
      toast({
        title: 'App Deleted',
        description: 'The app has been successfully removed.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete the app.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New App
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="font-headline">
                {editingApp ? 'Edit App' : 'Add New App'}
              </DialogTitle>
            </DialogHeader>
            <AppForm
              app={editingApp}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length > 0 ? (
              apps.map(app => (
                <TableRow key={app.id}>
                  <TableCell>
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                      data-ai-hint="app icon"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditForm(app)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the app
                              listing for &quot;{app.name}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(app.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No apps found. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

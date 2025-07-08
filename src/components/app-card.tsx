import Image from 'next/image';
import Link from 'next/link';
import type { App } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  const hasDownloads = app.downloadLinks.android || app.downloadLinks.windows;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-start gap-4">
        <Image
          src={app.icon}
          alt={`${app.name} icon`}
          width={64}
          height={64}
          className="rounded-lg border"
          data-ai-hint="app icon"
        />
        <div className="flex-1">
          <CardTitle className="font-headline text-lg">{app.name}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">{app.category}</Badge>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {app.description}
        </p>
      </CardContent>
      <CardFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full" variant="default" disabled={!hasDownloads}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {app.downloadLinks.android && (
              <DropdownMenuItem asChild>
                <Link href={app.downloadLinks.android} target="_blank" rel="noopener noreferrer" className="w-full">
                  For Android
                </Link>
              </DropdownMenuItem>
            )}
            {app.downloadLinks.windows && (
              <DropdownMenuItem asChild>
                <Link href={app.downloadLinks.windows} target="_blank" rel="noopener noreferrer" className="w-full">
                  For Windows
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

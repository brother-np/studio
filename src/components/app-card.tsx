import Image from 'next/image';
import Link from 'next/link';
import type { App } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
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
        <Button asChild className="w-full" variant="default">
          <Link href={app.downloadLink} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

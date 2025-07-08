import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NepaliAppHubIcon } from '@/components/icons';
import { Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <NepaliAppHubIcon className="h-6 w-6" />
          <span className="font-bold font-headline sm:inline-block">
            <span className="text-primary">Nepali</span><span className="text-accent">AppHub</span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/dashboard">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

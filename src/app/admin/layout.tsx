import Link from 'next/link';
import { NepaliAppHubIcon } from '@/components/icons';
import LogoutButton from '@/components/logout-button';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <NepaliAppHubIcon className="h-6 w-6" />
            <span className="font-headline">
              <span className="text-primary">Nepali</span><span className="text-accent">AppHub</span> Admin
            </span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                <Home />
                Home
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

'use client';

import { logout } from '@/app/admin/dashboard/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <form action={logout}>
      <Button type="submit" variant="destructive">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}

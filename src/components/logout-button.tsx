'use client';

import { logout } from '@/app/admin/dashboard/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="destructive">
        <LogOut />
        Logout
      </Button>
    </form>
  );
}

'use client';

import { Icons } from '@/components/icons';
import { UserNav } from './user-nav';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
        <Icons.logo className="h-7 w-7" />
        <h1 className="font-headline">FitTrackAI</h1>
      </Link>
      <UserNav />
    </header>
  );
}

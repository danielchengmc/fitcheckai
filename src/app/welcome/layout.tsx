'use client';

import type { ReactNode } from 'react';
import { Icons } from '@/components/icons';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WelcomeLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
        <Icons.logo className="h-8 w-8" />
        <h1 className="font-headline">FitTrackAI</h1>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}

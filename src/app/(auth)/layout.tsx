import type { ReactNode } from 'react';
import { Icons } from '@/components/icons';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
        <Icons.logo className="h-8 w-8" />
        <h1 className="font-headline">FitTrackAI</h1>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}

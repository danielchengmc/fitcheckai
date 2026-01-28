'use client';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Icons.logo className="h-12 w-12 animate-pulse text-primary" />
        <div className="space-y-2 text-center">
            <p className='text-muted-foreground'>Loading your fitness journey...</p>
        </div>
      </div>
    </div>
  );
}

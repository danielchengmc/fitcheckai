'use client';

import { Header } from '@/components/header';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/icons';
import { useUserProfile } from '@/hooks/use-user-profile';
import { OnboardingForm } from '@/components/onboarding-form';
import { usePathname } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useUserProfile();
  const pathname = usePathname();

  const isLoading = userLoading || profileLoading;

  if (isLoading || !user) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 justify-between">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
            </header>
            <main className="flex-1 p-4 md:p-8 lg:p-10">
                <div className="flex justify-center items-center h-full">
                    <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
                </div>
            </main>
        </div>
    );
  }

  if (!profile?.profileComplete) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
          <Icons.logo className="h-8 w-8" />
          <h1 className="font-headline">FitTrackAI</h1>
        </div>
        <div className="w-full max-w-md">
          <OnboardingForm />
        </div>
      </main>
    );
  }

  const isProfilePage = pathname === '/dashboard/profile';

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {!isProfilePage && <DashboardNav />}
        {children}
      </main>
    </div>
  );
}

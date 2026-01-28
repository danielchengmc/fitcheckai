'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
        toast({
            title: "Sign Out Failed",
            description: "There was a problem signing you out. Please try again.",
            variant: "destructive"
        })
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2 text-xl font-bold text-primary">
        <Icons.logo className="h-7 w-7" />
        <h1 className="font-headline">FitTrackAI</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign Out">
        <LogOut className="h-5 w-5" />
      </Button>
    </header>
  );
}

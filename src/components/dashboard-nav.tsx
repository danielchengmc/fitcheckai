'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { href: '/dashboard/workouts', label: 'Workouts', icon: Icons.dumbbell },
  { href: '/dashboard/meals', label: 'Meals', icon: Icons.meal },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid w-full grid-cols-3 mb-6 bg-muted p-1 rounded-md text-muted-foreground">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              isActive && 'bg-background text-foreground shadow-sm'
            )}
          >
            <item.icon className="mr-2 h-4 w-4 hidden sm:inline-block" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

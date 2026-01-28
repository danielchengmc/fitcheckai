'use client';

import type { ReactNode } from 'react';

// This layout is intentionally minimal to break a redirect loop.
// The onboarding logic is now handled in /dashboard/layout.tsx.
export default function WelcomeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

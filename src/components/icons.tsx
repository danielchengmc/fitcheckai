import { Weight, Dumbbell, UtensilsCrossed, LayoutDashboard, LoaderCircle } from 'lucide-react';
import React from 'react';

export const Icons = {
  logo: Weight,
  dumbbell: Dumbbell,
  meal: UtensilsCrossed,
  dashboard: LayoutDashboard,
  spinner: LoaderCircle,
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path
        d="M12.48 10.92v3.28h7.84c-.27 1.44-1.7 3.92-4.57 3.92-2.72 0-4.94-2.26-4.94-5.02s2.22-5.02 4.94-5.02c1.56 0 2.58.66 3.17 1.22l2.48-2.4c-1.5-1.4-3.48-2.3-5.65-2.3-4.8 0-8.68 3.87-8.68 8.68s3.88 8.68 8.68 8.68c4.94 0 8.4-3.4 8.4-8.52 0-.57-.05-1.12-.14-1.64H12.48z"
        fill="currentColor"
      />
    </svg>
  ),
};

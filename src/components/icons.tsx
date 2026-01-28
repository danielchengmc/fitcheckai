import { Weight, Dumbbell, UtensilsCrossed, LayoutDashboard, LoaderCircle, User, LogOut } from 'lucide-react';
import React from 'react';

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.84-4.32 1.84-5.24 0-9.48-4.24-9.48-9.48s4.24-9.48 9.48-9.48c2.92 0 5.04 1.16 6.6 2.68l-2.52 2.52c-.92-.88-2.16-1.48-4.08-1.48-3.4 0-6.16 2.84-6.16 6.32s2.76 6.32 6.16 6.32c3.8 0 5.4-2.6 5.6-4.08h-5.6z" fill="#4285F4"/>
    </svg>
);


export const Icons = {
  logo: Weight,
  dumbbell: Dumbbell,
  meal: UtensilsCrossed,
  dashboard: LayoutDashboard,
  spinner: LoaderCircle,
  google: GoogleIcon,
  user: User,
  logout: LogOut,
};

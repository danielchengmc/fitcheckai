'use client';

import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between py-2 border-b">
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium text-right">{value}</p>
  </div>
);

export default function ProfilePage() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 sm:p-6 md:p-8 text-center text-muted-foreground">
        <p>Could not load user profile.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            This is how we personalize your fitness journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <DetailItem label="Name" value={profile.displayName || 'Not set'} />
                <DetailItem label="Email" value={profile.email || 'Not set'} />
                <DetailItem label="Age" value={profile.age} />
                <DetailItem label="Gender" value={profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)} />
                <DetailItem label="Height" value={`${profile.height} cm`} />
                <DetailItem label="Weight" value={`${profile.weight} kg`} />
                <DetailItem label="Exercise Frequency" value={`${profile.exerciseFrequency} days/week`} />
                <div className="py-2">
                    <p className="text-muted-foreground mb-2">Goals</p>
                    <p className="font-medium p-3 bg-muted/50 rounded-md whitespace-pre-wrap">{profile.goals}</p>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

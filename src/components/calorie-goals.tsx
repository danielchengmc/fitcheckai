'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { calculateCalorieGoalsAction } from '@/app/dashboard/actions';
import type { CalculateCalorieGoalsOutput } from '@/ai/flows/calculate-calorie-goals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Flame } from 'lucide-react';

const GoalItem = ({ label, value, color }: { label: string; value: number; color?: string }) => (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${color || 'text-primary'}`}>{Math.round(value)}</p>
        <p className="text-xs text-muted-foreground">calories/day</p>
    </div>
);


export function CalorieGoals() {
  const { profile, loading: profileLoading } = useUserProfile();
  const [goals, setGoals] = useState<CalculateCalorieGoalsOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGoals() {
      if (profile) {
        try {
          setLoading(true);
          const result = await calculateCalorieGoalsAction({
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            weight: profile.weight,
            exerciseFrequency: profile.exerciseFrequency,
          });
          setGoals(result);
        } catch (error) {
          console.error("Failed to fetch calorie goals", error);
          // Optionally set an error state to show in the UI
        } finally {
          setLoading(false);
        }
      }
    }

    if (!profileLoading && profile) {
      fetchGoals();
    }
  }, [profile, profileLoading]);

  const isLoading = profileLoading || loading;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary" />
          <CardTitle>Daily Calorie Goals</CardTitle>
        </div>
        <CardDescription>
            AI-powered recommendations based on your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : goals ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GoalItem label="Cut" value={goals.cutting} color="text-chart-4" />
            <GoalItem label="Maintain" value={goals.maintenance} color="text-chart-2" />
            <GoalItem label="Bulk" value={goals.bulking} color="text-chart-1" />
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Could not load your calorie goals.</p>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { calculateCalorieGoals } from '@/ai/flows/calculate-calorie-goals';
import type { CalorieGoals as CalorieGoalsType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Flame } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useUser } from '@/hooks/use-user';

const GoalItem = ({ label, value, protein, color }: { label: string; value: number; protein: number; color?: string }) => (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="mt-2">
            <p className={`text-3xl font-bold ${color || 'text-primary'}`}>{Math.round(value)}</p>
            <p className="text-xs text-muted-foreground -mt-1">Calories</p>
        </div>
        <div className="mt-3">
            <p className="text-xl font-bold">{Math.round(protein)}g</p>
            <p className="text-xs text-muted-foreground -mt-1">Protein</p>
        </div>
    </div>
);


export function CalorieGoals() {
  const { user } = useUser();
  const { profile, loading: profileLoading } = useUserProfile();
  const [goals, setGoals] = useState<CalorieGoalsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndSetGoals() {
      if (profile && user) {
        if (profile.calorieGoals) {
          setGoals(profile.calorieGoals);
          setLoading(false);
        } else {
          try {
            setLoading(true);
            setError(null);
            const result = await calculateCalorieGoals({
              age: profile.age,
              gender: profile.gender,
              height: profile.height,
              weight: profile.weight,
              exerciseFrequency: profile.exerciseFrequency,
            });
            setGoals(result);
            
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
              calorieGoals: result
            });

          } catch (error) {
            console.error("Failed to fetch calorie goals", error);
            setError("Could not load your calorie goals.");
          } finally {
            setLoading(false);
          }
        }
      }
    }

    if (!profileLoading && profile) {
      fetchAndSetGoals();
    } else if (!profileLoading && !profile) {
      setLoading(false);
    }
  }, [profile, profileLoading, user]);

  const isLoading = profileLoading || loading;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary" />
          <CardTitle>Daily Goals</CardTitle>
        </div>
        <CardDescription>
            AI-powered recommendations for your daily calorie and protein intake.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : error ? (
            <p className="text-muted-foreground text-center">{error}</p>
        ) : goals ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GoalItem label="Cut" value={goals.cutting} protein={goals.protein.cutting} color="text-chart-4" />
            <GoalItem label="Maintain" value={goals.maintenance} protein={goals.protein.maintenance} color="text-chart-2" />
            <GoalItem label="Bulk" value={goals.bulking} protein={goals.protein.bulking} color="text-chart-1" />
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Could not load your goals.</p>
        )}
      </CardContent>
    </Card>
  );
}

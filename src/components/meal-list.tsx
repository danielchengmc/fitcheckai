'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Meal } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export function MealList() {
  const { user } = useUser();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const q = query(collection(db, 'users', user.uid, 'meals'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const mealsData: Meal[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        mealsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Meal);
      });
      setMeals(mealsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-[200px] w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>You haven&apos;t logged any meals yet.</p>
        <p>Click &quot;Log New Meal&quot; to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meals.map((meal) => (
        <Card key={meal.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="aspect-video relative w-full">
              <Image src={meal.imageUrl} alt="A logged meal" fill className="object-cover" />
            </div>
          </CardHeader>
          <CardContent className="p-4">
             <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <p className="font-semibold text-primary">{Math.round(meal.calories)}</p>
                    <p className="text-muted-foreground">Calories</p>
                </div>
                <div>
                    <p className="font-semibold">{Math.round(meal.protein)}g</p>
                    <p className="text-muted-foreground">Protein</p>
                </div>
                <div>
                    <p className="font-semibold">{Math.round(meal.carbohydrates)}g</p>
                    <p className="text-muted-foreground">Carbs</p>
                </div>
                <div>
                    <p className="font-semibold">{Math.round(meal.fat)}g</p>
                    <p className="text-muted-foreground">Fat</p>
                </div>
             </div>
          </CardContent>
           <CardFooter className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">
                    Logged {meal.createdAt ? formatDistanceToNow(new Date(meal.createdAt), { addSuffix: true }) : 'just now'}
                </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

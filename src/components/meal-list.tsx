'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Meal } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';
import { Icons } from './icons';

export function MealList() {
  const { user } = useUser();
  const [groupedMeals, setGroupedMeals] = useState<Record<string, { meals: Meal[]; totalCalories: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    };

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

      const grouped = mealsData.reduce((acc, meal) => {
        if (!meal.createdAt) return acc;
        const dateKey = format(new Date(meal.createdAt), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
            acc[dateKey] = { meals: [], totalCalories: 0 };
        }
        acc[dateKey].meals.push(meal);
        acc[dateKey].totalCalories += meal.calories;
        return acc;
      }, {} as Record<string, { meals: Meal[]; totalCalories: number }>);

      setGroupedMeals(grouped);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching meals:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (Object.keys(groupedMeals).length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>You haven&apos;t logged any meals yet.</p>
        <p>Click &quot;Log New Meal&quot; to get started.</p>
      </div>
    );
  }

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(groupedMeals).map(([date, data]) => (
          <AccordionItem value={date} key={date}>
            <AccordionTrigger className="px-6">
              <div className="flex justify-between w-full pr-4">
                <span className="font-semibold text-primary">{format(new Date(date), 'MMMM d, yyyy')}</span>
                <span className="text-sm text-muted-foreground">
                  Total: {Math.round(data.totalCalories)} kcal
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-2">
                {data.meals.map((meal) => (
                  <div key={meal.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Icons.meal className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium">{Math.round(meal.calories)} Calories</p>
                    </div>
                     <p className="text-xs text-muted-foreground">
                        {meal.createdAt ? format(new Date(meal.createdAt), 'p') : ''}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

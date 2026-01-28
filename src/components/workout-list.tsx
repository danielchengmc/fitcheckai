'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Workout } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';

export function WorkoutList() {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const q = query(collection(db, 'users', user.uid, 'workouts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workoutsData: Workout[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workoutsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Workout);
      });
      setWorkouts(workoutsData);
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

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>You haven&apos;t logged any workouts yet.</p>
        <p>Click &quot;Log New Workout&quot; to get started.</p>
      </div>
    );
  }

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        {workouts.map((workout) => (
          <AccordionItem value={workout.id!} key={workout.id}>
            <AccordionTrigger className="px-6">
              <div className="flex justify-between w-full pr-4">
                <span className="font-semibold text-primary">{workout.name}</span>
                <span className="text-sm text-muted-foreground">
                  {workout.createdAt ? format(new Date(workout.createdAt), 'MMM d, yyyy') : 'Date not available'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4">
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-4 font-semibold text-sm text-muted-foreground px-2">
                  <div className="col-span-2">Exercise</div>
                  <div className="text-center">Sets</div>
                  <div className="text-center">Reps</div>
                  <div className="text-center">Weight</div>
                </div>
                <div className="divide-y rounded-md border">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 p-2 text-sm items-center">
                      <div className="col-span-2 font-medium">{exercise.name}</div>
                      <div className="text-center">{exercise.sets}</div>
                      <div className="text-center">{exercise.reps}</div>
                      <div className="text-center">{exercise.weight} kg</div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

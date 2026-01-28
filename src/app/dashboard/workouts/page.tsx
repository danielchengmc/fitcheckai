'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WorkoutForm } from '@/components/workout-form';
import { WorkoutList } from '@/components/workout-list';

export default function WorkoutsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const onEntryAdded = () => {
    setDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Workouts</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Log New Workout</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log a New Workout</DialogTitle>
            </DialogHeader>
            <WorkoutForm onWorkoutAdded={onEntryAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <WorkoutList />
    </div>
  );
}

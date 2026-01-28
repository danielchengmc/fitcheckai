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
import { MealForm } from '@/components/meal-form';
import { MealList } from '@/components/meal-list';

export default function MealsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const onEntryAdded = () => {
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Your Meals</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Log New Meal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log a New Meal</DialogTitle>
            </DialogHeader>
            <MealForm onMealAdded={onEntryAdded} />
          </DialogContent>
        </Dialog>
      </div>
      <MealList />
    </div>
  );
}

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutForm } from '@/components/workout-form';
import { WorkoutList } from '@/components/workout-list';
import { MealForm } from '@/components/meal-form';
import { MealList } from '@/components/meal-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { Icons } from '@/components/icons';

type DialogState = {
  workout: boolean;
  meal: boolean;
};

export default function DashboardPage() {
  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = useState<DialogState>({
    workout: false,
    meal: false,
  });

  const handleDialogChange = (dialog: keyof DialogState, open: boolean) => {
    setDialogOpen((prev) => ({ ...prev, [dialog]: open }));
  };

  const onEntryAdded = () => {
    setDialogOpen({ workout: false, meal: false });
  };
  
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="dashboard"><Icons.dashboard className="mr-2 h-4 w-4 hidden sm:inline-block"/>Dashboard</TabsTrigger>
          <TabsTrigger value="workouts"><Icons.dumbbell className="mr-2 h-4 w-4 hidden sm:inline-block"/>Workouts</TabsTrigger>
          <TabsTrigger value="meals"><Icons.meal className="mr-2 h-4 w-4 hidden sm:inline-block"/>Meals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {userName}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ready to crush your goals? Track a workout or log a meal to get started.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workouts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Your Workouts</h2>
            <Dialog open={dialogOpen.workout} onOpenChange={(open) => handleDialogChange('workout', open)}>
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
        </TabsContent>
        
        <TabsContent value="meals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Your Meals</h2>
            <Dialog open={dialogOpen.meal} onOpenChange={(open) => handleDialogChange('meal', open)}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

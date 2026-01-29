
'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import { Icons } from './icons';
import { PlusCircle, Trash2 } from 'lucide-react';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required.'),
  sets: z.coerce.number().min(1, 'Must be at least 1 set.'),
  reps: z.coerce.number().min(1, 'Must be at least 1 rep.'),
  weight: z.coerce.number().min(0, 'Weight can be 0.'),
});

const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required.'),
  exercises: z.array(exerciseSchema).min(1, 'Add at least one exercise.'),
});

type WorkoutFormProps = {
  onWorkoutAdded: () => void;
};

export function WorkoutForm({ onWorkoutAdded }: WorkoutFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof workoutSchema>>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: '',
      exercises: [{ name: '', sets: 1, reps: 1, weight: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  async function onSubmit(values: z.infer<typeof workoutSchema>) {
    if (!user) return;
    setIsLoading(true);

    addDoc(collection(db, 'users', user.uid, 'workouts'), {
      ...values,
      createdAt: new Date(),
    }).catch((error) => {
      console.error("Error logging workout:", error);
      toast({
        title: 'Error Logging Workout',
        description: 'There was a problem saving your workout.',
        variant: 'destructive',
      });
    });

    toast({
      title: 'Workout Logged!',
      description: 'Your workout has been successfully saved.',
    });
    onWorkoutAdded();
    form.reset();
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Upper Body Day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Exercises</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end p-3 border rounded-lg relative">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 flex-1">
                <FormField
                  control={form.control}
                  name={`exercises.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="text-xs">Exercise Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Bench Press" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`exercises.${index}.sets`}
                  render={({ field }) => (
                    <FormItem><FormLabel className="text-xs">Sets</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`exercises.${index}.reps`}
                  render={({ field }) => (
                    <FormItem><FormLabel className="text-xs">Reps</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`exercises.${index}.weight`}
                  render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel className="text-xs">Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}
                />
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {form.formState.errors.exercises?.message && <FormMessage>{form.formState.errors.exercises.message}</FormMessage>}
        </div>
        
        <Button type="button" variant="outline" onClick={() => append({ name: '', sets: 1, reps: 1, weight: 0 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
        </Button>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Log Workout
        </Button>
      </form>
    </Form>
  );
}

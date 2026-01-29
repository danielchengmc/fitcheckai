
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Icons } from '@/components/icons';
import { calculateCalorieGoals } from '@/ai/flows/calculate-calorie-goals';

const profileSchema = z.object({
  age: z.coerce.number().min(1, 'Please enter a valid age.'),
  gender: z.string().min(1, 'Please select your gender.'),
  height: z.coerce.number().min(1, 'Please enter your height in cm.'),
  weight: z.coerce.number().min(1, 'Please enter your weight in kg.'),
  goals: z.string().min(10, 'Please describe your goals in at least 10 characters.'),
  exerciseFrequency: z.coerce.number().min(0, 'Cannot be negative.').max(7, 'Cannot be more than 7.'),
});

export function OnboardingForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: '' as any,
      gender: '',
      height: '' as any,
      weight: '' as any,
      goals: '',
      exerciseFrequency: '' as any,
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) return;
    setIsLoading(true);

    try {
      const calorieGoals = await calculateCalorieGoals({
        age: values.age,
        gender: values.gender,
        height: values.height,
        weight: values.weight,
        exerciseFrequency: values.exerciseFrequency,
      });

      const userProfile = {
        ...values,
        email: user.email,
        displayName: user.displayName,
        profileComplete: true,
        createdAt: new Date(),
        calorieGoals,
      };
      
      setDoc(doc(db, 'users', user.uid), userProfile, { merge: true }).catch((error) => {
          console.error("Error saving profile:", error);
          toast({
            title: 'Error Saving Profile',
            description: 'Your details could not be saved. Please try again.',
            variant: 'destructive',
          });
      });

      toast({
        title: 'Profile Saved!',
        description: "Welcome to FitTrackAI! We're excited to have you.",
      });
      // The parent layout will automatically switch views on successful save.
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Saving Profile',
        description: 'There was a problem personalizing your details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tell Us About Yourself</CardTitle>
        <CardDescription>
          This will help us personalize your fitness journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 180" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 75" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="exerciseFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days you exercise per week</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are your fitness goals?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Lose 5kg, run a 5k, or build muscle."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Save & Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

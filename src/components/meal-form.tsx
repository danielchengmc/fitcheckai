'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { estimateMealCalories } from '@/ai/flows/estimate-meal-calories';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Icons } from './icons';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const aiFormSchema = z.object({
  image: z.custom<FileList>().refine((files) => files?.length > 0, 'An image is required.'),
});

const manualFormSchema = z.object({
    calories: z.coerce.number().min(1, "Please enter a valid calorie amount."),
});

type MealFormProps = {
  onMealAdded: () => void;
};

function AiMealForm({ onMealAdded }: MealFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof aiFormSchema>>({
    resolver: zodResolver(aiFormSchema),
  });
  
  const imageRef = form.register("image");

  const handleImageChange = (event: React.ChangeEvent<HTMLTargetElement>) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setPreview(null);
    }
  };

  async function onSubmit(values: z.infer<typeof aiFormSchema>) {
    if (!user || !preview) return;
    setIsLoading(true);

    try {
      const { calories } = await estimateMealCalories({ photoDataUri: preview });

      addDoc(collection(db, 'users', user.uid, 'meals'), {
        calories,
        createdAt: new Date(),
      }).catch((error) => {
        console.error("Error logging meal:", error);
        toast({
          title: 'Error Logging Meal',
          description: 'There was a problem saving your meal to the database.',
          variant: 'destructive',
        });
      });

      toast({
        title: 'Meal Logged!',
        description: `AI estimated ${Math.round(calories)} calories.`,
      });
      onMealAdded();
      form.reset();
      setPreview(null);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Logging Meal',
        description: 'There was a problem analyzing your meal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Photo</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" {...imageRef} onChange={handleImageChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {preview && (
          <Card>
            <CardContent className="p-2">
                <div className="aspect-video relative">
                    <Image src={preview} alt="Meal preview" fill className="rounded-md object-cover" />
                </div>
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full" disabled={isLoading || !preview}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Analyzing...' : 'Log Meal'}
        </Button>
      </form>
    </Form>
  );
}

function ManualMealForm({ onMealAdded }: MealFormProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<z.infer<typeof manualFormSchema>>({
      resolver: zodResolver(manualFormSchema),
      defaultValues: {
        calories: '' as any,
      },
    });
  
    function onSubmit(values: z.infer<typeof manualFormSchema>) {
      if (!user) return;
      setIsLoading(true);
  
      addDoc(collection(db, 'users', user.uid, 'meals'), {
        calories: values.calories,
        createdAt: new Date(),
      }).catch((error) => {
        console.error("Error logging meal:", error);
        toast({
          title: 'Error Logging Meal',
          description: 'There was a problem saving your meal.',
          variant: 'destructive',
        });
      });

      toast({
        title: 'Meal Logged!',
        description: `You manually logged ${values.calories} calories.`,
      });
      onMealAdded();
      form.reset();
      setIsLoading(false);
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Log Meal
          </Button>
        </form>
      </Form>
    );
  }

export function MealForm({ onMealAdded }: MealFormProps) {
  return (
    <Tabs defaultValue="ai" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ai">AI Estimate</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      <TabsContent value="ai">
        <AiMealForm onMealAdded={onMealAdded} />
      </TabsContent>
      <TabsContent value="manual">
        <ManualMealForm onMealAdded={onMealAdded} />
      </TabsContent>
    </Tabs>
  );
}

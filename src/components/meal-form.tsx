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
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Icons } from './icons';
import { Card, CardContent } from './ui/card';

const formSchema = z.object({
  image: z.custom<FileList>().refine((files) => files?.length > 0, 'An image is required.'),
});

type MealFormProps = {
  onMealAdded: () => void;
};

export function MealForm({ onMealAdded }: MealFormProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !preview) return;
    setIsLoading(true);

    const imageFile = values.image[0];

    try {
      // 1. Get AI estimation
      const nutritionData = await estimateMealCalories({ photoDataUri: preview });

      // 2. Upload image to Firebase Storage
      const storageRef = ref(storage, `meals/${user.uid}/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // 3. Save to Firestore
      await addDoc(collection(db, 'users', user.uid, 'meals'), {
        imageUrl,
        ...nutritionData,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Meal Logged!',
        description: 'Your meal and its nutritional info have been saved.',
      });
      onMealAdded();
      form.reset();
      setPreview(null);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Logging Meal',
        description: 'There was a problem analyzing or saving your meal.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

import type { Timestamp } from 'firebase/firestore';

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

export type Workout = {
  id?: string;
  name:string;
  exercises: Exercise[];
  createdAt: Timestamp | Date;
};

export type Meal = {
  id?: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  createdAt: Timestamp | Date;
};

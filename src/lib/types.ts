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
  createdAt?: Timestamp | Date;
};

export type Meal = {
  id?: string;
  imageUrl: string;
  calories: number;
  createdAt?: Timestamp | Date;
};

export type UserProfile = {
  id?: string;
  age: number;
  gender: 'male' | 'female' | 'prefer-not-to-say';
  height: number; // in cm
  weight: number; // in kg
  goals: string;
  exerciseFrequency: number; // days per week, 0-7
  profileComplete: boolean;
  createdAt: Timestamp | Date;
  email?: string | null;
  displayName?: string | null;
};

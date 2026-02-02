import { z } from 'zod';
import type {
  CalculateCalorieGoalsInput,
  CalculateCalorieGoalsOutput,
} from '@/lib/types';

const CalculateCalorieGoalsInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  gender: z.string().describe("The gender of the user ('male' or 'female')."),
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  exerciseFrequency: z
    .number()
    .min(0)
    .max(7)
    .describe('How many days per week the user exercises (0-7).'),
});

export function calculateCalorieGoals(
  input: CalculateCalorieGoalsInput
): CalculateCalorieGoalsOutput {
  const { age, gender, height, weight, exerciseFrequency } =
    CalculateCalorieGoalsInputSchema.parse(input);

  // 1.  Calculate the Basal Metabolic Rate (BMR)
  let bmr: number;
  // For Men: BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) + 5
  // For Women: BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age in years) - 161
  if (gender.toLowerCase() === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 2. Determine activity multiplier
  let activityMultiplier: number;
  if (exerciseFrequency === 0) {
    activityMultiplier = 1.2; // Sedentary
  } else if (exerciseFrequency >= 1 && exerciseFrequency <= 3) {
    activityMultiplier = 1.375; // Lightly Active
  } else if (exerciseFrequency >= 4 && exerciseFrequency <= 5) {
    activityMultiplier = 1.55; // Moderately Active
  } else {
    // 6-7
    activityMultiplier = 1.725; // Very Active
  }

  // 3.  Calculate the calorie goals based on BMR and activity level
  const maintenance = Math.round(bmr * activityMultiplier);
  const cutting = Math.round(maintenance - 400);
  const bulking = Math.round(maintenance + 400);

  // 4.  Calculate the protein goals in grams
  // Protein goals is 0.8 x weight in kg x 2.2. (round to whole number)
  const proteinGoal = Math.round(0.8 * weight * 2.2);

  const result: CalculateCalorieGoalsOutput = {
    maintenance,
    cutting,
    bulking,
    protein: {
      cutting: proteinGoal,
      maintenance: proteinGoal,
      bulking: proteinGoal,
    },
  };

  return result;
}

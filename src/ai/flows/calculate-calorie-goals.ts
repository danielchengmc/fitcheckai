'use server';

/**
 * @fileOverview Calculates daily calorie goals for a user based on their profile.
 *
 * - calculateCalorieGoals - A function that handles the calorie goal calculation process.
 * - CalculateCalorieGoalsInput - The input type for the calculateCalorieGoals function.
 * - CalculateCalorieGoalsOutput - The return type for the calculateCalorieGoals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateCalorieGoalsInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  gender: z.string().describe("The gender of the user ('male' or 'female')."),
  height: z.number().describe('The height of the user in centimeters.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  exerciseFrequency: z.number().describe('How many days per week the user exercises (0-7).'),
});
export type CalculateCalorieGoalsInput = z.infer<typeof CalculateCalorieGoalsInputSchema>;

const CalculateCalorieGoalsOutputSchema = z.object({
  maintenance: z.number().describe('The estimated daily calories to maintain current weight.'),
  cutting: z.number().describe('The estimated daily calories for weight loss (a moderate deficit).'),
  bulking: z.number().describe('The estimated daily calories for muscle gain (a moderate surplus).'),
});
export type CalculateCalorieGoalsOutput = z.infer<typeof CalculateCalorieGoalsOutputSchema>;


export async function calculateCalorieGoals(
  input: CalculateCalorieGoalsInput
): Promise<CalculateCalorieGoalsOutput> {
  return calculateCalorieGoalsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateCalorieGoalsPrompt',
  input: {schema: CalculateCalorieGoalsInputSchema},
  output: {schema: CalculateCalorieGoalsOutputSchema},
  prompt: `You are a nutrition and fitness expert. Your task is to calculate the recommended daily calorie intake for a user based on their personal details.

User Details:
- Age: {{{age}}} years
- Gender: {{{gender}}}
- Height: {{{height}}} cm
- Weight: {{{weight}}} kg
- Exercise Frequency: {{{exerciseFrequency}}} days per week

Follow these steps for your calculation:
1.  Calculate the Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation:
    - For men: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
    - For women: BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) - 161

2.  Determine the activity multiplier based on the exercise frequency:
    - 0 days: 1.2 (Sedentary)
    - 1-3 days: 1.375 (Lightly active)
    - 4-5 days: 1.55 (Moderately active)
    - 6-7 days: 1.725 (Very active)

3.  Calculate the Total Daily Energy Expenditure (TDEE) for maintenance:
    - TDEE = BMR * Activity Multiplier

4.  Calculate the goals:
    - Maintenance: Round the TDEE to the nearest whole number.
    - Cutting: Subtract 400 calories from the TDEE and round to the nearest whole number.
    - Bulking: Add 400 calories to the TDEE and round to the nearest whole number.

Provide the final numbers for maintenance, cutting, and bulking as a JSON object.
`,
});


const calculateCalorieGoalsFlow = ai.defineFlow(
  {
    name: 'calculateCalorieGoalsFlow',
    inputSchema: CalculateCalorieGoalsInputSchema,
    outputSchema: CalculateCalorieGoalsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

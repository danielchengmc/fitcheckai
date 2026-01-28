'use server';

/**
 * @fileOverview Estimates the calorie and macro content of a meal from a photo.
 *
 * - estimateMealCalories - A function that handles the meal calorie estimation process.
 * - EstimateMealCaloriesInput - The input type for the estimateMealCalories function.
 * - EstimateMealCaloriesOutput - The return type for the estimateMealCalories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateMealCaloriesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type EstimateMealCaloriesInput = z.infer<typeof EstimateMealCaloriesInputSchema>;

const EstimateMealCaloriesOutputSchema = z.object({
  calories: z.number().describe('The estimated calorie count of the meal.'),
  protein: z.number().describe('The estimated protein content of the meal in grams.'),
  carbohydrates: z
    .number()
    .describe('The estimated carbohydrate content of the meal in grams.'),
  fat: z.number().describe('The estimated fat content of the meal in grams.'),
});
export type EstimateMealCaloriesOutput = z.infer<typeof EstimateMealCaloriesOutputSchema>;

export async function estimateMealCalories(
  input: EstimateMealCaloriesInput
): Promise<EstimateMealCaloriesOutput> {
  return estimateMealCaloriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateMealCaloriesPrompt',
  input: {schema: EstimateMealCaloriesInputSchema},
  output: {schema: EstimateMealCaloriesOutputSchema},
  prompt: `You are a nutrition expert. You will be given a photo of a meal and you will estimate its calorie and macro content.

  Photo: {{media url=photoDataUri}}

  Respond with the estimated calorie count, protein content (in grams), carbohydrate content (in grams), and fat content (in grams). Return the response as a JSON object. Be as accurate as possible.
  `,
});

const estimateMealCaloriesFlow = ai.defineFlow(
  {
    name: 'estimateMealCaloriesFlow',
    inputSchema: EstimateMealCaloriesInputSchema,
    outputSchema: EstimateMealCaloriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

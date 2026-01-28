'use server';

/**
 * @fileOverview Estimates the calorie content of a meal from a photo.
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
type EstimateMealCaloriesInput = z.infer<typeof EstimateMealCaloriesInputSchema>;

const EstimateMealCaloriesOutputSchema = z.object({
  calories: z.number().describe('The estimated calorie count of the meal.'),
});
type EstimateMealCaloriesOutput = z.infer<typeof EstimateMealCaloriesOutputSchema>;

export async function estimateMealCalories(
  input: EstimateMealCaloriesInput
): Promise<EstimateMealCaloriesOutput> {
  return estimateMealCaloriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateMealCaloriesPrompt',
  input: {schema: EstimateMealCaloriesInputSchema},
  output: {schema: EstimateMealCaloriesOutputSchema},
  prompt: `Output only one number. Tell me the calories of everything in this picture combined.

  Photo: {{media url=photoDataUri}}`,
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

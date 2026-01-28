'use server';

import { estimateMealCalories as estimateMealCaloriesFlow, EstimateMealCaloriesInput, EstimateMealCaloriesOutput } from "@/ai/flows/estimate-meal-calories";

export async function estimateMealCaloriesAction(input: EstimateMealCaloriesInput): Promise<EstimateMealCaloriesOutput> {
  try {
    const result = await estimateMealCaloriesFlow(input);
    return result;
  } catch (error) {
    console.error("Error in estimateMealCaloriesAction:", error);
    throw new Error("Failed to estimate meal calories.");
  }
}

'use server';

import { estimateMealCalories as estimateMealCaloriesFlow } from "@/ai/flows/estimate-meal-calories";
import type { EstimateMealCaloriesInput, EstimateMealCaloriesOutput } from "@/lib/types";

export async function estimateMealCaloriesAction(input: EstimateMealCaloriesInput): Promise<EstimateMealCaloriesOutput> {
  try {
    const result = await estimateMealCaloriesFlow(input);
    return result;
  } catch (error) {
    console.error("Error in estimateMealCaloriesAction:", error);
    throw new Error("Failed to estimate meal calories.");
  }
}

'use server';

import { estimateMealCalories as estimateMealCaloriesFlow, EstimateMealCaloriesInput, EstimateMealCaloriesOutput } from "@/ai/flows/estimate-meal-calories";
import { calculateCalorieGoals as calculateCalorieGoalsFlow, CalculateCalorieGoalsInput, CalculateCalorieGoalsOutput } from "@/ai/flows/calculate-calorie-goals";

export async function estimateMealCaloriesAction(input: EstimateMealCaloriesInput): Promise<EstimateMealCaloriesOutput> {
  try {
    const result = await estimateMealCaloriesFlow(input);
    return result;
  } catch (error) {
    console.error("Error in estimateMealCaloriesAction:", error);
    throw new Error("Failed to estimate meal calories.");
  }
}

export async function calculateCalorieGoalsAction(input: CalculateCalorieGoalsInput): Promise<CalculateCalorieGoalsOutput> {
    try {
        const result = await calculateCalorieGoalsFlow(input);
        return result;
    } catch (error) {
        console.error("Error in calculateCalorieGoalsAction:", error);
        throw new Error("Failed to calculate calorie goals.");
    }
}

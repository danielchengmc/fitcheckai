'use server';

import { estimateMealCalories as estimateMealCaloriesFlow } from "@/ai/flows/estimate-meal-calories";
import { calculateCalorieGoals as calculateCalorieGoalsFlow } from "@/ai/flows/calculate-calorie-goals";

// By inferring the types from the flows, we don't need to export them from the flow files,
// which can cause issues with the 'use server' directive.
type EstimateMealCaloriesFlowType = typeof estimateMealCaloriesFlow;
type EstimateMealCaloriesInput = Parameters<EstimateMealCaloriesFlowType>[0];
type EstimateMealCaloriesOutput = Awaited<ReturnType<EstimateMealCaloriesFlowType>>;

type CalculateCalorieGoalsFlowType = typeof calculateCalorieGoalsFlow;
type CalculateCalorieGoalsInput = Parameters<CalculateCalorieGoalsFlowType>[0];
type CalculateCalorieGoalsOutput = Awaited<ReturnType<CalculateCalorieGoalsFlowType>>;


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

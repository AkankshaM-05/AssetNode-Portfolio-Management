'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating portfolio insights.
 *
 * - generatePortfolioInsights - A function that leverages AI to analyze investment data and provide insights and suggestions.
 * - GeneratePortfolioInsightsInput - The input type for the generatePortfolioInsights function.
 * - GeneratePortfolioInsightsOutput - The return type for the generatePortfolioInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const InvestmentSchema = z.object({
  assetType: z.literal('Stock').describe('The type of asset, currently only Stock is supported.'),
  companyName: z.string().describe('The name of the company for the investment.'),
  quantity: z.number().describe('The number of units held for this investment.'),
  buyPrice: z.number().describe('The price at which each unit was purchased.'),
  purchaseDate: z.string().datetime().describe('The date when the investment was purchased (ISO 8601 format).'),
});

const GeneratePortfolioInsightsInputSchema = z.object({
  investments: z.array(InvestmentSchema).describe('An array of the user\'s investment holdings.'),
});
export type GeneratePortfolioInsightsInput = z.infer<typeof GeneratePortfolioInsightsInputSchema>;

// Output Schema
const PortfolioHealthSchema = z.object({
  overallStatus: z.enum(['Excellent', 'Good', 'Moderate', 'Poor', 'Critical']).describe('Overall health status of the portfolio.'),
  summary: z.string().describe('A brief summary of the portfolio health.'),
});

const AllocationInsightSchema = z.object({
  category: z.string().describe('Category of allocation (e.g., by asset type, industry).'),
  details: z.string().describe('Detailed observation about the allocation.'),
});

const ConcentrationInsightSchema = z.object({
  area: z.string().describe('Area of concentration (e.g., specific company, sector).'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The risk level associated with this concentration.'),
  details: z.string().describe('Detailed observation about the concentration.'),
});

const SuggestionSchema = z.object({
  type: z.string().describe('Type of suggestion (e.g., diversification, rebalance, research).'),
  description: z.string().describe('Detailed suggestion for action.'),
  priority: z.enum(['Low', 'Medium', 'High']).describe('The priority of the suggestion.'),
});

const GeneratePortfolioInsightsOutputSchema = z.object({
  portfolioHealth: PortfolioHealthSchema,
  allocationInsights: z.array(AllocationInsightSchema).describe('Insights regarding the portfolio\'s asset allocation.'),
  concentrationInsights: z.array(ConcentrationInsightSchema).describe('Insights regarding any significant concentrations in the portfolio.'),
  suggestions: z.array(SuggestionSchema).describe('Personalized suggestions for improving the portfolio.'),
});
export type GeneratePortfolioInsightsOutput = z.infer<typeof GeneratePortfolioInsightsOutputSchema>;

// Prompt definition
const portfolioInsightsPrompt = ai.definePrompt({
  name: 'portfolioInsightsPrompt',
  input: { schema: GeneratePortfolioInsightsInputSchema },
  output: { schema: GeneratePortfolioInsightsOutputSchema },
  prompt: `You are an expert financial analyst specializing in personal investment portfolios. Your goal is to analyze the provided investment data and generate clear, concise insights on portfolio health, allocation, and concentration, along with personalized suggestions for diversification or optimization.\n\nHere is the user's investment data:\n\n{{#if investments}}\n{{#each investments}}\n- Asset Type: {{{assetType}}}\n  Company Name: {{{companyName}}}\n  Quantity: {{{quantity}}}\n  Buy Price: {{{buyPrice}}}\n  Purchase Date: {{{purchaseDate}}}\n{{/each}}\n{{else}}\nNo investments provided. Please indicate that the portfolio is empty and provide general advice.\n{{/if}}\n\nBased on the above investment data (or lack thereof), provide the following:\n\n1.  **Portfolio Health**: Assess the overall health status (Excellent, Good, Moderate, Poor, Critical) and provide a brief summary.\n2.  **Allocation Insights**: Identify how assets are distributed. Look for distribution by asset type, industry, or other relevant factors.\n3.  **Concentration Insights**: Point out any significant concentrations, such as too much invested in a single company, sector, or asset type. Assign a risk level (Low, Medium, High).\n4.  **Suggestions**: Offer specific, actionable suggestions for diversification, rebalancing, or optimizing the portfolio. Assign a priority (Low, Medium, High) to each suggestion.\n\nEnsure your output strictly adheres to the JSON schema provided. If the investments list is empty, make sure the output reflects that appropriately by providing general advice about starting a portfolio.`,
});

// Flow definition
const generatePortfolioInsightsFlow = ai.defineFlow(
  {
    name: 'generatePortfolioInsightsFlow',
    inputSchema: GeneratePortfolioInsightsInputSchema,
    outputSchema: GeneratePortfolioInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await portfolioInsightsPrompt(input);
    return output!;
  }
);

// Wrapper function
export async function generatePortfolioInsights(
  input: GeneratePortfolioInsightsInput
): Promise<GeneratePortfolioInsightsOutput> {
  return generatePortfolioInsightsFlow(input);
}

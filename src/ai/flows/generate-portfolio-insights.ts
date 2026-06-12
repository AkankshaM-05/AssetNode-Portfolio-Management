'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating stock portfolio insights.
 *
 * - generatePortfolioInsights - A function that leverages AI to analyze stock investment data and provide market insights and suggestions.
 * - GeneratePortfolioInsightsInput - The input type for the generatePortfolioInsights function.
 * - GeneratePortfolioInsightsOutput - The return type for the generatePortfolioInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const StockSchema = z.object({
  assetType: z.literal('Stock'),
  companyName: z.string(),
  quantity: z.number(),
  buyPrice: z.number(),
  purchaseDate: z.string().datetime(),

  // NEW FIELDS
  sector: z.string().optional(),
  industry: z.string().optional(),
  marketCap: z.number().optional(),
  livePrice: z.number().optional(),
});

const GeneratePortfolioInsightsInputSchema = z.object({
  investments: z.array(StockSchema).describe('An array of the user\'s stock holdings.'),
});
export type GeneratePortfolioInsightsInput = z.infer<typeof GeneratePortfolioInsightsInputSchema>;

// Output Schema
const PortfolioHealthSchema = z.object({
  overallStatus: z.enum(['Excellent', 'Good', 'Moderate', 'Poor', 'Critical']).describe('Overall health status of the stock portfolio.'),
  summary: z.string().describe('A brief summary of the stock portfolio health.'),
});

const AllocationInsightSchema = z.object({
  category: z.string().describe('Category of allocation (e.g., by sector, industry, market cap).'),
  details: z.string().describe('Detailed observation about the stock allocation.'),
});

const ConcentrationInsightSchema = z.object({
  area: z.string().describe('Area of concentration (e.g., specific stock, sector).'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('The risk level associated with this concentration.'),
  details: z.string().describe('Detailed observation about the concentration.'),
});

const SuggestionSchema = z.object({
  type: z.string().describe('Type of suggestion (e.g., sector diversification, stop-loss, research).'),
  description: z.string().describe('Detailed suggestion for action.'),
  priority: z.enum(['Low', 'Medium', 'High']).describe('The priority of the suggestion.'),
});

const GeneratePortfolioInsightsOutputSchema = z.object({
  portfolioHealth: PortfolioHealthSchema,
  allocationInsights: z.array(AllocationInsightSchema).describe('Insights regarding the stock portfolio\'s market allocation.'),
  concentrationInsights: z.array(ConcentrationInsightSchema).describe('Insights regarding any significant company or sector concentrations.'),
  suggestions: z.array(SuggestionSchema).describe('Personalized suggestions for improving the stock portfolio strategy.'),
});
export type GeneratePortfolioInsightsOutput = z.infer<typeof GeneratePortfolioInsightsOutputSchema>;

// Prompt definition
const portfolioInsightsPrompt = ai.definePrompt({
  name: 'portfolioInsightsPrompt',
  input: { schema: GeneratePortfolioInsightsInputSchema },
  output: { schema: GeneratePortfolioInsightsOutputSchema },
  prompt: `You are a professional equity strategist and financial analyst. Your goal is to analyze the user's stock portfolio and generate clear, actionable insights focused exclusively on public equities (stocks).

Here is the user's stock data:

{{#if investments}}
{{#each investments}}
- Company: {{{companyName}}}
  Shares: {{{quantity}}}
  Buy Price (Avg): {{{buyPrice}}}
  Purchase Date: {{{purchaseDate}}}
{{/each}}
{{else}}
No stocks provided. Please indicate that the registry is empty and provide general advice on starting a stock portfolio.
{{/if}}

Based on the stock data provided, provide the following:

1.  **Stock Portfolio Health**: Assess the overall health based on potential sector diversification and concentration risk.
2.  **Allocation Insights**: Identify distribution by sector (if known), market cap style, or industry.
3.  **Concentration Insights**: Highlight if too much weight is in one company or sector.
4.  **Suggestions**: Specific, actionable stock market strategies (e.g., "Look into consumer staples for better defensive posture").

Ensure your output strictly adheres to the JSON schema and focuses only on Stock-related analysis. Avoid mentioning other asset classes like crypto or real estate.`,
});

// Flow definition
const generatePortfolioInsightsFlow = ai.defineFlow(
  {
    name: 'generatePortfolioInsightsFlow',
    inputSchema: GeneratePortfolioInsightsInputSchema,
    outputSchema: GeneratePortfolioInsightsOutputSchema,
  },
  async (input) => {
    try {
      const result = await portfolioInsightsPrompt(input);

      if (!result?.output) {
        throw new Error("AI returned empty output");
      }

      return result.output;
    } catch (error) {
      console.error("AI Flow failed:", error);
      throw new Error(
        error instanceof Error ? error.message : "AI generation failed"
      );
    }
  }
);

// Wrapper function
export async function generatePortfolioInsights(
  input: GeneratePortfolioInsightsInput
): Promise<GeneratePortfolioInsightsOutput> {
  return generatePortfolioInsightsFlow(input);
}

'use server';

/**
 * @fileOverview AI-powered asset registration validator flow.
 *
 * This file defines a Genkit flow that leverages AI to automatically identify missing asset properties
 * during the registration process. It suggests missing details like model name, manufacture date, or
 * asset type based on the asset name to speed up registration and ensure data completeness.
 *
 * @interface AssetRegistrationInput - Defines the input schema for the asset registration validator flow.
 * @interface AssetRegistrationOutput - Defines the output schema for the asset registration validator flow, 
 *   containing suggested missing asset properties.
 * @function validateAssetRegistration - The main function that triggers the asset registration validation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssetRegistrationInputSchema = z.object({
  assetName: z.string().describe('The name of the asset being registered.'),
  existingProperties: z.record(z.any()).optional().describe('Existing properties of the asset.'),
});
export type AssetRegistrationInput = z.infer<typeof AssetRegistrationInputSchema>;

const AssetRegistrationOutputSchema = z.object({
  suggestedProperties: z.record(z.string()).describe('Suggested missing properties for the asset, with property names as keys and suggested values as values.'),
});
export type AssetRegistrationOutput = z.infer<typeof AssetRegistrationOutputSchema>;

export async function validateAssetRegistration(input: AssetRegistrationInput): Promise<AssetRegistrationOutput> {
  return assetRegistrationValidatorFlow(input);
}

const assetRegistrationPrompt = ai.definePrompt({
  name: 'assetRegistrationPrompt',
  input: {schema: AssetRegistrationInputSchema},
  output: {schema: AssetRegistrationOutputSchema},
  prompt: `You are an AI assistant designed to help users register assets quickly and completely.

  The user is registering an asset with the name "{{assetName}}". They may have already provided some properties for this asset, which are provided below:

  {{#if existingProperties}}
  Existing Properties:
  {{#each existingProperties}}
  - {{@key}}: {{this}}
  {{/each}}
  {{else}}
  No properties have been provided yet.
  {{/if}}

  Based on the asset's name and any existing properties, suggest any missing properties that would be helpful to include during asset registration. These could include things like model name, manufacture date, asset type, or any other relevant details. Respond in JSON format, with property names as keys and suggested values as values.
  `,
});

const assetRegistrationValidatorFlow = ai.defineFlow(
  {
    name: 'assetRegistrationValidatorFlow',
    inputSchema: AssetRegistrationInputSchema,
    outputSchema: AssetRegistrationOutputSchema,
  },
  async input => {
    const {output} = await assetRegistrationPrompt(input);
    return output!;
  }
);

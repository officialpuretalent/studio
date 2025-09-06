'use server';

/**
 * @fileOverview Validates tenant information (email and phone number) using Genkit.
 *
 * - validateTenantInfo - Validates the email and phone number.
 * - ValidateTenantInfoInput - The input type for the validateTenantInfo function.
 * - ValidateTenantInfoOutput - The return type for the validateTenantInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateTenantInfoInputSchema = z.object({
  email: z.string().email().describe('The tenant\'s email address.'),
  phoneNumber: z.string().describe('The tenant\'s phone number including country code.'),
});
export type ValidateTenantInfoInput = z.infer<typeof ValidateTenantInfoInputSchema>;

const ValidateTenantInfoOutputSchema = z.object({
  isValidEmail: z.boolean().describe('Whether the email address is valid.'),
  isValidPhoneNumber: z.boolean().describe('Whether the phone number is valid.'),
});
export type ValidateTenantInfoOutput = z.infer<typeof ValidateTenantInfoOutputSchema>;

export async function validateTenantInfo(input: ValidateTenantInfoInput): Promise<ValidateTenantInfoOutput> {
  return validateTenantInfoFlow(input);
}

const validateTenantInfoPrompt = ai.definePrompt({
  name: 'validateTenantInfoPrompt',
  input: {schema: ValidateTenantInfoInputSchema},
  output: {schema: ValidateTenantInfoOutputSchema},
  prompt: `You are an expert at validating contact information.

  Determine if the provided email and phone number are valid.

  Email: {{{email}}}
  Phone Number: {{{phoneNumber}}}

  Return a JSON object indicating whether the email and phone number are valid.
  `,
});

const validateTenantInfoFlow = ai.defineFlow(
  {
    name: 'validateTenantInfoFlow',
    inputSchema: ValidateTenantInfoInputSchema,
    outputSchema: ValidateTenantInfoOutputSchema,
  },
  async input => {
    const {output} = await validateTenantInfoPrompt(input);
    return output!;
  }
);

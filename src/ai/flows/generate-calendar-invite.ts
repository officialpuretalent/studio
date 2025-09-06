'use server';

/**
 * @fileOverview Generates a calendar invite (ics format) based on the viewing details.
 *
 * - generateCalendarInvite - A function that handles the calendar invite generation.
 * - GenerateCalendarInviteInput - The input type for the generateCalendarInvite function.
 * - GenerateCalendarInviteOutput - The return type for the generateCalendarInvite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCalendarInviteInputSchema = z.object({
  propertyName: z.string().describe('The name of the property being viewed.'),
  propertyAddress: z.string().describe('The address of the property.'),
  tenantName: z.string().describe('The name of the tenant.'),
  tenantEmail: z.string().describe('The email address of the tenant.'),
  startTime: z.string().describe('The start time of the viewing (e.g., Tuesday, 23rd September at 10:00 AM).'),
  endTime: z.string().describe('The end time of the viewing (e.g., Tuesday, 23rd September at 10:30 AM).'),
});
export type GenerateCalendarInviteInput = z.infer<typeof GenerateCalendarInviteInputSchema>;

const GenerateCalendarInviteOutputSchema = z.object({
  icsContent: z.string().describe('The iCalendar (ics) format content of the event.'),
});
export type GenerateCalendarInviteOutput = z.infer<typeof GenerateCalendarInviteOutputSchema>;

export async function generateCalendarInvite(input: GenerateCalendarInviteInput): Promise<GenerateCalendarInviteOutput> {
  return generateCalendarInviteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCalendarInvitePrompt',
  input: {schema: GenerateCalendarInviteInputSchema},
  output: {schema: GenerateCalendarInviteOutputSchema},
  prompt: `You are an expert calendar invite generator, who can create .ics files from structured data.

  Create an .ics calendar invite with the following details:

  Property Name: {{{propertyName}}}
  Property Address: {{{propertyAddress}}}
  Tenant Name: {{{tenantName}}}
  Tenant Email: {{{tenantEmail}}}
  Start Time: {{{startTime}}}
  End Time: {{{endTime}}}

  Ensure the output is a valid .ics file that can be imported into Google Calendar, Outlook, and other calendar applications.  Include timezone information.
  Make sure the start and end times are in UTC format.

  The summary should be 'Viewing at {{{propertyName}}}'.
  The location should be '{{{propertyAddress}}}'.
  The description should be 'Viewing for {{{tenantName}}} at {{{propertyAddress}}}'.

  Ensure that the DTSTAMP, UID, and other required fields are correctly formatted.
  Follow proper formatting and escaping for iCalendar files. Only return the iCalendar file content.

  Do not include any introductory or explanatory text.  Begin immediately with 'BEGIN:VCALENDAR'.
  `, 
});

const generateCalendarInviteFlow = ai.defineFlow(
  {
    name: 'generateCalendarInviteFlow',
    inputSchema: GenerateCalendarInviteInputSchema,
    outputSchema: GenerateCalendarInviteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

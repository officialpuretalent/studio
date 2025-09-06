'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { validateTenantInfo } from '@/ai/flows/validate-tenant-info';
import { generateCalendarInvite } from '@/ai/flows/generate-calendar-invite';
import { format, addMinutes } from 'date-fns';

const bookViewingSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  mobileNumber: z.string(),
  propertyId: z.string(),
  propertyAddress: z.string(),
  viewingTime: z.string().datetime(),
});

export async function bookViewing(data: z.infer<typeof bookViewingSchema>) {
  const validation = bookViewingSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const {
    fullName,
    email,
    mobileNumber,
    propertyId,
    propertyAddress,
    viewingTime,
  } = validation.data;

  try {
    const { isValidEmail, isValidPhoneNumber } = await validateTenantInfo({
      email,
      phoneNumber: mobileNumber,
    });

    if (!isValidEmail || !isValidPhoneNumber) {
      let errorMessage = 'Please check your contact details.';
      if (!isValidEmail && !isValidPhoneNumber)
        errorMessage = 'The email and phone number appear to be invalid.';
      else if (!isValidEmail)
        errorMessage = 'The email address appears to be invalid.';
      else if (!isValidPhoneNumber)
        errorMessage = 'The phone number appears to be invalid.';
      return { success: false, error: errorMessage };
    }

    // In a real app, you would save the booking to a database here.
  } catch (error) {
    console.error('AI validation failed:', error);
    // For demo purposes, we will proceed even if AI validation fails.
    // In a production app, you might want to return an error here.
    // return { success: false, error: 'Could not validate your information. Please try again.' };
  }

  const params = new URLSearchParams({
    propertyAddress,
    viewingTime,
    tenantName: fullName,
    tenantEmail: email,
  });

  redirect(`/property/${propertyId}/confirmed?${params.toString()}`);
}

const calendarInviteSchema = z.object({
  propertyAddress: z.string(),
  tenantName: z.string(),
  tenantEmail: z.string().email(),
  viewingTime: z.string().datetime(),
});

export async function getCalendarInvite(
  data: z.infer<typeof calendarInviteSchema>
) {
  const validation = calendarInviteSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: 'Invalid data for calendar invite.' };
  }

  const { propertyAddress, tenantName, tenantEmail, viewingTime } =
    validation.data;
  const startTime = new Date(viewingTime);
  const endTime = addMinutes(startTime, 30);

  try {
    const { icsContent } = await generateCalendarInvite({
      propertyName: propertyAddress,
      propertyAddress: propertyAddress,
      tenantName: tenantName,
      tenantEmail: tenantEmail,
      startTime: format(startTime, "EEEE, MMMM do, yyyy 'at' h:mm a"),
      endTime: format(endTime, "EEEE, MMMM do, yyyy 'at' h:mm a"),
    });

    return { success: true, icsContent };
  } catch (error) {
    console.error('Calendar invite generation failed:', error);
    return {
      success: false,
      error: 'Could not generate calendar invite at this time.',
    };
  }
}

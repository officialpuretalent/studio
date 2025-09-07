'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { generateCalendarInvite } from '@/ai/flows/generate-calendar-invite';
import { format, addMinutes } from 'date-fns';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { rateLimit, isRateLimited } from '@/lib/rate-limit-server';

const bookViewingSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  mobileNumber: z.string(),
  propertyId: z.string(),
  propertyAddress: z.string(),
  viewingTime: z.string().datetime(),
});

// Simple validation function
function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber: string): {isValid: boolean, formatted?: string} {
  try {
    // Try to parse the phone number (defaults to international format)
    let parsed = parsePhoneNumberFromString(phoneNumber)

    if (parsed && parsed.isValid()) {
      return {
        isValid: true,
        formatted: parsed.formatInternational(),
      }
    }

    // If no country code provided, try with South African country code
    if (!phoneNumber.startsWith('+')) {
      const withCountryCode = `+27${phoneNumber.replace(/^0/, '')}`;
      parsed = parsePhoneNumberFromString(withCountryCode, 'ZA');

      if (parsed && parsed.isValid()) {
        return {
          isValid: true,
          formatted: parsed.formatInternational(),
        }
      }
    }

    return {isValid: false, formatted: undefined}
  } catch (error) {
    return {isValid: false, formatted: undefined}
  }
}

// Internal booking function (without rate limiting)
async function _bookViewing(data: z.infer<typeof bookViewingSchema>) {
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

  // Fast, local validation (takes milliseconds instead of seconds)
  const isValidEmail = validateEmail(email);
  const phoneValidation = validatePhoneNumber(mobileNumber);

  if (!isValidEmail || !phoneValidation.isValid) {
    let errorMessage = 'Please check your contact details.';
    if (!isValidEmail && !phoneValidation.isValid) {
      errorMessage = 'The email and phone number appear to be invalid.';
    } else if (!isValidEmail) {
      errorMessage = 'The email address appears to be invalid.';
    } else if (!phoneValidation.isValid) {
      errorMessage = 'The phone number appears to be invalid. Please include country code or use South African format.';
    }
    return { success: false, error: errorMessage };
  }

  // In a real app, you would save the booking to a database here.
  // You could store the formatted phone number: phoneValidation.formatted

  const params = new URLSearchParams({
    propertyAddress,
    viewingTime,
    tenantName: fullName,
    tenantEmail: email,
  });

  redirect(`/property/${propertyId}/confirmed?${params.toString()}`);
}

// Rate-limited booking function (5 bookings per hour per IP)
export const bookViewing = rateLimit(_bookViewing, 'booking');

const calendarInviteSchema = z.object({
  propertyAddress: z.string(),
  tenantName: z.string(),
  tenantEmail: z.string().email(),
  viewingTime: z.string().datetime(),
});

// Internal calendar invite function (without rate limiting)
async function _getCalendarInvite(
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

// Rate-limited calendar invite function (10 invites per 10 minutes per IP)
export const getCalendarInvite = rateLimit(_getCalendarInvite, 'calendar');

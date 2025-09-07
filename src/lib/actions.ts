'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { generateCalendarInvite } from '@/ai/flows/generate-calendar-invite';
import { format, addMinutes } from 'date-fns';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import { checkRateLimit, rateLimitConfigs } from './rate-limit';
import { headers } from 'next/headers';

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

function getClientIPForAction(): string {
    const headersList = headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIP = headersList.get('x-real-ip');
    const cfIP = headersList.get('cf-connecting-ip');
    
    let clientIP = 'unknown';
    if (forwarded) {
      clientIP = forwarded.split(',')[0].trim();
    } else if (realIP) {
      clientIP = realIP;
    } else if (cfIP) {
      clientIP = cfIP;
    }
    return clientIP;
}

export async function bookViewing(data: z.infer<typeof bookViewingSchema>) {
  const clientIP = getClientIPForAction();
  const rateLimitResult = checkRateLimit(`booking:${clientIP}`, rateLimitConfigs.booking);

  if (!rateLimitResult.success) {
      console.warn(`Rate limit exceeded for booking:${clientIP}:`, rateLimitResult.error);
      return {
        success: false,
        error: rateLimitResult.error || 'Rate limit exceeded. Please try again later.',
        rateLimited: true,
      };
  }
    
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


const calendarInviteSchema = z.object({
  propertyAddress: z.string(),
  tenantName: z.string(),
  tenantEmail: z.string().email(),
  viewingTime: z.string().datetime(),
});

export async function getCalendarInvite(
  data: z.infer<typeof calendarInviteSchema>
) {
    const clientIP = getClientIPForAction();
    const rateLimitResult = checkRateLimit(`calendar:${clientIP}`, rateLimitConfigs.calendar);

    if (!rateLimitResult.success) {
        console.warn(`Rate limit exceeded for calendar:${clientIP}:`, rateLimitResult.error);
        return {
            success: false,
            error: rateLimitResult.error || 'Rate limit exceeded. Please try again later.',
            rateLimited: true,
        };
    }

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

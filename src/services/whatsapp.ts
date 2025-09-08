import { format } from 'date-fns';
import fetch from 'node-fetch';

const {
  WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_BUSINESS_ACCOUNT_ID,
} = process.env;

if (
  !WHATSAPP_ACCESS_TOKEN ||
  !WHATSAPP_PHONE_NUMBER_ID ||
  !WHATSAPP_BUSINESS_ACCOUNT_ID
) {
  console.warn(
    'WhatsApp environment variables are not fully configured. WhatsApp messages will not be sent.'
  );
}

interface BookingConfirmationDetails {
  tenantName: string;
  tenantWhatsAppNumber: string;
  propertyAddress: string;
  viewingTime: Date;
  bookingId: string;
}

// Validation helpers
function validateButtonTitle(title: string): string {
  if (title.length > 20) {
    throw new Error(`Button title "${title}" exceeds 20 character limit`);
  }
  return title;
}

function validateButtonId(id: string): string {
  if (id.length > 256) {
    throw new Error(`Button ID "${id}" exceeds 256 character limit`);
  }
  return id;
}

function validateBodyText(text: string): string {
  if (text.length > 1024) {
    throw new Error(`Body text exceeds 1024 character limit (${text.length} characters)`);
  }
  return text;
}

export async function sendBookingConfirmation(
  details: BookingConfirmationDetails
) {
  if (
    !WHATSAPP_ACCESS_TOKEN ||
    !WHATSAPP_PHONE_NUMBER_ID ||
    !WHATSAPP_BUSINESS_ACCOUNT_ID
  ) {
    throw new Error('WhatsApp service is not configured.');
  }

  const {
    tenantName,
    tenantWhatsAppNumber,
    propertyAddress,
    viewingTime,
    bookingId,
  } = details;

  const formattedTime = format(
    viewingTime,
    "EEEE, do LLLL yyyy 'at' h:mm a"
  );

  const messageBody = `Hi ${tenantName},\n\nYour viewing for the property at *${propertyAddress}* is scheduled for *${formattedTime}*.\n\nPlease confirm or cancel your attendance below.`;

  // Validate message components
  const validatedBody = validateBodyText(messageBody);
  const confirmButtonId = validateButtonId(`confirm_${bookingId}`);
  const cancelButtonId = validateButtonId(`cancel_${bookingId}`);
  const confirmTitle = validateButtonTitle('Confirm Viewing');
  const cancelTitle = validateButtonTitle('Cancel Viewing');

  const messagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: tenantWhatsAppNumber,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: validatedBody,
      },
      footer: {
        text: 'Aperture Studio - Property Viewings'
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: confirmButtonId,
              title: confirmTitle,
            },
          },
          {
            type: 'reply',
            reply: {
              id: cancelButtonId,
              title: cancelTitle,
            },
          },
        ],
      },
    },
  };

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messagePayload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to send WhatsApp message:', errorData);
    throw new Error(`WhatsApp API request failed: ${response.statusText}`);
  }

  const responseData = await response.json();
  console.log('WhatsApp message sent successfully:', responseData);
  return responseData;
}

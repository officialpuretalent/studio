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

  const messagePayload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: tenantWhatsAppNumber,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: messageBody,
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: `confirm_${bookingId}`,
              title: 'Confirm Viewing',
            },
          },
          {
            type: 'reply',
            reply: {
              id: `cancel_${bookingId}`,
              title: 'Cancel Viewing',
            },
          },
        ],
      },
    },
  };

  const response = await fetch(
    `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
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

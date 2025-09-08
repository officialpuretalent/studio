import nodemailer from 'nodemailer';
import { format } from 'date-fns';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

interface BookingConfirmationDetails {
  tenantName: string;
  tenantEmail: string;
  propertyAddress: string;
  viewingTime: Date;
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT || '587', 10),
  secure: parseInt(SMTP_PORT || '587', 10) === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export async function sendBookingConfirmationEmail(details: BookingConfirmationDetails) {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.warn('SMTP environment variables are not fully configured. Emails will not be sent.');
    return;
  }

  const { tenantName, tenantEmail, propertyAddress, viewingTime } = details;

  const formattedTime = format(viewingTime, "EEEE, do LLLL yyyy 'at' h:mm a");

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Viewing Confirmed: ${propertyAddress}</h2>
      <p>Hi ${tenantName},</p>
      <p>This is a confirmation of your upcoming property viewing. Here are the details:</p>
      <ul>
        <li><strong>Property:</strong> ${propertyAddress}</li>
        <li><strong>Date & Time:</strong> ${formattedTime}</li>
      </ul>
      <p>We have also sent a confirmation to your WhatsApp number. You can manage your booking from there.</p>
      <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>The Aperture Team</p>
    </div>
  `;

  const mailOptions = {
    from: `"Aperture" <${SMTP_USER}>`,
    to: tenantEmail,
    subject: `Viewing Confirmed for ${propertyAddress}`,
    html: emailHtml,
    text: `Hi ${tenantName},\n\nYour viewing for the property at ${propertyAddress} is scheduled for ${formattedTime}.\n\nWe have also sent a confirmation to your WhatsApp number.\n\nBest regards,\nThe Aperture Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    // In a real app, you might want to add this to a retry queue.
    throw new Error('Failed to send confirmation email.');
  }
}

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
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Viewing Confirmed</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
            body {
                font-family: 'Poppins', Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                border: 1px solid #e2e8f0;
            }
            .header {
                background-color: #f8f9fa;
                padding: 40px;
                text-align: center;
                border-bottom: 1px solid #e2e8f0;
            }
            .header h1 {
                margin: 0;
                color: #2c3e50;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 30px 40px;
            }
            .content h2 {
                color: #34495e;
                font-size: 22px;
                margin-top: 0;
            }
            .content p {
                line-height: 1.7;
                font-size: 16px;
            }
            .details {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
                border: 1px solid #e2e8f0;
            }
            .details p {
                margin: 10px 0;
                font-size: 16px;
            }
            .details strong {
                color: #2c3e50;
                min-width: 100px;
                display: inline-block;
            }
            .footer {
                text-align: center;
                padding: 30px;
                font-size: 14px;
                color: #95a5a6;
                background-color: #f8f9fa;
                border-top: 1px solid #e2e8f0;
            }
            .footer a {
                color: #7f56d9;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Aperture</h1>
            </div>
            <div class="content">
                <h2>Viewing Confirmed!</h2>
                <p>Hi ${tenantName},</p>
                <p>This is a confirmation of your upcoming property viewing. We're excited to show you around.</p>
                <div class="details">
                    <p><strong>Property:</strong> ${propertyAddress}</p>
                    <p><strong>Date & Time:</strong> ${formattedTime}</p>
                </div>
                <p>A confirmation has also been sent to your WhatsApp. You can manage your booking, reschedule, or cancel from there.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <p>Best regards,<br>The Aperture Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Aperture. All rights reserved.</p>
                <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
            </div>
        </div>
    </body>
    </html>
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

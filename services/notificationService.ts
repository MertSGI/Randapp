import { Appointment, Service } from '../types';

/**
 * MOCK EMAIL SERVICE
 * In a real application, this would call your backend API (e.g., Python/FastAPI)
 * which would then use SMTP, SendGrid, or AWS SES.
 */
export const sendBookingEmail = async (appointment: Appointment, serviceName: string, confirmationDetails: { subject: string, body: string }): Promise<boolean> => {
  console.group("📧 Sending Email...");
  console.log(`To: ${appointment.user_email}`);
  console.log(`Subject: ${confirmationDetails.subject}`);
  console.log(`Body: ${confirmationDetails.body}`);
  console.groupEnd();
  
  // Simulate API Network Delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ Email sent successfully via 'MockSMTP'");
      resolve(true);
    }, 800);
  });
};

/**
 * MOCK SMS SERVICE
 * In a real application, this would call your backend API
 * which would then use Twilio, SNS, or another SMS gateway.
 */
export const sendBookingSms = async (appointment: Appointment, serviceName: string): Promise<boolean> => {
  const message = `RadApp: Hello ${appointment.user_name}, your ${serviceName} appointment on ${appointment.date} at ${appointment.time} is confirmed.`;
  
  console.group("📱 Sending SMS...");
  console.log(`To: ${appointment.phone || 'No phone provided'}`);
  console.log(`Message: ${message}`);
  console.groupEnd();

  if (!appointment.phone) return Promise.resolve(false);

  // Simulate API Network Delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ SMS sent successfully via 'MockTwilio'");
      resolve(true);
    }, 800);
  });
};
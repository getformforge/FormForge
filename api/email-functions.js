import { Resend } from 'resend';
import * as functions from 'firebase-functions';
import admin from './lib/firebase-admin.js';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to format submission data as HTML
const formatSubmissionHTML = (formData, formTitle) => {
  const fieldRows = Object.entries(formData)
    .filter(([key]) => key !== 'formId' && key !== 'userId')
    .map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      return `
        <tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">${label}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb;">${value || 'Not provided'}</td>
        </tr>
      `;
    }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">New Form Submission</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">${formTitle}</p>
        </div>
        <div class="content">
          <p style="font-size: 16px; color: #374151;">You have received a new submission for your form.</p>
          
          <table>
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Field</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Response</th>
              </tr>
            </thead>
            <tbody>
              ${fieldRows}
            </tbody>
          </table>
          
          <a href="https://formforge.com/dashboard" class="button">View in Dashboard</a>
          
          <div class="footer">
            <p>This email was sent by FormForge</p>
            <p>© ${new Date().getFullYear()} FormForge. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send submission notification to form owner
export const sendSubmissionEmail = functions.https.onCall(async (data, context) => {
  try {
    const { ownerEmail, formTitle, submissionData, formId } = data;

    const emailData = await resend.emails.send({
      from: 'FormForge <notifications@formforge.com>',
      to: [ownerEmail],
      subject: `New submission for "${formTitle}"`,
      html: formatSubmissionHTML(submissionData, formTitle),
      tags: [
        { name: 'type', value: 'submission_notification' },
        { name: 'form_id', value: formId }
      ]
    });

    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending submission email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Send confirmation email to submitter
export const sendConfirmationEmail = functions.https.onCall(async (data, context) => {
  try {
    const { submitterEmail, formTitle, submissionData } = data;

    const emailData = await resend.emails.send({
      from: 'FormForge <noreply@formforge.com>',
      to: [submitterEmail],
      subject: `Thank you for your submission - ${formTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; }
            .checkmark { width: 60px; height: 60px; margin: 0 auto; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="checkmark">
                <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#10b981" stroke-width="2"/>
                  <path fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" d="M14 27l7 7 16-16"/>
                </svg>
              </div>
              <h1 style="color: #111827; margin: 20px 0 10px;">Thank You!</h1>
              <p style="color: #6b7280;">Your form has been submitted successfully</p>
            </div>
            <div class="content">
              <h2 style="color: #374151; font-size: 18px;">Your Submission Details</h2>
              <p style="color: #6b7280;">Here's a copy of what you submitted for "${formTitle}":</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${Object.entries(submissionData).map(([key, value]) => 
                  `<p><strong>${key}:</strong> ${value}</p>`
                ).join('')}
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                If you have any questions, please don't hesitate to contact us.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      tags: [
        { name: 'type', value: 'submission_confirmation' }
      ]
    });

    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Send welcome email to new users
export const sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  try {
    const { email, userName } = data;

    const emailData = await resend.emails.send({
      from: 'FormForge Team <team@formforge.com>',
      to: [email],
      subject: 'Welcome to FormForge! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .feature { padding: 15px; margin: 10px 0; background: #f9fafb; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px;">Welcome to FormForge!</h1>
              <p style="margin: 10px 0 0; opacity: 0.9; font-size: 18px;">Let's build something amazing together</p>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #374151;">Hi ${userName || 'there'},</p>
              <p style="color: #6b7280;">We're thrilled to have you join FormForge! Here's how to get started:</p>
              
              <div class="feature">
                <h3 style="margin: 0 0 8px; color: #111827;">📝 Create Your First Form</h3>
                <p style="margin: 0; color: #6b7280;">Use our drag-and-drop builder to create beautiful forms in minutes.</p>
              </div>
              
              <div class="feature">
                <h3 style="margin: 0 0 8px; color: #111827;">🎨 Choose a Theme</h3>
                <p style="margin: 0; color: #6b7280;">Make your forms stand out with our professional themes.</p>
              </div>
              
              <div class="feature">
                <h3 style="margin: 0 0 8px; color: #111827;">📊 Track Submissions</h3>
                <p style="margin: 0; color: #6b7280;">Monitor responses and generate PDFs automatically.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://formforge.com/dashboard" class="button">Go to Dashboard</a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                Need help? Just reply to this email and we'll be happy to assist!
              </p>
              
              <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                The FormForge Team
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      tags: [
        { name: 'type', value: 'welcome_email' }
      ]
    });

    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Password reset email
export const sendPasswordReset = functions.https.onCall(async (data, context) => {
  try {
    const { email, resetLink } = data;

    const emailData = await resend.emails.send({
      from: 'FormForge Security <security@formforge.com>',
      to: [email],
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; }
            .button { display: inline-block; padding: 14px 32px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1 style="color: #111827; margin: 0 0 20px;">Password Reset Request</h1>
              <p style="color: #6b7280;">We received a request to reset your password. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              
              <div class="warning">
                <p style="margin: 0; color: #991b1b;">
                  <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password won't be changed.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                This link will expire in 1 hour for security reasons.
              </p>
              
              <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                ${resetLink}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      tags: [
        { name: 'type', value: 'password_reset' }
      ]
    });

    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

export default {
  sendSubmissionEmail,
  sendConfirmationEmail,
  sendWelcomeEmail,
  sendPasswordReset
};
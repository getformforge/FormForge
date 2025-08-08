import { getFunctions, httpsCallable } from 'firebase/functions';

// Email service to handle all email notifications
class EmailService {
  constructor() {
    this.functions = getFunctions();
  }

  // Send email notification when form receives submission
  async sendSubmissionNotification(data) {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendSubmissionEmail');
      const result = await sendEmail(data);
      return result.data;
    } catch (error) {
      console.error('Error sending submission notification:', error);
      throw error;
    }
  }

  // Send confirmation email to person who submitted form
  async sendSubmissionConfirmation(data) {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendConfirmationEmail');
      const result = await sendEmail(data);
      return result.data;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetLink) {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendPasswordReset');
      const result = await sendEmail({ email, resetLink });
      return result.data;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Send welcome email to new users
  async sendWelcomeEmail(email, userName) {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendWelcomeEmail');
      const result = await sendEmail({ email, userName });
      return result.data;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  // Send weekly summary email
  async sendWeeklySummary(email, summaryData) {
    try {
      const sendEmail = httpsCallable(this.functions, 'sendWeeklySummary');
      const result = await sendEmail({ email, ...summaryData });
      return result.data;
    } catch (error) {
      console.error('Error sending weekly summary:', error);
      throw error;
    }
  }
}

export default new EmailService();
# Email Notification Implementation Plan

## Quick Start with Resend (Recommended)

### Step 1: Sign up for Resend
1. Go to https://resend.com
2. Sign up for free account (3,000 emails/month free)
3. Verify your domain or use their testing domain

### Step 2: Install Resend
```bash
npm install resend
```

### Step 3: Create API Route (using Firebase Functions)

```javascript
// functions/sendEmail.js
import { Resend } from 'resend';

const resend = new Resend('re_YOUR_API_KEY');

export const sendSubmissionNotification = async (to, formTitle, submissionData) => {
  const { data, error } = await resend.emails.send({
    from: 'FormForge <notifications@your-domain.com>',
    to: [to],
    subject: `New submission for ${formTitle}`,
    html: `
      <h2>New Form Submission</h2>
      <p>You received a new submission for your form: <strong>${formTitle}</strong></p>
      <h3>Submission Details:</h3>
      <ul>
        ${Object.entries(submissionData).map(([key, value]) => 
          `<li><strong>${key}:</strong> ${value}</li>`
        ).join('')}
      </ul>
      <p>View all submissions in your <a href="https://formforge.com/dashboard">dashboard</a></p>
    `
  });
  
  return { data, error };
};
```

### Step 4: Trigger on Form Submission

```javascript
// In your form submission handler
const handleFormSubmission = async (formData) => {
  // Save submission to Firebase
  await saveSubmission(formData);
  
  // Send email notification
  await sendSubmissionNotification(
    userEmail,
    formTitle,
    formData
  );
};
```

## Email Types to Implement

### 1. **Submission Notification** (Priority 1)
- Sent to: Form owner
- When: New submission received
- Content: Submission details, link to dashboard

### 2. **Submission Confirmation** (Priority 2)
- Sent to: Person who submitted form
- When: After successful submission
- Content: Thank you message, copy of responses

### 3. **Weekly Summary** (Priority 3)
- Sent to: Form owners
- When: Every Monday
- Content: Week's stats, top forms, recent submissions

### 4. **Password Reset** (Priority 4)
- Sent to: User requesting reset
- When: Password reset requested
- Content: Reset link

### 5. **Welcome Email** (Priority 5)
- Sent to: New users
- When: After signup
- Content: Getting started guide, tips

## Alternative: Frontend-Only with EmailJS

If you want to avoid backend setup initially:

```javascript
// Install EmailJS
npm install @emailjs/browser

// In your React component
import emailjs from '@emailjs/browser';

// Initialize (in your app setup)
emailjs.init("YOUR_PUBLIC_KEY");

// Send email
const sendEmail = async (templateParams) => {
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams
    );
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email error:', error);
  }
};
```

## Cost Comparison

| Service | Free Tier | Paid Starting | Best For |
|---------|-----------|---------------|----------|
| Resend | 3,000/month | $20/mo for 50k | Best overall |
| SendGrid | 100/day | $19.95/mo | Large scale |
| EmailJS | 200/month | $9/mo | Frontend only |
| Firebase + Gmail | 500/day | Pay per use | DIY approach |

## Implementation Priority

1. **Week 1**: Basic submission notifications with Resend
2. **Week 2**: Confirmation emails to submitters
3. **Week 3**: Password reset functionality
4. **Week 4**: Weekly summaries and welcome emails

## Environment Variables Needed

```env
# .env.local
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
VITE_EMAIL_FROM=notifications@formforge.com
```

## Testing Strategy

1. Use Resend's test mode initially
2. Send test emails to yourself
3. Check spam folder placement
4. Test with different email providers
5. Monitor delivery rates

## Estimated Time: 2-3 days for basic implementation
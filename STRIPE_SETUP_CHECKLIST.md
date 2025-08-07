# 🚀 Stripe Production Setup Checklist

## Prerequisites
- [ ] Stripe account created at stripe.com
- [ ] Business details verified (tax ID, bank account)
- [ ] Vercel account with FormForge deployed

## Step 1: Stripe Dashboard Setup (Live Mode)

### 1.1 Switch to Live Mode
- [ ] Toggle from "Test mode" to "Live mode" in Stripe Dashboard

### 1.2 Get API Keys
- [ ] Copy **Publishable key**: `pk_live_...`
- [ ] Copy **Secret key**: `sk_live_...` (keep secure!)

### 1.3 Create Products & Prices
Go to **Products** in Stripe Dashboard and create:

#### Free Plan
- [ ] Name: `FormForge Free`
- [ ] Price: `$0/month`
- [ ] Save Price ID: N/A (free tier)

#### Pro Plan
- [ ] Name: `FormForge Pro`
- [ ] Price: `$9.99/month`
- [ ] Billing: Monthly
- [ ] Save Price ID: `price_XXXXX` ← **COPY THIS**

#### Business Plan
- [ ] Name: `FormForge Business`
- [ ] Price: `$29.99/month`
- [ ] Billing: Monthly
- [ ] Save Price ID: `price_XXXXX` ← **COPY THIS**

## Step 2: Vercel Environment Variables

Go to [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables

### 2.1 Remove Test Keys (if exist)
- [ ] Delete any test Stripe keys

### 2.2 Add Production Keys
Add these environment variables:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
VITE_STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID
VITE_STRIPE_BUSINESS_PRICE_ID=price_YOUR_BUSINESS_PRICE_ID
```

- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Added `STRIPE_SECRET_KEY`
- [ ] Added `VITE_STRIPE_PRO_PRICE_ID`
- [ ] Added `VITE_STRIPE_BUSINESS_PRICE_ID`

## Step 3: Webhook Configuration

### 3.1 Create Webhook Endpoint
In Stripe Dashboard → Developers → Webhooks:

- [ ] Click "Add endpoint"
- [ ] URL: `https://www.getformforge.com/api/stripe-webhook`
- [ ] Description: `FormForge Production Webhook`

### 3.2 Select Events
Select these events:
- [ ] `checkout.session.completed`
- [ ] `customer.subscription.created`
- [ ] `customer.subscription.updated`
- [ ] `customer.subscription.deleted`
- [ ] `invoice.payment_succeeded`
- [ ] `invoice.payment_failed`

### 3.3 Save Webhook Secret
- [ ] Copy the **Signing secret**: `whsec_...`
- [ ] Add to Vercel as: `STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET`

## Step 4: Backend API Setup

### 4.1 Create API Routes (if not exist)
You need these API endpoints:

```javascript
// /api/create-checkout-session
// Creates Stripe Checkout session for new subscriptions

// /api/stripe-webhook
// Handles Stripe webhook events

// /api/create-portal-session
// Creates customer portal for subscription management
```

### 4.2 Firebase Functions (Optional)
If using Firebase Functions:
- [ ] Deploy functions with production Stripe keys
- [ ] Update CORS settings for production domain

## Step 5: Testing Production Setup

### 5.1 Test Checkout Flow
- [ ] Create a test account on your live site
- [ ] Try subscribing to Pro plan
- [ ] Verify Stripe Dashboard shows the subscription
- [ ] Check Firebase/database for updated user plan

### 5.2 Test Webhook
- [ ] Make a test payment
- [ ] Verify webhook is received in Stripe Dashboard
- [ ] Check user account is upgraded

### 5.3 Test Subscription Management
- [ ] Access customer portal
- [ ] Test cancellation
- [ ] Test plan upgrade/downgrade

## Step 6: Deploy to Production

### 6.1 Redeploy on Vercel
- [ ] Trigger new deployment to use new env variables
- [ ] Wait for deployment to complete

### 6.2 Verify Live Site
- [ ] Check console for any Stripe errors
- [ ] Verify checkout flow works
- [ ] Test with a real card (you can refund yourself)

## Step 7: Post-Launch Tasks

### 7.1 Monitor First Week
- [ ] Check Stripe Dashboard daily
- [ ] Monitor for failed payments
- [ ] Review webhook logs

### 7.2 Set Up Notifications
- [ ] Enable Stripe email notifications for important events
- [ ] Set up Slack/Discord webhooks for new subscriptions

### 7.3 Customer Support
- [ ] Prepare FAQ for payment issues
- [ ] Set up refund policy
- [ ] Document cancellation process

## Important URLs

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Live Site**: https://www.getformforge.com
- **Stripe Customer Portal**: Will be at `/api/create-portal-session`

## Security Reminders

⚠️ **NEVER** commit API keys to Git
⚠️ **NEVER** share secret keys
⚠️ Always use environment variables
⚠️ Enable 2FA on Stripe account

## Troubleshooting

### Common Issues:

1. **"No such price" error**
   - Verify price IDs match exactly
   - Ensure you're in Live mode, not Test mode

2. **Webhook not received**
   - Check webhook URL is correct
   - Verify signing secret matches

3. **Payment fails**
   - Check Stripe Dashboard for decline reasons
   - Verify card requirements (3D Secure, etc.)

## Support Contacts

- **Stripe Support**: support@stripe.com
- **Stripe Docs**: https://stripe.com/docs
- **Status Page**: https://status.stripe.com

---

## Your Current Status: 
- ✅ Test mode working
- ⏳ Ready for production setup
- 🎯 Next: Complete steps above

Once complete, you'll have:
- Real payments flowing
- Automatic subscription management  
- Customer portal for self-service
- Webhook automation

Good luck! 🚀
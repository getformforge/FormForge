# 🔥 Firebase Admin Setup for Stripe Integration

## Prerequisites
- Firebase project (formforge-production)
- Vercel account with FormForge deployed
- Stripe webhook configured

## Step 1: Generate Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **formforge-production** project
3. Click the **gear icon** → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Click **Generate key** (downloads a JSON file)
7. **SAVE THIS FILE SECURELY** - you'll need it!

## Step 2: Prepare Service Account for Vercel

The downloaded JSON looks like this:
```json
{
  "type": "service_account",
  "project_id": "formforge-production",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### IMPORTANT: You need to minify this JSON!

1. Go to [JSON Minifier](https://www.jsonformatter.org/json-minify)
2. Paste your service account JSON
3. Click "Minify"
4. Copy the minified result

## Step 3: Add to Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your FormForge project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Value: (paste the entire minified JSON)
   - Environment: Production

## Step 4: Update API Endpoints

Replace the basic webhook files with the complete versions:

1. **Rename files in Vercel:**
   - `api/stripe-webhook.js` → DELETE
   - `api/stripe-webhook-complete.js` → Rename to `stripe-webhook.js`
   - `api/create-checkout-session.js` → DELETE
   - `api/create-checkout-session-complete.js` → Rename to `create-checkout-session.js`
   - `api/create-portal-session.js` → DELETE
   - `api/create-portal-session-complete.js` → Rename to `create-portal-session.js`

Or simply update your deployment to use the `-complete` versions.

## Step 5: Update Frontend to Call API

Update your StripeCheckout component to actually call the API:

```javascript
// In src/components/StripeCheckout.jsx
// Replace the simulated success with:

const response = await fetch('https://www.getformforge.com/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: selectedPlan.priceId,
    userId: currentUser.uid,
    userEmail: currentUser.email,
    idToken: await currentUser.getIdToken()
  })
});

const { url } = await response.json();
window.location.href = url; // Redirect to Stripe Checkout
```

## Step 6: Add Manage Subscription Button

In your UserDashboard, add:

```javascript
const handleManageSubscription = async () => {
  const idToken = await currentUser.getIdToken();
  
  const response = await fetch('https://www.getformforge.com/api/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.uid,
      idToken: idToken
    })
  });
  
  const { url } = await response.json();
  window.location.href = url; // Redirect to Stripe Portal
};
```

## Step 7: Redeploy

After adding the service account key:
1. Redeploy on Vercel
2. Test the complete flow

## What Happens Now:

1. **User clicks upgrade** → Redirected to Stripe Checkout
2. **Payment successful** → Webhook receives event
3. **Webhook updates Firebase** → User plan changes to Pro/Business
4. **User refreshes** → Sees upgraded features immediately
5. **User clicks "Manage Subscription"** → Goes to Stripe portal
6. **User cancels** → Webhook downgrades to free plan

## Security Notes

⚠️ **NEVER commit the service account key to Git**
⚠️ **Keep the JSON minified when adding to Vercel**
⚠️ **The service account has admin access - guard it carefully**

## Troubleshooting

### "No service account key" error
- Ensure the JSON is properly minified
- Check it's added to Production environment in Vercel

### User plan not updating
- Check Vercel Functions logs for webhook errors
- Verify Firebase service account has correct permissions
- Check Stripe webhook is sending to correct URL

### Authentication errors
- Ensure idToken is being sent from frontend
- Verify Firebase Admin SDK is initialized correctly

## Testing Checklist

- [ ] Service account key added to Vercel
- [ ] API endpoints deployed
- [ ] Frontend updated to call APIs
- [ ] Test upgrade flow
- [ ] Check Firebase user document updates
- [ ] Test subscription management portal
- [ ] Test cancellation flow

## Support

- **Firebase Console**: https://console.firebase.google.com
- **Vercel Functions Logs**: https://vercel.com/[your-account]/formforge/functions
- **Stripe Dashboard**: https://dashboard.stripe.com/test/webhooks
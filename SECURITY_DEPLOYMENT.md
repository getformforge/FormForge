# FormForge Security Deployment Guide

## Critical Security Updates Implemented

This guide documents the security improvements made to FormForge and how to deploy them properly.

### 1. Firebase Security Rules

**Location:** `firestore.rules`

The updated security rules provide:
- ✅ User data isolation (users can only access their own data)
- ✅ Protection against unauthorized plan modifications
- ✅ Validation for form creation and submission
- ✅ Rate limiting support through field count limits
- ✅ Immutable submissions (no editing after creation)
- ✅ Default deny for all unspecified paths

**To Deploy:**
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy the security rules
firebase deploy --only firestore:rules
```

### 2. Environment Variables

**Location:** `.env.example`

Firebase configuration is now loaded from environment variables with fallback values.

**For Local Development:**
1. Copy `.env.example` to `.env`
2. Replace placeholder values with your Firebase config
3. Never commit `.env` to version control

**For Production (Vercel):**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add the following variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
   - `VITE_STRIPE_PUBLISHABLE_KEY`

### 3. Rate Limiting

**Location:** `src/services/rateLimitService.js`

Client-side rate limiting has been implemented for:
- PDF Generation: 10 attempts per hour
- Form Submissions: 20 attempts per 15 minutes
- Form Creation: 5 attempts per hour
- Authentication: 5 attempts per 15 minutes

**Note:** This is client-side protection. For production, implement server-side rate limiting using:
- Firebase Functions with rate limiting middleware
- Cloudflare Rate Limiting
- Or API Gateway rate limiting

### 4. Error Handling

**Location:** `src/services/errorService.js`

Secure error handling that:
- ✅ Sanitizes error messages in production
- ✅ Prevents information disclosure
- ✅ Provides user-friendly error messages
- ✅ Logs detailed errors only in development

### 5. Removed Compliance Claims

All unverified compliance claims have been removed:
- ❌ HIPAA compliance claims removed
- ❌ ISO 27001 certification claims removed
- ✅ Replaced with factual security features

## Security Best Practices

### Immediate Actions Required:

1. **Deploy Firebase Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Set Environment Variables in Vercel**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all Firebase configuration variables

3. **Enable Firebase App Check (Recommended)**
   ```javascript
   // In firebase.js
   import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
   
   const appCheck = initializeAppCheck(app, {
     provider: new ReCaptchaV3Provider('your-recaptcha-site-key'),
     isTokenAutoRefreshEnabled: true
   });
   ```

4. **Add Server-Side Rate Limiting**
   Consider using Firebase Functions:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   ```

### Additional Security Recommendations:

1. **Content Security Policy (CSP)**
   Add to your HTML header:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; 
                  style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
   ```

2. **HTTPS Only**
   - Vercel provides this by default ✅
   - Ensure all API calls use HTTPS

3. **Input Validation**
   - Form field limits are enforced in security rules
   - Add client-side validation for better UX
   - Never trust client-side validation alone

4. **Regular Security Audits**
   ```bash
   # Check for vulnerable dependencies
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   ```

5. **Monitor Security Events**
   - Set up Firebase Analytics events for failed auth attempts
   - Monitor Firestore security rule denials in Firebase Console
   - Consider integrating Sentry for error tracking

## Testing Security

### Test Security Rules:
```bash
# Run Firebase emulator
firebase emulators:start

# Test rules with Firebase Rules Unit Testing
npm install --save-dev @firebase/rules-unit-testing
```

### Test Rate Limiting:
1. Try to generate PDFs rapidly (should block after 10)
2. Submit forms quickly (should block after 20)
3. Attempt multiple logins (should block after 5)

### Test Error Handling:
1. Disconnect network and try operations
2. Use invalid credentials
3. Try to access unauthorized resources

## Monitoring & Alerts

### Set up monitoring for:
1. **Failed Authentication Attempts**
   - Track in Firebase Analytics
   - Alert on unusual patterns

2. **Rate Limit Violations**
   - Log to analytics when limits are hit
   - Monitor for potential attacks

3. **Security Rule Denials**
   - Check Firebase Console → Firestore → Monitor
   - Set up alerts for high denial rates

## Compliance Notes

- **GDPR**: Implement user data export/deletion
- **CCPA**: Add privacy policy and data handling disclosure
- **HIPAA**: Do NOT claim compliance without proper BAA and certification
- **SOC 2**: Using SOC 2 compliant infrastructure (Firebase) but app itself is not certified

## Emergency Response

If you detect a security breach:
1. Immediately disable affected user accounts
2. Revoke all Firebase API keys
3. Deploy restrictive security rules
4. Audit all data access logs
5. Notify affected users within 72 hours (GDPR requirement)

## Support

For security questions or to report vulnerabilities:
- Email: security@getformforge.com (set this up)
- Use responsible disclosure practices
- We aim to respond within 48 hours

---

**Last Updated:** December 2024
**Security Review Schedule:** Quarterly
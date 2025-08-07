// Stripe Configuration
// This file centralizes all Stripe-related configuration

const isDevelopment = import.meta.env.DEV;

export const stripeConfig = {
  // Publishable key (safe for frontend)
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
    'pk_test_51RsoCaEvcCT1QyXDXgbvUupcT1yB3Czpy9hS2Hq2Hdme9pg2Yz5Rn1zCBi2wteVW1dcHyip0a3BzMwmItkJWE5UM005jhF23IY',
  
  // Price IDs - Update these with your live Stripe price IDs
  priceIds: {
    pro: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_1RsoIhEvcCT1QyXDvNf9c7DD',
    business: import.meta.env.VITE_STRIPE_BUSINESS_PRICE_ID || 'price_1RsoJEEvcCT1QyXDQjj1g8G1'
  },
  
  // Success and cancel URLs for Stripe Checkout
  urls: {
    success: `${window.location.origin}/dashboard?payment=success`,
    cancel: `${window.location.origin}/pricing?payment=cancelled`
  }
};

// Plan details for display
export const planDetails = {
  free: {
    name: 'Free',
    price: 0,
    priceDisplay: '$0',
    features: [
      '3 forms',
      '100 submissions/month',
      '10 PDFs/month',
      'Basic field types',
      'FormForge branding'
    ],
    limits: {
      forms: 3,
      submissions: 100,
      pdfs: 10
    }
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    priceDisplay: '$9.99',
    priceId: stripeConfig.priceIds.pro,
    features: [
      'Unlimited forms',
      '1,000 submissions/month',
      '100 PDFs/month',
      'All field types',
      'Custom branding',
      'Priority support'
    ],
    limits: {
      forms: -1, // unlimited
      submissions: 1000,
      pdfs: 100
    }
  },
  business: {
    name: 'Business',
    price: 29.99,
    priceDisplay: '$29.99',
    priceId: stripeConfig.priceIds.business,
    features: [
      'Everything in Pro',
      '10,000 submissions/month',
      '1,000 PDFs/month',
      'White-label branding',
      'API access',
      'Team collaboration',
      'Premium support'
    ],
    limits: {
      forms: -1, // unlimited
      submissions: 10000,
      pdfs: 1000
    }
  }
};
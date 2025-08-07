// Complete Stripe Checkout Session Creation with Firebase Integration
// Deploy this to /api/create-checkout-session

import Stripe from 'stripe';
import { adminAuth } from './lib/firebase-admin.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, userEmail, idToken } = req.body;

    // Verify the user's identity using Firebase Auth
    if (idToken) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        if (decodedToken.uid !== userId) {
          return res.status(403).json({ error: 'Unauthorized' });
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ error: 'Invalid authentication token' });
      }
    }

    // Check if customer already exists
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId
        }
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `https://www.getformforge.com/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.getformforge.com/pricing?payment=cancelled`,
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    res.status(200).json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
}
// Complete Customer Portal Session Creation
// Deploy this to /api/create-portal-session

import Stripe from 'stripe';
import { adminAuth, adminDb } from './lib/firebase-admin.js';

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
    const { userId, idToken } = req.body;

    // Verify the user's identity
    if (!idToken) {
      return res.status(403).json({ error: 'No authentication token provided' });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.uid !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get user's Stripe customer ID from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const customerId = userData.stripeCustomerId;

    if (!customerId) {
      return res.status(400).json({ error: 'No subscription found for this user' });
    }

    // Create portal session for customer to manage subscription
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://www.getformforge.com/dashboard',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({ 
      error: 'Failed to create portal session',
      details: error.message 
    });
  }
}
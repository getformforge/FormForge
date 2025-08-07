// Complete Customer Portal Session Creation
// Deploy this to /api/create-portal-session

const Stripe = require('stripe');

module.exports = async function handler(req, res) {
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
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Initialize Firebase Admin inline to avoid import issues
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      try {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
        );
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: 'formforge-production'
        });
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
        return res.status(500).json({ 
          error: 'Server configuration error',
          details: 'Firebase initialization failed' 
        });
      }
    }
    
    const { userId, idToken } = req.body;

    // Verify the user's identity
    if (!idToken) {
      return res.status(403).json({ error: 'No authentication token provided' });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.uid !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    } catch (authError) {
      console.error('Auth verification error:', authError);
      return res.status(403).json({ error: 'Invalid authentication token' });
    }

    // Get user's Stripe customer ID from Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
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
};
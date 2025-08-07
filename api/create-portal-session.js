// Complete Customer Portal Session Creation
// Deploy this to /api/create-portal-session

const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  console.log('Portal session endpoint called');
  
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

  // Check if Stripe key exists
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not found in environment');
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: 'Stripe not configured' 
    });
  }

  // Check if Firebase key exists
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY not found in environment');
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: 'Firebase not configured' 
    });
  }

  try {
    // Initialize Stripe
    console.log('Initializing Stripe...');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Initialize Firebase Admin inline to avoid import issues
    console.log('Initializing Firebase Admin...');
    const admin = require('firebase-admin');
    
    if (!admin.apps.length) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: 'formforge-production'
        });
        console.log('Firebase Admin initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error.message);
        return res.status(500).json({ 
          error: 'Server configuration error',
          details: 'Firebase initialization failed: ' + error.message
        });
      }
    }
    
    const { userId, idToken } = req.body;
    console.log('Request for userId:', userId);

    // Verify the user's identity
    if (!idToken) {
      console.error('No idToken provided');
      return res.status(403).json({ error: 'No authentication token provided' });
    }

    try {
      console.log('Verifying ID token...');
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('Token verified for user:', decodedToken.uid);
      
      if (decodedToken.uid !== userId) {
        console.error('User ID mismatch:', decodedToken.uid, '!==', userId);
        return res.status(403).json({ error: 'Unauthorized' });
      }
    } catch (authError) {
      console.error('Auth verification error:', authError.message);
      return res.status(403).json({ 
        error: 'Invalid authentication token',
        details: authError.message 
      });
    }

    // Get user's Stripe customer ID from Firestore
    console.log('Fetching user from Firestore...');
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.error('User not found in Firestore:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const customerId = userData.stripeCustomerId;
    console.log('Stripe customer ID:', customerId ? 'Found' : 'Not found');

    if (!customerId) {
      console.error('No stripeCustomerId for user:', userId);
      return res.status(400).json({ 
        error: 'No subscription found',
        details: 'No Stripe customer ID associated with this account. Please subscribe to a plan first.' 
      });
    }

    // Create portal session for customer to manage subscription
    console.log('Creating Stripe portal session...');
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://www.getformforge.com',
    });
    
    console.log('Portal session created successfully');
    res.status(200).json({ url: session.url });
    
  } catch (error) {
    console.error('Portal session error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create portal session',
      details: error.message 
    });
  }
};
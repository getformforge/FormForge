// Simple test endpoint to verify API deployment
module.exports = function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Check environment variables
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY;
  const hasFirebaseKey = !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  // Try to parse Firebase key to check if it's valid JSON
  let firebaseKeyValid = false;
  if (hasFirebaseKey) {
    try {
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseKeyValid = true;
    } catch (e) {
      firebaseKeyValid = false;
    }
  }
  
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    environment: {
      hasStripeKey,
      hasFirebaseKey,
      firebaseKeyValid,
      stripeKeyLength: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
      nodeVersion: process.version
    }
  });
};
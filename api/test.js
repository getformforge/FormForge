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
  
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasFirebaseKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    }
  });
};
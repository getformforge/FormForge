import { auth } from '../firebase';

/**
 * Creates a Stripe Customer Portal session for subscription management
 * Allows users to cancel, update payment method, or change plans
 */
export const createCustomerPortalSession = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the ID token for authentication
    const idToken = await user.getIdToken();

    // Call the API to create portal session
    const response = await fetch('https://www.getformforge.com/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.uid,
        idToken: idToken
      })
    });

    // Log response status for debugging
    console.log('Portal session response status:', response.status);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      throw new Error('Invalid response from server. Please check if the API is deployed.');
    }

    if (!response.ok) {
      console.error('Portal session error:', data);
      throw new Error(data.error || data.details || 'Failed to create portal session');
    }

    return data;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
};

/**
 * Opens the Stripe Customer Portal in a new tab
 */
export const openCustomerPortal = async () => {
  try {
    const { url } = await createCustomerPortalSession();
    
    // Open in new tab
    window.open(url, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error opening customer portal:', error);
    
    // Return user-friendly error message
    if (error.message.includes('No subscription found')) {
      throw new Error('No active subscription found. Please subscribe to a plan first.');
    } else if (error.message.includes('not authenticated')) {
      throw new Error('Please sign in to manage your subscription.');
    } else {
      throw new Error('Unable to open subscription management. Please try again later.');
    }
  }
};
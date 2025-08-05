import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Crown, Zap, Star, Check, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Stripe publishable key (safe to use in frontend)
const stripePromise = loadStripe('pk_test_51RsoCaEvcCT1QyXDXgbvUupcT1yB3Czpy9hS2Hq2Hdme9pg2Yz5Rn1zCBi2wteVW1dcHyip0a3BzMwmItkJWE5UM005jhF23IY');

const CheckoutForm = ({ plan, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const planDetails = {
    pro: {
      name: 'Pro',
      price: '$9',
      priceId: 'price_1RsoIhEvcCT1QyXDvNf9c7DD',
      features: [
        'Unlimited forms',
        '1,000 submissions/month',
        'Custom PDF branding',
        'Priority support',
        'Advanced field types'
      ]
    },
    business: {
      name: 'Business',
      price: '$29',
      priceId: 'price_1RsoJEEvcCT1QyXDQjj1g8G1',
      features: [
        'Everything in Pro',
        '10,000 submissions/month',
        'White-label branding',
        'Custom domains',
        'API access',
        'Team collaboration'
      ]
    }
  };

  const selectedPlan = planDetails[plan];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: currentUser?.email,
          name: currentUser?.displayName
        }
      });

      if (pmError) {
        setError(pmError.message);
        setLoading(false);
        return;
      }

      // In a real app, you would send the payment method ID to your backend
      // to create a subscription with Stripe
      console.log('Payment Method ID:', paymentMethod.id);
      console.log('Plan:', selectedPlan.priceId);
      console.log('User:', currentUser?.uid);

      // Simulate success for demo
      setTimeout(() => {
        setLoading(false);
        onSuccess?.(plan);
      }, 2000);

    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      width: '100%'
    },
    planHeader: {
      textAlign: 'center',
      marginBottom: '32px',
      padding: '24px',
      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(230, 57, 70, 0.1))',
      borderRadius: '16px',
      border: '1px solid rgba(255, 107, 53, 0.3)'
    },
    planName: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    planPrice: {
      fontSize: '32px',
      fontWeight: '900',
      color: '#ff6b35',
      marginBottom: '16px'
    },
    features: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      textAlign: 'left'
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
      color: 'rgba(255,255,255,0.9)',
      fontSize: '14px',
      fontWeight: '500'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    cardSection: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 107, 53, 0.2)',
      borderRadius: '12px',
      padding: '20px'
    },
    cardLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    cardElement: {
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 107, 53, 0.3)',
      borderRadius: '8px'
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
      padding: '12px',
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      justifyContent: 'center'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px'
    },
    button: {
      flex: 1,
      padding: '16px 24px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: 'none'
    },
    primaryButton: {
      background: 'linear-gradient(45deg, #ff6b35, #e63946)',
      color: 'white',
      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
    },
    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255,255,255,0.8)',
      border: '2px solid rgba(255, 255, 255, 0.2)'
    },
    security: {
      textAlign: 'center',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.6)',
      marginTop: '16px'
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '500',
        '::placeholder': {
          color: 'rgba(255,255,255,0.5)'
        }
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444'
      }
    },
    hidePostalCode: true
  };

  return (
    <div style={styles.container}>
      <div style={styles.planHeader}>
        <div style={styles.planName}>
          {plan === 'pro' ? <Crown size={24} /> : <Star size={24} />}
          {selectedPlan.name} Plan
        </div>
        <div style={styles.planPrice}>{selectedPlan.price}<span style={{fontSize: '16px', fontWeight: '500'}}>/month</span></div>
        <ul style={styles.features}>
          {selectedPlan.features.map((feature, index) => (
            <li key={index} style={styles.feature}>
              <Check size={16} color="#10b981" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.cardSection}>
          <div style={styles.cardLabel}>
            <CreditCard size={18} />
            Payment Details
          </div>
          <div style={styles.cardElement}>
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={onCancel}
            style={{...styles.button, ...styles.secondaryButton}}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : `Subscribe ${selectedPlan.price}/mo`}
          </button>
        </div>
      </form>

      <div style={styles.security}>
        🔒 Secure payment powered by Stripe. Cancel anytime.
      </div>
    </div>
  );
};

const StripeCheckout = ({ plan, onSuccess, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm plan={plan} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
};

export default StripeCheckout;
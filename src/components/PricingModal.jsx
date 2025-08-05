import React, { useState } from 'react';
import { Crown, Zap, Star, Check, X, Sparkles } from 'lucide-react';
import StripeCheckout from './StripeCheckout';
import { useAuth } from '../contexts/AuthContext';

const PricingModal = ({ onClose, onSuccess }) => {
  const { userPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      priceNumber: 0,
      description: 'Perfect for getting started',
      icon: <Sparkles size={24} />,
      color: '#6b7280',
      features: [
        '3 forms maximum',
        '50 submissions per month',
        'Basic PDF templates',
        'FormForge branding',
        'Community support'
      ],
      limitations: [
        'Limited form customization',
        'No custom branding',
        'Basic analytics'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9',
      priceNumber: 9,
      description: 'For professionals and small businesses',
      icon: <Crown size={24} />,
      color: '#3b82f6',
      popular: true,
      features: [
        'Unlimited forms',
        '1,000 submissions per month',
        'Custom PDF branding',
        'Advanced field types',
        'Priority support',
        'Form analytics',
        'Custom themes'
      ],
      upgrade: userPlan === 'free'
    },
    {
      id: 'business',
      name: 'Business',
      price: '$29',
      priceNumber: 29,
      description: 'For teams and growing businesses',
      icon: <Star size={24} />,
      color: '#10b981',
      features: [
        'Everything in Pro',
        '10,000 submissions per month',
        'White-label branding',
        'Custom domains',
        'API access',
        'Team collaboration',
        'Advanced analytics',
        'Priority onboarding'
      ],
      upgrade: userPlan === 'free' || userPlan === 'pro'
    }
  ];

  const handlePlanSelect = (planId) => {
    if (planId === 'free' || planId === userPlan) return;
    
    setSelectedPlan(planId);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = (plan) => {
    setShowCheckout(false);
    onSuccess?.(plan);
    onClose?.();
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
      padding: '20px'
    },
    container: {
      background: 'linear-gradient(135deg, rgba(45, 45, 45, 0.98), rgba(30, 30, 30, 0.98))',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 107, 53, 0.2)',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      padding: '40px',
      width: '100%',
      maxWidth: showCheckout ? '600px' : '1000px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.7)',
      transition: 'all 0.3s ease'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '900',
      background: 'linear-gradient(45deg, #ff6b35, #ffaa00)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '12px',
      fontFamily: 'Inter, sans-serif'
    },
    subtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '18px',
      fontWeight: '500'
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    planCard: (plan) => ({
      background: plan.popular ? 
        'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 197, 253, 0.05))' :
        'rgba(255, 255, 255, 0.05)',
      border: plan.popular ? 
        '2px solid #3b82f6' : 
        plan.id === userPlan ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      transition: 'all 0.3s ease',
      cursor: plan.upgrade ? 'pointer' : 'default',
      opacity: plan.id === userPlan ? 0.7 : 1
    }),
    popularBadge: {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    currentBadge: {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(45deg, #10b981, #059669)',
      color: 'white',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      textTransform: 'uppercase'
    },
    planHeader: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    planIcon: (color) => ({
      margin: '0 auto 12px',
      padding: '12px',
      borderRadius: '50%',
      background: `${color}20`,
      color: color,
      width: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    planName: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '4px'
    },
    planDescription: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: '14px',
      marginBottom: '16px'
    },
    planPrice: {
      fontSize: '36px',
      fontWeight: '900',
      color: '#ffffff',
      marginBottom: '4px'
    },
    planPriceSubtext: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '14px'
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 24px 0'
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '6px 0',
      color: 'rgba(255,255,255,0.9)',
      fontSize: '14px',
      fontWeight: '500'
    },
    planButton: (plan) => ({
      width: '100%',
      padding: '14px 20px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: plan.upgrade ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      border: 'none',
      background: plan.id === userPlan ? 
        'rgba(16, 185, 129, 0.2)' :
        plan.upgrade ? 
          `linear-gradient(45deg, ${plan.color}, ${plan.color}dd)` : 
          'rgba(107, 114, 128, 0.3)',
      color: plan.upgrade || plan.id === userPlan ? 'white' : 'rgba(255,255,255,0.5)'
    }),
    checkoutContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  if (showCheckout) {
    return (
      <div style={styles.overlay} onClick={handleCheckoutCancel}>
        <div style={styles.container} onClick={(e) => e.stopPropagation()}>
          <button onClick={handleCheckoutCancel} style={styles.closeButton}>
            <X size={20} />
          </button>
          <div style={styles.checkoutContainer}>
            <StripeCheckout 
              plan={selectedPlan} 
              onSuccess={handleCheckoutSuccess}
              onCancel={handleCheckoutCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeButton}>
          <X size={20} />
        </button>
        
        <div style={styles.header}>
          <h1 style={styles.title}>Choose Your Plan</h1>
          <p style={styles.subtitle}>Upgrade your FormForge experience with powerful features</p>
        </div>

        <div style={styles.plansGrid}>
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              style={styles.planCard(plan)}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
              {plan.id === userPlan && <div style={styles.currentBadge}>Current Plan</div>}
              
              <div style={styles.planHeader}>
                <div style={styles.planIcon(plan.color)}>
                  {plan.icon}
                </div>
                <div style={styles.planName}>{plan.name}</div>
                <div style={styles.planDescription}>{plan.description}</div>
                <div style={styles.planPrice}>
                  {plan.price}
                  {plan.priceNumber > 0 && (
                    <span style={styles.planPriceSubtext}>/month</span>
                  )}
                </div>
              </div>

              <ul style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={styles.feature}>
                    <Check size={16} color="#10b981" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                style={styles.planButton(plan)}
                disabled={!plan.upgrade && plan.id !== userPlan}
              >
                {plan.id === userPlan ? 'Current Plan' :
                 plan.upgrade ? `Upgrade to ${plan.name}` : 
                 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
import React, { useState } from 'react';
import { ArrowRight, Check, Download, Star, Users, Clock, Shield, FileText } from 'lucide-react';
import { contractTemplate } from '../templates/contractTemplate';
import SEOHead from '../components/SEOHead';

const ContractGenerator = ({ onStartContract }) => {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'G-QTM6MKENRR/contract_start'
      });
    }
    
    onStartContract(contractTemplate);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2D4A22 0%, #1B5E20 100%)',
      padding: '0'
    },
    hero: {
      textAlign: 'center',
      padding: '80px 20px',
      color: 'white'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '900',
      marginBottom: '24px',
      lineHeight: '1.1'
    },
    subtitle: {
      fontSize: '1.25rem',
      marginBottom: '40px',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto 40px'
    },
    ctaButton: {
      padding: '18px 40px',
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
      transition: 'all 0.3s ease'
    },
    features: {
      background: 'white',
      padding: '80px 20px',
      textAlign: 'center'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      marginTop: '60px'
    },
    featureCard: {
      padding: '40px 30px',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      border: '1px solid #f0f0f0'
    },
    featureIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      color: 'white',
      fontSize: '24px'
    },
    featureTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '16px',
      color: '#333'
    },
    featureDescription: {
      color: '#666',
      lineHeight: '1.6'
    },
    testimonials: {
      background: '#f8f9fa',
      padding: '80px 20px',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '20px',
      color: '#333'
    },
    sectionSubtitle: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '60px',
      maxWidth: '600px',
      margin: '0 auto 60px'
    },
    testimonialGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '30px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    testimonialCard: {
      background: 'white',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      textAlign: 'left'
    },
    stars: {
      color: '#ffc107',
      marginBottom: '16px'
    },
    testimonialText: {
      fontStyle: 'italic',
      marginBottom: '20px',
      color: '#555',
      lineHeight: '1.6'
    },
    testimonialAuthor: {
      fontWeight: '600',
      color: '#333'
    },
    pricing: {
      background: 'white',
      padding: '80px 20px',
      textAlign: 'center'
    },
    pricingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      maxWidth: '900px',
      margin: '60px auto 0'
    },
    pricingCard: (popular) => ({
      background: 'white',
      border: popular ? '3px solid #4CAF50' : '1px solid #e0e0e0',
      borderRadius: '16px',
      padding: '40px 30px',
      position: 'relative',
      boxShadow: popular ? '0 12px 40px rgba(76, 175, 80, 0.2)' : '0 4px 20px rgba(0,0,0,0.08)'
    }),
    popularBadge: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#4CAF50',
      color: 'white',
      padding: '8px 24px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '700'
    },
    planName: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '16px'
    },
    planPrice: {
      fontSize: '3rem',
      fontWeight: '900',
      color: '#4CAF50',
      marginBottom: '30px'
    },
    planFeatures: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '40px'
    },
    planFeature: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px',
      color: '#555'
    },
    legalSection: {
      background: '#f8f9fa',
      padding: '60px 20px',
      textAlign: 'center'
    },
    legalGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
      maxWidth: '800px',
      margin: '40px auto 0'
    },
    legalPoint: {
      background: 'white',
      padding: '30px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
    },
    legalIcon: {
      fontSize: '24px',
      marginBottom: '12px'
    },
    legalTitle: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#333'
    },
    legalDescription: {
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.5'
    }
  };

  return (
    <>
      <SEOHead 
        title="Freelance Contract Generator | Professional Service Agreements - FormForge"
        description="Create professional freelance contracts and service agreements in minutes. Protect your business and get paid on time with legally sound contracts."
        keywords="freelance contract, service agreement, contract template, freelancer contract, work agreement, legal contract generator"
        canonicalUrl={`${window.location.origin}/contract-generator`}
      />
      <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Professional Freelance Contract Generator
        </h1>
        <p style={styles.subtitle}>
          Create bulletproof freelance contracts and service agreements in minutes. 
          Protect your business and get paid on time with legally sound contracts.
        </p>
        <button onClick={handleGetStarted} style={styles.ctaButton}>
          Create Free Contract <ArrowRight size={20} />
        </button>
        <div style={{ marginTop: '30px', opacity: 0.8 }}>
          ⚖️ Legally compliant • ✨ Professional format • 🔒 Protect your work
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Use Our Contract Generator?</h2>
        <p style={styles.sectionSubtitle}>
          Everything freelancers need to create professional service agreements that protect their business
        </p>
        
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Shield size={24} />
            </div>
            <h3 style={styles.featureTitle}>Legal Protection</h3>
            <p style={styles.featureDescription}>
              Comprehensive legal clauses covering payment terms, intellectual property rights, 
              termination conditions, and liability protection.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <FileText size={24} />
            </div>
            <h3 style={styles.featureTitle}>Professional Format</h3>
            <p style={styles.featureDescription}>
              Clean, professional contract layout that looks great and covers all essential 
              elements of a freelance service agreement.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Clock size={24} />
            </div>
            <h3 style={styles.featureTitle}>Save Hours of Work</h3>
            <p style={styles.featureDescription}>
              No more writing contracts from scratch. Our template covers all standard 
              freelance scenarios and can be customized in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Legal Points Section */}
      <section style={styles.legalSection}>
        <h2 style={styles.sectionTitle}>Essential Contract Elements Included</h2>
        <p style={styles.sectionSubtitle}>
          Our template covers all critical aspects of freelance service agreements
        </p>
        
        <div style={styles.legalGrid}>
          <div style={styles.legalPoint}>
            <div style={styles.legalIcon}>💰</div>
            <div style={styles.legalTitle}>Payment Terms</div>
            <div style={styles.legalDescription}>Clear payment schedules, amounts, and late payment clauses</div>
          </div>
          
          <div style={styles.legalPoint}>
            <div style={styles.legalIcon}>📋</div>
            <div style={styles.legalTitle}>Scope of Work</div>
            <div style={styles.legalDescription}>Detailed project descriptions and deliverables specification</div>
          </div>
          
          <div style={styles.legalPoint}>
            <div style={styles.legalIcon}>🧠</div>
            <div style={styles.legalTitle}>IP Rights</div>
            <div style={styles.legalDescription}>Intellectual property ownership and usage rights clarification</div>
          </div>
          
          <div style={styles.legalPoint}>
            <div style={styles.legalIcon}>🔄</div>
            <div style={styles.legalTitle}>Revisions</div>
            <div style={styles.legalDescription}>Number of included revisions and additional work terms</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.testimonials}>
        <h2 style={styles.sectionTitle}>Trusted by Freelancers Worldwide</h2>
        
        <div style={styles.testimonialGrid}>
          <div style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>
              "This contract template saved me from a nightmare client situation. 
              Having clear terms upfront made all the difference."
            </p>
            <div style={styles.testimonialAuthor}>David K., Web Developer</div>
          </div>
          
          <div style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>
              "Professional, comprehensive, and easy to customize. I use this 
              for all my consulting contracts now."
            </p>
            <div style={styles.testimonialAuthor}>Rachel T., Marketing Consultant</div>
          </div>
          
          <div style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>
              "Finally, a contract template that covers everything I need. 
              No more awkward conversations about scope creep!"
            </p>
            <div style={styles.testimonialAuthor}>Alex M., Graphic Designer</div>
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section style={styles.pricing}>
        <h2 style={styles.sectionTitle}>Simple, Transparent Pricing</h2>
        <p style={styles.sectionSubtitle}>
          Start free and upgrade when you need more features
        </p>
        
        <div style={styles.pricingGrid}>
          <div style={styles.pricingCard(false)}>
            <h3 style={styles.planName}>Free</h3>
            <div style={styles.planPrice}>$0</div>
            <ul style={styles.planFeatures}>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                10 contracts per month
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Professional PDF templates
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                All essential legal clauses
              </li>
            </ul>
            <button onClick={handleGetStarted} style={styles.ctaButton}>
              Get Started Free
            </button>
          </div>
          
          <div style={styles.pricingCard(true)}>
            <div style={styles.popularBadge}>Most Popular</div>
            <h3 style={styles.planName}>Pro</h3>
            <div style={styles.planPrice}>$9<span style={{fontSize: '1rem'}}>/mo</span></div>
            <ul style={styles.planFeatures}>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Unlimited contracts
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Custom branding
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Multiple templates
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Contract tracking
              </li>
            </ul>
            <button onClick={handleGetStarted} style={styles.ctaButton}>
              Start Pro Trial
            </button>
          </div>
          
          <div style={styles.pricingCard(false)}>
            <h3 style={styles.planName}>Business</h3>
            <div style={styles.planPrice}>$29<span style={{fontSize: '1rem'}}>/mo</span></div>
            <ul style={styles.planFeatures}>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Everything in Pro
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Client portal
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                E-signature integration
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Team features
              </li>
            </ul>
            <button onClick={handleGetStarted} style={styles.ctaButton}>
              Start Business Trial
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ContractGenerator;
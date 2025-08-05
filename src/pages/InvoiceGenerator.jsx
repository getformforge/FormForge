import React, { useState } from 'react';
import { ArrowRight, Check, Download, Star, Users, Clock } from 'lucide-react';
import { invoiceTemplate } from '../templates/invoiceTemplate';
import SEOHead from '../components/SEOHead';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { theme } from '../styles/theme';

const InvoiceGenerator = ({ onStartInvoice }) => {
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'G-QTM6MKENRR/invoice_start'
      });
    }
    
    onStartInvoice(invoiceTemplate);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      background: '#ff6b35',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
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
      background: 'linear-gradient(45deg, #ff6b35, #ffaa00)',
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
      border: popular ? '3px solid #ff6b35' : '1px solid #e0e0e0',
      borderRadius: '16px',
      padding: '40px 30px',
      position: 'relative',
      boxShadow: popular ? '0 12px 40px rgba(255, 107, 53, 0.2)' : '0 4px 20px rgba(0,0,0,0.08)'
    }),
    popularBadge: {
      position: 'absolute',
      top: '-15px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#ff6b35',
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
      color: '#ff6b35',
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
    }
  };

  return (
    <>
      <SEOHead 
        title="Free Invoice Generator | Create Professional Invoices - FormForge"
        description="Generate professional invoices in seconds. Free invoice template with PDF download. Perfect for freelancers and small businesses. No signup required."
        keywords="invoice generator, free invoice, freelance invoice, professional invoice template, PDF invoice, small business invoice"
        canonicalUrl={`${window.location.origin}/invoice-generator`}
      />
      <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Free Professional Invoice Generator
        </h1>
        <p style={styles.subtitle}>
          Create stunning, professional invoices in under 2 minutes. Perfect for freelancers, 
          consultants, and small businesses. No signup required.
        </p>
        <button onClick={handleGetStarted} style={styles.ctaButton}>
          Create Free Invoice <ArrowRight size={20} />
        </button>
        <div style={{ marginTop: '30px', opacity: 0.8 }}>
          ✨ Free forever • No watermarks • Professional PDF
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Our Invoice Generator?</h2>
        <p style={styles.sectionSubtitle}>
          Everything you need to create professional invoices that get you paid faster
        </p>
        
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Clock size={24} />
            </div>
            <h3 style={styles.featureTitle}>Ready in 2 Minutes</h3>
            <p style={styles.featureDescription}>
              Our smart template fills in common fields automatically. Just add your details 
              and generate a professional PDF instantly.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Download size={24} />
            </div>
            <h3 style={styles.featureTitle}>Professional PDFs</h3>
            <p style={styles.featureDescription}>
              Beautiful, clean invoice layouts that look professional and help you get paid faster. 
              Multiple templates to choose from.
            </p>
          </div>
          
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>
              <Users size={24} />
            </div>
            <h3 style={styles.featureTitle}>Trusted by 10,000+</h3>
            <p style={styles.featureDescription}>
              Join thousands of freelancers and small businesses who trust FormForge 
              for their professional invoicing needs.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={styles.testimonials}>
        <h2 style={styles.sectionTitle}>What Our Users Say</h2>
        
        <div style={styles.testimonialGrid}>
          <div style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>
              "This saved me hours of work. The invoices look so professional, 
              and my clients pay faster now!"
            </p>
            <div style={styles.testimonialAuthor}>Sarah M., Freelance Designer</div>
          </div>
          
          <div style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>
              "Perfect for my consulting business. Clean, professional, and takes 
              literally 2 minutes to create each invoice."
            </p>
            <div style={styles.testimonialAuthor}>Mike R., Business Consultant</div>
          </div>
          
          <div style={styles.testimonialCard}>
            <div style={styles.stars}>★★★★★</div>
            <p style={styles.testimonialText}>
              "I was using Word templates before this. What a game changer! 
              My invoices look 10x more professional now."
            </p>
            <div style={styles.testimonialAuthor}>Jessica L., Marketing Agency</div>
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
                10 invoices per month
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                Professional PDF templates
              </li>
              <li style={styles.planFeature}>
                <Check size={16} color="#10b981" />
                All essential fields
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
                Unlimited invoices
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
                Payment tracking
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
                Automatic reminders
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

export default InvoiceGenerator;
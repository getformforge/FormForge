import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Zap, 
  Mail, 
  Cloud, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  DollarSign,
  User,
  FileText,
  Layers
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Auth from '../components/Auth';
import UserDashboard from '../components/UserDashboard';
import PricingModal from '../components/PricingModal';
import Templates from '../components/Templates';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

const PartnersPage = () => {
  const { currentUser } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Track affiliate clicks
  const trackClick = (partner, url) => {
    // Track in analytics
    if (window.gtag) {
      window.gtag('event', 'affiliate_click', {
        partner: partner,
        url: url
      });
    }
    
    // Open in new tab
    window.open(url, '_blank');
  };

  const featuredPartners = [
    {
      name: 'Stripe',
      description: 'Accept payments directly in your forms with the world\'s leading payment processor',
      features: [
        'Accept credit cards, ACH, and 135+ currencies',
        'Industry-leading fraud protection',
        'Simple 2.9% + 30¢ pricing',
        'Instant payouts available'
      ],
      icon: <CreditCard size={32} />,
      color: '#635BFF',
      affiliate: 'https://stripe.com/partners/referrals?ref=formforge',
      bonus: '💰 Get $500 in free processing credits',
      category: 'payments',
      popular: true
    },
    {
      name: 'Zapier',
      description: 'Connect your forms to 5,000+ apps without any coding',
      features: [
        'Automate workflows instantly',
        'Send form data anywhere',
        'No coding required',
        '5-minute setup'
      ],
      icon: <Zap size={32} />,
      color: '#FF4A00',
      affiliate: 'https://zapier.com/sign-up?utm_source=partner&utm_campaign=formforge',
      bonus: '🎁 14-day free trial included',
      category: 'automation',
      popular: true
    },
    {
      name: 'SendGrid',
      description: 'Deliver transactional emails at scale with 99% deliverability',
      features: [
        'Send 40,000 emails for $15/month',
        'Industry-best deliverability',
        'Real-time analytics',
        'Email validation included'
      ],
      icon: <Mail size={32} />,
      color: '#1A82E2',
      affiliate: 'https://sendgrid.com/partners/affiliate?ref=formforge',
      bonus: '✨ Get 40,000 free emails your first month',
      category: 'email'
    },
    {
      name: 'Google Workspace',
      description: 'Professional email and productivity suite for your business',
      features: [
        'Custom email @yourdomain',
        'Google Drive storage',
        'Video conferencing',
        'Collaborative docs'
      ],
      icon: <Globe size={32} />,
      color: '#4285F4',
      affiliate: 'https://workspace.google.com/landing/partners/referral/formforge.html',
      bonus: '🎯 10% off your first year',
      category: 'productivity'
    },
    {
      name: 'Cloudflare',
      description: 'Protect and accelerate your forms with enterprise security',
      features: [
        'DDoS protection',
        'Global CDN',
        'Free SSL certificates',
        'Bot management'
      ],
      icon: <Shield size={32} />,
      color: '#F38020',
      affiliate: 'https://www.cloudflare.com/partners?ref=formforge',
      bonus: '🛡️ Free plan available',
      category: 'security'
    },
    {
      name: 'AWS Credits',
      description: 'Get cloud hosting credits for scaling your form infrastructure',
      features: [
        '$5,000 in AWS credits',
        'Startup program access',
        'Technical support',
        'Training resources'
      ],
      icon: <Cloud size={32} />,
      color: '#FF9900',
      affiliate: 'https://aws.amazon.com/activate?ref=formforge',
      bonus: '☁️ Up to $5,000 in free credits',
      category: 'hosting'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Partners' },
    { id: 'payments', name: 'Payments' },
    { id: 'automation', name: 'Automation' },
    { id: 'email', name: 'Email' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'security', name: 'Security' },
    { id: 'hosting', name: 'Hosting' }
  ];

  const filteredPartners = selectedCategory === 'all' 
    ? featuredPartners 
    : featuredPartners.filter(p => p.category === selectedCategory);

  return (
    <Layout variant="landing">
      {/* Professional Header - Matching HomePage */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left: Logo */}
          <Link to="/" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              FormForge
            </div>
          </Link>

          {/* Right: Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Link
              to="/builder"
              style={{
                padding: '8px 16px',
                color: '#374151',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Layers size={16} />
              Form Builder
            </Link>

            <button
              onClick={() => setShowTemplates(true)}
              style={{
                padding: '8px 16px',
                color: '#374151',
                background: 'transparent',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <FileText size={16} />
              Templates
            </button>

            <Link
              to="/partners"
              style={{
                padding: '8px 16px',
                color: '#374151',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f3f4f6'
              }}
            >
              <Zap size={16} />
              Partners
            </Link>

            <button
              onClick={() => setShowPricing(true)}
              style={{
                padding: '8px 16px',
                color: '#374151',
                background: 'transparent',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <CreditCard size={16} />
              Pricing
            </button>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              backgroundColor: '#e5e7eb',
              margin: '0 8px'
            }} />

            {/* User/Auth Section */}
            {currentUser ? (
              <button
                onClick={() => setShowUserDashboard(true)}
                style={{
                  padding: '8px 16px',
                  color: '#374151',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <User size={16} />
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'Account'}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: '8px 16px',
                    color: '#374151',
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f97316 100%)',
                    color: 'white',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <Layout.Section padding="xl">
        <Layout.Container>
          <div style={{ textAlign: 'center', marginBottom: theme.spacing[16] }}>
            <h1 style={{
              fontSize: theme.typography.fontSize['5xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[6],
              lineHeight: theme.typography.lineHeight.tight,
              maxWidth: '800px',
              margin: `0 auto ${theme.spacing[6]}`
            }}>
              Our Trusted Partners
            </h1>
            
            <p style={{
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.secondary[600],
              marginBottom: theme.spacing[10],
              lineHeight: theme.typography.lineHeight.relaxed,
              maxWidth: '700px',
              margin: `0 auto ${theme.spacing[10]}`
            }}>
              Connect FormForge with industry-leading tools to supercharge your workflow. 
              Exclusive deals and discounts for our users.
            </p>

            {/* Stats */}
            <Layout.Grid cols={4} gap={8} style={{ marginTop: theme.spacing[12], maxWidth: '800px', margin: `${theme.spacing[12]} auto 0` }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.black,
                  color: theme.colors.primary[500],
                  marginBottom: theme.spacing[2]
                }}>
                  $5,500+
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[500],
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  In Partner Savings
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.black,
                  color: theme.colors.primary[500],
                  marginBottom: theme.spacing[2]
                }}>
                  5,000+
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[500],
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  App Integrations
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.black,
                  color: theme.colors.primary[500],
                  marginBottom: theme.spacing[2]
                }}>
                  99%
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[500],
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  Email Deliverability
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: theme.typography.fontSize['3xl'],
                  fontWeight: theme.typography.fontWeight.black,
                  color: theme.colors.primary[500],
                  marginBottom: theme.spacing[2]
                }}>
                  24/7
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[500],
                  fontWeight: theme.typography.fontWeight.medium
                }}>
                  Support Available
                </div>
              </div>
            </Layout.Grid>
          </div>
        </Layout.Container>
      </Layout.Section>

      {/* Category Filter */}
      <Layout.Section padding="sm">
        <Layout.Container>
          <div style={{ 
            display: 'flex', 
            gap: theme.spacing[3],
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                  background: selectedCategory === category.id 
                    ? 'linear-gradient(135deg, #ff6b35 0%, #f97316 100%)' 
                    : 'white',
                  color: selectedCategory === category.id ? 'white' : theme.colors.secondary[700],
                  border: selectedCategory === category.id 
                    ? 'none' 
                    : `2px solid ${theme.colors.secondary[200]}`,
                  borderRadius: theme.borderRadius.full,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.borderColor = theme.colors.primary[300];
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.borderColor = theme.colors.secondary[200];
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </Layout.Container>
      </Layout.Section>

      {/* Partners Grid */}
      <Layout.Section padding="lg">
        <Layout.Container>
          <Layout.Grid cols="auto" gap={8}>
            {filteredPartners.map((partner, index) => (
              <Card 
                key={partner.name}
                variant="base" 
                padding="lg"
                style={{
                  position: 'relative',
                  border: '2px solid rgba(255, 107, 53, 0.2)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {partner.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '20px',
                    background: theme.gradients.primary,
                    color: 'white',
                    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.bold
                  }}>
                    POPULAR
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: theme.borderRadius.xl,
                    background: `linear-gradient(135deg, ${partner.color}20 0%, ${partner.color}10 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: theme.spacing[6],
                    color: partner.color
                  }}>
                    {partner.icon}
                  </div>
                  
                  <h3 style={{
                    fontSize: theme.typography.fontSize.xl,
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.secondary[900],
                    marginBottom: theme.spacing[3]
                  }}>
                    {partner.name}
                  </h3>
                  
                  <p style={{
                    color: theme.colors.secondary[600],
                    lineHeight: theme.typography.lineHeight.relaxed,
                    marginBottom: theme.spacing[4]
                  }}>
                    {partner.description}
                  </p>

                  <div style={{
                    background: theme.colors.primary[50],
                    border: `1px solid ${theme.colors.primary[200]}`,
                    padding: theme.spacing[3],
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing[4]
                  }}>
                    <p style={{
                      margin: 0,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.primary[700],
                      fontSize: theme.typography.fontSize.sm
                    }}>
                      {partner.bonus}
                    </p>
                  </div>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    marginBottom: theme.spacing[6]
                  }}>
                    {partner.features.map((feature, idx) => (
                      <li key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing[2],
                        marginBottom: theme.spacing[2],
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.secondary[600]
                      }}>
                        <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => trackClick(partner.name, partner.affiliate)}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Get Started with {partner.name}
                </Button>
              </Card>
            ))}
          </Layout.Grid>
        </Layout.Container>
      </Layout.Section>

      {/* CTA Section */}
      <Layout.Section padding="xl" style={{ background: theme.colors.secondary[50] }}>
        <Layout.Container>
          <Card variant="glass" padding="xl" style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[6]
            }}>
              Need a Custom Integration?
            </h2>
            
            <p style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.secondary[600],
              marginBottom: theme.spacing[10],
              maxWidth: '500px',
              margin: `0 auto ${theme.spacing[10]}`
            }}>
              We're always adding new partners. Tell us what tools you need to connect with FormForge.
            </p>
            
            <Layout.Flex justify="center" gap={4} wrap="wrap">
              <Button 
                size="xl"
                onClick={() => window.location.href = 'mailto:support@formforge.com?subject=Integration Request'}
              >
                Request Integration
              </Button>
            </Layout.Flex>
          </Card>
        </Layout.Container>
      </Layout.Section>

      {/* Disclosure */}
      <Layout.Section padding="md">
        <Layout.Container>
          <div style={{
            textAlign: 'center',
            padding: theme.spacing[6],
            color: theme.colors.secondary[600],
            fontSize: theme.typography.fontSize.sm
          }}>
            <p>
              <strong>Affiliate Disclosure:</strong> FormForge may earn a commission when you sign up for services through our partner links. 
              We only recommend tools we trust and use ourselves. These partnerships help us keep FormForge affordable for everyone.
            </p>
          </div>
        </Layout.Container>
      </Layout.Section>

      {/* Modals */}
      {showTemplates && (
        <Templates 
          onSelectTemplate={(fields, name) => {
            sessionStorage.setItem('selectedTemplate', JSON.stringify({ fields, name }));
            window.location.href = '/builder';
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showUserDashboard && (
        <UserDashboard onClose={() => setShowUserDashboard(false)} />
      )}

      {showAuth && (
        <Auth onSuccess={() => setShowAuth(false)} onClose={() => setShowAuth(false)} />
      )}

      {showPricing && (
        <PricingModal onClose={() => setShowPricing(false)} />
      )}
    </Layout>
  );
};

export default PartnersPage;
import React from 'react';
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
  DollarSign
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { theme } from '../styles/theme';

const IntegrationsPage = () => {
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
      bonus: '💰 Exclusive: Get $500 in free processing credits',
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
    { id: 'all', name: 'All Integrations', icon: <Zap size={18} /> },
    { id: 'payments', name: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'automation', name: 'Automation', icon: <Zap size={18} /> },
    { id: 'email', name: 'Email', icon: <Mail size={18} /> },
    { id: 'productivity', name: 'Productivity', icon: <TrendingUp size={18} /> },
    { id: 'security', name: 'Security', icon: <Shield size={18} /> }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredPartners = selectedCategory === 'all' 
    ? featuredPartners 
    : featuredPartners.filter(p => p.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <Layout.Section 
        padding="xl" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Layout.Container size="md">
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold',
            marginBottom: theme.spacing[4]
          }}>
            Our Trusted Partners
          </h1>
          <p style={{ 
            fontSize: '20px',
            opacity: 0.95,
            marginBottom: theme.spacing[8]
          }}>
            Connect FormForge with industry-leading tools. Exclusive deals for our users.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: theme.spacing[4],
            borderRadius: theme.borderRadius.lg,
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>
              🎉 Special Offers: Save up to $5,500 with our partner deals
            </p>
          </div>
        </Layout.Container>
      </Layout.Section>

      {/* Category Filter */}
      <Layout.Section padding="md" style={{ background: '#f9fafb' }}>
        <Layout.Container size="lg">
          <div style={{ 
            display: 'flex', 
            gap: theme.spacing[2],
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                  background: selectedCategory === category.id ? '#3b82f6' : 'white',
                  color: selectedCategory === category.id ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: theme.borderRadius.full,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  transition: 'all 0.2s ease',
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium
                }}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </Layout.Container>
      </Layout.Section>

      {/* Partners Grid */}
      <Layout.Section padding="xl">
        <Layout.Container size="lg">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: theme.spacing[6],
            marginBottom: theme.spacing[12]
          }}>
            {filteredPartners.map(partner => (
              <Card 
                key={partner.name}
                variant="bordered" 
                padding="lg"
                style={{
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {partner.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: 'white',
                    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                    borderRadius: theme.borderRadius.full,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[1]
                  }}>
                    <Star size={12} fill="white" />
                    POPULAR
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[3],
                    marginBottom: theme.spacing[4]
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: `${partner.color}15`,
                      borderRadius: theme.borderRadius.lg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: partner.color
                    }}>
                      {partner.icon}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: theme.typography.fontSize.xl,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.secondary[900],
                        margin: 0
                      }}>
                        {partner.name}
                      </h3>
                    </div>
                  </div>

                  <p style={{
                    color: theme.colors.secondary[600],
                    marginBottom: theme.spacing[4],
                    fontSize: theme.typography.fontSize.base
                  }}>
                    {partner.description}
                  </p>

                  <div style={{
                    background: `${partner.color}08`,
                    padding: theme.spacing[3],
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing[4]
                  }}>
                    <p style={{
                      margin: 0,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: partner.color,
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
                    {partner.features.map((feature, index) => (
                      <li key={index} style={{
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
                  style={{
                    background: partner.color,
                    borderColor: partner.color
                  }}
                >
                  Get Started with {partner.name}
                </Button>
              </Card>
            ))}
          </div>

          {/* Disclosure */}
          <div style={{
            textAlign: 'center',
            padding: theme.spacing[6],
            background: theme.colors.secondary[50],
            borderRadius: theme.borderRadius.lg
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.secondary[600],
              margin: 0
            }}>
              <strong>Affiliate Disclosure:</strong> FormForge may earn a commission when you sign up for services through our partner links. 
              We only recommend tools we trust and use ourselves. These partnerships help us keep FormForge affordable for everyone.
            </p>
          </div>

          {/* CTA Section */}
          <div style={{
            textAlign: 'center',
            marginTop: theme.spacing[12],
            padding: theme.spacing[8],
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: theme.borderRadius.xl,
            color: 'white'
          }}>
            <h2 style={{
              fontSize: '32px',
              marginBottom: theme.spacing[4]
            }}>
              Need a Custom Integration?
            </h2>
            <p style={{
              fontSize: '18px',
              marginBottom: theme.spacing[6],
              opacity: 0.95
            }}>
              We're always adding new partners. Tell us what tools you need.
            </p>
            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                style={{
                  background: 'white',
                  color: '#3b82f6'
                }}
              >
                Request Integration
              </Button>
            </Link>
          </div>
        </Layout.Container>
      </Layout.Section>
    </Layout>
  );
};

export default IntegrationsPage;
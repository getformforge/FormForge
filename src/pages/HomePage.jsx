import React from 'react';
import { ArrowRight, CheckCircle, FileText, Download, Users, Star, Zap, Shield, Clock, Target } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { theme } from '../styles/theme';

const HomePage = ({ onNavigate }) => {
  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Lightning Fast',
      description: 'Generate professional PDFs in under 30 seconds. No waiting, no delays.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Business Grade',
      description: 'Professional templates designed for real business use. HIPAA compliant options available.'
    },
    {
      icon: <Target size={24} />,
      title: 'Purpose Built',
      description: 'Specialized for forms-to-PDF generation. No feature bloat, just what you need.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Save Hours',
      description: 'What used to take hours of manual work now takes minutes with our smart templates.'
    }
  ];

  const templates = [
    {
      id: 'invoice',
      title: 'Invoice Generator',
      description: 'Professional invoices for freelancers and small businesses',
      icon: '💼',
      color: theme.gradients.primary,
      popular: true,
      route: '/invoice-generator'
    },
    {
      id: 'contract',
      title: 'Contract Generator',
      description: 'Legal service agreements and freelance contracts',
      icon: '⚖️',
      color: theme.gradients.success,
      popular: true,
      route: '/contract-generator'
    },
    {
      id: 'medical',
      title: 'Medical Forms',
      description: 'HIPAA-compliant patient intake and medical forms',
      icon: '🏥',
      color: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
      popular: false,
      action: () => onNavigate('medical')
    },
    {
      id: 'rental',
      title: 'Rental Agreements',
      description: 'Professional lease agreements for landlords',
      icon: '🏠',
      color: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
      popular: false,
      action: () => onNavigate('rental')
    },
    {
      id: 'nda',
      title: 'NDAs & Legal',
      description: 'Non-disclosure and confidentiality agreements',
      icon: '🔒',
      color: 'linear-gradient(45deg, #f59e0b, #d97706)',
      popular: false,
      action: () => onNavigate('nda')
    },
    {
      id: 'custom',
      title: 'Custom Form Builder',
      description: 'Build any form from scratch with our flexible builder',
      icon: '🛠️',
      color: theme.gradients.secondary,
      popular: false,
      action: () => onNavigate('builder')
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Freelance Designer',
      company: 'Design Studio',
      quote: 'FormForge cut my invoicing time from 30 minutes to 2 minutes. My clients get professional PDFs instantly.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Family Physician',
      company: 'Chen Medical Practice',
      quote: 'The medical intake forms save us 15 minutes per patient. HIPAA compliance gives us peace of mind.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Property Manager',
      company: 'Urban Properties',
      quote: 'Professional lease agreements in minutes instead of hours. Tenants love the clean, clear format.',
      rating: 5
    }
  ];

  const stats = [
    { number: '50K+', label: 'PDFs Generated' },
    { number: '2,500+', label: 'Happy Users' },
    { number: '15min', label: 'Average Time Saved' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <Layout variant="landing">
      {/* Hero Section */}
      <Layout.Section padding="xl">
        <Layout.Container>
          <div style={{ textAlign: 'center', marginBottom: theme.spacing[16] }}>
            <div style={{
              fontSize: theme.typography.fontSize['6xl'],
              fontWeight: theme.typography.fontWeight.black,
              background: 'linear-gradient(45deg, #ff6b35, #ffaa00, #ff6b35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: theme.spacing[6],
              lineHeight: theme.typography.lineHeight.tight,
              letterSpacing: '-0.02em'
            }}>
              FormForge
            </div>
            
            <h1 style={{
              fontSize: theme.typography.fontSize['4xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[6],
              lineHeight: theme.typography.lineHeight.tight,
              maxWidth: '800px',
              margin: `0 auto ${theme.spacing[6]}`
            }}>
              Transform Forms into Professional PDFs in Seconds
            </h1>
            
            <p style={{
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.secondary[600],
              marginBottom: theme.spacing[10],
              lineHeight: theme.typography.lineHeight.relaxed,
              maxWidth: '600px',
              margin: `0 auto ${theme.spacing[10]}`
            }}>
              The specialized forms-to-PDF generator that saves businesses hours of work. 
              Professional templates for invoices, contracts, medical forms, and more.
            </p>

            <Layout.Flex justify="center" gap={4} wrap="wrap">
              <Button 
                size="xl" 
                rightIcon={<ArrowRight size={20} />}
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              >
                Choose Your Template
              </Button>
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => onNavigate('builder')}
              >
                Try Custom Builder
              </Button>
            </Layout.Flex>

            {/* Stats */}
            <Layout.Grid cols={4} gap={8} style={{ marginTop: theme.spacing[16], maxWidth: '800px', margin: `${theme.spacing[16]} auto 0` }}>
              {stats.map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: theme.typography.fontSize['3xl'],
                    fontWeight: theme.typography.fontWeight.black,
                    color: theme.colors.primary[500],
                    marginBottom: theme.spacing[2]
                  }}>
                    {stat.number}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.secondary[500],
                    fontWeight: theme.typography.fontWeight.medium
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </Layout.Grid>
          </div>
        </Layout.Container>
      </Layout.Section>

      {/* Features Section */}
      <Layout.Section padding="lg">
        <Layout.Container>
          <div style={{ textAlign: 'center', marginBottom: theme.spacing[16] }}>
            <h2 style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[4]
            }}>
              Why FormForge?
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.secondary[600],
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Built specifically for forms-to-PDF generation. No feature bloat, just professional results.
            </p>
          </div>

          <Layout.Grid cols="auto" gap={8}>
            {features.map((feature, index) => (
              <Card key={index} variant="glass" padding="lg">
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: theme.borderRadius.xl,
                  background: theme.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing[6],
                  color: 'white'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary[900],
                  marginBottom: theme.spacing[3]
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: theme.colors.secondary[600],
                  lineHeight: theme.typography.lineHeight.relaxed
                }}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </Layout.Grid>
        </Layout.Container>
      </Layout.Section>

      {/* Templates Section */}
      <Layout.Section padding="lg">
        <Layout.Container>
          <div style={{ textAlign: 'center', marginBottom: theme.spacing[16] }}>
            <h2 style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[4]
            }}>
              Professional Templates
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.secondary[600],
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Choose from our library of professionally designed templates or build your own custom form.
            </p>
          </div>

          <Layout.Grid cols="auto" gap={6}>
            {templates.map((template, index) => (
              <Card key={index} variant="base" padding="lg" style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                border: '2px solid rgba(255, 107, 53, 0.2)',
                ':hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }
              }}
              onClick={() => {
                if (template.route) {
                  window.location.href = template.route;
                } else if (template.action) {
                  template.action();
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              >
                {template.popular && (
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
                
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: theme.borderRadius.xl,
                  background: template.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing[6],
                  fontSize: '2rem'
                }}>
                  {template.icon}
                </div>
                
                <h3 style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary[900],
                  marginBottom: theme.spacing[3]
                }}>
                  {template.title}
                </h3>
                
                <p style={{
                  color: theme.colors.secondary[600],
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing[6]
                }}>
                  {template.description}
                </p>
                
                <Button variant="ghost" rightIcon={<ArrowRight size={16} />}>
                  Get Started
                </Button>
              </Card>
            ))}
          </Layout.Grid>
        </Layout.Container>
      </Layout.Section>

      {/* Testimonials */}
      <Layout.Section padding="lg">
        <Layout.Container>
          <div style={{ textAlign: 'center', marginBottom: theme.spacing[16] }}>
            <h2 style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[4]
            }}>
              Trusted by Professionals
            </h2>
          </div>

          <Layout.Grid cols="auto" gap={8}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="glass" padding="lg">
                <div style={{ marginBottom: theme.spacing[4] }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill={theme.colors.warning[500]} color={theme.colors.warning[500]} style={{ marginRight: theme.spacing[1] }} />
                  ))}
                </div>
                
                <p style={{
                  color: theme.colors.secondary[700],
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing[6],
                  fontStyle: 'italic'
                }}>
                  "{testimonial.quote}"
                </p>
                
                <div>
                  <div style={{
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.secondary[900],
                    marginBottom: theme.spacing[1]
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.secondary[600]
                  }}>
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </Card>
            ))}
          </Layout.Grid>
        </Layout.Container>
      </Layout.Section>

      {/* CTA Section */}
      <Layout.Section padding="xl">
        <Layout.Container>
          <Card variant="glass" padding="xl" style={{ textAlign: 'center' }}>
            <h2 style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[6]
            }}>
              Ready to Transform Your Forms?
            </h2>
            
            <p style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.secondary[600],
              marginBottom: theme.spacing[10],
              maxWidth: '500px',
              margin: `0 auto ${theme.spacing[10]}`
            }}>
              Join thousands of professionals who save hours every week with FormForge.
            </p>
            
            <Layout.Flex justify="center" gap={4} wrap="wrap">
              <Button 
                size="xl" 
                rightIcon={<ArrowRight size={20} />}
                onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              >
                Choose Template
              </Button>
              <Button 
                variant="secondary" 
                size="xl"
                onClick={() => onNavigate('builder')}
              >
                Custom Builder
              </Button>
            </Layout.Flex>
          </Card>
        </Layout.Container>
      </Layout.Section>
    </Layout>
  );
};

export default HomePage;
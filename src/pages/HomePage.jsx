import React, { useState } from 'react';
import { ArrowRight, CheckCircle, FileText, Download, Users, Star, Zap, Shield, Clock, Target, Layers, GitBranch, Save, CreditCard } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Header from '../components/layout/Header';
import Templates from '../components/Templates';
import Auth from '../components/Auth';
import UserDashboard from '../components/UserDashboard';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

const HomePage = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (templateFields, templateName) => {
    if (!currentUser) {
      setSelectedTemplate({ fields: templateFields, name: templateName });
      setShowAuth(true);
      setShowTemplates(false);
    } else {
      // User is authenticated, proceed directly
      loadTemplateAndNavigate(templateFields, templateName);
    }
  };

  const loadTemplateAndNavigate = (templateFields, templateName) => {
    // Store template in sessionStorage for the builder to pick up
    sessionStorage.setItem('selectedTemplate', JSON.stringify({
      fields: templateFields,
      name: templateName
    }));
    
    // Show confirmation and navigate
    if (window.confirm(`Load "${templateName}" template in the form builder?`)) {
      onNavigate('builder');
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (selectedTemplate) {
      loadTemplateAndNavigate(selectedTemplate.fields, selectedTemplate.name);
      setSelectedTemplate(null);
    }
  };

  const features = [
    {
      icon: <Layers size={24} />,
      title: 'Multi-Column Form Builder',
      description: 'Create professional layouts with our drag-and-drop builder. Design forms with 1, 2, or 3 column layouts. Add headings, dividers, and organize fields into logical sections.'
    },
    {
      icon: <GitBranch size={24} />,
      title: 'Smart Conditional Logic',
      description: 'Build dynamic forms that adapt to user input. Show or hide fields based on responses. Create intelligent workflows that guide users through complex processes.'
    },
    {
      icon: <Save size={24} />,
      title: 'Save, Load & Reuse Forms',
      description: 'Save your forms as templates for future use. Load and duplicate existing forms with one click. Build your library of reusable form templates.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Enterprise Security',
      description: 'End-to-end encryption, Firebase Authentication, and secure data transmission. Your sensitive documents are protected with bank-level security.'
    },
    {
      icon: <Users size={24} />,
      title: 'Share & Collect',
      description: 'Share forms with unique URLs. Collect responses automatically. Track submissions in real-time. Export data when you need it.'
    },
    {
      icon: <FileText size={24} />,
      title: 'Professional PDFs',
      description: 'Generate filled or blank PDF templates instantly. Add custom headers and branding. Perfect for contracts, invoices, and official documents.'
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
      description: 'Secure patient intake and medical forms',
      icon: '🏥',
      color: theme.gradients.info,
      popular: false,
      action: () => onNavigate('medical')
    },
    {
      id: 'rental',
      title: 'Rental Agreements',
      description: 'Professional lease agreements for landlords',
      icon: '🏠',
      color: theme.gradients.warning,
      popular: false,
      action: () => onNavigate('rental')
    },
    {
      id: 'nda',
      title: 'NDAs & Legal',
      description: 'Non-disclosure and confidentiality agreements',
      icon: '🔒',
      color: theme.gradients.danger,
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
      quote: 'The medical intake forms save us 15 minutes per patient. The security features give us peace of mind.',
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
      {/* Header */}
      <Header
        title="FormForge"
        showHomeButton={false}
        user={currentUser}
        onUserClick={() => setShowUserDashboard(true)}
        rightContent={
          currentUser ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('builder')}
            >
              Go to Builder
            </Button>
          ) : (
            <Layout.Flex gap={2}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAuth(true)}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAuth(true)}
              >
                Get Started
              </Button>
            </Layout.Flex>
          )
        }
      />

      {/* Navigation Bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        position: 'sticky',
        top: '73px',
        zIndex: 90,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          padding: '12px 0'
        }}>
          <a 
            href="/builder"
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.color = '#374151'}
          >
            <Layers size={16} />
            Form Builder
          </a>
          
          <a 
            href="#templates"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.color = '#374151'}
          >
            <FileText size={16} />
            Templates
          </a>
          
          <a 
            href="/integrations"
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              padding: '6px 12px',
              borderRadius: '6px',
              color: 'white'
            }}
          >
            <Zap size={16} />
            Integrations
            <span style={{
              background: 'white',
              color: '#f59e0b',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 'bold',
              marginLeft: '4px'
            }}>
              NEW
            </span>
          </a>
          
          <a 
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.color = '#374151'}
          >
            <CreditCard size={16} />
            Pricing
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <Layout.Section padding="xl">
        <Layout.Container>
          <div style={{ textAlign: 'center', marginBottom: theme.spacing[16] }}>
            <div style={{
              fontSize: theme.typography.fontSize['6xl'],
              fontWeight: theme.typography.fontWeight.black,
              background: theme.gradients.primary,
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
              Create, Share & Collect Secure Business Forms
            </h1>
            
            <p style={{
              fontSize: theme.typography.fontSize.xl,
              color: theme.colors.secondary[600],
              marginBottom: theme.spacing[10],
              lineHeight: theme.typography.lineHeight.relaxed,
              maxWidth: '700px',
              margin: `0 auto ${theme.spacing[10]}`
            }}>
              Build professional forms, share them securely with clients, collect responses automatically, 
              and generate beautiful PDFs. Trusted by businesses for sensitive documents with enterprise-grade security.
            </p>

            <Layout.Flex justify="center" gap={4} wrap="wrap">
              <Button 
                size="xl" 
                rightIcon={<ArrowRight size={20} />}
                onClick={() => setShowTemplates(true)}
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
              Start with a professionally designed template or build your own custom form from scratch.
            </p>
          </div>

          <Layout.Grid cols="auto" gap={6}>
            {templates.map((template, index) => (
              <Card key={index} variant="base" padding="lg" style={{
                position: 'relative',
                border: '2px solid rgba(255, 107, 53, 0.2)'
              }}>
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
                  marginBottom: theme.spacing[4]
                }}>
                  {template.description}
                </p>
                
              </Card>
            ))}
          </Layout.Grid>
        </Layout.Container>
      </Layout.Section>

      {/* Security Section */}
      <Layout.Section padding="lg" style={{ 
        background: theme.gradients.light, 
        borderTop: '1px solid rgba(226, 232, 240, 0.8)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        <Layout.Container>
          <div style={{ textAlign: 'center', marginBottom: theme.spacing[12] }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#059669',
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              marginBottom: theme.spacing[4]
            }}>
              <Shield size={16} />
              ENTERPRISE SECURITY
            </div>
            <h2 style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.secondary[900],
              marginBottom: theme.spacing[4]
            }}>
              Your Data is Protected
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.secondary[600],
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              We understand you're sharing sensitive business documents. That's why FormForge uses the same security standards as banks and healthcare providers.
            </p>
          </div>

          <Layout.Grid cols={2} gap={8}>
            <Card variant="glass" padding="lg">
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: theme.borderRadius.xl,
                background: theme.gradients.success,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing[4],
                color: 'white'
              }}>
                <Shield size={24} />
              </div>
              <h3 style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.secondary[900],
                marginBottom: theme.spacing[3]
              }}>
                End-to-End Encryption
              </h3>
              <p style={{
                color: theme.colors.secondary[600],
                lineHeight: theme.typography.lineHeight.relaxed,
                marginBottom: theme.spacing[3]
              }}>
                All form data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your sensitive information is never stored in plain text.
              </p>
              <ul style={{
                color: theme.colors.secondary[600],
                fontSize: theme.typography.fontSize.sm,
                paddingLeft: theme.spacing[5]
              }}>
                <li>Firebase Security Rules protect your data</li>
                <li>SOC 2 Type II compliant infrastructure</li>
                <li>Regular security audits and penetration testing</li>
              </ul>
            </Card>

            <Card variant="glass" padding="lg">
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: theme.borderRadius.xl,
                background: theme.gradients.info,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: theme.spacing[4],
                color: 'white'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.secondary[900],
                marginBottom: theme.spacing[3]
              }}>
                Secure Authentication
              </h3>
              <p style={{
                color: theme.colors.secondary[600],
                lineHeight: theme.typography.lineHeight.relaxed,
                marginBottom: theme.spacing[3]
              }}>
                Multi-factor authentication, secure password requirements, and session management ensure only authorized users access your forms and data.
              </p>
              <ul style={{
                color: theme.colors.secondary[600],
                fontSize: theme.typography.fontSize.sm,
                paddingLeft: theme.spacing[5]
              }}>
                <li>Firebase Authentication (Google's enterprise auth)</li>
                <li>Automatic session timeout and management</li>
                <li>GDPR and CCPA compliant data handling</li>
              </ul>
            </Card>
          </Layout.Grid>

          <div style={{ 
            textAlign: 'center', 
            marginTop: theme.spacing[12],
            padding: theme.spacing[6],
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: theme.borderRadius.xl,
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.secondary[700],
              margin: 0,
              fontWeight: theme.typography.fontWeight.medium
            }}>
              <strong>Bank-Level Security</strong> • <strong>SOC 2 Type II Infrastructure</strong> • <strong>99.9% Uptime</strong>
            </p>
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
              Complete Business Form Workflow
            </h2>
            <p style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.secondary[600],
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              The only platform you need for secure business forms. Create professional forms, share them with clients, collect responses automatically, and generate branded PDFs. Trusted by professionals handling sensitive documents.
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
                onClick={() => setShowTemplates(true)}
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

      {/* Templates Modal */}
      {showTemplates && (
        <Templates 
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* User Dashboard Modal */}
      {showUserDashboard && (
        <UserDashboard onClose={() => setShowUserDashboard(false)} />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <Auth onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />
      )}
    </Layout>
  );
};

export default HomePage;
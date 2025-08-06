import React, { useState, useEffect } from 'react';
import { Download, Save, Eye, Settings, Share2, BarChart3 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
import PlanLimits from './components/PlanLimits';
import PricingModal from './components/PricingModal';
import Templates from './components/Templates';
import ShareFormModal from './components/ShareFormModal';
import SubmissionsDashboard from './components/SubmissionsDashboard';
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import ModernFormBuilder from './components/form/ModernFormBuilder';
import { 
  AdvancedTextArea,
  AdvancedDatePicker,
  AdvancedFileUpload,
  AdvancedRating,
  AdvancedSignature,
  AdvancedMultiSelect,
  AdvancedNumberInput
} from './components/form/AdvancedFieldTypes';
import { theme } from './styles/theme';
import jsPDF from 'jspdf';
import rateLimitService from './services/rateLimitService';
import { 
  saveFormTemplate, 
  getUserFormTemplates, 
  deleteFormTemplate,
  publishForm as publishFormToDb,
  getPublishedForm,
  submitFormResponse,
  getFormSubmissions,
  checkPlanLimits,
  trackPDFGeneration
} from './services/formService';

const FormBuilderApp = () => {
  const { currentUser } = useAuth();
  const [currentView, setCurrentView] = useState('builder'); // builder, preview, settings
  const [formFields, setFormFields] = useState([
    { id: 1, type: 'text', label: 'Full Name', required: true },
    { id: 2, type: 'email', label: 'Email Address', required: true }
  ]);
  const [formData, setFormData] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  const [templateKey, setTemplateKey] = useState(Date.now());


  // Check for template from landing pages on component mount
  useEffect(() => {
    const selectedTemplate = sessionStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);
        if (template && template.fields) {
          const formFields = template.fields.map((field, index) => ({
            ...field,
            id: Date.now() + index,
          }));
          
          setFormFields(formFields);
          setFormData({});
          setTemplateKey(Date.now()); // Force re-render
          sessionStorage.removeItem('selectedTemplate');
          
          setTimeout(() => {
            alert(`✅ Template "${template.name}" loaded successfully! Start filling out the form to generate your professional PDF.`);
          }, 500);
        }
      } catch (error) {
        console.error('Error loading template from landing page:', error);
        sessionStorage.removeItem('selectedTemplate');
      }
    }
  }, []);

  const handleFieldsChange = (newFields) => {
    setFormFields(newFields);
    // Clear form data for removed fields
    const fieldIds = new Set(newFields.map(f => f.id));
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => fieldIds.has(parseInt(key)))
    );
    setFormData(cleanedFormData);
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderFormField = (field) => {
    const value = formData[field.id];
    const error = field.required && !value;

    const commonProps = {
      field,
      value,
      onChange: (val) => handleInputChange(field.id, val),
      error
    };

    switch (field.type) {
      case 'textarea':
        return <AdvancedTextArea {...commonProps} />;
      case 'date':
      case 'time':
        return <AdvancedDatePicker {...commonProps} />;
      case 'file':
        return <AdvancedFileUpload {...commonProps} />;
      case 'rating':
        return <AdvancedRating {...commonProps} />;
      case 'signature':
        return <AdvancedSignature {...commonProps} />;
      case 'multiselect':
        return <AdvancedMultiSelect {...commonProps} />;
      case 'number':
        return <AdvancedNumberInput {...commonProps} />;
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={{
              width: '100%',
              padding: theme.spacing[3],
              border: error ? `2px solid ${theme.colors.error[500]}` : `2px solid ${theme.colors.secondary[200]}`,
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.typography.fontSize.base,
              outline: 'none'
            }}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ color: theme.colors.secondary[600] }}>
              {field.placeholder || 'Check if applicable'}
            </span>
          </label>
        );
      default:
        return (
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={{
              width: '100%',
              padding: theme.spacing[3],
              border: error ? `2px solid ${theme.colors.error[500]}` : `2px solid ${theme.colors.secondary[200]}`,
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.typography.fontSize.base,
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary[500];
              e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary[500]}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? theme.colors.error[500] : theme.colors.secondary[200];
              e.target.style.boxShadow = 'none';
            }}
          />
        );
    }
  };

  const generatePDF = async () => {
    // Check rate limiting
    const rateLimitCheck = rateLimitService.checkAndRecord('pdf_generation', currentUser?.uid || 'anonymous');
    if (!rateLimitCheck.allowed) {
      const remaining = rateLimitService.getTimeUntilReset('pdf_generation', currentUser?.uid || 'anonymous');
      const timeStr = rateLimitService.formatTimeRemaining(remaining);
      alert(`❌ ${rateLimitCheck.message}\n\nYou can try again in ${timeStr}.`);
      return;
    }

    // Validate required fields
    const missingFields = formFields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      alert(`❌ Please fill in the following required fields:\n\n${missingFields.join('\n')}`);
      return;
    }
    
    if (!currentUser) {
      alert('❌ Please sign in to generate PDFs');
      return;
    }
    
    const canGeneratePDF = await checkPlanLimits(currentUser.uid, 'generate_pdf');
    if (!canGeneratePDF) {
      alert('❌ You have reached your monthly PDF generation limit. Please upgrade to generate more PDFs.');
      setShowPricingModal(true);
      return;
    }
    
    setIsGeneratingPDF(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let currentY = 30;
      
      // Process form fields
      formFields.forEach((field) => {
        if (currentY > 250) {
          pdf.addPage();
          currentY = 30;
        }
        
        // Handle layout fields (headings, paragraphs, dividers)
        if (field.type === 'heading1') {
          pdf.setFontSize(20);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(51, 51, 51);
          const lines = pdf.splitTextToSize(field.content || 'Heading', pageWidth - (margin * 2));
          lines.forEach(line => {
            pdf.text(line, margin, currentY);
            currentY += 10;
          });
          currentY += 10;
        } else if (field.type === 'heading2') {
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(51, 51, 51);
          const lines = pdf.splitTextToSize(field.content || 'Subheading', pageWidth - (margin * 2));
          lines.forEach(line => {
            pdf.text(line, margin, currentY);
            currentY += 8;
          });
          currentY += 8;
        } else if (field.type === 'paragraph') {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(102, 102, 102);
          const lines = pdf.splitTextToSize(field.content || '', pageWidth - (margin * 2));
          lines.forEach(line => {
            pdf.text(line, margin, currentY);
            currentY += 6;
          });
          currentY += 6;
        } else if (field.type === 'divider') {
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, currentY, pageWidth - margin, currentY);
          currentY += 10;
        } else if (field.label) {
          // Regular form fields
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(51, 51, 51);
          pdf.text(`${field.label}:`, margin, currentY);
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(102, 102, 102);
          let value = formData[field.id] || '(Not provided)';
          
          if (field.type === 'checkbox') {
            value = value ? '✓ Yes' : '✗ No';
          } else if (field.type === 'rating') {
            value = value ? `${'★'.repeat(value)}${'☆'.repeat(5-value)} (${value}/5)` : '(Not rated)';
          } else if (field.type === 'signature') {
            value = value ? '✍ Signed' : '(No signature)';
          }
          
          const valueText = String(value).substring(0, 60);
          pdf.text(valueText, margin, currentY + 12);
          
          currentY += 25;
        }
      });
      
      // Minimal footer with just date
      const footerY = pdf.internal.pageSize.getHeight() - 15;
      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 180);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, footerY, { align: 'center' });
      
      const fileName = `form-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      await trackPDFGeneration(currentUser.uid);
      setStatsRefreshTrigger(prev => prev + 1);
      
      alert('✅ Professional PDF generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('❌ Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSelectTemplate = (templateFields, templateName) => {
    // Ensure all fields have unique IDs and clear existing data
    const fieldsWithUniqueIds = templateFields.map((field, index) => ({
      ...field,
      id: Date.now() + index // Generate unique IDs
    }));
    
    setFormFields(fieldsWithUniqueIds);
    setFormData({}); // Clear all form data
    setTemplateKey(Date.now()); // Force re-render
    setCurrentView('builder'); // Switch to builder view to see the change
    alert(`✅ Template "${templateName}" loaded successfully!`);
  };

  const handlePublishForm = async (formInfo) => {
    // Check rate limiting
    const rateLimitCheck = rateLimitService.checkAndRecord('form_creation', currentUser?.uid);
    if (!rateLimitCheck.allowed) {
      const remaining = rateLimitService.getTimeUntilReset('form_creation', currentUser?.uid);
      const timeStr = rateLimitService.formatTimeRemaining(remaining);
      alert(`❌ ${rateLimitCheck.message}\n\nYou can try again in ${timeStr}.`);
      return { success: false };
    }

    setIsPublishing(true);

    try {
      if (formFields.length === 0) {
        alert('❌ Please add at least one field to your form before publishing');
        return { success: false };
      }

      const result = await publishFormToDb(currentUser.uid, {
        title: formInfo.title,
        description: formInfo.description,
        fields: formFields
      });

      if (result.success) {
        setStatsRefreshTrigger(prev => prev + 1);
        return result;
      } else {
        alert(`❌ Error publishing form: ${result.error}`);
        return { success: false };
      }
    } catch (error) {
      console.error('Error publishing form:', error);
      alert('❌ Error publishing form. Please try again.');
      return { success: false };
    } finally {
      setIsPublishing(false);
    }
  };

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <Layout>
      <Header
        title="FormForge"
        subtitle="Create, share, and collect form responses • Generate professional PDFs"
        showHomeButton={true}
        onHome={() => window.location.href = '/'}
        user={currentUser}
        onUserClick={() => setShowUserDashboard(true)}
        rightContent={
          <Layout.Flex gap={2}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<BarChart3 size={16} />}
              onClick={() => setShowSubmissions(true)}
            >
              View Submissions
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Settings size={16} />}
              onClick={() => setShowTemplates(true)}
            >
              Templates
            </Button>
          </Layout.Flex>
        }
      />

      <Layout.Section padding="sm">
        <div style={{ width: '100%', maxWidth: '100%', padding: '0 20px' }}>
          <PlanLimits onUpgrade={() => setShowPricingModal(true)} refreshTrigger={statsRefreshTrigger} />

          {/* Form Builder with integrated preview toggle */}
          <div style={{ marginBottom: theme.spacing[6] }}>
            <Layout.Flex justify="space-between" align="center" style={{ marginBottom: theme.spacing[6] }}>
              <Layout.Flex gap={2} align="center">
                <Button
                  variant={currentView === 'builder' ? 'primary' : 'secondary'}
                  size="md"
                  onClick={() => setCurrentView('builder')}
                >
                  Builder
                </Button>
                <Button
                  variant={currentView === 'preview' ? 'primary' : 'secondary'}
                  size="md"
                  leftIcon={<Eye size={16} />}
                  onClick={() => setCurrentView('preview')}
                >
                  Preview & Test
                </Button>
              </Layout.Flex>

              <div style={{ 
                textAlign: 'center',
                flex: '1',
                paddingLeft: theme.spacing[8],
                paddingRight: theme.spacing[8]
              }}>
                <h2 style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary[900],
                  margin: 0,
                  marginBottom: theme.spacing[1]
                }}>
                  Form Builder
                </h2>
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[600],
                  margin: 0
                }}>
                  {currentView === 'builder' ? 'Design your form with advanced field types' : 'Preview and test your form'}
                </p>
              </div>
              
              <Layout.Flex gap={2} align="center">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Share2 size={16} />}
                  onClick={() => setShowShareModal(true)}
                  disabled={formFields.length === 0}
                >
                  Share Form
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Download size={16} />}
                  onClick={generatePDF}
                  disabled={isGeneratingPDF || formFields.length === 0}
                  loading={isGeneratingPDF}
                >
                  {isGeneratingPDF ? 'Generating...' : 'Generate PDF'}
                </Button>
              </Layout.Flex>
            </Layout.Flex>
          </div>

          {currentView === 'builder' && (
            <ModernFormBuilder
              key={templateKey}
              onFieldsChange={handleFieldsChange}
              initialFields={formFields}
            />
          )}

          {currentView === 'preview' && (
            <>
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: `1px solid ${theme.colors.secondary[200]}`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing[4],
                marginBottom: theme.spacing[6],
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[600],
                  margin: 0
                }}>
                  💡 <strong>Tip:</strong> Fill out the form below to test it before sharing
                </p>
              </div>
              
              <Layout.Grid cols={2} gap={8}>
                <Card variant="glass" padding="lg">
                  <Card.Header>
                    <Card.Title style={{ color: theme.colors.secondary[900] }}>Form Preview</Card.Title>
                    <Card.Subtitle style={{ color: theme.colors.secondary[600] }}>
                      This shows how your shared form will look
                    </Card.Subtitle>
                  </Card.Header>

                  <Card.Content>
                  {formFields.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: theme.spacing[8], color: theme.colors.secondary[500] }}>
                      No fields added yet. Go to Builder to add fields.
                    </div>
                  ) : (
                    <div style={{
                      padding: '24px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
                        {formFields.map(field => (
                          <div key={field.id}>
                            <label style={{
                              display: 'block',
                              fontSize: theme.typography.fontSize.sm,
                              fontWeight: theme.typography.fontWeight.medium,
                              color: theme.colors.secondary[700],
                              marginBottom: theme.spacing[2]
                            }}>
                              {field.label}
                              {field.required && (
                                <span style={{ color: theme.colors.error[500], marginLeft: theme.spacing[1] }}>*</span>
                              )}
                            </label>
                            {renderFormField(field)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Content>

              </Card>

              <Card variant="glass" padding="lg">
                <Card.Header>
                  <Card.Title style={{ color: theme.colors.secondary[900] }}>PDF Preview</Card.Title>
                  <Card.Subtitle style={{ color: theme.colors.secondary[600] }}>
                    How your PDF will look
                  </Card.Subtitle>
                </Card.Header>

                <Card.Content>
                  <div style={{
                    border: `1px solid ${theme.colors.secondary[200]}`,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing[6],
                    background: 'white',
                    minHeight: '400px'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: theme.spacing[6] }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: theme.typography.fontSize.xl,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.secondary[900],
                        marginBottom: theme.spacing[2]
                      }}>
                        Form Submission
                      </h3>
                      <p style={{ 
                        color: theme.colors.secondary[600], 
                        margin: 0,
                        fontSize: theme.typography.fontSize.sm 
                      }}>
                        Generated on {new Date().toLocaleDateString()}
                      </p>
                      <div style={{
                        height: '1px',
                        background: theme.colors.secondary[200],
                        marginTop: theme.spacing[4],
                        marginBottom: theme.spacing[4]
                      }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
                      {formFields.map(field => (
                        <div key={field.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          paddingBottom: theme.spacing[2],
                          borderBottom: `1px solid ${theme.colors.secondary[200]}`
                        }}>
                          <span style={{
                            fontWeight: theme.typography.fontWeight.medium,
                            color: theme.colors.secondary[900]
                          }}>
                            {field.label}:
                          </span>
                          <span style={{ color: theme.colors.secondary[600] }}>
                            {formData[field.id] || '(Not filled)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Content>
              </Card>
              </Layout.Grid>
            </>
          )}
        </div>
      </Layout.Section>

      {/* Modals */}
      {showUserDashboard && (
        <UserDashboard onClose={() => setShowUserDashboard(false)} />
      )}
      
      {showPricingModal && (
        <PricingModal 
          onClose={() => setShowPricingModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
      
      {showTemplates && (
        <Templates 
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showShareModal && (
        <ShareFormModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onPublish={handlePublishForm}
          isPublishing={isPublishing}
        />
      )}

      {showSubmissions && (
        <SubmissionsDashboard onClose={() => setShowSubmissions(false)} />
      )}
    </Layout>
  );
};

export default FormBuilderApp;
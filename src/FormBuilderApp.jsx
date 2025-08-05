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
import EnhancedFormBuilder from './components/form/EnhancedFormBuilder';
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
      let currentY = 40;

      // Professional header
      pdf.setFillColor(255, 107, 53);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Professional Form Submission', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      currentY = 60;
      
      // Date
      pdf.setFontSize(12);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY);
      currentY += 25;
      
      // Form fields
      formFields.forEach((field) => {
        if (currentY > 250) {
          pdf.addPage();
          currentY = 30;
        }
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${field.label}:`, margin, currentY);
        
        pdf.setFont('helvetica', 'normal');
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
      });
      
      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 20;
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by FormForge • Professional Forms Platform', pageWidth / 2, footerY, { align: 'center' });
      
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
    setFormFields(templateFields);
    setFormData({});
    alert(`✅ Template "${templateName}" loaded successfully!`);
  };

  const handlePublishForm = async (formInfo) => {
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
        title="FormForge Builder"
        subtitle="Create professional forms and generate beautiful PDFs"
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

      <Layout.Section padding="lg">
        <Layout.Container>
          <PlanLimits onUpgrade={() => setShowPricingModal(true)} refreshTrigger={statsRefreshTrigger} />
          
          {formFields.length > 0 && currentView === 'preview' && (
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
                💡 <strong>Tip:</strong> Use "Share Form" to collect responses from others, or "View Submissions" to see collected data
              </p>
            </div>
          )}

          {/* Form Builder with integrated preview toggle */}
          <div style={{ marginBottom: theme.spacing[6] }}>
            <Layout.Flex justify="space-between" align="center" style={{ marginBottom: theme.spacing[6] }}>
              <div>
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
                  fontSize: theme.typography.fontSize.base,
                  color: theme.colors.secondary[600],
                  margin: 0
                }}>
                  {currentView === 'builder' ? 'Design your form with advanced field types' : 'Preview and test your form'}
                </p>
              </div>
              
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
                
                {formFields.length > 0 && (
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon={<Share2 size={16} />}
                    onClick={() => setShowShareModal(true)}
                  >
                    Share Form
                  </Button>
                )}
              </Layout.Flex>
            </Layout.Flex>
          </div>

          {currentView === 'builder' && (
            <EnhancedFormBuilder
              onFieldsChange={handleFieldsChange}
              initialFields={formFields}
            />
          )}

          {currentView === 'preview' && (
            <Layout.Grid cols={2} gap={8}>
              <Card variant="glass" padding="lg">
                <Card.Header>
                  <Card.Title style={{ color: theme.colors.secondary[900] }}>Form Preview</Card.Title>
                  <Card.Subtitle style={{ color: theme.colors.secondary[600] }}>
                    Fill out your form to see how it works
                  </Card.Subtitle>
                </Card.Header>

                <Card.Content>
                  {formFields.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: theme.spacing[8], color: theme.colors.secondary[500] }}>
                      No fields added yet. Go to Builder to add fields.
                    </div>
                  ) : (
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
                  )}
                </Card.Content>

                {formFields.length > 0 && (
                  <Card.Footer>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="primary"
                        size="md"
                        leftIcon={<Download size={16} />}
                        onClick={generatePDF}
                        disabled={isGeneratingPDF}
                        loading={isGeneratingPDF}
                      >
                        {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}
                      </Button>
                    </div>
                  </Card.Footer>
                )}
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
                      <div style={{
                        background: theme.colors.primary[500],
                        color: 'white',
                        padding: theme.spacing[4],
                        borderRadius: theme.borderRadius.md,
                        marginBottom: theme.spacing[4]
                      }}>
                        <h3 style={{ margin: 0, fontSize: theme.typography.fontSize.lg }}>
                          Professional Form Submission
                        </h3>
                      </div>
                      <p style={{ color: theme.colors.secondary[600], margin: 0 }}>
                        Generated: {new Date().toLocaleDateString()}
                      </p>
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
          )}
        </Layout.Container>
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
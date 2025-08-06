import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import rateLimitService from '../services/rateLimitService';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getPublishedForm, submitFormResponse } from '../services/formService';
import { 
  AdvancedTextArea,
  AdvancedDatePicker,
  AdvancedFileUpload,
  AdvancedRating,
  AdvancedSignature,
  AdvancedMultiSelect,
  AdvancedNumberInput
} from '../components/form/AdvancedFieldTypes';
import { theme } from '../styles/theme';
import { getThemeById, generateThemeCSS } from '../styles/formThemes';

const PublicFormPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formTheme, setFormTheme] = useState(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const result = await getPublishedForm(formId);
        if (result.success) {
          setForm(result.form);
          // Set the theme from the form data
          const selectedTheme = result.form.theme || result.form.settings?.theme || 'modern';
          setFormTheme(getThemeById(selectedTheme));
          
          // Initialize form data with empty values
          const initialData = {};
          result.form.fields.forEach(field => {
            initialData[field.id] = '';
          });
          setFormData(initialData);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  // Inject theme CSS into the page
  useEffect(() => {
    if (formTheme) {
      const styleId = 'form-theme-styles';
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = generateThemeCSS(formTheme.id);
      
      return () => {
        // Cleanup on unmount
        const element = document.getElementById(styleId);
        if (element) {
          element.remove();
        }
      };
    }
  }, [formTheme]);

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check rate limiting (use formId as identifier for per-form limiting)
    const rateLimitCheck = rateLimitService.checkAndRecord('form_submission', formId);
    if (!rateLimitCheck.allowed) {
      const remaining = rateLimitService.getTimeUntilReset('form_submission', formId);
      const timeStr = rateLimitService.formatTimeRemaining(remaining);
      alert(`❌ ${rateLimitCheck.message}\n\nYou can try again in ${timeStr}.`);
      return;
    }

    setSubmitting(true);

    try {
      // Validate required fields
      const missingFields = form.fields
        .filter(field => field.required && !formData[field.id])
        .map(field => field.label);
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields:\n\n${missingFields.join('\n')}`);
        setSubmitting(false);
        return;
      }

      const result = await submitFormResponse(formId, formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        alert(`Error submitting form: ${result.error}`);
      }
    } catch (err) {
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormField = (field) => {
    const value = formData[field.id];
    const error = field.required && !value;
    const themeStyles = formTheme?.styles || {};

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
            style={themeStyles.select || {
              width: '100%',
              padding: theme.spacing[3],
              border: error ? `2px solid ${theme.colors.error[500]}` : `2px solid ${theme.colors.secondary[200]}`,
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.typography.fontSize.base,
              outline: 'none'
            }}
            className="form-select"
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
            {field.options?.map((option, index) => (
              <label key={index} style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <input
                  type="radio"
                  name={`field_${field.id}`}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
                <span style={{ color: theme.colors.secondary[700] }}>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              style={themeStyles.checkbox || { width: '20px', height: '20px' }}
              className="form-checkbox"
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
            style={themeStyles.input || {
              width: '100%',
              padding: theme.spacing[3],
              border: error ? `2px solid ${theme.colors.error[500]}` : `2px solid ${theme.colors.secondary[200]}`,
              borderRadius: theme.borderRadius.lg,
              fontSize: theme.typography.fontSize.base,
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            className="form-input"
          />
        );
    }
  };

  if (loading) {
    return (
      <Layout>
        <Layout.Section padding="lg">
          <Layout.Container size="sm">
            <div style={{ textAlign: 'center', padding: theme.spacing[16] }}>
              <div style={{ 
                fontSize: theme.typography.fontSize.lg, 
                color: theme.colors.secondary[600] 
              }}>
                Loading form...
              </div>
            </div>
          </Layout.Container>
        </Layout.Section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Layout.Section padding="lg">
          <Layout.Container size="sm">
            <Card variant="base" padding="lg">
              <div style={{ textAlign: 'center', padding: theme.spacing[8] }}>
                <AlertCircle size={48} style={{ 
                  color: theme.colors.error[500], 
                  marginBottom: theme.spacing[4] 
                }} />
                <h2 style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary[900],
                  marginBottom: theme.spacing[2]
                }}>
                  Form Not Found
                </h2>
                <p style={{
                  color: theme.colors.secondary[600],
                  fontSize: theme.typography.fontSize.base
                }}>
                  {error}
                </p>
              </div>
            </Card>
          </Layout.Container>
        </Layout.Section>
      </Layout>
    );
  }

  if (submitted) {
    return (
      <Layout>
        <Layout.Section padding="lg">
          <Layout.Container size="sm">
            <Card variant="base" padding="lg">
              <div style={{ textAlign: 'center', padding: theme.spacing[8] }}>
                <CheckCircle size={48} style={{ 
                  color: theme.colors.success[500], 
                  marginBottom: theme.spacing[4] 
                }} />
                <h2 style={{
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.secondary[900],
                  marginBottom: theme.spacing[2]
                }}>
                  Thank You!
                </h2>
                <p style={{
                  color: theme.colors.secondary[600],
                  fontSize: theme.typography.fontSize.base
                }}>
                  Your response has been submitted successfully.
                </p>
                <div style={{ marginTop: theme.spacing[6] }}>
                  <p style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.secondary[500],
                    textAlign: 'center'
                  }}>
                    Powered by FormForge
                  </p>
                </div>
              </div>
            </Card>
          </Layout.Container>
        </Layout.Section>
      </Layout>
    );
  }

  const themeStyles = formTheme?.styles || {};

  return (
    <Layout>
      <Layout.Section padding="lg" style={{ 
        minHeight: '100vh',
        background: formTheme?.id === 'dark' ? '#0f0f1a' : 
                   formTheme?.id === 'glass' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                   'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Layout.Container size="sm">
          <div 
            style={{
              ...(themeStyles.container || {}),
              margin: '40px auto',
              maxWidth: '600px'
            }}
          >
            <div>
              <h1 style={themeStyles.title || { fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                {form.title}
              </h1>
              {form.description && (
                <p style={themeStyles.description || { fontSize: '16px', color: '#6B7280', marginBottom: '32px' }}>
                  {form.description}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {form.fields.map(field => (
                  <div key={field.id} className="field-wrapper" style={themeStyles.fieldWrapper}>
                    <label style={themeStyles.label}>
                      {field.label}
                      {field.required && (
                        <span style={{ color: themeStyles.error?.color || '#ef4444', marginLeft: '4px' }}>*</span>
                      )}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: '32px', 
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <button
                  type="submit"
                  className="submit-button"
                  style={{
                    ...themeStyles.submitButton,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Form'}
                </button>
              </div>
            </form>

            <div style={{ 
              marginTop: '32px', 
              textAlign: 'center',
              borderTop: formTheme?.id === 'minimal' ? '1px solid #000' : '1px solid rgba(0, 0, 0, 0.1)',
              paddingTop: '16px'
            }}>
              <p style={{
                fontSize: '12px',
                color: formTheme?.id === 'dark' ? '#6b6b80' : '#9ca3af'
              }}>
                Powered by <strong>FormForge</strong>
              </p>
            </div>
          </div>
        </Layout.Container>
      </Layout.Section>
    </Layout>
  );
};

export default PublicFormPage;
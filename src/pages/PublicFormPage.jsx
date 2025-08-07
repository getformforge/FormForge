import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import rateLimitService from '../services/rateLimitService';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getPublishedForm, submitFormResponse } from '../services/formService';
import { evaluateFieldConditions, getVisibleFields } from '../utils/conditionalLogicEvaluator';
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

const PublicFormPage = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const result = await getPublishedForm(formId);
        if (result.success) {
          setForm(result.form);
          
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


  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Force re-render to update conditional logic visibility
    setForm(prevForm => ({ ...prevForm }));
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

  // Group fields into rows based on the saved row structure or field metadata
  const getFieldRows = () => {
    if (!form?.fields || form.fields.length === 0) return [];
    
    // If form has rowsStructure, use that
    if (form?.rowsStructure && form.rowsStructure.length > 0) {
      return form.rowsStructure.map(row => {
        // Apply conditional logic to filter visible fields
        const visibleFields = (row.fields || []).filter(field => 
          evaluateFieldConditions(field, formData, form.fields)
        );
        
        return {
          ...row,
          fields: visibleFields,
          columns: row.columns || 1
        };
      });
    }
    
    // Otherwise, build rows from field metadata
    const rows = [];
    const rowMap = new Map();
    
    // Filter visible fields based on conditional logic
    const visibleFields = form.fields.filter(field => 
      evaluateFieldConditions(field, formData, form.fields)
    );
    
    visibleFields.forEach(field => {
      if (field.rowId && field.columns) {
        // Field has row information
        if (!rowMap.has(field.rowId)) {
          const newRow = { id: field.rowId, fields: [], columns: field.columns };
          rowMap.set(field.rowId, newRow);
          rows.push(newRow);
        }
        rowMap.get(field.rowId).fields.push(field);
      } else {
        // No row info, create single column row
        rows.push({ 
          id: Date.now() + Math.random(), 
          fields: [field], 
          columns: 1 
        });
      }
    });
    
    return rows;
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
              padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
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
              style={{ width: '20px', height: '20px' }}
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
            style={{
              width: '100%',
              padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
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

  return (
    <Layout>
      <Layout.Section padding="lg" style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '900px', 
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <Card variant="glass" padding="xl" style={{
            margin: '40px auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
          }}>
            {/* Form Header with PDF Settings */}
            <div style={{ 
              marginBottom: theme.spacing[8],
              paddingBottom: theme.spacing[6],
              borderBottom: `2px solid ${theme.colors.secondary[200]}`
            }}>
              {/* Logo if present */}
              {form.settings?.logo && (
                <div style={{ 
                  textAlign: form.settings.logoPosition || 'left',
                  marginBottom: theme.spacing[4]
                }}>
                  <img 
                    src={form.settings.logo} 
                    alt="Logo" 
                    style={{ 
                      height: '60px',
                      display: form.settings.logoPosition === 'center' ? 'inline-block' : 'block',
                      marginLeft: form.settings.logoPosition === 'right' ? 'auto' : form.settings.logoPosition === 'center' ? 'auto' : '0',
                      marginRight: form.settings.logoPosition === 'center' ? 'auto' : '0'
                    }} 
                  />
                </div>
              )}
              
              {/* Main Header */}
              {(form.settings?.pdfHeader || form.title) && (
                <h1 style={{ 
                  fontSize: `${parseInt(form.settings?.headerFontSize) * 1.8 || 36}px`, 
                  fontWeight: theme.typography.fontWeight.bold, 
                  color: form.settings?.headerColor || theme.colors.secondary[900], 
                  marginBottom: theme.spacing[3],
                  textAlign: form.settings?.headerAlignment || 'center'
                }}>
                  {form.settings?.pdfHeader || form.title}
                </h1>
              )}
              
              {/* Subheader */}
              {(form.settings?.pdfSubheader || form.description) && (
                <p style={{ 
                  fontSize: `${parseInt(form.settings?.subheaderFontSize) * 1.3 || 18}px`, 
                  color: theme.colors.secondary[600], 
                  textAlign: form.settings?.headerAlignment || 'center',
                  maxWidth: '600px',
                  margin: form.settings?.headerAlignment === 'center' ? '0 auto' : '0',
                  marginBottom: theme.spacing[2]
                }}>
                  {form.settings?.pdfSubheader || form.description}
                </p>
              )}
              
              {/* Date if enabled */}
              {form.settings?.showDate !== false && (
                <p style={{ 
                  fontSize: theme.typography.fontSize.sm, 
                  color: theme.colors.secondary[500], 
                  textAlign: form.settings?.headerAlignment || 'center',
                  marginTop: theme.spacing[2]
                }}>
                  Date: {form.settings?.pdfDate ? new Date(form.settings.pdfDate).toLocaleDateString() : new Date().toLocaleDateString()}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
                {getFieldRows().map((row, rowIndex) => (
                  <div key={rowIndex} style={{ 
                    display: 'grid',
                    gridTemplateColumns: row.columns === 1 ? '1fr' : row.columns === 2 ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
                    gap: theme.spacing[6]
                  }}>
                    {(row.fields || []).map(field => {
                      
                      // Handle layout fields
                      if (field.type === 'heading1') {
                        return (
                          <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                            <h2 style={{ 
                              fontSize: '32px', 
                              fontWeight: theme.typography.fontWeight.bold, 
                              color: theme.colors.secondary[900], 
                              margin: `${theme.spacing[4]} 0 ${theme.spacing[4]} 0`,
                              paddingTop: theme.spacing[4]
                            }}>
                              {field.content || 'Main Heading'}
                            </h2>
                          </div>
                        );
                      }
                      if (field.type === 'heading2') {
                        return (
                          <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                            <h3 style={{ 
                              fontSize: '24px', 
                              fontWeight: theme.typography.fontWeight.semibold, 
                              color: theme.colors.secondary[800], 
                              margin: `${theme.spacing[3]} 0 ${theme.spacing[3]} 0` 
                            }}>
                              {field.content || 'Sub Heading'}
                            </h3>
                          </div>
                        );
                      }
                      if (field.type === 'paragraph') {
                        return (
                          <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                            <p style={{ 
                              fontSize: theme.typography.fontSize.base, 
                              color: theme.colors.secondary[600], 
                              margin: `0 0 ${theme.spacing[4]} 0`, 
                              lineHeight: '1.7' 
                            }}>
                              {field.content || 'Paragraph text...'}
                            </p>
                          </div>
                        );
                      }
                      if (field.type === 'divider') {
                        return (
                          <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                            <hr style={{ 
                              border: 'none', 
                              borderTop: `2px solid ${theme.colors.secondary[200]}`, 
                              margin: `${theme.spacing[6]} 0` 
                            }} />
                          </div>
                        );
                      }
                      
                      // Regular form fields
                      return (
                        <div key={field.id} style={{ width: '100%' }}>
                          <label style={{
                            display: 'block',
                            fontSize: theme.typography.fontSize.base,
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
                      );
                    })}
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: theme.spacing[8], 
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  leftIcon={!submitting && <Send size={18} />}
                  disabled={submitting}
                  loading={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Form'}
                </Button>
              </div>
            </form>

            <div style={{ 
              marginTop: theme.spacing[8], 
              textAlign: 'center',
              borderTop: `1px solid ${theme.colors.secondary[200]}`,
              paddingTop: theme.spacing[4]
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.secondary[500]
              }}>
                Powered by <strong>FormForge</strong>
              </p>
            </div>
          </Card>
        </div>
      </Layout.Section>
    </Layout>
  );
};

export default PublicFormPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <Layout.Section padding="lg">
        <Layout.Container size="sm">
          <Card variant="base" padding="lg">
            <Card.Header>
              <Card.Title>{form.title}</Card.Title>
              {form.description && (
                <Card.Subtitle>{form.description}</Card.Subtitle>
              )}
            </Card.Header>

            <Card.Content>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
                  {form.fields.map(field => (
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

                <div style={{ marginTop: theme.spacing[8] }}>
                  <Button
                    type="submit"
                    size="lg"
                    leftIcon={<Send size={20} />}
                    disabled={submitting}
                    loading={submitting}
                    style={{ width: '100%' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Form'}
                  </Button>
                </div>
              </form>
            </Card.Content>

            <div style={{ 
              marginTop: theme.spacing[6], 
              textAlign: 'center',
              borderTop: `1px solid ${theme.colors.secondary[200]}`,
              paddingTop: theme.spacing[4]
            }}>
              <p style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.secondary[400]
              }}>
                Powered by <strong>FormForge</strong>
              </p>
            </div>
          </Card>
        </Layout.Container>
      </Layout.Section>
    </Layout>
  );
};

export default PublicFormPage;
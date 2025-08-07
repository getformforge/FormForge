import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Download, Calendar, Users, X, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Card from './ui/Card';
import Layout from './layout/Layout';
import { getFormSubmissions, getUserForms } from '../services/formService';
import { theme } from '../styles/theme';
import jsPDF from 'jspdf';
import { evaluateFieldConditions, getVisibleFields } from '../utils/conditionalLogicEvaluator';

const SubmissionsDashboard = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;

      try {
        // Load user's forms and all submissions
        const [formsResult, submissionsResult] = await Promise.all([
          getUserForms(currentUser.uid),
          getFormSubmissions(currentUser.uid)
        ]);

        console.log('Forms result:', formsResult);
        console.log('Submissions result:', submissionsResult);

        if (formsResult.success) {
          setForms(formsResult.forms);
          console.log('Loaded forms:', formsResult.forms);
        }

        if (submissionsResult.success) {
          setSubmissions(submissionsResult.submissions);
          console.log('Loaded submissions:', submissionsResult.submissions);
        } else {
          console.error('Failed to load submissions:', submissionsResult.error);
        }
      } catch (error) {
        console.error('Error loading submissions data:', error);
        alert('Error loading submissions. Check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  const filteredSubmissions = selectedForm 
    ? submissions.filter(sub => sub.formId === selectedForm.id)
    : submissions;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const exportSubmissions = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      encodeURIComponent(generateCSV(filteredSubmissions));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `submissions_${selectedForm?.title || 'all'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const generateCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = ['Submission Date', 'Form Title'];
    const allFields = new Set();
    
    // Collect all unique field names
    data.forEach(submission => {
      Object.keys(submission.responses || {}).forEach(fieldId => {
        // Find the field label from form fields
        const form = forms.find(f => f.id === submission.formId);
        const field = form?.fields?.find(f => f.id.toString() === fieldId);
        if (field) {
          allFields.add(field.label);
        } else {
          allFields.add(`Field ${fieldId}`);
        }
      });
    });
    
    headers.push(...Array.from(allFields));
    
    const rows = data.map(submission => {
      const form = forms.find(f => f.id === submission.formId);
      const row = [
        formatDate(submission.submittedAt),
        form?.title || 'Unknown Form'
      ];
      
      allFields.forEach(fieldLabel => {
        const field = form?.fields?.find(f => f.label === fieldLabel);
        const value = field ? submission.responses[field.id] : '';
        row.push(value || '');
      });
      
      return row;
    });
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
      padding: '20px'
    },
    modal: {
      background: '#ffffff',
      borderRadius: theme.borderRadius.xl,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: `1px solid ${theme.colors.secondary[200]}`,
      padding: theme.spacing[8],
      width: '100%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[6]
    },
    title: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.secondary[900],
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2]
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme.spacing[2],
      borderRadius: theme.borderRadius.md,
      color: theme.colors.secondary[500],
      transition: 'all 0.2s ease'
    },
    formSelect: {
      padding: theme.spacing[3],
      border: `2px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.fontSize.base,
      outline: 'none',
      minWidth: '200px'
    },
    submissionCard: {
      background: theme.colors.secondary[50],
      border: `1px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[3],
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    submissionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing[2]
    },
    submissionTitle: {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.secondary[900]
    },
    submissionDate: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.secondary[500]
    },
    emptyState: {
      textAlign: 'center',
      padding: theme.spacing[16],
      color: theme.colors.secondary[500]
    }
  };

  if (loading) {
    return (
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={{ textAlign: 'center', padding: theme.spacing[8] }}>
            Loading submissions...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <BarChart3 size={24} />
            Form Submissions
          </h2>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.secondary[100];
              e.target.style.color = theme.colors.secondary[700];
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = theme.colors.secondary[500];
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: theme.spacing[6] }}>
          <Layout.Flex justify="space-between" align="center" gap={4}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Filter by Form
              </label>
              <select
                style={styles.formSelect}
                value={selectedForm?.id || ''}
                onChange={(e) => {
                  const form = forms.find(f => f.id === e.target.value);
                  setSelectedForm(form || null);
                }}
              >
                <option value="">All Forms ({submissions.length})</option>
                {forms.map(form => {
                  const count = submissions.filter(sub => sub.formId === form.id).length;
                  return (
                    <option key={form.id} value={form.id}>
                      {form.title} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {filteredSubmissions.length > 0 && (
              <Button
                variant="secondary"
                leftIcon={<Download size={16} />}
                onClick={exportSubmissions}
              >
                Export CSV
              </Button>
            )}
          </Layout.Flex>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={48} style={{ marginBottom: theme.spacing[4], opacity: 0.5, color: theme.colors.secondary[400] }} />
            <div style={{ fontSize: theme.typography.fontSize.lg, marginBottom: theme.spacing[2], color: theme.colors.secondary[600] }}>
              No submissions yet
            </div>
            <div style={{ fontSize: theme.typography.fontSize.sm }}>
              Share your forms to start collecting responses
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: theme.spacing[4] }}>
              <h3 style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.secondary[900],
                margin: 0
              }}>
                {filteredSubmissions.length} Submission{filteredSubmissions.length !== 1 ? 's' : ''}
                {selectedForm && ` for "${selectedForm.title}"`}
              </h3>
            </div>

            {filteredSubmissions.map(submission => {
              const form = forms.find(f => f.id === submission.formId);
              return (
                <div
                  key={submission.id}
                  style={styles.submissionCard}
                  onClick={() => setSelectedSubmission(submission)}
                  onMouseEnter={(e) => {
                    e.target.style.background = theme.colors.secondary[100];
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = theme.colors.secondary[50];
                  }}
                >
                  <div style={styles.submissionHeader}>
                    <div style={styles.submissionTitle}>
                      {form?.title || 'Unknown Form'}
                    </div>
                    <div style={styles.submissionDate}>
                      <Calendar size={14} style={{ display: 'inline', marginRight: theme.spacing[1] }} />
                      {formatDate(submission.submittedAt)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.secondary[600]
                  }}>
                    {Object.keys(submission.responses || {}).length} field{Object.keys(submission.responses || {}).length !== 1 ? 's' : ''} submitted
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedSubmission && (
          <SubmissionDetailModal 
            submission={selectedSubmission}
            form={forms.find(f => f.id === selectedSubmission.formId)}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </div>
    </div>
  );
};

// Generate PDF from a submission
const generatePDFFromSubmission = (submission, form) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = 30;

  // Get custom PDF settings from sessionStorage
  const savedSettings = sessionStorage.getItem('formSettings');
  const formSettings = savedSettings ? JSON.parse(savedSettings) : null;
  
  // Add custom header if set, otherwise use form title
  if (formSettings?.pdfHeader) {
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 51, 51);
    pdf.text(formSettings.pdfHeader, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    
    if (formSettings.pdfSubheader) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(102, 102, 102);
      pdf.text(formSettings.pdfSubheader, pageWidth / 2, currentY, { align: 'center' });
      currentY += 8;
    }
    
    currentY += 10;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
  } else if (form?.title) {
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(51, 51, 51);
    pdf.text(form.title, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
  }
  
  pdf.setTextColor(0, 0, 0);
  
  // Submission info
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const submissionDate = submission.submittedAt?.toDate ? 
    submission.submittedAt.toDate() : new Date(submission.submittedAt);
  pdf.text(`Submitted: ${submissionDate.toLocaleString()}`, margin, currentY);
  currentY += 25;
  
  // Draw a line separator
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, currentY - 10, pageWidth - margin, currentY - 10);
  
  // Form fields and responses - apply conditional logic
  const visibleFields = form?.fields?.filter(field => 
    evaluateFieldConditions(field, submission.responses || {}, form.fields)
  ) || [];
  
  visibleFields.forEach((field) => {
    if (currentY > 250) {
      pdf.addPage();
      currentY = 30;
    }
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${field.label}:`, margin, currentY);
    
    pdf.setFont('helvetica', 'normal');
    let value = submission.responses?.[field.id] || '(Not provided)';
    
    if (field.type === 'checkbox') {
      value = value ? '✓ Yes' : '✗ No';
    } else if (field.type === 'rating') {
      value = value ? `${'★'.repeat(value)}${'☆'.repeat(5-value)} (${value}/5)` : '(Not rated)';
    } else if (field.type === 'signature') {
      value = value ? '✍ Signed' : '(No signature)';
    }
    
    // Handle long text by wrapping
    const valueText = String(value);
    const splitText = pdf.splitTextToSize(valueText, pageWidth - margin * 2 - 10);
    
    if (Array.isArray(splitText)) {
      splitText.forEach((line, index) => {
        pdf.text(line, margin, currentY + 12 + (index * 5));
      });
      currentY += 12 + (splitText.length * 5) + 10;
    } else {
      pdf.text(valueText.substring(0, 60), margin, currentY + 12);
      currentY += 25;
    }
  });
  
  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 20;
  pdf.setFontSize(10);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Generated by FormForge • Professional Forms Platform', pageWidth / 2, footerY, { align: 'center' });
  
  // Generate filename with form title and date
  const dateStr = new Date().toISOString().split('T')[0];
  const formTitle = (form?.title || 'submission').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `${formTitle}_${dateStr}.pdf`;
  
  pdf.save(fileName);
};

const SubmissionDetailModal = ({ submission, form, onClose }) => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      backdropFilter: 'blur(8px)',
      padding: '20px'
    },
    modal: {
      background: '#ffffff',
      borderRadius: theme.borderRadius.xl,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: `1px solid ${theme.colors.secondary[200]}`,
      padding: theme.spacing[8],
      width: '100%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing[6]
        }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.secondary[900],
            margin: 0
          }}>
            {form?.title || 'Form Submission'}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.md,
              color: theme.colors.secondary[500]
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: theme.spacing[6] }}>
          <p style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.secondary[600],
            margin: 0
          }}>
            Submitted on {submission.submittedAt?.toDate ? 
              submission.submittedAt.toDate().toLocaleDateString() + ' at ' + 
              submission.submittedAt.toDate().toLocaleTimeString() : 
              'Unknown date'
            }
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
          {form?.fields?.filter(field => 
            evaluateFieldConditions(field, submission.responses || {}, form.fields)
          ).map(field => {
            const value = submission.responses?.[field.id];
            return (
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
                <div style={{
                  padding: theme.spacing[3],
                  background: theme.colors.secondary[50],
                  border: `1px solid ${theme.colors.secondary[200]}`,
                  borderRadius: theme.borderRadius.lg,
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {value || <span style={{ color: theme.colors.secondary[400] }}>No response</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ 
          marginTop: theme.spacing[8],
          display: 'flex',
          gap: theme.spacing[4],
          justifyContent: 'flex-end'
        }}>
          <Button 
            variant="secondary" 
            leftIcon={<Download size={16} />}
            onClick={() => generatePDFFromSubmission(submission, form)}
          >
            Generate PDF
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsDashboard;
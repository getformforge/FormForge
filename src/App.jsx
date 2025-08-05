import React, { useState, useEffect } from 'react';
import { Download, FileText, Plus, Trash2, Save, FolderOpen, ChevronUp, ChevronDown, 
         Type, Mail, Hash, Calendar, FileUp, CheckSquare, List, Sparkles, Star, PenTool, 
         Share, Copy, Eye, BarChart3 } from 'lucide-react';
import jsPDF from 'jspdf';

const FormPDFApp = () => {
  const [formFields, setFormFields] = useState([
    { id: 1, type: 'text', label: 'Full Name', required: true },
    { id: 2, type: 'email', label: 'Email Address', required: true }
  ]);
  
  const [formData, setFormData] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [pdfTemplate, setPdfTemplate] = useState('modern'); // modern, classic, minimal
  const [currentFormId, setCurrentFormId] = useState(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSubmissionsDialog, setShowSubmissionsDialog] = useState(false);
  const [formSubmissions, setFormSubmissions] = useState([]);
  const [currentView, setCurrentView] = useState('builder'); // builder, shared-form, submissions
  
  // Load saved templates from localStorage on mount
  useEffect(() => {
    const templates = localStorage.getItem('formForgeTemplates');
    if (templates) {
      setSavedTemplates(JSON.parse(templates));
    }
  }, []);

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: type === 'text' ? 'Text Field' : 
             type === 'email' ? 'Email Field' :
             type === 'select' ? 'Select Field' : 
             type === 'file' ? 'File Upload' :
             type === 'number' ? 'Number Field' :
             type === 'date' ? 'Date Field' :
             type === 'textarea' ? 'Text Area' :
             type === 'checkbox' ? 'Checkbox' :
             type === 'rating' ? 'Rating Scale' : 'Signature',
      required: false,
      options: type === 'select' ? ['Option 1', 'Option 2'] : undefined
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const updateField = (id, updates) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const moveFieldUp = (id) => {
    const index = formFields.findIndex(field => field.id === id);
    if (index > 0) {
      const newFields = [...formFields];
      [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
      setFormFields(newFields);
    }
  };

  const moveFieldDown = (id) => {
    const index = formFields.findIndex(field => field.id === id);
    if (index < formFields.length - 1) {
      const newFields = [...formFields];
      [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      setFormFields(newFields);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData({ ...formData, [fieldId]: value });
  };
  
  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    
    const newTemplate = {
      id: Date.now(),
      name: templateName,
      fields: formFields,
      createdAt: new Date().toLocaleDateString()
    };
    
    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('formForgeTemplates', JSON.stringify(updatedTemplates));
    
    setShowSaveDialog(false);
    setTemplateName('');
    alert('✅ FormForge template saved successfully!');
  };
  
  const loadTemplate = (template) => {
    setFormFields(template.fields);
    setFormData({});
    setShowLoadDialog(false);
    alert(`✅ Loaded template: ${template.name}`);
  };
  
  const deleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = savedTemplates.filter(t => t.id !== templateId);
      setSavedTemplates(updatedTemplates);
      localStorage.setItem('formForgeTemplates', JSON.stringify(updatedTemplates));
    }
  };

  const generateModernPDF = (pdf, pageWidth, margin) => {
    let currentY = 40;
    
    // Modern header with gradient effect simulation
    pdf.setFillColor(59, 130, 246); // Blue
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Form Submission', pageWidth / 2, 25, { align: 'center' });
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    currentY = 60;
    
    // Date with modern styling
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Submitted on ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, margin, currentY);
    
    currentY += 30;
    pdf.setTextColor(0, 0, 0);
    
    // Form fields with modern styling
    formFields.forEach((field, index) => {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 30;
      }
      
      // Field container background (light gray)
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(margin - 5, currentY - 8, pageWidth - 2 * margin + 10, 20, 'F');
      }
      
      // Field label
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55);
      pdf.text(`${field.label}:`, margin, currentY);
      
      // Field value
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      let value = formData[field.id] || '(Not provided)';
      
      // Handle special field types
      if (field.type === 'checkbox') {
        value = value === true || value === 'true' ? '✓ Yes' : '✗ No';
      } else if (field.type === 'rating') {
        value = value ? `${'★'.repeat(value)}${'☆'.repeat(5-value)} (${value}/5)` : '(Not rated)';
      } else if (field.type === 'signature') {
        value = value ? `✍ ${value}` : '(No signature provided)';
      }
      
      const valueText = String(value).substring(0, 45);
      pdf.text(valueText, margin, currentY + 8);
      
      currentY += 25;
    });
    
    // Modern footer
    const footerY = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFillColor(243, 244, 246);
    pdf.rect(0, footerY - 10, pageWidth, 30, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);
    pdf.text('Powered by FormForge • Professional Form to PDF Generator', pageWidth / 2, footerY, { align: 'center' });
  };

  const generateClassicPDF = (pdf, pageWidth, margin) => {
    let currentY = 50;
    
    // Classic header with border
    pdf.setLineWidth(2);
    pdf.rect(margin, 20, pageWidth - 2 * margin, 40);
    
    pdf.setFontSize(24);
    pdf.setFont('times', 'bold');
    pdf.text('FORM SUBMISSION', pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('times', 'normal');
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 50, { align: 'center' });
    
    currentY = 80;
    
    // Classic table-style layout
    formFields.forEach((field) => {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 30;
      }
      
      // Table row borders
      pdf.setLineWidth(0.5);
      pdf.rect(margin, currentY - 8, pageWidth - 2 * margin, 20);
      pdf.line(margin + 80, currentY - 8, margin + 80, currentY + 12);
      
      // Field label
      pdf.setFontSize(12);
      pdf.setFont('times', 'bold');
      pdf.text(`${field.label}:`, margin + 5, currentY);
      
      // Field value
      pdf.setFont('times', 'normal');
      let value = formData[field.id] || '(Not provided)';
      
      // Handle special field types
      if (field.type === 'checkbox') {
        value = value === true || value === 'true' ? 'Yes' : 'No';
      } else if (field.type === 'rating') {
        value = value ? `${value}/5 stars` : '(Not rated)';
      } else if (field.type === 'signature') {
        value = value ? value : '(No signature provided)';
      }
      
      const valueText = String(value).substring(0, 35);
      pdf.text(valueText, margin + 85, currentY);
      
      currentY += 20;
    });
    
    // Classic footer
    const footerY = pdf.internal.pageSize.getHeight() - 30;
    pdf.setLineWidth(1);
    pdf.line(margin, footerY, pageWidth - margin, footerY);
    
    pdf.setFontSize(10);
    pdf.setFont('times', 'italic');
    pdf.text('Generated by FormForge', pageWidth / 2, footerY + 15, { align: 'center' });
  };

  const generateMinimalPDF = (pdf, pageWidth, margin) => {
    let currentY = 40;
    
    // Minimal header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Form Submission', margin, currentY);
    
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    pdf.text(new Date().toLocaleDateString(), margin, currentY + 15);
    
    currentY = 70;
    pdf.setTextColor(0, 0, 0);
    
    // Minimal field display
    formFields.forEach((field) => {
      if (currentY > 260) {
        pdf.addPage();
        currentY = 30;
      }
      
      // Field label
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${field.label}`, margin, currentY);
      
      // Field value
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(64, 64, 64);
      let value = formData[field.id] || '—';
      
      // Handle special field types
      if (field.type === 'checkbox') {
        value = value === true || value === 'true' ? 'Yes' : 'No';
      } else if (field.type === 'rating') {
        value = value ? `${value}/5` : '—';
      } else if (field.type === 'signature') {
        value = value ? value : '—';
      }
      
      const valueText = String(value).substring(0, 60);
      pdf.text(valueText, margin, currentY + 10);
      
      currentY += 25;
      pdf.setTextColor(0, 0, 0);
    });
    
    // Minimal footer
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('FormForge', pageWidth - margin - 20, pdf.internal.pageSize.getHeight() - 10);
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
    
    setIsGeneratingPDF(true);
    
    try {
      // Small delay for UX (shows the loading state)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create new PDF document
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;

      // Generate PDF based on selected template
      switch (pdfTemplate) {
        case 'modern':
          generateModernPDF(pdf, pageWidth, margin);
          break;
        case 'classic':
          generateClassicPDF(pdf, pageWidth, margin);
          break;
        case 'minimal':
          generateMinimalPDF(pdf, pageWidth, margin);
          break;
        default:
          generateModernPDF(pdf, pageWidth, margin);
      }
      
      // Download the PDF
      const fileName = `${pdfTemplate}-form-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      // Show success message
      alert(`✅ ${pdfTemplate.charAt(0).toUpperCase() + pdfTemplate.slice(1)} PDF downloaded successfully!`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('❌ Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateFormId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const publishForm = () => {
    const formId = generateFormId();
    const publishedForm = {
      id: formId,
      fields: formFields,
      title: `Form ${formId}`,
      createdAt: new Date().toISOString(),
      submissions: []
    };
    
    // Save to localStorage (in real app, this would be a database)
    const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
    publishedForms.push(publishedForm);
    localStorage.setItem('publishedForms', JSON.stringify(publishedForms));
    
    setCurrentFormId(formId);
    setShowShareDialog(true);
  };

  const submitForm = (formId, submissionData) => {
    const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
    const formIndex = publishedForms.findIndex(form => form.id === formId);
    
    if (formIndex !== -1) {
      const submission = {
        id: Date.now(),
        data: submissionData,
        submittedAt: new Date().toISOString()
      };
      
      publishedForms[formIndex].submissions.push(submission);
      localStorage.setItem('publishedForms', JSON.stringify(publishedForms));
      
      return true; // Success
    }
    return false; // Form not found
  };

  const loadSubmissions = () => {
    if (currentFormId) {
      const publishedForms = JSON.parse(localStorage.getItem('publishedForms') || '[]');
      const form = publishedForms.find(form => form.id === currentFormId);
      if (form) {
        setFormSubmissions(form.submissions || []);
        setShowSubmissionsDialog(true);
      }
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?form=${currentFormId}&view=form`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('🎉 Share link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('🎉 Share link copied to clipboard!');
    });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
      padding: '20px',
      position: 'relative',
      '::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '48px'
    },
    title: {
      fontSize: '4rem',
      fontWeight: '900',
      background: 'linear-gradient(45deg, #ff6b35, #ffaa00, #ff6b35)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '16px',
      textShadow: '0 4px 8px rgba(255, 107, 53, 0.3)',
      letterSpacing: '-0.02em',
      fontFamily: 'Inter, sans-serif'
    },
    subtitle: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: '1.3rem',
      fontWeight: '500',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      maxWidth: '600px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    card: {
      backgroundColor: 'rgba(45, 45, 45, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255, 107, 53, 0.1)',
      border: '2px solid rgba(255, 107, 53, 0.2)',
      padding: '32px',
      position: 'relative'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    cardTitle: {
      fontSize: '1.8rem',
      fontWeight: '800',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    button: {
      padding: '14px 28px',
      background: 'linear-gradient(45deg, #ff6b35, #e63946)',
      color: 'white',
      border: '2px solid transparent',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '700',
      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontFamily: 'Inter, sans-serif'
    },
    buttonGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginBottom: '24px'
    },
    fieldButton: {
      padding: '20px',
      border: '2px solid rgba(255, 107, 53, 0.2)',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, rgba(45, 45, 45, 0.9), rgba(60, 60, 60, 0.9))',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      color: '#ffffff',
      textAlign: 'center',
      minHeight: '80px'
    },
    fieldEditor: {
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.6))',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      ':hover': {
        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        transform: 'translateY(-1px)'
      }
    },
    fieldHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    fieldActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    reorderButton: {
      background: 'none',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      cursor: 'pointer',
      padding: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280'
    },
    fieldLabel: {
      fontWeight: '500',
      color: '#1f2937',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      flex: 1,
      fontSize: '16px'
    },
    deleteButton: {
      color: '#ef4444',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px'
    },
    fieldInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    fieldType: {
      fontSize: '14px',
      color: '#6b7280',
      textTransform: 'capitalize'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    textarea: {
      width: '100%',
      padding: '8px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical'
    },
    formInput: {
      width: '100%',
      padding: '16px 20px',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      background: 'rgba(45, 45, 45, 0.9)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2), inset 0 2px 4px rgba(0,0,0,0.1)',
      color: '#ffffff',
      fontWeight: '500',
      fontFamily: 'Inter, sans-serif'
    },
    formInputError: {
      width: '100%',
      padding: '16px 20px',
      border: '2px solid #e63946',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      background: 'rgba(45, 45, 45, 0.95)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3), inset 0 2px 4px rgba(0,0,0,0.1)',
      color: '#ffffff',
      fontWeight: '500',
      fontFamily: 'Inter, sans-serif'
    },
    formField: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '15px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '10px',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
    required: {
      color: '#ff6b35',
      marginLeft: '4px',
      fontWeight: '700'
    },
    generateButton: {
      width: '100%',
      marginTop: '32px',
      padding: '20px 32px',
      background: 'linear-gradient(45deg, #ff6b35, #e63946, #ff8500)',
      color: 'white',
      border: '3px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '20px',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      boxShadow: '0 12px 30px rgba(255, 107, 53, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: 'Inter, sans-serif'
    },
    pdfPreview: {
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '400px'
    },
    pdfHeader: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    pdfTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '8px'
    },
    pdfDate: {
      color: '#6b7280'
    },
    pdfContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    pdfField: {
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between'
    },
    pdfFieldLabel: {
      fontWeight: '500',
      color: '#374151'
    },
    pdfFieldValue: {
      color: '#6b7280'
    },
    successNote: {
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#ecfdf5',
      border: '1px solid #a7f3d0',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#065f46'
    },
    nextSteps: {
      marginTop: '48px',
      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(230, 57, 70, 0.1))',
      backdropFilter: 'blur(20px)',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      borderRadius: '16px',
      padding: '36px',
      boxShadow: '0 15px 40px rgba(255, 107, 53, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
    },
    nextStepsTitle: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '20px',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    nextStepsList: {
      color: '#ffffff',
      lineHeight: '1.8',
      fontSize: '15px',
      fontWeight: '500'
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    iconButton: {
      padding: '14px',
      background: 'linear-gradient(135deg, rgba(60, 60, 60, 0.9), rgba(45, 45, 45, 0.9))',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      color: '#ffffff'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalHeader: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1f2937'
    },
    templateItem: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f9fafb'
    },
    templateInfo: {
      flex: 1
    },
    templateName: {
      fontWeight: '500',
      color: '#1f2937',
      marginBottom: '4px'
    },
    templateDate: {
      fontSize: '12px',
      color: '#6b7280'
    },
    templateActions: {
      display: 'flex',
      gap: '8px'
    },
    smallButton: {
      padding: '4px 12px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    dangerButton: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    modalInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '16px'
    },
    modalActions: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'flex-end'
    }
  };

  const FieldEditor = ({ field, fieldIndex, totalFields }) => {
    const [localLabel, setLocalLabel] = useState(field.label);
    
    useEffect(() => {
      setLocalLabel(field.label);
    }, [field.label]);
    
    const handleLabelChange = (e) => {
      setLocalLabel(e.target.value);
    };
    
    const handleLabelBlur = () => {
      updateField(field.id, { label: localLabel });
    };

    return (
      <div style={styles.fieldEditor}>
        <div style={styles.fieldHeader}>
          <input
            type="text"
            value={localLabel}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
            style={styles.fieldLabel}
          />
          <div style={styles.fieldActions}>
            <button
              onClick={() => moveFieldUp(field.id)}
              style={{...styles.reorderButton, opacity: fieldIndex === 0 ? 0.3 : 1}}
              disabled={fieldIndex === 0}
              title="Move up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => moveFieldDown(field.id)}
              style={{...styles.reorderButton, opacity: fieldIndex === totalFields - 1 ? 0.3 : 1}}
              disabled={fieldIndex === totalFields - 1}
              title="Move down"
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={() => removeField(field.id)}
              style={styles.deleteButton}
            >
              <Trash2 size={16} />
            </button>
          </div>
          </div>
        
        <div style={styles.fieldInfo}>
          <span style={styles.fieldType}>{field.type}</span>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(field.id, { required: e.target.checked })}
            />
            <span style={{fontSize: '14px', color: '#6b7280'}}>Required</span>
          </label>
        </div>
        
        {field.type === 'select' && (
          <div style={{marginTop: '12px'}}>
            <label style={{display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>
              Options (one per line):
            </label>
            <textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => updateField(field.id, { 
                options: e.target.value.split('\n').filter(opt => opt.trim()) 
              })}
              style={styles.textarea}
              rows={3}
            />
          </div>
        )}
      </div>
    );
  };

  const FormPreview = ({ field }) => {
    const [localValue, setLocalValue] = useState(formData[field.id] || '');
    const isEmpty = !localValue || localValue === '';
    const isInvalid = field.required && isEmpty;
    
    useEffect(() => {
      setLocalValue(formData[field.id] || '');
    }, [formData[field.id]]);
    
    const handleChange = (value) => {
      setLocalValue(value);
    };
    
    const handleBlur = () => {
      handleInputChange(field.id, localValue);
    };
    
    const inputStyle = isInvalid ? styles.formInputError : styles.formInput;

    return (
      <div style={styles.formField}>
        <label style={styles.label}>
          {field.label}
          {field.required && <span style={styles.required}>*</span>}
        </label>
        
        {field.type === 'text' && (
          <input
            type="text"
            style={inputStyle}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )}
        
        {field.type === 'email' && (
          <input
            type="email"
            style={inputStyle}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )}
        
        {field.type === 'select' && (
          <select
            style={inputStyle}
            value={localValue}
            onChange={(e) => {
              handleChange(e.target.value);
              handleInputChange(field.id, e.target.value);
            }}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )}
        
        {field.type === 'file' && (
          <input
            type="file"
            style={styles.formInput}
            onChange={(e) => {
              const fileName = e.target.files[0]?.name || '';
              handleChange(fileName);
              handleInputChange(field.id, fileName);
            }}
          />
        )}
        
        {field.type === 'number' && (
          <input
            type="number"
            style={inputStyle}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )}
        
        {field.type === 'date' && (
          <input
            type="date"
            style={inputStyle}
            value={localValue}
            onChange={(e) => {
              handleChange(e.target.value);
              handleInputChange(field.id, e.target.value);
            }}
          />
        )}
        
        {field.type === 'textarea' && (
          <textarea
            style={{...inputStyle, minHeight: '100px', resize: 'vertical'}}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            rows={4}
          />
        )}
        
        {field.type === 'checkbox' && (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <input
              type="checkbox"
              id={`checkbox-${field.id}`}
              style={{width: '20px', height: '20px', cursor: 'pointer'}}
              checked={localValue === 'true' || localValue === true}
              onChange={(e) => {
                handleChange(e.target.checked);
                handleInputChange(field.id, e.target.checked);
              }}
            />
            <span style={{marginLeft: '8px', color: '#6b7280'}}>
              Check if applicable
            </span>
          </div>
        )}
        
        {field.type === 'rating' && (
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => {
                  handleChange(rating);
                  handleInputChange(field.id, rating);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <Star 
                  size={24} 
                  fill={rating <= (localValue || 0) ? '#f59e0b' : 'none'}
                  color={rating <= (localValue || 0) ? '#f59e0b' : '#d1d5db'}
                />
              </button>
            ))}
            <span style={{marginLeft: '12px', color: '#6b7280', fontSize: '14px'}}>
              {localValue ? `${localValue}/5 stars` : 'Click to rate'}
            </span>
          </div>
        )}
        
        {field.type === 'signature' && (
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            background: '#f9fafb',
            cursor: 'pointer'
          }}
          onClick={() => {
            const signature = prompt('Enter your signature (or type your name):');
            if (signature) {
              handleChange(signature);
              handleInputChange(field.id, signature);
            }
          }}
          >
            <PenTool size={32} style={{color: '#9ca3af', marginBottom: '8px'}} />
            <div style={{color: '#6b7280'}}>
              {localValue ? (
                <div>
                  <div style={{fontStyle: 'italic', fontSize: '18px', color: '#1f2937', marginBottom: '4px'}}>
                    {localValue}
                  </div>
                  <div style={{fontSize: '12px'}}>Click to change signature</div>
                </div>
              ) : (
                <div>
                  <div>Click to add signature</div>
                  <div style={{fontSize: '12px', marginTop: '4px'}}>Type your name or signature</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <header style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'}}>
            <h1 style={styles.title}>FormForge</h1>
          </div>
          <p style={styles.subtitle}>Forge professional documents from simple forms with our intelligent builder</p>
          <div style={{marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap'}}>
            <div style={{color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
              <CheckSquare size={18} style={{marginRight: '10px', color: '#ff6b35'}} />
              Industrial Strength
            </div>
            <div style={{color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
              <Download size={18} style={{marginRight: '10px', color: '#ffaa00'}} />
              Forge to PDF
            </div>
            <div style={{color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center'}}>
              <Save size={18} style={{marginRight: '10px', color: '#ff8500'}} />
              Built to Last
            </div>
          </div>
        </header>

        <div style={styles.grid}>
          {/* Form Builder */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Form Builder</h2>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  style={styles.iconButton}
                  title="Save Template"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => setShowLoadDialog(true)}
                  style={styles.iconButton}
                  title="Load Template"
                >
                  <FolderOpen size={20} />
                </button>
                <button
                  onClick={publishForm}
                  style={styles.iconButton}
                  title="Share Form"
                >
                  <Share size={20} />
                </button>
                {currentFormId && (
                  <button
                    onClick={loadSubmissions}
                    style={styles.iconButton}
                    title="View Submissions"
                  >
                    <BarChart3 size={20} />
                  </button>
                )}
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  style={styles.button}
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
            </div>

            {!isPreview ? (
              <>
                <div style={{marginBottom: '32px'}}>
                  <h3 style={{fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px', color: '#ffffff', display: 'flex', alignItems: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                    <Plus size={22} style={{marginRight: '12px', color: '#ff6b35'}} />
                    Forge New Fields
                  </h3>
                  <div style={styles.buttonGrid}>
                    <button
                      onClick={() => addField('text')}
                      style={styles.fieldButton}
                    >
                      <Type size={20} style={{marginRight: '8px', color: '#3b82f6'}} />
                      <span>Text Field</span>
                    </button>
                    <button
                      onClick={() => addField('email')}
                      style={styles.fieldButton}
                    >
                      <Mail size={20} style={{marginRight: '8px', color: '#10b981'}} />
                      <span>Email Field</span>
                    </button>
                    <button
                      onClick={() => addField('select')}
                      style={styles.fieldButton}
                    >
                      <List size={20} style={{marginRight: '8px', color: '#8b5cf6'}} />
                      <span>Dropdown</span>
                    </button>
                    <button
                      onClick={() => addField('file')}
                      style={styles.fieldButton}
                    >
                      <FileUp size={20} style={{marginRight: '8px', color: '#f59e0b'}} />
                      <span>File Upload</span>
                    </button>
                    <button
                      onClick={() => addField('number')}
                      style={styles.fieldButton}
                    >
                      <Hash size={20} style={{marginRight: '8px', color: '#ef4444'}} />
                      <span>Number</span>
                    </button>
                    <button
                      onClick={() => addField('date')}
                      style={styles.fieldButton}
                    >
                      <Calendar size={20} style={{marginRight: '8px', color: '#06b6d4'}} />
                      <span>Date Picker</span>
                    </button>
                    <button
                      onClick={() => addField('textarea')}
                      style={styles.fieldButton}
                    >
                      <FileText size={20} style={{marginRight: '8px', color: '#84cc16'}} />
                      <span>Long Text</span>
                    </button>
                    <button
                      onClick={() => addField('checkbox')}
                      style={styles.fieldButton}
                    >
                      <CheckSquare size={20} style={{marginRight: '8px', color: '#ec4899'}} />
                      <span>Checkbox</span>
                    </button>
                    <button
                      onClick={() => addField('rating')}
                      style={styles.fieldButton}
                    >
                      <Star size={20} style={{marginRight: '8px', color: '#f59e0b'}} />
                      <span>Rating</span>
                    </button>
                    <button
                      onClick={() => addField('signature')}
                      style={styles.fieldButton}
                    >
                      <PenTool size={20} style={{marginRight: '8px', color: '#6366f1'}} />
                      <span>Signature</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 style={{fontSize: '1.4rem', fontWeight: '700', marginBottom: '24px', color: '#ffffff', display: 'flex', alignItems: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                    <FileText size={22} style={{marginRight: '12px', color: '#ff6b35'}} />
                    Forged Components ({formFields.length})
                  </h3>
                  {formFields.map((field, index) => (
                    <FieldEditor 
                      key={field.id} 
                      field={field} 
                      fieldIndex={index}
                      totalFields={formFields.length}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div>
                <h3 style={{fontSize: '1.4rem', fontWeight: '700', marginBottom: '24px', color: '#ffffff', display: 'flex', alignItems: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                  <FileText size={22} style={{marginRight: '12px', color: '#ff6b35'}} />
                  Forge Preview
                </h3>
                {formFields.map(field => (
                  <FormPreview key={field.id} field={field} />
                ))}
                
                {/* PDF Template Selector */}
                <div style={{margin: '24px 0', padding: '20px', background: 'rgba(243, 244, 246, 0.5)', borderRadius: '12px', border: '1px solid rgba(209, 213, 219, 0.3)'}}>
                  <h4 style={{fontSize: '17px', fontWeight: '700', marginBottom: '16px', color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>Choose Forge Template</h4>
                  <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                    {[
                      { id: 'modern', name: 'Modern', desc: 'Clean design with colors' },
                      { id: 'classic', name: 'Classic', desc: 'Traditional table layout' },
                      { id: 'minimal', name: 'Minimal', desc: 'Simple and clean' }
                    ].map(template => (
                      <button
                        key={template.id}
                        onClick={() => setPdfTemplate(template.id)}
                        style={{
                          padding: '12px 16px',
                          border: pdfTemplate === template.id ? '2px solid #ff6b35' : '2px solid rgba(255, 107, 53, 0.3)',
                          borderRadius: '8px',
                          background: pdfTemplate === template.id ? 'rgba(255, 107, 53, 0.2)' : 'rgba(45, 45, 45, 0.8)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          minWidth: '120px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{fontWeight: '700', fontSize: '15px', color: pdfTemplate === template.id ? '#ff6b35' : '#ffffff'}}>
                          {template.name}
                        </div>
                        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '2px'}}>
                          {template.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  style={{
                    ...styles.generateButton,
                    backgroundColor: isGeneratingPDF ? '#6b7280' : '#059669',
                    cursor: isGeneratingPDF ? 'not-allowed' : 'pointer'
                  }}
                >
                  <Download size={20} />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}
                </button>
              </div>
            )}
          </div>

          {/* PDF Preview */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>PDF Preview</h2>
            
            <div style={styles.pdfPreview}>
              <div style={styles.pdfHeader}>
                <FileText size={48} style={{margin: '0 auto 8px', color: '#9ca3af', display: 'block'}} />
                <h3 style={styles.pdfTitle}>Form Submission</h3>
                <p style={styles.pdfDate}>{new Date().toLocaleDateString()}</p>
              </div>

              <div style={styles.pdfContent}>
                {formFields.map(field => (
                  <div key={field.id} style={styles.pdfField}>
                    <span style={styles.pdfFieldLabel}>{field.label}:</span>
                    <span style={styles.pdfFieldValue}>
                      {formData[field.id] || '(Not filled)'}
                    </span>
                  </div>
                ))}
              </div>

              {Object.keys(formData).length > 0 && (
                <div style={styles.successNote}>
                  ✓ This preview shows how your PDF will look when generated
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={styles.nextSteps}>
          <h3 style={styles.nextStepsTitle}>The FormForge Roadmap</h3>
          <div style={styles.nextStepsList}>
            <p>✓ <strong>Industrial form builder</strong> with 10 field types - <span style={{color: '#ff6b35'}}>Forged!</span></p>
            <p>✓ <strong>Professional PDF templates</strong> (Modern, Classic, Minimal) - <span style={{color: '#ff6b35'}}>Forged!</span></p>
            <p>✓ <strong>Template forge & storage</strong> - <span style={{color: '#ff6b35'}}>Forged!</span></p>
            <p>✓ <strong>Form sharing & distribution</strong> - <span style={{color: '#ff6b35'}}>Forged!</span></p>
            <p>✓ <strong>Submission collection & export</strong> - <span style={{color: '#ff6b35'}}>Forged!</span></p>
            <p>✓ <strong>Advanced fields</strong> (Rating, Signature) - <span style={{color: '#ff6b35'}}>Forged!</span></p>
            <p>▸ <strong>User accounts & authentication</strong> - <span style={{color: '#ffaa00'}}>In the Forge</span></p>
            <p>▸ <strong>Payment & subscription system</strong> - <span style={{color: '#ffaa00'}}>In the Forge</span></p>
            <p>▸ <strong>Custom branding & white-label</strong> - <span style={{color: '#ffaa00'}}>In the Forge</span></p>
          </div>
        </div>
      </div>
      
      {/* Save Template Dialog */}
      {showSaveDialog && (
        <div style={styles.modal} onClick={() => setShowSaveDialog(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalHeader}>Save Form Template</h3>
            <input
              type="text"
              placeholder="Enter template name..."
              style={styles.modalInput}
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveTemplate()}
              autoFocus
            />
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowSaveDialog(false)}
                style={{...styles.smallButton, backgroundColor: '#e5e7eb'}}
              >
                Cancel
              </button>
              <button
                onClick={saveTemplate}
                style={{...styles.smallButton, ...styles.primaryButton}}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Load Template Dialog */}
      {showLoadDialog && (
        <div style={styles.modal} onClick={() => setShowLoadDialog(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalHeader}>Load Form Template</h3>
            {savedTemplates.length === 0 ? (
              <p style={{color: '#6b7280', textAlign: 'center', margin: '32px 0'}}>
                No saved templates yet. Create and save a FormForge template first.
              </p>
            ) : (
              savedTemplates.map(template => (
                <div key={template.id} style={styles.templateItem}>
                  <div style={styles.templateInfo}>
                    <div style={styles.templateName}>{template.name}</div>
                    <div style={styles.templateDate}>
                      Created: {template.createdAt} • {template.fields.length} fields
                    </div>
                  </div>
                  <div style={styles.templateActions}>
                    <button
                      onClick={() => loadTemplate(template)}
                      style={{...styles.smallButton, ...styles.primaryButton}}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      style={{...styles.smallButton, ...styles.dangerButton}}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowLoadDialog(false)}
                style={{...styles.smallButton, backgroundColor: '#e5e7eb'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Form Dialog */}
      {showShareDialog && (
        <div style={styles.modal} onClick={() => setShowShareDialog(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalHeader}>🎉 Form Published Successfully!</h3>
            <div style={{marginBottom: '20px'}}>
              <p style={{color: '#6b7280', marginBottom: '16px'}}>
                Your form is now live and ready to collect submissions. Share this link with others:
              </p>
              <div style={{
                padding: '12px',
                background: '#f3f4f6',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontFamily: 'monospace',
                fontSize: '14px',
                wordBreak: 'break-all',
                marginBottom: '12px'
              }}>
                {`${window.location.origin}${window.location.pathname}?form=${currentFormId}&view=form`}
              </div>
              <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                <button
                  onClick={copyShareLink}
                  style={{...styles.smallButton, ...styles.primaryButton, display: 'flex', alignItems: 'center', gap: '8px'}}
                >
                  <Copy size={16} />
                  Copy Link
                </button>
                <button
                  onClick={() => window.open(`${window.location.origin}${window.location.pathname}?form=${currentFormId}&view=form`, '_blank')}
                  style={{...styles.smallButton, backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: '8px'}}
                >
                  <Eye size={16} />
                  Preview
                </button>
              </div>
              <div style={{background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe'}}>
                <p style={{fontSize: '14px', color: '#1e40af', margin: 0}}>
                  💡 <strong>Pro Tip:</strong> Use the View Submissions button to see responses and analytics!
                </p>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowShareDialog(false)}
                style={{...styles.smallButton, backgroundColor: '#e5e7eb'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Submissions Dialog */}
      {showSubmissionsDialog && (
        <div style={styles.modal} onClick={() => setShowSubmissionsDialog(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalHeader}>📊 Form Submissions ({formSubmissions.length})</h3>
            {formSubmissions.length === 0 ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                <BarChart3 size={48} style={{color: '#d1d5db', margin: '0 auto 16px'}} />
                <p>No submissions yet.</p>
                <p style={{fontSize: '14px'}}>Share your form to start collecting responses!</p>
              </div>
            ) : (
              <div style={{maxHeight: '400px', overflow: 'auto'}}>
                {formSubmissions.map((submission, index) => (
                  <div key={submission.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    background: '#f9fafb'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                      <h4 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>
                        Submission #{index + 1}
                      </h4>
                      <span style={{fontSize: '12px', color: '#6b7280'}}>
                        {new Date(submission.submittedAt).toLocaleDateString()} {new Date(submission.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{display: 'grid', gap: '8px'}}>
                      {Object.entries(submission.data).map(([fieldId, value]) => {
                        const field = formFields.find(f => f.id.toString() === fieldId);
                        return field ? (
                          <div key={fieldId} style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{fontWeight: '500', color: '#374151'}}>{field.label}:</span>
                            <span style={{color: '#6b7280', maxWidth: '60%', textAlign: 'right'}}>
                              {field.type === 'checkbox' ? (value ? 'Yes' : 'No') : 
                               field.type === 'rating' ? `${value}/5 stars` : 
                               value || '(empty)'}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowSubmissionsDialog(false)}
                style={{...styles.smallButton, backgroundColor: '#e5e7eb'}}
              >
                Close
              </button>
              {formSubmissions.length > 0 && (
                <button
                  onClick={() => {
                    // Export submissions as CSV
                    const headers = formFields.map(f => f.label);
                    const csvContent = [
                      headers.join(','),
                      ...formSubmissions.map(submission => 
                        formFields.map(field => {
                          const value = submission.data[field.id] || '';
                          return `"${String(value).replace(/"/g, '""')}"`;
                        }).join(',')
                      )
                    ].join('\\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                  style={{...styles.smallButton, backgroundColor: '#10b981', color: 'white'}}
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPDFApp;
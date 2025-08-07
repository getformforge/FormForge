import React, { useState, useEffect } from 'react';
import { Download, Save, Eye, Settings, Share2, BarChart3, ChevronDown, FolderOpen, Copy, Trash2, MoreVertical, FileText } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import UserDashboard from './components/UserDashboard';
// PlanLimits moved to UserDashboard dropdown
import PricingModal from './components/PricingModal';
import Templates from './components/Templates';
import ShareFormModal from './components/ShareFormModal';
import SubmissionsDashboard from './components/SubmissionsDashboard';
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Button from './components/ui/Button';
import UserDropdown from './components/UserDropdown';
import Card from './components/ui/Card';
import RowBasedFormBuilder from './components/form/RowBasedFormBuilder';
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
import { evaluateFieldConditions, getVisibleFields } from './utils/conditionalLogicEvaluator';

const FormBuilderApp = () => {
  const { currentUser } = useAuth();
  
  // Clear session storage when user changes
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('currentUserId');
    if (currentUser) {
      if (storedUserId && storedUserId !== currentUser.uid) {
        // Different user logged in, clear all session data
        sessionStorage.clear();
      }
      sessionStorage.setItem('currentUserId', currentUser.uid);
    } else {
      // User logged out, clear session
      sessionStorage.clear();
    }
  }, [currentUser]);
  const [currentView, setCurrentView] = useState('builder'); // builder, preview, settings
  const [formFields, setFormFields] = useState(() => {
    if (!currentUser) return [];
    const savedFields = sessionStorage.getItem('formFields');
    if (savedFields) {
      try {
        return JSON.parse(savedFields);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [formData, setFormData] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [showFormOptions, setShowFormOptions] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [templateName, setTemplateName] = useState('');
  
  // Load saved templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      if (currentUser) {
        try {
          const templates = await getUserFormTemplates(currentUser.uid);
          setSavedTemplates(templates);
        } catch (error) {
          console.error('Error loading templates:', error);
          setSavedTemplates([]);
        }
      }
    };
    loadTemplates();
  }, [currentUser]);

  // Save current form as template
  const saveTemplate = async () => {
    if (!currentUser) {
      alert('Please sign in to save templates');
      return;
    }
    
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    
    const template = {
      id: Date.now(), // Add unique ID
      name: templateName,
      fields: formFields,
      rows: formRowsStructure,
      settings: formSettings,
      createdAt: new Date().toISOString()
    };
    
    try {
      console.log('Attempting to save template:', template);
      const success = await saveFormTemplate(currentUser.uid, template);
      
      if (success) {
        const templates = await getUserFormTemplates(currentUser.uid);
        setSavedTemplates(templates);
        setShowSaveDialog(false);
        setTemplateName('');
        alert('✅ Template saved successfully!');
      } else {
        alert('❌ Failed to save template. Please try again.');
      }
    } catch (error) {
      console.error('Save template error:', error);
      alert('❌ Failed to save template: ' + (error.message || 'Unknown error'));
    }
  };

  // Load a saved template
  const loadTemplate = (template) => {
    const fields = template.fields || [];
    const rows = template.rows || [];
    const settings = template.settings || formSettings;
    
    // Update state
    setFormFields(fields);
    setFormRowsStructure(rows);
    setFormSettings(settings);
    setFormData({});
    
    // Update session storage for persistence
    sessionStorage.setItem('formFields', JSON.stringify(fields));
    sessionStorage.setItem('formRowsStructure', JSON.stringify(rows));
    sessionStorage.setItem('formSettings', JSON.stringify(settings));
    
    // Force re-render of the form builder
    setTemplateKey(Date.now());
    
    setShowLoadDialog(false);
    alert(`✅ Loaded template: ${template.name}`);
  };

  // Delete a saved template
  const deleteTemplate = async (templateId) => {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to delete this template?')) {
      const success = await deleteFormTemplate(currentUser.uid, templateId);
      
      if (success) {
        const templates = await getUserFormTemplates(currentUser.uid);
        setSavedTemplates(templates);
      } else {
        alert('❌ Failed to delete template. Please try again.');
      }
    }
  };

  // Duplicate a template
  const duplicateTemplate = async (template) => {
    if (!currentUser) return;
    
    const duplicatedTemplate = {
      id: Date.now() + Math.random(), // Add unique ID
      name: `${template.name} (Copy)`,
      fields: template.fields.map(field => ({
        ...field,
        id: Date.now() + Math.random()
      })),
      rows: template.rows,
      settings: template.settings,
      createdAt: new Date().toISOString()
    };
    
    const success = await saveFormTemplate(currentUser.uid, duplicatedTemplate);
    
    if (success) {
      const templates = await getUserFormTemplates(currentUser.uid);
      setSavedTemplates(templates);
      alert(`✅ Duplicated template: ${duplicatedTemplate.name}`);
      
      // Load the duplicated template
      loadTemplate(duplicatedTemplate);
    } else {
      alert('❌ Failed to duplicate template. Please try again.');
    }
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.form-options-container')) {
        setShowFormOptions(false);
      }
      if (!e.target.closest('.pdf-dropdown-container')) {
        setShowPdfOptions(false);
      }
    };
    
    if (showFormOptions || showPdfOptions) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showFormOptions, showPdfOptions]);
  const [templateKey, setTemplateKey] = useState(Date.now());
  const [formSettings, setFormSettings] = useState(() => {
    if (!currentUser) return { pdfHeader: '', pdfSubheader: '', pdfDate: new Date().toISOString().split('T')[0] };
    const savedSettings = sessionStorage.getItem('formSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      pdfHeader: '',
      pdfSubheader: '',
      pdfDate: new Date().toISOString().split('T')[0]
    };
  });
  const [formRowsStructure, setFormRowsStructure] = useState(() => {
    if (!currentUser) return [];
    const savedRows = sessionStorage.getItem('formRowsStructure');
    return savedRows ? JSON.parse(savedRows) : [];
  });
  // Auto-save is enabled, no need for manual save state


  // Check for template from landing pages on component mount
  useEffect(() => {
    if (!currentUser) return; // Don't load templates if not logged in
    
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
  }, [currentUser]);

  const handleFieldsChange = (newFields, rowsStructure) => {
    setFormFields(newFields || []);
    if (rowsStructure) {
      setFormRowsStructure(rowsStructure);
      sessionStorage.setItem('formRowsStructure', JSON.stringify(rowsStructure));
    }
    sessionStorage.setItem('formFields', JSON.stringify(newFields || []));
    // Clear form data for removed fields
    const fieldIds = new Set((newFields || []).map(f => f.id));
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([key]) => fieldIds.has(parseInt(key)))
    );
    setFormData(cleanedFormData);
  };

  // Auto-save happens in handleFieldsChange, no need for manual save

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // Group fields into rows based on the saved row structure
  const getFieldRows = (applyConditionalLogic = false) => {
    if (formRowsStructure && formRowsStructure.length > 0) {
      // Use the saved row structure
      return formRowsStructure.map(row => {
        let fields = row.fields || [];
        
        // Apply conditional logic if requested (for preview/rendering)
        if (applyConditionalLogic) {
          fields = fields.filter(field => evaluateFieldConditions(field, formData, formFields));
        }
        
        return {
          ...row,
          fields,
          columns: row.columns || 1
        };
      });
    }
    
    // Fallback: create simple rows from fields
    const rows = [];
    let currentRow = { fields: [], columns: 1 };
    
    // Filter fields if applying conditional logic
    const fieldsToProcess = applyConditionalLogic 
      ? formFields.filter(field => evaluateFieldConditions(field, formData, formFields))
      : formFields;
    
    fieldsToProcess.forEach(field => {
      // Check if field has row information
      if (field.rowId && field.columns) {
        // Find or create the row
        let existingRow = rows.find(r => r.id === field.rowId);
        if (!existingRow) {
          existingRow = { id: field.rowId, fields: [], columns: field.columns };
          rows.push(existingRow);
        }
        existingRow.fields.push(field);
      } else {
        // No row info, use simple layout
        currentRow.fields.push(field);
        if (currentRow.fields.length >= 1) {
          rows.push({ ...currentRow, id: Date.now() + Math.random() });
          currentRow = { fields: [], columns: 1 };
        }
      }
    });
    
    if (currentRow.fields.length > 0) {
      rows.push({ ...currentRow, id: Date.now() + Math.random() });
    }
    
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

  const generatePDF = async (isBlank = false) => {
    // Check rate limiting
    const rateLimitCheck = rateLimitService.checkAndRecord('pdf_generation', currentUser?.uid || 'anonymous');
    if (!rateLimitCheck.allowed) {
      const remaining = rateLimitService.getTimeUntilReset('pdf_generation', currentUser?.uid || 'anonymous');
      const timeStr = rateLimitService.formatTimeRemaining(remaining);
      alert(`❌ ${rateLimitCheck.message}\n\nYou can try again in ${timeStr}.`);
      return;
    }

    // Only validate required fields if generating filled PDF
    if (!isBlank) {
      const missingFields = formFields
        .filter(field => field.required && !formData[field.id])
        .map(field => field.label);
      
      if (missingFields.length > 0) {
        alert(`❌ Please fill in the following required fields:\n\n${missingFields.join('\n')}`);
        return;
      }
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
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let currentY = 25;
      let pageNumber = 1;
      
      // Add custom header if set
      const showHeader = formSettings.showHeader !== false; // Default to true
      if (showHeader && (formSettings.pdfHeader || formSettings.logo)) {
        // Add logo if present
        if (formSettings.logo) {
          const logoSize = 30;
          let logoX = margin;
          if (formSettings.logoPosition === 'center') {
            logoX = (pageWidth - logoSize) / 2;
          } else if (formSettings.logoPosition === 'right') {
            logoX = pageWidth - margin - logoSize;
          }
          try {
            pdf.addImage(formSettings.logo, 'PNG', logoX, currentY - 5, logoSize, logoSize);
          } catch (e) {
            console.error('Error adding logo to PDF:', e);
          }
          if (formSettings.logoPosition === 'center') {
            currentY += logoSize + 5;
          }
        }
        
        // Determine alignment for text
        const alignment = formSettings.headerAlignment || 'center';
        let textX = pageWidth / 2;
        let textAlign = 'center';
        if (alignment === 'left') {
          textX = formSettings.logo && formSettings.logoPosition === 'left' ? margin + 40 : margin;
          textAlign = 'left';
        } else if (alignment === 'right') {
          textX = formSettings.logo && formSettings.logoPosition === 'right' ? pageWidth - margin - 40 : pageWidth - margin;
          textAlign = 'right';
        }
        
        // Add header text
        if (formSettings.pdfHeader) {
          const headerFontSize = parseInt(formSettings.headerFontSize) || 20;
          pdf.setFontSize(headerFontSize);
          pdf.setFont('helvetica', 'bold');
          const headerColor = formSettings.headerColor || '#333333';
          const r = parseInt(headerColor.slice(1,3), 16);
          const g = parseInt(headerColor.slice(3,5), 16);
          const b = parseInt(headerColor.slice(5,7), 16);
          pdf.setTextColor(r, g, b);
          pdf.text(formSettings.pdfHeader, textX, currentY, { align: textAlign });
          currentY += headerFontSize / 2 + 4;
        }
        
        // Add subheader
        if (formSettings.pdfSubheader) {
          const subheaderFontSize = parseInt(formSettings.subheaderFontSize) || 14;
          pdf.setFontSize(subheaderFontSize);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(102, 102, 102);
          pdf.text(formSettings.pdfSubheader, textX, currentY, { align: textAlign });
          currentY += subheaderFontSize / 2 + 3;
        }
        
        // Add date if enabled
        if (formSettings.showDate !== false) {
          pdf.setFontSize(11);
          pdf.setTextColor(128, 128, 128);
          const dateText = formSettings.pdfDate ? `Date: ${new Date(formSettings.pdfDate).toLocaleDateString()}` : `Date: ${new Date().toLocaleDateString()}`;
          pdf.text(dateText, textX, currentY, { align: textAlign });
          currentY += 6;
        }
        
        currentY += 3;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
      }
      
      // Process form fields by rows for multi-column layout
      // Apply conditional logic to filter visible fields for PDF
      const rows = getFieldRows(true);
      rows.forEach((row) => {
        // Check if we need a new page before adding content (only if we have substantial content left)
        if (currentY > pageHeight - 50 && row.fields && row.fields.length > 0) {
          // Check if this is just trailing space - don't create new page for minimal content
          const remainingHeight = pageHeight - currentY;
          const estimatedRowHeight = 30; // Estimate height needed for a typical row
          
          if (remainingHeight < estimatedRowHeight) {
            pdf.addPage();
            pageNumber++;
            currentY = 30;
          }
        }
        
        // Calculate column width
        const columns = row.columns || 1;
        const columnWidth = (pageWidth - (margin * 2)) / columns;
        const columnSpacing = 8;
        
        // Find the maximum height needed for this row
        let maxHeight = 0;
        
        (row.fields || []).forEach((field, colIndex) => {
          // Layout fields span full width
          if (['heading1', 'heading2', 'paragraph', 'divider'].includes(field.type)) {
            // Check if layout element would overflow
            if (currentY > pageHeight - 45) {
              pdf.addPage();
              pageNumber++;
              currentY = 30;
            }
            if (field.type === 'heading1') {
              pdf.setFontSize(18);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(51, 51, 51);
              const lines = pdf.splitTextToSize(field.content || 'Heading', pageWidth - (margin * 2));
              pdf.text(lines[0], margin, currentY);
              currentY += 12;
            } else if (field.type === 'heading2') {
              pdf.setFontSize(14);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(51, 51, 51);
              const lines = pdf.splitTextToSize(field.content || 'Subheading', pageWidth - (margin * 2));
              pdf.text(lines[0], margin, currentY);
              currentY += 10;
            } else if (field.type === 'paragraph') {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(102, 102, 102);
              const lines = pdf.splitTextToSize(field.content || '', pageWidth - (margin * 2));
              lines.forEach(line => {
                pdf.text(line, margin, currentY);
                currentY += 5;
              });
              currentY += 3;
            } else if (field.type === 'divider') {
              pdf.setDrawColor(200, 200, 200);
              pdf.line(margin, currentY, pageWidth - margin, currentY);
              currentY += 8;
            }
          } else if (field.label) {
            // Regular form fields - position based on column
            const xPos = margin + (colIndex * columnWidth);
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(51, 51, 51);
            pdf.text(`${field.label}:`, xPos, currentY);
            
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(102, 102, 102);
            let value = isBlank ? '________________________' : (formData[field.id] || '(Not provided)');
            
            if (field.type === 'checkbox') {
              value = value ? '✓ Yes' : '✗ No';
            } else if (field.type === 'rating') {
              value = value ? `${'★'.repeat(value)}${'☆'.repeat(5-value)} (${value}/5)` : '(Not rated)';
            } else if (field.type === 'signature') {
              if (value && value.startsWith('data:image')) {
                // Add signature image
                try {
                  const imgWidth = 60;
                  const imgHeight = 30;
                  pdf.addImage(value, 'PNG', xPos, currentY + 10, imgWidth, imgHeight);
                  // Adjust field height to account for image
                  const fieldHeight = 10 + imgHeight + 10;
                  maxHeight = Math.max(maxHeight, fieldHeight);
                  value = ''; // Don't add text since we added the image
                } catch (e) {
                  console.error('Error adding signature image:', e);
                  value = '✍ Signed';
                }
              } else if (isBlank) {
                value = '[Sign here] _____________________';
              } else {
                value = '(No signature)';
              }
            }
            
            // Only add text if we have a value (skip for signature images)
            if (value) {
              const maxTextWidth = columnWidth - columnSpacing;
              const valueText = String(value);
              const lines = pdf.splitTextToSize(valueText, maxTextWidth);
              
              lines.forEach((line, idx) => {
                pdf.text(line, xPos, currentY + 8 + (idx * 4));
              });
              
              const fieldHeight = 8 + (lines.length * 4) + 8;
              maxHeight = Math.max(maxHeight, fieldHeight);
            }
          }
        });
        
        // Move Y position by the maximum height of the row
        if (maxHeight > 0) {
          currentY += maxHeight;
        }
      });
      
      // Add page number and footer to all pages
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const footerY = pageHeight - 15;
        
        // Page numbers (if enabled)
        if (formSettings.showPageNumbers !== false) {
          pdf.setFontSize(8);
          pdf.setTextColor(180, 180, 180);
          pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });
        }
        
        // Custom footer text (if enabled and provided)
        if (formSettings.showFooter && formSettings.footerText) {
          pdf.setFontSize(8);
          pdf.setTextColor(128, 128, 128);
          const footerTextY = formSettings.showPageNumbers !== false ? footerY - 5 : footerY;
          pdf.text(formSettings.footerText, pageWidth / 2, footerTextY, { align: 'center' });
        }
        
        // Add small header name in footer on pages after the first (if no custom footer)
        if (i > 1 && formSettings.pdfHeader && !formSettings.showFooter) {
          pdf.setFontSize(8);
          pdf.setTextColor(180, 180, 180);
          pdf.text(formSettings.pdfHeader, pageWidth - margin, footerY, { align: 'right' });
        }
      }
      
      const fileName = isBlank 
        ? `blank-form-template-${new Date().toISOString().split('T')[0]}.pdf`
        : `form-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      await trackPDFGeneration(currentUser.uid);
      setStatsRefreshTrigger(prev => prev + 1);
      
      alert(isBlank 
        ? '✅ Blank PDF template generated successfully!' 
        : '✅ Professional PDF generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('❌ Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSelectTemplate = (templateFields, templateName) => {
    // Create optimized row structure based on template
    const rows = [];
    let currentRow = null;
    
    // Analyze template fields to create optimal layout
    templateFields.forEach((field, index) => {
      const fieldWithId = { ...field, id: Date.now() + index };
      
      // Determine optimal columns based on field type and position
      if (!currentRow) {
        // Start new row
        const columnsForRow = determineOptimalColumns(templateFields, index);
        currentRow = {
          id: Date.now() + Math.random(),
          columns: columnsForRow,
          fields: [fieldWithId]
        };
      } else {
        // Check if we should start a new row
        const shouldStartNewRow = 
          currentRow.fields.length >= currentRow.columns ||
          ['heading1', 'heading2', 'paragraph', 'divider'].includes(field.type) ||
          (currentRow.fields.length > 0 && ['textarea', 'file', 'signature'].includes(field.type));
        
        if (shouldStartNewRow) {
          rows.push(currentRow);
          const columnsForRow = determineOptimalColumns(templateFields, index);
          currentRow = {
            id: Date.now() + Math.random(),
            columns: columnsForRow,
            fields: [fieldWithId]
          };
        } else {
          currentRow.fields.push(fieldWithId);
        }
      }
    });
    
    // Add last row
    if (currentRow && currentRow.fields.length > 0) {
      rows.push(currentRow);
    }
    
    // Update state
    setFormRowsStructure(rows);
    const flatFields = [];
    rows.forEach(row => {
      row.fields.forEach(field => {
        flatFields.push({ ...field, columns: row.columns, rowId: row.id });
      });
    });
    setFormFields(flatFields);
    setFormData({});
    setTemplateKey(Date.now());
    setCurrentView('builder');
    alert(`✅ Template "${templateName}" loaded with optimized layout!`);
  };
  
  // Helper function to determine optimal columns
  const determineOptimalColumns = (fields, startIndex) => {
    const field = fields[startIndex];
    
    // Layout fields always take full width
    if (['heading1', 'heading2', 'paragraph', 'divider'].includes(field.type)) {
      return 1;
    }
    
    // Large fields take full width
    if (['textarea', 'file', 'signature'].includes(field.type)) {
      return 1;
    }
    
    // Check next few fields to determine if they can be grouped
    let consecutiveSmallFields = 0;
    for (let i = startIndex; i < Math.min(startIndex + 3, fields.length); i++) {
      const f = fields[i];
      if (!['textarea', 'file', 'signature', 'heading1', 'heading2', 'paragraph', 'divider'].includes(f.type)) {
        consecutiveSmallFields++;
      } else {
        break;
      }
    }
    
    // If we have 3+ small fields, use 3 columns
    if (consecutiveSmallFields >= 3) return 3;
    // If we have 2 small fields, use 2 columns
    if (consecutiveSmallFields >= 2) return 2;
    // Otherwise single column
    return 1;
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
        fields: formFields,
        rowsStructure: formRowsStructure,
        settings: formSettings // Include PDF header settings
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
        centerControls={
          <>
            {/* Builder/Preview Toggle */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing[2],
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              background: theme.colors.secondary[50],
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.secondary[200]}`
            }}>
              <span style={{ 
                fontSize: theme.typography.fontSize.sm, 
                color: currentView === 'builder' ? theme.colors.secondary[900] : theme.colors.secondary[500],
                fontWeight: currentView === 'builder' ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal
              }}>
                Builder
              </span>
              <label style={{ 
                position: 'relative', 
                display: 'inline-block', 
                width: '44px', 
                height: '24px',
                cursor: 'pointer'
              }}>
                <input 
                  type="checkbox" 
                  checked={currentView === 'preview'}
                  onChange={() => setCurrentView(currentView === 'builder' ? 'preview' : 'builder')}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: currentView === 'preview' ? theme.colors.primary[500] : theme.colors.secondary[300],
                  borderRadius: '24px',
                  transition: 'background-color 0.2s',
                }}>
                  <span style={{
                    position: 'absolute',
                    left: currentView === 'preview' ? '22px' : '2px',
                    top: '2px',
                    height: '20px',
                    width: '20px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </span>
              </label>
              <span style={{ 
                fontSize: theme.typography.fontSize.sm, 
                color: currentView === 'preview' ? theme.colors.secondary[900] : theme.colors.secondary[500],
                fontWeight: currentView === 'preview' ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal
              }}>
                Preview
              </span>
            </div>

            {/* Form Options Dropdown */}
            <div className="form-options-container" style={{ position: 'relative' }}>
              <button
                onClick={() => setShowFormOptions(!showFormOptions)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  background: 'white',
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[700],
                  cursor: formFields.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: formFields.length === 0 ? 0.5 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (formFields.length > 0) {
                    e.currentTarget.style.borderColor = theme.colors.secondary[400];
                    e.currentTarget.style.background = theme.colors.secondary[50];
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.secondary[300];
                  e.currentTarget.style.background = 'white';
                }}
                disabled={formFields.length === 0}
              >
                <FileText size={16} />
                Form Options
                <ChevronDown size={14} style={{ 
                  transform: showFormOptions ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s'
                }} />
              </button>
              
              {/* Dropdown Menu */}
              {showFormOptions && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  background: 'white',
                  border: `1px solid ${theme.colors.secondary[200]}`,
                  borderRadius: theme.borderRadius.md,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '200px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => {
                      setShowFormOptions(false);
                      setShowShareModal(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.colors.secondary[700],
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.secondary[50]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Share2 size={16} />
                    Share Form
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowFormOptions(false);
                      setShowSaveDialog(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.colors.secondary[700],
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.secondary[50]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Save size={16} />
                    Save Form
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowFormOptions(false);
                      setShowLoadDialog(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${theme.colors.secondary[100]}`,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.colors.secondary[700],
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.secondary[50]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FolderOpen size={16} />
                    Load Form
                  </button>
                  
                  {/* Divider */}
                  <div style={{ borderTop: `1px solid ${theme.colors.secondary[100]}`, margin: 0 }} />
                  
                  <button
                    onClick={() => {
                      setShowFormOptions(false);
                      generatePDF(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.colors.secondary[700],
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.secondary[50]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    disabled={isGeneratingPDF}
                  >
                    <Download size={16} />
                    {isGeneratingPDF ? 'Generating...' : 'Generate Filled PDF'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowFormOptions(false);
                      generatePDF(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: theme.colors.secondary[700],
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.secondary[50]}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    disabled={isGeneratingPDF}
                  >
                    <FileText size={16} />
                    Generate Blank Template
                  </button>
                </div>
              )}
            </div>
          </>
        }
        rightContent={
          <UserDropdown
            user={currentUser}
            onProfileClick={() => setShowUserDashboard(true)}
            onSubmissionsClick={() => setShowSubmissions(true)}
          />
        }
      />

      <Layout.Section padding="none">
        <div style={{ width: '100%', maxWidth: '100%' }}>

          {currentView === 'builder' && (
            <RowBasedFormBuilder
              key={templateKey}
              onFieldsChange={handleFieldsChange}
              initialFields={formFields}
              initialRows={formRowsStructure}
              formSettings={formSettings}
              onSettingsChange={setFormSettings}
              onShowTemplates={() => setShowTemplates(true)}
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
                        {getFieldRows(true).map((row, rowIndex) => (
                          <div key={rowIndex} style={{ 
                            display: 'grid',
                            gridTemplateColumns: row.columns === 1 ? '1fr' : row.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                            gap: theme.spacing[4]
                          }}>
                            {(row.fields || []).map(field => {
                              
                              // Handle layout fields
                              if (field.type === 'heading1') {
                                return (
                                  <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>
                                      {field.content || 'Main Heading'}
                                    </h1>
                                  </div>
                                );
                              }
                              if (field.type === 'heading2') {
                                return (
                                  <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
                                      {field.content || 'Sub Heading'}
                                    </h2>
                                  </div>
                                );
                              }
                              if (field.type === 'paragraph') {
                                return (
                                  <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0', lineHeight: '1.6' }}>
                                      {field.content || 'Paragraph text...'}
                                    </p>
                                  </div>
                                );
                              }
                              if (field.type === 'divider') {
                                return (
                                  <div key={field.id} style={{ gridColumn: '1 / -1' }}>
                                    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />
                                  </div>
                                );
                              }
                              
                              // Regular form fields
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
                                  {renderFormField(field)}
                                </div>
                              );
                            })}
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
                  {(() => {
                    // Calculate pages for PDF preview
                    const A4_HEIGHT = 842; // A4 height at 72 DPI in pixels
                    const HEADER_HEIGHT = 120; // Approximate header height
                    const FOOTER_HEIGHT = 40; // Footer space
                    const MARGIN_TOP = 40;
                    const MARGIN_BOTTOM = 40;
                    const ROW_HEIGHT = 35; // Approximate height per field row
                    const USABLE_HEIGHT = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - FOOTER_HEIGHT;
                    const FIRST_PAGE_USABLE = USABLE_HEIGHT - HEADER_HEIGHT;
                    
                    let pages = [];
                    let currentPage = { rows: [], pageNumber: 1 };
                    let currentHeight = HEADER_HEIGHT;
                    
                    const fieldRows = getFieldRows(true); // Apply conditional logic for preview
                    
                    fieldRows.forEach((row, index) => {
                      // Estimate row height based on number of fields and columns
                      const estimatedHeight = row.columns > 1 ? ROW_HEIGHT : ROW_HEIGHT * 1.2;
                      const maxHeight = currentPage.pageNumber === 1 ? FIRST_PAGE_USABLE : USABLE_HEIGHT;
                      
                      if (currentHeight + estimatedHeight > maxHeight) {
                        // Start new page
                        pages.push(currentPage);
                        currentPage = { rows: [], pageNumber: currentPage.pageNumber + 1 };
                        currentHeight = MARGIN_TOP;
                      }
                      
                      currentPage.rows.push(row);
                      currentHeight += estimatedHeight;
                    });
                    
                    // Add last page
                    if (currentPage.rows.length > 0) {
                      pages.push(currentPage);
                    }
                    
                    // If no pages, create one empty page
                    if (pages.length === 0) {
                      pages.push({ rows: [], pageNumber: 1 });
                    }
                    
                    const totalPages = pages.length;
                    
                    return (
                      <div style={{
                        border: `1px solid ${theme.colors.secondary[200]}`,
                        borderRadius: theme.borderRadius.lg,
                        background: '#f8f8f8',
                        padding: '20px',
                        overflowY: 'auto',
                        maxHeight: '80vh'
                      }}>
                        {pages.map((page, pageIndex) => (
                          <div key={pageIndex} style={{
                            background: 'white',
                            width: '100%',
                            maxWidth: '595px', // A4 width at 72 DPI
                            margin: pageIndex > 0 ? '20px auto 0' : '0 auto',
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                            height: '842px', // Fixed A4 height
                            position: 'relative',
                            pageBreakAfter: 'always'
                          }}>
                            <div style={{
                              padding: '40px 30px',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              {/* Header only on first page */}
                              {pageIndex === 0 && (
                                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                  <h3 style={{ 
                                    margin: 0, 
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#333333',
                                    marginBottom: '8px'
                                  }}>
                                    {formSettings.pdfHeader || 'Form Submission'}
                                  </h3>
                                  {formSettings.pdfSubheader && (
                                    <p style={{ 
                                      color: '#666666', 
                                      margin: 0,
                                      fontSize: '14px',
                                      marginBottom: '6px'
                                    }}>
                                      {formSettings.pdfSubheader}
                                    </p>
                                  )}
                                  <p style={{ 
                                    color: '#999999', 
                                    margin: 0,
                                    fontSize: '11px' 
                                  }}>
                                    Date: {formSettings.pdfDate ? new Date(formSettings.pdfDate).toLocaleDateString() : new Date().toLocaleDateString()}
                                  </p>
                                  <div style={{
                                    height: '1px',
                                    background: '#cccccc',
                                    marginTop: '10px',
                                    marginBottom: '15px'
                                  }} />
                                </div>
                              )}
                              
                              {/* Content */}
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {page.rows.map((row, rowIndex) => (
                                  <div key={rowIndex} style={{
                                    display: 'grid',
                                    gridTemplateColumns: row.columns === 1 ? '1fr' : row.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                                    gap: '25px',
                                    marginBottom: '8px'
                                  }}>
                                    {(row.fields || []).map(field => {
                                      // Skip layout fields in PDF preview
                                      if (['heading1', 'heading2', 'paragraph', 'divider'].includes(field.type)) {
                                        return null;
                                      }
                                      return (
                                        <div key={field.id} style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '2px'
                                        }}>
                                          <span style={{
                                            fontSize: '9px',
                                            fontWeight: 'bold',
                                            color: '#333333'
                                          }}>
                                            {field.label}:
                                          </span>
                                          <span style={{ 
                                            fontSize: '9px',
                                            color: '#666666',
                                            wordBreak: 'break-word',
                                            lineHeight: '1.3'
                                          }}>
                                            {field.type === 'signature' ? (
                                              formData[field.id] && formData[field.id].startsWith('data:image') ? (
                                                <img 
                                                  src={formData[field.id]} 
                                                  alt="Signature" 
                                                  style={{ 
                                                    maxWidth: '80px', 
                                                    maxHeight: '40px',
                                                    border: '1px solid #e0e0e0'
                                                  }} 
                                                />
                                              ) : (
                                                <span style={{ fontStyle: 'italic' }}>[Sign here] _____________________</span>
                                              )
                                            ) : field.type === 'checkbox' ? (
                                              formData[field.id] ? '✓ Yes' : '✗ No'
                                            ) : field.type === 'rating' ? (
                                              formData[field.id] ? `${'★'.repeat(formData[field.id])}${'☆'.repeat(5-formData[field.id])} (${formData[field.id]}/5)` : '(Not rated)'
                                            ) : (
                                              formData[field.id] || '(Not filled)'
                                            )}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                              
                              {/* Footer */}
                              <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '30px',
                                right: '30px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '8px',
                                color: '#999999'
                              }}>
                                <span>Page {page.pageNumber} of {totalPages}</span>
                                {page.pageNumber > 1 && formSettings.pdfHeader && (
                                  <span>{formSettings.pdfHeader}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
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

      {/* Save Form Dialog */}
      {showSaveDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowSaveDialog(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>Save Form Template</h2>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '24px'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveTemplate}>
                Save Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Load Form Dialog */}
      {showLoadDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowLoadDialog(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '70vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '24px', color: '#1f2937' }}>Load Form Template</h2>
            {savedTemplates.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', margin: '32px 0' }}>
                No saved templates yet. Create and save a form template first.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedTemplates.map(template => (
                  <div key={template.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#1f2937' }}>{template.name}</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                        Created: {new Date(template.createdAt).toLocaleDateString()} • 
                        {template.fields?.length || 0} fields
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => loadTemplate(template)}
                      >
                        Load
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm"
                        leftIcon={<Copy size={14} />}
                        onClick={() => duplicateTemplate(template)}
                      >
                        Duplicate
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() => deleteTemplate(template.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowLoadDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FormBuilderApp;
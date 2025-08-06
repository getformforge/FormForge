// FormForge Professional Form Themes
// Beautiful, modern themes for form rendering

export const formThemes = {
  // Default/Modern Theme - Clean and professional
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with subtle shadows',
    styles: {
      // Container styles
      container: {
        background: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: 'none',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      // Form title
      title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '8px',
        lineHeight: '1.2'
      },
      // Form description
      description: {
        fontSize: '16px',
        color: '#6B7280',
        marginBottom: '32px',
        lineHeight: '1.5'
      },
      // Field wrapper
      fieldWrapper: {
        marginBottom: '24px',
        animation: 'fadeIn 0.3s ease-in-out'
      },
      // Field label
      label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '8px',
        display: 'block',
        letterSpacing: '0.025em'
      },
      // Input field styles
      input: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #D1D5DB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        color: '#111827',
        transition: 'all 0.2s ease',
        outline: 'none',
        boxSizing: 'border-box',
        '&:focus': {
          borderColor: '#3B82F6',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
        },
        '&:hover': {
          borderColor: '#9CA3AF'
        }
      },
      // Select dropdown
      select: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '16px',
        border: '1px solid #D1D5DB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        color: '#111827',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.2s ease',
        '&:focus': {
          borderColor: '#3B82F6',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
        }
      },
      // Checkbox and radio
      checkbox: {
        width: '20px',
        height: '20px',
        marginRight: '12px',
        cursor: 'pointer',
        accentColor: '#3B82F6'
      },
      // Submit button
      submitButton: {
        padding: '14px 32px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#FFFFFF',
        backgroundColor: '#3B82F6',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.25)',
        '&:hover': {
          backgroundColor: '#2563EB',
          transform: 'translateY(-1px)',
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
        },
        '&:active': {
          transform: 'translateY(0)'
        }
      },
      // Error message
      error: {
        color: '#EF4444',
        fontSize: '14px',
        marginTop: '4px'
      },
      // Help text
      helpText: {
        color: '#6B7280',
        fontSize: '14px',
        marginTop: '4px',
        fontStyle: 'italic'
      }
    }
  },

  // Glassmorphism Theme - Modern glass effect
  glass: {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Elegant frosted glass effect with depth',
    styles: {
      container: {
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      title: {
        fontSize: '34px',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '12px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      },
      description: {
        fontSize: '16px',
        color: '#475569',
        marginBottom: '36px',
        lineHeight: '1.6'
      },
      fieldWrapper: {
        marginBottom: '28px'
      },
      label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#334155',
        marginBottom: '10px',
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      },
      input: {
        width: '100%',
        padding: '14px 18px',
        fontSize: '16px',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(5px)',
        color: '#1e293b',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box',
        '&:focus': {
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.6)'
        }
      },
      select: {
        width: '100%',
        padding: '14px 18px',
        fontSize: '16px',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(5px)',
        color: '#1e293b',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.3s ease'
      },
      checkbox: {
        width: '22px',
        height: '22px',
        marginRight: '14px',
        cursor: 'pointer',
        accentColor: '#8b5cf6'
      },
      submitButton: {
        padding: '16px 40px',
        fontSize: '17px',
        fontWeight: '600',
        color: '#FFFFFF',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px 0 rgba(118, 75, 162, 0.4)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px 0 rgba(118, 75, 162, 0.5)'
        }
      },
      error: {
        color: '#dc2626',
        fontSize: '14px',
        marginTop: '6px',
        fontWeight: '500'
      },
      helpText: {
        color: '#64748b',
        fontSize: '14px',
        marginTop: '6px'
      }
    }
  },

  // Minimal Theme - Clean and simple
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with focus on content',
    styles: {
      container: {
        background: '#FFFFFF',
        borderRadius: '0',
        padding: '48px',
        boxShadow: 'none',
        border: '2px solid #000000',
        fontFamily: 'Helvetica, Arial, sans-serif'
      },
      title: {
        fontSize: '28px',
        fontWeight: '400',
        color: '#000000',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      },
      description: {
        fontSize: '14px',
        color: '#666666',
        marginBottom: '40px',
        lineHeight: '1.6',
        fontWeight: '300'
      },
      fieldWrapper: {
        marginBottom: '32px',
        borderBottom: '1px solid #E5E5E5',
        paddingBottom: '32px'
      },
      label: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#000000',
        marginBottom: '12px',
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.15em'
      },
      input: {
        width: '100%',
        padding: '12px 0',
        fontSize: '16px',
        border: 'none',
        borderBottom: '2px solid #000000',
        borderRadius: '0',
        backgroundColor: 'transparent',
        color: '#000000',
        transition: 'border-color 0.2s ease',
        outline: 'none',
        boxSizing: 'border-box',
        '&:focus': {
          borderBottomColor: '#000000',
          borderBottomWidth: '3px'
        },
        '&:hover': {
          borderBottomColor: '#333333'
        }
      },
      select: {
        width: '100%',
        padding: '12px 0',
        fontSize: '16px',
        border: 'none',
        borderBottom: '2px solid #000000',
        borderRadius: '0',
        backgroundColor: 'transparent',
        color: '#000000',
        cursor: 'pointer',
        outline: 'none'
      },
      checkbox: {
        width: '18px',
        height: '18px',
        marginRight: '16px',
        cursor: 'pointer',
        accentColor: '#000000'
      },
      submitButton: {
        padding: '16px 48px',
        fontSize: '14px',
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: '#000000',
        border: '2px solid #000000',
        borderRadius: '0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        '&:hover': {
          backgroundColor: '#FFFFFF',
          color: '#000000'
        }
      },
      error: {
        color: '#000000',
        fontSize: '12px',
        marginTop: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      },
      helpText: {
        color: '#666666',
        fontSize: '12px',
        marginTop: '8px'
      }
    }
  },

  // Corporate Theme - Professional business style
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional design for business forms',
    styles: {
      container: {
        background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
        borderRadius: '8px',
        padding: '40px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        border: '1px solid #E0E0E0',
        fontFamily: 'Georgia, serif'
      },
      title: {
        fontSize: '36px',
        fontWeight: '300',
        color: '#1a237e',
        marginBottom: '16px',
        borderBottom: '3px solid #1a237e',
        paddingBottom: '16px',
        fontFamily: 'Georgia, serif'
      },
      description: {
        fontSize: '16px',
        color: '#455a64',
        marginBottom: '32px',
        lineHeight: '1.7',
        fontStyle: 'italic'
      },
      fieldWrapper: {
        marginBottom: '28px',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #E8E8E8'
      },
      label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#263238',
        marginBottom: '10px',
        display: 'block',
        fontFamily: 'Arial, sans-serif'
      },
      input: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '15px',
        border: '1px solid #CFD8DC',
        borderRadius: '4px',
        backgroundColor: '#FAFAFA',
        color: '#263238',
        transition: 'all 0.2s ease',
        outline: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
        '&:focus': {
          borderColor: '#1a237e',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 2px rgba(26, 35, 126, 0.1)'
        }
      },
      select: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '15px',
        border: '1px solid #CFD8DC',
        borderRadius: '4px',
        backgroundColor: '#FAFAFA',
        color: '#263238',
        cursor: 'pointer',
        outline: 'none',
        fontFamily: 'Arial, sans-serif'
      },
      checkbox: {
        width: '20px',
        height: '20px',
        marginRight: '12px',
        cursor: 'pointer',
        accentColor: '#1a237e'
      },
      submitButton: {
        padding: '14px 40px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#FFFFFF',
        backgroundColor: '#1a237e',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        '&:hover': {
          backgroundColor: '#0d1854',
          boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)'
        }
      },
      error: {
        color: '#c62828',
        fontSize: '13px',
        marginTop: '6px',
        fontFamily: 'Arial, sans-serif'
      },
      helpText: {
        color: '#607d8b',
        fontSize: '13px',
        marginTop: '6px',
        fontStyle: 'italic'
      }
    }
  },

  // Dark Theme - Modern dark mode
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Elegant dark theme with vibrant accents',
    styles: {
      container: {
        background: 'linear-gradient(135deg, #1e1e2e 0%, #151521 100%)',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      title: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: '12px',
        background: 'linear-gradient(135deg, #00d4ff 0%, #7a73ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      },
      description: {
        fontSize: '16px',
        color: '#a0a0b8',
        marginBottom: '36px',
        lineHeight: '1.6'
      },
      fieldWrapper: {
        marginBottom: '28px'
      },
      label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#e0e0f0',
        marginBottom: '10px',
        display: 'block',
        letterSpacing: '0.025em'
      },
      input: {
        width: '100%',
        padding: '14px 18px',
        fontSize: '16px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#FFFFFF',
        transition: 'all 0.3s ease',
        outline: 'none',
        boxSizing: 'border-box',
        '&:focus': {
          borderColor: '#7a73ff',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 20px rgba(122, 115, 255, 0.3)'
        },
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.07)'
        },
        '&::placeholder': {
          color: '#6b6b80'
        }
      },
      select: {
        width: '100%',
        padding: '14px 18px',
        fontSize: '16px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#FFFFFF',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.3s ease',
        '& option': {
          backgroundColor: '#1e1e2e',
          color: '#FFFFFF'
        }
      },
      checkbox: {
        width: '22px',
        height: '22px',
        marginRight: '14px',
        cursor: 'pointer',
        accentColor: '#7a73ff',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid rgba(255, 255, 255, 0.2)'
      },
      submitButton: {
        padding: '16px 40px',
        fontSize: '17px',
        fontWeight: '600',
        color: '#FFFFFF',
        background: 'linear-gradient(135deg, #00d4ff 0%, #7a73ff 100%)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(122, 115, 255, 0.4)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px rgba(122, 115, 255, 0.6)'
        }
      },
      error: {
        color: '#ff6b6b',
        fontSize: '14px',
        marginTop: '6px',
        fontWeight: '500'
      },
      helpText: {
        color: '#8080a0',
        fontSize: '14px',
        marginTop: '6px'
      }
    }
  }
};

// Helper function to apply theme styles
export const applyThemeStyles = (element, styles) => {
  // Handle pseudo-selectors and nested styles
  const processedStyles = {};
  
  Object.entries(styles).forEach(([key, value]) => {
    if (key.startsWith('&:')) {
      // Handle pseudo-selectors (hover, focus, etc.)
      // These will need to be applied via CSS classes or inline event handlers
      return;
    }
    processedStyles[key] = value;
  });
  
  return processedStyles;
};

// Get theme by ID
export const getThemeById = (themeId) => {
  return formThemes[themeId] || formThemes.modern;
};

// Get all theme options for selector
export const getThemeOptions = () => {
  return Object.entries(formThemes).map(([key, theme]) => ({
    value: key,
    label: theme.name,
    description: theme.description
  }));
};

// Generate CSS for dynamic theme application
export const generateThemeCSS = (themeId) => {
  const theme = getThemeById(themeId);
  if (!theme) return '';
  
  return `
    .form-theme-${themeId} {
      /* Container styles */
      ${Object.entries(theme.styles.container)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} .form-title {
      ${Object.entries(theme.styles.title)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} .form-description {
      ${Object.entries(theme.styles.description)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} .field-wrapper {
      ${Object.entries(theme.styles.fieldWrapper)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} label {
      ${Object.entries(theme.styles.label)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} input[type="text"],
    .form-theme-${themeId} input[type="email"],
    .form-theme-${themeId} input[type="tel"],
    .form-theme-${themeId} input[type="number"],
    .form-theme-${themeId} input[type="date"],
    .form-theme-${themeId} input[type="time"],
    .form-theme-${themeId} input[type="url"],
    .form-theme-${themeId} textarea {
      ${Object.entries(theme.styles.input)
        .filter(([key]) => !key.startsWith('&'))
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} select {
      ${Object.entries(theme.styles.select)
        .filter(([key]) => !key.startsWith('&'))
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} input[type="checkbox"],
    .form-theme-${themeId} input[type="radio"] {
      ${Object.entries(theme.styles.checkbox)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} .submit-button {
      ${Object.entries(theme.styles.submitButton)
        .filter(([key]) => !key.startsWith('&'))
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    /* Hover states */
    .form-theme-${themeId} input:hover,
    .form-theme-${themeId} textarea:hover {
      ${theme.styles.input['&:hover'] ? Object.entries(theme.styles.input['&:hover'])
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ') : ''}
    }
    
    .form-theme-${themeId} input:focus,
    .form-theme-${themeId} textarea:focus {
      ${theme.styles.input['&:focus'] ? Object.entries(theme.styles.input['&:focus'])
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ') : ''}
    }
    
    .form-theme-${themeId} .submit-button:hover {
      ${theme.styles.submitButton['&:hover'] ? Object.entries(theme.styles.submitButton['&:hover'])
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ') : ''}
    }
    
    .form-theme-${themeId} .error-message {
      ${Object.entries(theme.styles.error)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
    
    .form-theme-${themeId} .help-text {
      ${Object.entries(theme.styles.helpText)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join('\n      ')}
    }
  `;
};

export default formThemes;
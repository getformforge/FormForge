// FormForge Design System - Unified Theme
export const theme = {
  // Color Palette
  colors: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#ff6b35', // Main brand color
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb'
    }
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },

  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem'
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px'
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #ff6b35 0%, #e63946 100%)',
    secondary: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    hero: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    card: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)'
  },

  // Component Styles
  components: {
    // Button variants
    button: {
      primary: {
        background: 'linear-gradient(45deg, #ff6b35, #e63946)',
        color: '#ffffff',
        border: '2px solid transparent',
        boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.39)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px 0 rgba(255, 107, 53, 0.49)'
        }
      },
      secondary: {
        background: 'rgba(100, 116, 139, 0.1)',
        color: '#64748b',
        border: '2px solid rgba(100, 116, 139, 0.2)',
        '&:hover': {
          background: 'rgba(100, 116, 139, 0.2)',
          color: '#475569'
        }
      },
      success: {
        background: 'linear-gradient(45deg, #22c55e, #16a34a)',
        color: '#ffffff',
        border: '2px solid transparent',
        boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.39)'
      },
      ghost: {
        background: 'transparent',
        color: '#64748b',
        border: '2px solid transparent',
        '&:hover': {
          background: 'rgba(100, 116, 139, 0.1)',
          color: '#475569'
        }
      }
    },

    // Card styles
    card: {
      base: {
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 107, 53, 0.1)',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '2rem'
      },
      glass: {
        background: 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
      }
    },

    // Input styles
    input: {
      base: {
        background: 'rgba(248, 250, 252, 0.8)',
        border: '2px solid rgba(100, 116, 139, 0.2)',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        color: '#1e293b',
        transition: 'all 0.2s ease',
        '&:focus': {
          outline: 'none',
          borderColor: '#ff6b35',
          boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)'
        }
      },
      error: {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
      }
    }
  }
};

// Helper functions for responsive design
export const responsive = {
  // Media query helper
  media: (breakpoint) => `@media (min-width: ${theme.breakpoints[breakpoint]})`,
  
  // Responsive spacing
  spacing: (mobile, tablet, desktop) => ({
    padding: theme.spacing[mobile],
    [responsive.media('md')]: {
      padding: theme.spacing[tablet]
    },
    [responsive.media('lg')]: {
      padding: theme.spacing[desktop]
    }
  })
};

// Utility functions
export const utils = {
  // Create hover effects
  hover: (styles) => ({
    transition: 'all 0.2s ease',
    '&:hover': styles
  }),

  // Create focus effects
  focus: (color = theme.colors.primary[500]) => ({
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${color}20`
    }
  }),

  // Typography combinations
  heading: (size = '2xl', weight = 'bold') => ({
    fontSize: theme.typography.fontSize[size],
    fontWeight: theme.typography.fontWeight[weight],
    lineHeight: theme.typography.lineHeight.tight,
    color: theme.colors.secondary[900]
  }),

  body: (size = 'base') => ({
    fontSize: theme.typography.fontSize[size],
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: theme.typography.lineHeight.normal,
    color: theme.colors.secondary[700]
  })
};
import React from 'react';
import { theme } from '../../styles/theme';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: {
      background: theme.gradients.primary,
      color: '#ffffff',
      border: '2px solid transparent',
      boxShadow: '0 4px 14px 0 rgba(255, 107, 53, 0.39)',
      '&:hover': !disabled && {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(255, 107, 53, 0.49)'
      }
    },
    secondary: {
      background: 'rgba(100, 116, 139, 0.1)',
      color: theme.colors.secondary[700],
      border: `2px solid rgba(100, 116, 139, 0.2)`,
      '&:hover': !disabled && {
        background: 'rgba(100, 116, 139, 0.2)',
        color: theme.colors.secondary[800]
      }
    },
    success: {
      background: theme.gradients.success,
      color: '#ffffff',
      border: '2px solid transparent',
      boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.39)'
    },
    ghost: {
      background: 'transparent',
      color: theme.colors.secondary[600],
      border: '2px solid transparent',
      '&:hover': !disabled && {
        background: 'rgba(100, 116, 139, 0.1)',
        color: theme.colors.secondary[700]
      }
    },
    danger: {
      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
      color: '#ffffff',
      border: '2px solid transparent',
      boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)'
    }
  };

  const sizes = {
    sm: {
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium
    },
    md: {
      padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.semibold
    },
    lg: {
      padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold
    },
    xl: {
      padding: `${theme.spacing[5]} ${theme.spacing[10]}`,
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    textDecoration: 'none',
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    ...sizes[size],
    ...variants[variant],
    ...(disabled && {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    })
  };

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      style={baseStyles}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {leftIcon && !loading && leftIcon}
      {children}
      {rightIcon && !loading && rightIcon}
      
      {/* Add keyframe animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;
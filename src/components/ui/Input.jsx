import React, { forwardRef } from 'react';
import { theme } from '../../styles/theme';

const Input = forwardRef(({ 
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
  style = {},
  ...props 
}, ref) => {
  const sizes = {
    sm: {
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      fontSize: theme.typography.fontSize.sm
    },
    md: {
      padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
      fontSize: theme.typography.fontSize.base
    },
    lg: {
      padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
      fontSize: theme.typography.fontSize.lg
    }
  };

  const inputStyles = {
    width: '100%',
    background: theme.components.input.base.background,
    border: error 
      ? `2px solid ${theme.colors.error[500]}` 
      : theme.components.input.base.border,
    borderRadius: theme.components.input.base.borderRadius,
    color: theme.components.input.base.color,
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    transition: theme.components.input.base.transition,
    outline: 'none',
    ...sizes[size],
    ...(disabled && {
      opacity: 0.6,
      cursor: 'not-allowed'
    }),
    ...(leftIcon && {
      paddingLeft: `${theme.spacing[10]}`
    }),
    ...(rightIcon && {
      paddingRight: `${theme.spacing[10]}`
    }),
    '&:focus': {
      borderColor: error ? theme.colors.error[500] : theme.colors.primary[500],
      boxShadow: error 
        ? `0 0 0 3px ${theme.colors.error[500]}20`
        : `0 0 0 3px ${theme.colors.primary[500]}20`
    },
    ...style
  };

  const labelStyles = {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.secondary[700],
    marginBottom: theme.spacing[2]
  };

  const containerStyles = {
    position: 'relative',
    width: '100%'
  };

  const iconStyles = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.secondary[400],
    pointerEvents: 'none'
  };

  const leftIconStyles = {
    ...iconStyles,
    left: theme.spacing[3]
  };

  const rightIconStyles = {
    ...iconStyles,
    right: theme.spacing[3]
  };

  const helperTextStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: error ? theme.colors.error[600] : theme.colors.secondary[500],
    marginTop: theme.spacing[1]
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && (
            <span style={{ color: theme.colors.error[500], marginLeft: theme.spacing[1] }}>
              *
            </span>
          )}
        </label>
      )}
      
      <div style={containerStyles}>
        {leftIcon && (
          <div style={leftIconStyles}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={inputStyles}
          className={className}
          onFocus={(e) => {
            e.target.style.borderColor = error ? theme.colors.error[500] : theme.colors.primary[500];
            e.target.style.boxShadow = error 
              ? `0 0 0 3px ${theme.colors.error[500]}20`
              : `0 0 0 3px ${theme.colors.primary[500]}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error 
              ? theme.colors.error[500] 
              : 'rgba(100, 116, 139, 0.2)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />
        
        {rightIcon && (
          <div style={rightIconStyles}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div style={helperTextStyles}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
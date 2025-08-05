import React from 'react';
import { theme } from '../../styles/theme';

const Card = ({ 
  children, 
  variant = 'base',
  padding = 'default',
  className = '',
  style = {},
  ...props 
}) => {
  const variants = {
    base: {
      background: theme.components.card.base.background,
      backdropFilter: theme.components.card.base.backdropFilter,
      border: theme.components.card.base.border,
      borderRadius: theme.components.card.base.borderRadius,
      boxShadow: theme.components.card.base.boxShadow
    },
    glass: {
      background: theme.components.card.glass.background,
      backdropFilter: theme.components.card.glass.backdropFilter,
      border: theme.components.card.glass.border,
      borderRadius: theme.components.card.glass.borderRadius,
      boxShadow: theme.components.card.glass.boxShadow
    },
    outline: {
      background: 'transparent',
      border: `2px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.xl,
      boxShadow: 'none'
    },
    elevated: {
      background: '#ffffff',
      border: 'none',
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.boxShadow.xl
    }
  };

  const paddings = {
    none: '0',
    sm: theme.spacing[4],
    default: theme.spacing[6],
    lg: theme.spacing[8],
    xl: theme.spacing[10]
  };

  const cardStyles = {
    position: 'relative',
    width: '100%',
    padding: paddings[padding],
    ...variants[variant],
    ...style
  };

  return (
    <div 
      style={cardStyles}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', style = {} }) => {
  return (
    <div 
      style={{
        marginBottom: theme.spacing[6],
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', style = {} }) => {
  return (
    <h3 
      style={{
        fontSize: theme.typography.fontSize['2xl'],
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.secondary[900],
        margin: 0,
        marginBottom: theme.spacing[2],
        lineHeight: theme.typography.lineHeight.tight,
        ...style
      }}
      className={className}
    >
      {children}
    </h3>
  );
};

const CardSubtitle = ({ children, className = '', style = {} }) => {
  return (
    <p 
      style={{
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.secondary[600],
        margin: 0,
        lineHeight: theme.typography.lineHeight.relaxed,
        ...style
      }}
      className={className}
    >
      {children}
    </p>
  );
};

const CardContent = ({ children, className = '', style = {} }) => {
  return (
    <div 
      style={{
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', style = {} }) => {
  return (
    <div 
      style={{
        marginTop: theme.spacing[6],
        paddingTop: theme.spacing[6],
        borderTop: `1px solid ${theme.colors.secondary[200]}`,
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// Export compound component
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
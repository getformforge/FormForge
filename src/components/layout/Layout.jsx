import React from 'react';
import { theme } from '../../styles/theme';

const Layout = ({ children, variant = 'default' }) => {
  const variants = {
    default: {
      minHeight: '100vh',
      background: theme.gradients.background,
      position: 'relative'
    },
    landing: {
      minHeight: '100vh',
      background: theme.gradients.hero,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }
    }
  };

  return (
    <div style={variants[variant]}>
      {/* Background overlay for landing variant */}
      {variant === 'landing' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />
      )}
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};

const Container = ({ children, size = 'default', className = '' }) => {
  const sizes = {
    sm: '640px',
    default: '1200px',
    lg: '1400px',
    full: '100%'
  };

  return (
    <div 
      style={{
        maxWidth: sizes[size],
        margin: '0 auto',
        padding: `0 ${theme.spacing[5]}`,
        width: '100%'
      }}
      className={className}
    >
      {children}
    </div>
  );
};

const Section = ({ children, padding = 'default', className = '', style = {}, id, ...props }) => {
  const paddings = {
    none: '0',
    sm: `${theme.spacing[8]} 0`,
    default: `${theme.spacing[16]} 0`,
    lg: `${theme.spacing[24]} 0`,
    xl: `${theme.spacing[32]} 0`
  };

  return (
    <section 
      id={id}
      style={{
        padding: paddings[padding],
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </section>
  );
};

const Grid = ({ children, cols = 1, gap = 6, className = '', style = {} }) => {
  const colsMap = {
    1: 'repeat(1, minmax(0, 1fr))',
    2: 'repeat(2, minmax(0, 1fr))',
    3: 'repeat(3, minmax(0, 1fr))',
    4: 'repeat(4, minmax(0, 1fr))',
    auto: 'repeat(auto-fit, minmax(300px, 1fr))'
  };

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: colsMap[cols],
        gap: theme.spacing[gap],
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
};

const Flex = ({ 
  children, 
  direction = 'row', 
  align = 'stretch', 
  justify = 'flex-start',
  gap = 0,
  wrap = 'nowrap',
  className = '',
  style = {}
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        gap: gap > 0 ? theme.spacing[gap] : 0,
        flexWrap: wrap,
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// Export compound component
Layout.Container = Container;
Layout.Section = Section;
Layout.Grid = Grid;
Layout.Flex = Flex;

export default Layout;
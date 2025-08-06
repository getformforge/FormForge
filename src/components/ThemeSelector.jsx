import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { theme } from '../styles/theme';

const ThemeSelector = ({ currentTheme, onThemeChange, isPreview = false }) => {
  const [showThemePanel, setShowThemePanel] = useState(false);
  
  const themes = [
    { value: 'modern', label: 'Modern', color: '#3B82F6' },
    { value: 'glass', label: 'Glass', color: '#8B5CF6' },
    { value: 'minimal', label: 'Minimal', color: '#000000' },
    { value: 'corporate', label: 'Corporate', color: '#1A237E' },
    { value: 'dark', label: 'Dark', color: '#7A73FF' }
  ];

  const handleThemeSelect = (themeId) => {
    onThemeChange(themeId);
    setShowThemePanel(false);
  };

  const currentThemeData = themes.find(t => t.value === currentTheme) || themes[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowThemePanel(!showThemePanel)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: 'rgba(100, 116, 139, 0.1)',
          border: '2px solid rgba(100, 116, 139, 0.2)',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          color: theme.colors.secondary[700],
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '110px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(100, 116, 139, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(100, 116, 139, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.2)';
        }}
      >
        <Palette size={14} />
        <span>Theme: {currentThemeData.label}</span>
      </button>

      {showThemePanel && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 999
            }}
            onClick={() => setShowThemePanel(false)}
          />
          
          {/* Theme Panel */}
          <div
            style={{
              position: 'absolute',
              top: '36px',
              right: '0',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              padding: '8px',
              width: '140px',
              zIndex: 1000
            }}
          >
            {themes.map((theme) => (
              <div
                key={theme.value}
                onClick={() => handleThemeSelect(theme.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.2s ease',
                  fontSize: '13px',
                  fontWeight: currentTheme === theme.value ? '600' : '400',
                  color: currentTheme === theme.value ? theme.color : '#374151',
                  background: currentTheme === theme.value ? `${theme.color}10` : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== theme.value) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== theme.value) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: theme.color,
                  border: theme.value === 'minimal' ? '1px solid #000' : 'none'
                }} />
                {theme.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
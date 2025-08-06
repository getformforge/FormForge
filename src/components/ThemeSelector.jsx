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
      <div
        onClick={() => setShowThemePanel(!showThemePanel)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: 'rgba(100, 116, 139, 0.1)',
          border: '2px solid rgba(100, 116, 139, 0.2)',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: theme.colors.secondary[700],
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(100, 116, 139, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.3)';
          e.currentTarget.style.color = theme.colors.secondary[800];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(100, 116, 139, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.2)';
          e.currentTarget.style.color = theme.colors.secondary[700];
        }}
      >
        <Palette size={16} />
        <span>Theme: {currentThemeData.label}</span>
      </div>

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
              top: '44px',
              right: '0',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              padding: '8px',
              width: '160px',
              zIndex: 1000
            }}
          >
            {themes.map((themeOption) => (
              <div
                key={themeOption.value}
                onClick={() => handleThemeSelect(themeOption.value)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'background 0.2s ease',
                  fontSize: '14px',
                  fontWeight: currentTheme === themeOption.value ? '600' : '400',
                  color: currentTheme === themeOption.value ? themeOption.color : '#374151',
                  backgroundColor: currentTheme === themeOption.value ? `${themeOption.color}10` : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== themeOption.value) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== themeOption.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  backgroundColor: themeOption.color,
                  border: themeOption.value === 'minimal' ? '1px solid #e5e7eb' : 'none',
                  flexShrink: 0
                }} />
                <span>{themeOption.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
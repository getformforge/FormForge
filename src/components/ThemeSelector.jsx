import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { getThemeOptions } from '../styles/formThemes';
import Button from './ui/Button';

const ThemeSelector = ({ currentTheme, onThemeChange, isPreview = false }) => {
  const [showThemePanel, setShowThemePanel] = useState(false);
  const themes = getThemeOptions();

  const handleThemeSelect = (themeId) => {
    onThemeChange(themeId);
    setShowThemePanel(false);
  };

  const themePreviewStyles = {
    modern: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
      border: '2px solid #e5e7eb',
      color: '#111827'
    },
    glass: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.9) 100%)',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      color: '#1e293b'
    },
    minimal: {
      background: '#ffffff',
      border: '2px solid #000000',
      color: '#000000'
    },
    corporate: {
      background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
      border: '2px solid #1a237e',
      color: '#1a237e'
    },
    dark: {
      background: 'linear-gradient(135deg, #1e1e2e 0%, #151521 100%)',
      border: '2px solid rgba(122, 115, 255, 0.5)',
      color: '#ffffff'
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setShowThemePanel(!showThemePanel)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        <Palette size={18} />
        Theme: {themes.find(t => t.value === currentTheme)?.label || 'Modern'}
      </Button>

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
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 999
            }}
            onClick={() => setShowThemePanel(false)}
          />
          
          {/* Theme Panel */}
          <div
            style={{
              position: 'absolute',
              top: '45px',
              left: isPreview ? 'auto' : '0',
              right: isPreview ? '0' : 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              padding: '20px',
              width: '320px',
              zIndex: 1000,
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827'
            }}>
              Choose Form Theme
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {themes.map((theme) => (
                <div
                  key={theme.value}
                  onClick={() => handleThemeSelect(theme.value)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ...themePreviewStyles[theme.value],
                    opacity: currentTheme === theme.value ? 1 : 0.85,
                    transform: currentTheme === theme.value ? 'scale(1.02)' : 'scale(1)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    if (currentTheme !== theme.value) {
                      e.currentTarget.style.opacity = '0.85';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        {theme.label}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        opacity: 0.8
                      }}>
                        {theme.description}
                      </div>
                    </div>
                    {currentTheme === theme.value && (
                      <Check 
                        size={20} 
                        style={{
                          color: theme.value === 'dark' ? '#7a73ff' : '#3b82f6'
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              <strong>Pro Tip:</strong> Themes affect how your form appears to users when shared. Choose one that matches your brand identity.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
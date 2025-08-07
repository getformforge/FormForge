import React, { useState } from 'react';
import { Settings, Upload, AlignLeft, AlignCenter, AlignRight, Calendar, Hash, Type, Palette, Eye, EyeOff } from 'lucide-react';
import { theme } from '../../styles/theme';

const PDFHeaderSettings = ({ settings, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoPreview, setLogoPreview] = useState(settings?.logo || null);

  const handleSettingChange = (key, value) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        handleSettingChange('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const defaultSettings = {
    pdfHeader: '',
    pdfSubheader: '',
    pdfDate: new Date().toISOString().split('T')[0],
    showHeader: true,
    showDate: true,
    showPageNumbers: true,
    headerAlignment: 'center',
    headerFontSize: '20',
    subheaderFontSize: '14',
    headerColor: '#333333',
    logo: null,
    logoPosition: 'left',
    footerText: '',
    showFooter: false,
    ...settings
  };

  return (
    <div style={{
      background: theme.colors.secondary[50],
      border: `1px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[4],
      marginBottom: theme.spacing[6]
    }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: isExpanded ? theme.spacing[4] : 0
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <Settings size={18} style={{ color: theme.colors.secondary[600] }} />
          <h3 style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.secondary[900],
            margin: 0
          }}>
            PDF Header & Branding
          </h3>
        </div>
        <div style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
          color: theme.colors.secondary[500]
        }}>
          ⌄
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
          
          {/* Logo Upload */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Company Logo
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  background: 'white',
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[600],
                  transition: 'all 0.2s'
                }}>
                  <Upload size={16} />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {logoPreview && (
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    style={{ 
                      height: '40px', 
                      borderRadius: theme.borderRadius.sm,
                      border: `1px solid ${theme.colors.secondary[200]}`
                    }} 
                  />
                )}
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Logo Position
              </label>
              <select
                value={defaultSettings.logoPosition}
                onChange={(e) => handleSettingChange('logoPosition', e.target.value)}
                style={{
                  width: '100%',
                  padding: theme.spacing[2],
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[900],
                  background: 'white'
                }}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="center">Center</option>
              </select>
            </div>
          </div>

          {/* Header Text */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing[4] }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Header Title
              </label>
              <input
                type="text"
                value={defaultSettings.pdfHeader}
                onChange={(e) => handleSettingChange('pdfHeader', e.target.value)}
                placeholder="e.g., Company Name or Form Title"
                style={{
                  width: '100%',
                  padding: theme.spacing[2],
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Font Size
              </label>
              <select
                value={defaultSettings.headerFontSize}
                onChange={(e) => handleSettingChange('headerFontSize', e.target.value)}
                style={{
                  width: '100%',
                  padding: theme.spacing[2],
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[900],
                  background: 'white'
                }}
              >
                <option value="16">Small (16px)</option>
                <option value="18">Medium (18px)</option>
                <option value="20">Large (20px)</option>
                <option value="24">Extra Large (24px)</option>
              </select>
            </div>
          </div>

          {/* Subheader */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing[4] }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Subheader Text
              </label>
              <input
                type="text"
                value={defaultSettings.pdfSubheader}
                onChange={(e) => handleSettingChange('pdfSubheader', e.target.value)}
                placeholder="e.g., Department or Description"
                style={{
                  width: '100%',
                  padding: theme.spacing[2],
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Alignment
              </label>
              <div style={{ display: 'flex', gap: theme.spacing[1] }}>
                <button
                  onClick={() => handleSettingChange('headerAlignment', 'left')}
                  style={{
                    flex: 1,
                    padding: theme.spacing[2],
                    background: defaultSettings.headerAlignment === 'left' ? theme.colors.primary[100] : 'white',
                    border: `1px solid ${defaultSettings.headerAlignment === 'left' ? theme.colors.primary[500] : theme.colors.secondary[300]}`,
                    borderRadius: `${theme.borderRadius.md} 0 0 ${theme.borderRadius.md}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <AlignLeft size={16} style={{ color: defaultSettings.headerAlignment === 'left' ? theme.colors.primary[600] : theme.colors.secondary[600] }} />
                </button>
                <button
                  onClick={() => handleSettingChange('headerAlignment', 'center')}
                  style={{
                    flex: 1,
                    padding: theme.spacing[2],
                    background: defaultSettings.headerAlignment === 'center' ? theme.colors.primary[100] : 'white',
                    border: `1px solid ${defaultSettings.headerAlignment === 'center' ? theme.colors.primary[500] : theme.colors.secondary[300]}`,
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <AlignCenter size={16} style={{ color: defaultSettings.headerAlignment === 'center' ? theme.colors.primary[600] : theme.colors.secondary[600] }} />
                </button>
                <button
                  onClick={() => handleSettingChange('headerAlignment', 'right')}
                  style={{
                    flex: 1,
                    padding: theme.spacing[2],
                    background: defaultSettings.headerAlignment === 'right' ? theme.colors.primary[100] : 'white',
                    border: `1px solid ${defaultSettings.headerAlignment === 'right' ? theme.colors.primary[500] : theme.colors.secondary[300]}`,
                    borderRadius: `0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <AlignRight size={16} style={{ color: defaultSettings.headerAlignment === 'right' ? theme.colors.primary[600] : theme.colors.secondary[600] }} />
                </button>
              </div>
            </div>
          </div>

          {/* Date and Color */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing[4] }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Document Date
              </label>
              <input
                type="date"
                value={defaultSettings.pdfDate}
                onChange={(e) => handleSettingChange('pdfDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: theme.spacing[2],
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Header Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <input
                  type="color"
                  value={defaultSettings.headerColor}
                  onChange={(e) => handleSettingChange('headerColor', e.target.value)}
                  style={{
                    width: '40px',
                    height: '34px',
                    border: `1px solid ${theme.colors.secondary[300]}`,
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={defaultSettings.headerColor}
                  onChange={(e) => handleSettingChange('headerColor', e.target.value)}
                  style={{
                    flex: 1,
                    padding: theme.spacing[2],
                    border: `1px solid ${theme.colors.secondary[300]}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.secondary[700],
                marginBottom: theme.spacing[2]
              }}>
                Display Options
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], fontSize: theme.typography.fontSize.sm }}>
                  <input
                    type="checkbox"
                    checked={defaultSettings.showDate}
                    onChange={(e) => handleSettingChange('showDate', e.target.checked)}
                  />
                  Show Date
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], fontSize: theme.typography.fontSize.sm }}>
                  <input
                    type="checkbox"
                    checked={defaultSettings.showPageNumbers}
                    onChange={(e) => handleSettingChange('showPageNumbers', e.target.checked)}
                  />
                  Page Numbers
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.secondary[700],
              marginBottom: theme.spacing[2]
            }}>
              <input
                type="checkbox"
                checked={defaultSettings.showFooter}
                onChange={(e) => handleSettingChange('showFooter', e.target.checked)}
              />
              Custom Footer
            </label>
            {defaultSettings.showFooter && (
              <input
                type="text"
                value={defaultSettings.footerText}
                onChange={(e) => handleSettingChange('footerText', e.target.value)}
                placeholder="e.g., © 2024 Company Name. All rights reserved."
                style={{
                  width: '100%',
                  padding: theme.spacing[2],
                  border: `1px solid ${theme.colors.secondary[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm
                }}
              />
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default PDFHeaderSettings;
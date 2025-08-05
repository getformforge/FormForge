import React, { useState, useRef } from 'react';
import { Calendar, Upload, Star, PenTool, Plus, Minus, Eye, EyeOff } from 'lucide-react';
import { theme } from '../../styles/theme';
import Button from '../ui/Button';

// Enhanced Text Area with rich features
export const AdvancedTextArea = ({ field, value, onChange, error }) => {
  const [charCount, setCharCount] = useState(value?.length || 0);
  const maxLength = field.maxLength || 500;

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange(newValue);
  };

  return (
    <div style={{ width: '100%' }}>
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder={field.placeholder}
        maxLength={maxLength}
        rows={field.rows || 4}
        style={{
          width: '100%',
          padding: theme.spacing[3],
          border: error ? `2px solid ${theme.colors.error[500]}` : `2px solid ${theme.colors.secondary[200]}`,
          borderRadius: theme.borderRadius.lg,
          fontSize: theme.typography.fontSize.base,
          fontFamily: theme.typography.fontFamily.sans.join(', '),
          resize: 'vertical',
          minHeight: '100px',
          lineHeight: theme.typography.lineHeight.relaxed,
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.colors.primary[500];
          e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary[500]}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? theme.colors.error[500] : theme.colors.secondary[200];
          e.target.style.boxShadow = 'none';
        }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing[1],
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.secondary[500]
      }}>
        <span>{charCount}/{maxLength} characters</span>
        {field.helperText && <span>{field.helperText}</span>}
      </div>
    </div>
  );
};

// Enhanced Date Picker with range support
export const AdvancedDatePicker = ({ field, value, onChange }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={field.dateType || 'date'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        min={field.minDate}
        max={field.maxDate}
        style={{
          width: '100%',
          padding: theme.spacing[3],
          border: `2px solid ${theme.colors.secondary[200]}`,
          borderRadius: theme.borderRadius.lg,
          fontSize: theme.typography.fontSize.base,
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.colors.primary[500];
          e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary[500]}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.colors.secondary[200];
          e.target.style.boxShadow = 'none';
        }}
      />
      <Calendar 
        size={20} 
        style={{
          position: 'absolute',
          right: theme.spacing[3],
          top: '50%',
          transform: 'translateY(-50%)',
          color: theme.colors.secondary[400],
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

// Enhanced File Upload with preview
export const AdvancedFileUpload = ({ field, value, onChange }) => {
  const fileInputRef = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (file) => {
    if (file) {
      onChange(file.name);
      
      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  return (
    <div>
      <div
        style={{
          border: `2px dashed ${dragOver ? theme.colors.primary[500] : theme.colors.secondary[300]}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[8],
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          background: dragOver ? `${theme.colors.primary[50]}` : 'transparent'
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={32} style={{ color: theme.colors.secondary[400], marginBottom: theme.spacing[3] }} />
        <div style={{ marginBottom: theme.spacing[2] }}>
          <strong>Click to upload</strong> or drag and drop
        </div>
        <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.secondary[500] }}>
          {field.acceptedTypes || 'Any file type'} • Max {field.maxSize || '10MB'}
        </div>
        {value && (
          <div style={{
            marginTop: theme.spacing[4],
            padding: theme.spacing[2],
            background: theme.colors.success[50],
            borderRadius: theme.borderRadius.md,
            color: theme.colors.success[700]
          }}>
            ✓ {value}
          </div>
        )}
      </div>
      
      {preview && (
        <div style={{ marginTop: theme.spacing[4] }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.boxShadow.md
            }}
          />
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept={field.acceptedTypes}
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />
    </div>
  );
};

// Enhanced Rating with custom scale
export const AdvancedRating = ({ field, value, onChange }) => {
  const maxRating = field.maxRating || 5;
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', gap: theme.spacing[1], marginBottom: theme.spacing[2] }}>
        {Array.from({ length: maxRating }, (_, i) => {
          const rating = i + 1;
          const isActive = rating <= (hoverRating || value || 0);
          
          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              onMouseEnter={() => setHoverRating(rating)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: theme.spacing[1],
                transition: 'all 0.2s ease'
              }}
            >
              <Star
                size={24}
                fill={isActive ? theme.colors.warning[500] : 'none'}
                color={isActive ? theme.colors.warning[500] : theme.colors.secondary[300]}
              />
            </button>
          );
        })}
      </div>
      <div style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.secondary[600]
      }}>
        {value ? `${value} out of ${maxRating}` : `Rate from 1 to ${maxRating}`}
      </div>
    </div>
  );
};

// Enhanced Signature with drawing area
export const AdvancedSignature = ({ field, value, onChange }) => {
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!value);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setHasSignature(true);
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL();
      onChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange('');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{
          border: `2px solid ${theme.colors.secondary[300]}`,
          borderRadius: theme.borderRadius.lg,
          cursor: 'crosshair',
          width: '100%',
          maxWidth: '400px',
          height: '200px',
          background: 'white'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing[3]
      }}>
        <span style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.secondary[600]
        }}>
          {hasSignature ? 'Signature captured' : 'Draw your signature above'}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSignature}
          disabled={!hasSignature}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

// Enhanced Multi-Select with search
export const AdvancedMultiSelect = ({ field, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedValues = value || [];

  const filteredOptions = field.options?.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleOption = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          border: `2px solid ${theme.colors.secondary[200]}`,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[3],
          cursor: 'pointer',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ flex: 1 }}>
          {selectedValues.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[1] }}>
              {selectedValues.map(val => (
                <span
                  key={val}
                  style={{
                    background: theme.colors.primary[100],
                    color: theme.colors.primary[700],
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm
                  }}
                >
                  {val}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ color: theme.colors.secondary[400] }}>
              Select options...
            </span>
          )}
        </div>
        <div style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </div>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: `1px solid ${theme.colors.secondary[200]}`,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.boxShadow.lg,
          zIndex: 10,
          marginTop: theme.spacing[1]
        }}>
          <input
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: theme.spacing[3],
              border: 'none',
              borderBottom: `1px solid ${theme.colors.secondary[200]}`,
              outline: 'none'
            }}
          />
          
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredOptions.map(option => (
              <div
                key={option}
                style={{
                  padding: theme.spacing[3],
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  ':hover': {
                    background: theme.colors.secondary[50]
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option);
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = theme.colors.secondary[50];
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `2px solid ${theme.colors.primary[500]}`,
                  borderRadius: theme.borderRadius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedValues.includes(option) ? theme.colors.primary[500] : 'transparent'
                }}>
                  {selectedValues.includes(option) && (
                    <div style={{ color: 'white', fontSize: '12px' }}>✓</div>
                  )}
                </div>
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Number Input with increment/decrement
export const AdvancedNumberInput = ({ field, value, onChange, error }) => {
  const numValue = value || field.defaultValue || 0;

  const increment = () => {
    const newValue = numValue + (field.step || 1);
    if (!field.max || newValue <= field.max) {
      onChange(newValue);
    }
  };

  const decrement = () => {
    const newValue = numValue - (field.step || 1);
    if (!field.min || newValue >= field.min) {
      onChange(newValue);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="number"
        value={numValue}
        onChange={(e) => onChange(Number(e.target.value))}
        min={field.min}
        max={field.max}
        step={field.step || 1}
        style={{
          width: '100%',
          padding: `${theme.spacing[3]} ${theme.spacing[12]} ${theme.spacing[3]} ${theme.spacing[3]}`,
          border: error ? `2px solid ${theme.colors.error[500]}` : `2px solid ${theme.colors.secondary[200]}`,
          borderRadius: theme.borderRadius.lg,
          fontSize: theme.typography.fontSize.base,
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
      />
      
      <div style={{
        position: 'absolute',
        right: theme.spacing[2],
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[1]
      }}>
        <button
          type="button"
          onClick={increment}
          style={{
            width: '24px',
            height: '16px',
            border: 'none',
            background: theme.colors.secondary[100],
            borderRadius: theme.borderRadius.sm,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}
        >
          <Plus size={12} />
        </button>
        <button
          type="button"
          onClick={decrement}
          style={{
            width: '24px',
            height: '16px',
            border: 'none',
            background: theme.colors.secondary[100],
            borderRadius: theme.borderRadius.sm,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}
        >
          <Minus size={12} />
        </button>
      </div>
    </div>
  );
};
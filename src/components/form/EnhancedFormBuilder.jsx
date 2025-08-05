import React, { useState } from 'react';
import { 
  Plus, 
  Type, 
  Mail, 
  Hash, 
  Calendar, 
  FileUp, 
  CheckSquare, 
  List, 
  Star, 
  PenTool,
  FileText,
  Users,
  Phone,
  Link,
  Clock,
  DragDropIcon
} from 'lucide-react';
import Layout from '../layout/Layout';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { theme } from '../../styles/theme';

const EnhancedFormBuilder = ({ onFieldsChange, initialFields = [] }) => {
  const [fields, setFields] = useState(initialFields);
  const [draggedField, setDraggedField] = useState(null);

  const fieldTypes = [
    {
      type: 'text',
      label: 'Short Text',
      icon: <Type size={20} />,
      description: 'Single line text input',
      color: theme.colors.primary[500]
    },
    {
      type: 'textarea',
      label: 'Long Text',
      icon: <FileText size={20} />,
      description: 'Multi-line text area with character count',
      color: theme.colors.info[500]
    },
    {
      type: 'email',
      label: 'Email',
      icon: <Mail size={20} />,
      description: 'Email address with validation',
      color: theme.colors.success[500]
    },
    {
      type: 'phone',
      label: 'Phone',
      icon: <Phone size={20} />,
      description: 'Phone number with formatting',
      color: theme.colors.warning[500]
    },
    {
      type: 'number',
      label: 'Number',
      icon: <Hash size={20} />,
      description: 'Number input with increment controls',
      color: theme.colors.error[500]
    },
    {
      type: 'date',
      label: 'Date',
      icon: <Calendar size={20} />,
      description: 'Date picker with range options',
      color: theme.colors.info[600]
    },
    {
      type: 'select',
      label: 'Dropdown',
      icon: <List size={20} />,
      description: 'Single select dropdown',
      color: theme.colors.secondary[500]
    },
    {
      type: 'multiselect',
      label: 'Multi-Select',
      icon: <Users size={20} />,
      description: 'Multiple choice with search',
      color: theme.colors.primary[600]
    },
    {
      type: 'checkbox',
      label: 'Checkbox',
      icon: <CheckSquare size={20} />,
      description: 'Yes/no or agreement checkbox',
      color: theme.colors.success[600]
    },
    {
      type: 'radio',
      label: 'Radio Group',
      icon: <CheckSquare size={20} />,
      description: 'Single choice from options',
      color: theme.colors.warning[600]
    },
    {
      type: 'file',
      label: 'File Upload',
      icon: <FileUp size={20} />,
      description: 'File upload with drag & drop',
      color: theme.colors.error[600]
    },
    {
      type: 'rating',
      label: 'Rating',
      icon: <Star size={20} />,
      description: 'Star rating or scale',
      color: theme.colors.warning[500]
    },
    {
      type: 'signature',
      label: 'Signature',
      icon: <PenTool size={20} />,
      description: 'Digital signature pad',
      color: theme.colors.secondary[600]
    },
    {
      type: 'url',
      label: 'Website URL',
      icon: <Link size={20} />,
      description: 'URL input with validation',
      color: theme.colors.info[500]
    },
    {
      type: 'time',
      label: 'Time',
      icon: <Clock size={20} />,
      description: 'Time picker',
      color: theme.colors.primary[400]
    }
  ];

  const addField = (fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType.type,
      label: fieldType.label,
      required: false,
      placeholder: `Enter ${fieldType.label.toLowerCase()}`,
      validation: {},
      options: fieldType.type === 'select' || fieldType.type === 'multiselect' || fieldType.type === 'radio' 
        ? ['Option 1', 'Option 2', 'Option 3'] 
        : undefined,
      ...getDefaultFieldConfig(fieldType.type)
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const getDefaultFieldConfig = (type) => {
    switch (type) {
      case 'textarea':
        return {
          rows: 4,
          maxLength: 500,
          helperText: 'Maximum 500 characters'
        };
      case 'number':
        return {
          min: 0,
          max: 1000000,
          step: 1,
          defaultValue: 0
        };
      case 'date':
        return {
          dateType: 'date',
          minDate: null,
          maxDate: null
        };
      case 'file':
        return {
          acceptedTypes: 'image/*,.pdf,.doc,.docx',
          maxSize: '10MB',
          multiple: false
        };
      case 'rating':
        return {
          maxRating: 5,
          allowHalf: false
        };
      case 'phone':
        return {
          format: 'US', // US, International, etc.
          placeholder: '(555) 123-4567'
        };
      default:
        return {};
    }
  };

  const updateField = (fieldId, updates) => {
    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const removeField = (fieldId) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const moveField = (fromIndex, toIndex) => {
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    setFields(updatedFields);
    onFieldsChange?.(updatedFields);
  };

  const duplicateField = (fieldId) => {
    const fieldToDuplicate = fields.find(f => f.id === fieldId);
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: Date.now(),
        label: `${fieldToDuplicate.label} (Copy)`
      };
      const fieldIndex = fields.findIndex(f => f.id === fieldId);
      const updatedFields = [...fields];
      updatedFields.splice(fieldIndex + 1, 0, duplicatedField);
      setFields(updatedFields);
      onFieldsChange?.(updatedFields);
    }
  };

  return (
    <Layout.Grid cols={2} gap={8}>
      {/* Field Types Palette */}
      <Card variant="base" padding="lg">
        <Card.Header>
          <Card.Title>Field Types</Card.Title>
          <Card.Subtitle>Drag and drop or click to add fields to your form</Card.Subtitle>
        </Card.Header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: theme.spacing[3]
        }}>
          {fieldTypes.map((fieldType) => (
            <div
              key={fieldType.type}
              style={{
                padding: theme.spacing[4],
                border: `2px solid rgba(255, 107, 53, 0.2)`,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
              onClick={() => addField(fieldType)}
              onMouseEnter={(e) => {
                e.target.style.borderColor = fieldType.color;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 20px ${fieldType.color}30`;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255, 107, 53, 0.2)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                marginBottom: theme.spacing[2]
              }}>
                <div style={{ color: fieldType.color }}>
                  {fieldType.icon}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: '#ffffff'
                }}>
                  {fieldType.label}
                </div>
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: theme.typography.lineHeight.tight
              }}>
                {fieldType.description}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Form Preview */}
      <Card variant="base" padding="lg">
        <Card.Header>
          <Layout.Flex justify="space-between" align="center">
            <div>
              <Card.Title>Form Preview</Card.Title>
              <Card.Subtitle>{fields.length} field{fields.length !== 1 ? 's' : ''} added</Card.Subtitle>
            </div>
            {fields.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFields([]);
                  onFieldsChange?.([]);
                }}
              >
                Clear All
              </Button>
            )}
          </Layout.Flex>
        </Card.Header>

        <Card.Content>
          {fields.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: theme.spacing[16],
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <FileText size={48} style={{ marginBottom: theme.spacing[4], opacity: 0.5 }} />
              <div style={{ fontSize: theme.typography.fontSize.lg, marginBottom: theme.spacing[2] }}>
                No fields added yet
              </div>
              <div style={{ fontSize: theme.typography.fontSize.sm }}>
                Click on field types to start building your form
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
              {fields.map((field, index) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  index={index}
                  totalFields={fields.length}
                  onUpdate={(updates) => updateField(field.id, updates)}
                  onRemove={() => removeField(field.id)}
                  onMoveUp={() => index > 0 && moveField(index, index - 1)}
                  onMoveDown={() => index < fields.length - 1 && moveField(index, index + 1)}
                  onDuplicate={() => duplicateField(field.id)}
                />
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </Layout.Grid>
  );
};

// Individual Field Editor Component
const FieldEditor = ({ 
  field, 
  index, 
  totalFields, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  onDuplicate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localLabel, setLocalLabel] = useState(field.label);

  const handleLabelBlur = () => {
    onUpdate({ label: localLabel });
  };

  return (
    <div style={{
      border: `1px solid rgba(255, 107, 53, 0.3)`,
      borderRadius: theme.borderRadius.lg,
      background: 'rgba(255, 255, 255, 0.05)',
      overflow: 'hidden'
    }}>
      {/* Field Header */}
      <div style={{
        padding: theme.spacing[4],
        borderBottom: `1px solid rgba(255, 107, 53, 0.2)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Layout.Flex align="center" gap={3}>
          <div style={{
            padding: theme.spacing[2],
            borderRadius: theme.borderRadius.md,
            background: 'rgba(255, 107, 53, 0.2)',
            color: theme.colors.primary[500]
          }}>
            {getFieldIcon(field.type)}
          </div>
          <div>
            <input
              type="text"
              value={localLabel}
              onChange={(e) => setLocalLabel(e.target.value)}
              onBlur={handleLabelBlur}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.medium,
                width: '200px'
              }}
            />
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: 'rgba(255, 255, 255, 0.6)',
              textTransform: 'capitalize'
            }}>
              {field.type} • {field.required ? 'Required' : 'Optional'}
            </div>
          </div>
        </Layout.Flex>

        <Layout.Flex align="center" gap={2}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={index === 0}
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={index === totalFields - 1}
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
          >
            📋
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '−' : '+'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
          >
            🗑️
          </Button>
        </Layout.Flex>
      </div>

      {/* Field Configuration (Expandable) */}
      {isExpanded && (
        <div style={{ padding: theme.spacing[4] }}>
          <Layout.Grid cols={2} gap={4}>
            <div>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: theme.spacing[2]
              }}>
                Placeholder
              </label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                style={{
                  width: '100%',
                  padding: theme.spacing[2],
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  borderRadius: theme.borderRadius.md,
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                fontSize: theme.typography.fontSize.sm,
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                />
                Required field
              </label>
            </div>
          </Layout.Grid>

          {/* Field-specific options */}
          {(field.type === 'select' || field.type === 'multiselect' || field.type === 'radio') && (
            <div style={{ marginTop: theme.spacing[4] }}>
              <label style={{
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: theme.spacing[2]
              }}>
                Options (one per line)
              </label>
              <textarea
                value={field.options?.join('\n') || ''}
                onChange={(e) => onUpdate({ 
                  options: e.target.value.split('\n').filter(opt => opt.trim()) 
                })}
                rows={4}
                style={{
                  width: '100%',
                  padding: theme.spacing[3],
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  borderRadius: theme.borderRadius.md,
                  color: '#ffffff',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const getFieldIcon = (type) => {
  const iconMap = {
    text: <Type size={16} />,
    textarea: <FileText size={16} />,
    email: <Mail size={16} />,
    phone: <Phone size={16} />,
    number: <Hash size={16} />,
    date: <Calendar size={16} />,
    time: <Clock size={16} />,
    select: <List size={16} />,
    multiselect: <Users size={16} />,
    checkbox: <CheckSquare size={16} />,
    radio: <CheckSquare size={16} />,
    file: <FileUp size={16} />,
    rating: <Star size={16} />,
    signature: <PenTool size={16} />,
    url: <Link size={16} />
  };
  
  return iconMap[type] || <Type size={16} />;
};

export default EnhancedFormBuilder;
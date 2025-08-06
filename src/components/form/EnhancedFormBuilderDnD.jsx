import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  CirclePlus, 
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
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings
} from 'lucide-react';
import Layout from '../layout/Layout';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { theme } from '../../styles/theme';

// Sortable field component
const SortableField = ({ field, onUpdateField, onDeleteField, onDuplicateField, onMoveField, isFirst, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card variant="base" padding="md" style={{
        marginBottom: theme.spacing[4],
        border: isDragging ? `2px solid ${theme.colors.primary[500]}` : `1px solid ${theme.colors.secondary[200]}`,
        background: isDragging ? theme.colors.primary[50] : '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing[3] }}>
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            style={{
              cursor: 'grab',
              padding: theme.spacing[2],
              color: theme.colors.secondary[400],
              display: 'flex',
              alignItems: 'center',
              marginTop: theme.spacing[2]
            }}
          >
            <GripVertical size={20} />
          </div>

          {/* Field Content */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing[3] }}>
              <div style={{ flex: 1, marginRight: theme.spacing[4] }}>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                  placeholder="Field Label"
                  style={{
                    width: '100%',
                    padding: theme.spacing[2],
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.medium,
                    border: `1px solid ${theme.colors.secondary[200]}`,
                    borderRadius: theme.borderRadius.md,
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: theme.spacing[1] }}>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Copy size={14} />}
                  onClick={() => onDuplicateField(field.id)}
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={14} />}
                  onClick={() => onDeleteField(field.id)}
                  style={{ padding: '4px 8px', fontSize: '12px', color: theme.colors.error[500] }}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Settings size={14} />}
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  {isExpanded ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div style={{ display: 'flex', gap: theme.spacing[4] }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.secondary[600],
                    marginBottom: theme.spacing[1]
                  }}>
                    Field Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) => onUpdateField(field.id, { type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: theme.spacing[2],
                      border: `1px solid ${theme.colors.secondary[200]}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.sm,
                      outline: 'none'
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="tel">Phone</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="url">URL</option>
                    <option value="textarea">Text Area</option>
                    <option value="select">Dropdown</option>
                    <option value="radio">Radio Buttons</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="file">File Upload</option>
                    <option value="rating">Rating</option>
                    <option value="signature">Signature</option>
                    <option value="multiselect">Multi-Select</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.secondary[600],
                    marginBottom: theme.spacing[1]
                  }}>
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdateField(field.id, { placeholder: e.target.value })}
                    placeholder="Enter placeholder..."
                    style={{
                      width: '100%',
                      padding: theme.spacing[2],
                      border: `1px solid ${theme.colors.secondary[200]}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: theme.typography.fontSize.sm,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], paddingTop: '24px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2],
                    cursor: 'pointer',
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.secondary[700]
                  }}>
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) => onUpdateField(field.id, { required: e.target.checked })}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Required
                  </label>
                </div>
              </div>
            )}

            {isExpanded && (field.type === 'select' || field.type === 'radio' || field.type === 'multiselect') && (
              <div style={{ marginTop: theme.spacing[3] }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.secondary[600],
                  marginBottom: theme.spacing[1]
                }}>
                  Options (one per line)
                </label>
                <textarea
                  value={field.options?.join('\n') || ''}
                  onChange={(e) => onUpdateField(field.id, { 
                    options: e.target.value.split('\n').filter(opt => opt.trim()) 
                  })}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: theme.spacing[2],
                    border: `1px solid ${theme.colors.secondary[200]}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm,
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const EnhancedFormBuilderDnD = ({ onFieldsChange, initialFields = [] }) => {
  const [fields, setFields] = useState(initialFields);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      description: 'Multi-line text area',
      color: theme.colors.info[500]
    },
    {
      type: 'email',
      label: 'Email',
      icon: <Mail size={20} />,
      description: 'Email address input',
      color: theme.colors.success[500]
    },
    {
      type: 'number',
      label: 'Number',
      icon: <Hash size={20} />,
      description: 'Numeric input',
      color: theme.colors.warning[500]
    },
    {
      type: 'tel',
      label: 'Phone',
      icon: <Phone size={20} />,
      description: 'Phone number input',
      color: theme.colors.secondary[500]
    },
    {
      type: 'date',
      label: 'Date',
      icon: <Calendar size={20} />,
      description: 'Date picker',
      color: theme.colors.error[500]
    },
    {
      type: 'select',
      label: 'Dropdown',
      icon: <List size={20} />,
      description: 'Single selection dropdown',
      color: theme.colors.primary[600]
    },
    {
      type: 'checkbox',
      label: 'Checkbox',
      icon: <CheckSquare size={20} />,
      description: 'Single checkbox',
      color: theme.colors.success[600]
    },
    {
      type: 'file',
      label: 'File Upload',
      icon: <FileUp size={20} />,
      description: 'File attachment',
      color: theme.colors.warning[600]
    },
    {
      type: 'rating',
      label: 'Rating',
      icon: <Star size={20} />,
      description: 'Star rating',
      color: theme.colors.warning[500]
    },
    {
      type: 'signature',
      label: 'Signature',
      icon: <PenTool size={20} />,
      description: 'Digital signature',
      color: theme.colors.info[600]
    }
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'multiselect' ? ['Option 1', 'Option 2'] : undefined
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  const updateField = (fieldId, updates) => {
    const updatedFields = fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  const deleteField = (fieldId) => {
    const updatedFields = fields.filter(field => field.id !== fieldId);
    setFields(updatedFields);
    onFieldsChange(updatedFields);
  };

  const duplicateField = (fieldId) => {
    const fieldToDuplicate = fields.find(f => f.id === fieldId);
    if (fieldToDuplicate) {
      const newField = { ...fieldToDuplicate, id: Date.now() };
      const fieldIndex = fields.findIndex(f => f.id === fieldId);
      const updatedFields = [
        ...fields.slice(0, fieldIndex + 1),
        newField,
        ...fields.slice(fieldIndex + 1)
      ];
      setFields(updatedFields);
      onFieldsChange(updatedFields);
    }
  };

  const moveField = (fieldId, direction) => {
    const index = fields.findIndex(f => f.id === fieldId);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < fields.length - 1)) {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const updatedFields = [...fields];
      [updatedFields[index], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[index]];
      setFields(updatedFields);
      onFieldsChange(updatedFields);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onFieldsChange(newItems);
        return newItems;
      });
    }
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to remove all fields?')) {
      setFields([]);
      onFieldsChange([]);
    }
  };

  return (
    <Layout.Grid cols={2} gap={8}>
      {/* Field Types Panel */}
      <Card variant="glass" padding="lg">
        <Card.Header>
          <Card.Title style={{ color: theme.colors.secondary[900] }}>Field Types</Card.Title>
          <Card.Subtitle style={{ color: theme.colors.secondary[600] }}>
            Drag and drop or click to add fields to your form
          </Card.Subtitle>
        </Card.Header>
        
        <Card.Content>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: theme.spacing[3] 
          }}>
            {fieldTypes.map((fieldType) => (
              <div
                key={fieldType.type}
                onClick={() => addField(fieldType.type)}
                style={{
                  padding: theme.spacing[3],
                  border: `2px solid ${theme.colors.secondary[200]}`,
                  borderRadius: theme.borderRadius.lg,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  background: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = fieldType.color;
                  e.currentTarget.style.background = `${fieldType.color}10`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.secondary[200];
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ color: fieldType.color, marginBottom: theme.spacing[2] }}>
                  {fieldType.icon}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.secondary[900],
                  marginBottom: theme.spacing[1]
                }}>
                  {fieldType.label}
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.secondary[500]
                }}>
                  {fieldType.description}
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Form Preview */}
      <Card variant="glass" padding="lg">
        <Card.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Card.Title style={{ color: theme.colors.secondary[900] }}>Form Preview</Card.Title>
              <Card.Subtitle style={{ color: theme.colors.secondary[600] }}>
                {fields.length} field{fields.length !== 1 ? 's' : ''} added
              </Card.Subtitle>
            </div>
            {fields.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                style={{ color: theme.colors.error[500] }}
              >
                Clear All
              </Button>
            )}
          </div>
        </Card.Header>

        <Card.Content>
          {fields.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: theme.spacing[12],
              color: theme.colors.secondary[400],
              background: theme.colors.secondary[50],
              borderRadius: theme.borderRadius.lg,
              border: `2px dashed ${theme.colors.secondary[300]}`
            }}>
              <CirclePlus size={48} style={{ marginBottom: theme.spacing[3] }} />
              <p style={{ margin: 0, fontSize: theme.typography.fontSize.base }}>
                Click on a field type to add it to your form
              </p>
              <p style={{ 
                margin: 0, 
                marginTop: theme.spacing[2], 
                fontSize: theme.typography.fontSize.sm 
              }}>
                You can drag and drop fields to reorder them
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    onUpdateField={updateField}
                    onDeleteField={deleteField}
                    onDuplicateField={duplicateField}
                    onMoveField={moveField}
                    isFirst={index === 0}
                    isLast={index === fields.length - 1}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </Card.Content>
      </Card>
    </Layout.Grid>
  );
};

export default EnhancedFormBuilderDnD;
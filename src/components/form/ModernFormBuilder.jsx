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
  Phone,
  Link,
  Clock,
  GripVertical,
  Copy,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Heading1,
  Heading2,
  AlignLeft,
  Columns,
  Image
} from 'lucide-react';
import { theme } from '../../styles/theme';

// Sortable field component
const SortableField = ({ field, onUpdateField, onDeleteField, onDuplicateField }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  const isLayoutField = ['heading1', 'heading2', 'paragraph', 'divider'].includes(field.type);

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{
        background: '#ffffff',
        border: isDragging ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '12px',
        overflow: 'hidden',
        boxShadow: isDragging ? '0 10px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
          background: isLayoutField ? '#f9fafb' : '#ffffff'
        }}>
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners}
            style={{
              cursor: 'grab',
              padding: '4px',
              color: '#9ca3af',
              marginRight: '12px'
            }}
          >
            <GripVertical size={18} />
          </div>

          {/* Field Label */}
          <div style={{ flex: 1 }}>
            {isLayoutField ? (
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                {field.type === 'heading1' && 'Main Heading'}
                {field.type === 'heading2' && 'Sub Heading'}
                {field.type === 'paragraph' && 'Text Paragraph'}
                {field.type === 'divider' && 'Section Divider'}
              </div>
            ) : (
              <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                placeholder="Field Label"
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#111827',
                  background: 'transparent',
                  width: '100%'
                }}
              />
            )}
          </div>

          {/* Field Type Badge */}
          <div style={{
            padding: '4px 8px',
            background: '#f3f4f6',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#6b7280',
            marginRight: '12px',
            textTransform: 'capitalize'
          }}>
            {field.type}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button
              onClick={() => onDuplicateField(field.id)}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => onDeleteField(field.id)}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Expanded Settings */}
        {isExpanded && (
          <div style={{ padding: '16px', background: '#f9fafb' }}>
            {isLayoutField ? (
              <div>
                {(field.type === 'heading1' || field.type === 'heading2' || field.type === 'paragraph') && (
                  <div>
                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                      Content
                    </label>
                    <textarea
                      value={field.content || ''}
                      onChange={(e) => onUpdateField(field.id, { content: e.target.value })}
                      placeholder={
                        field.type === 'heading1' ? 'Enter main heading...' :
                        field.type === 'heading2' ? 'Enter sub heading...' :
                        'Enter paragraph text...'
                      }
                      rows={field.type === 'paragraph' ? 3 : 1}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdateField(field.id, { placeholder: e.target.value })}
                    placeholder="Enter placeholder..."
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                    Width
                  </label>
                  <select
                    value={field.width || 'full'}
                    onChange={(e) => onUpdateField(field.id, { width: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="full">Full Width</option>
                    <option value="half">Half Width</option>
                    <option value="third">One Third</option>
                    <option value="two-thirds">Two Thirds</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) => onUpdateField(field.id, { required: e.target.checked })}
                    id={`required-${field.id}`}
                  />
                  <label htmlFor={`required-${field.id}`} style={{ fontSize: '14px', color: '#374151' }}>
                    Required field
                  </label>
                </div>

                {(field.type === 'select' || field.type === 'radio' || field.type === 'multiselect') && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
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
                        padding: '8px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ModernFormBuilder = ({ onFieldsChange, initialFields = [] }) => {
  const [fields, setFields] = useState(initialFields);
  const [activeTab, setActiveTab] = useState('input');
  const [previewMode, setPreviewMode] = useState('edit'); // 'edit' or 'preview'
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fieldCategories = {
    layout: [
      { type: 'heading1', label: 'Main Heading', icon: <Heading1 size={18} />, description: 'Large title text' },
      { type: 'heading2', label: 'Sub Heading', icon: <Heading2 size={18} />, description: 'Section heading' },
      { type: 'paragraph', label: 'Paragraph', icon: <AlignLeft size={18} />, description: 'Text block' },
      { type: 'divider', label: 'Divider', icon: <Columns size={18} />, description: 'Visual separator' }
    ],
    input: [
      { type: 'text', label: 'Text Input', icon: <Type size={18} />, description: 'Single line text' },
      { type: 'textarea', label: 'Text Area', icon: <FileText size={18} />, description: 'Multi-line text' },
      { type: 'email', label: 'Email', icon: <Mail size={18} />, description: 'Email address' },
      { type: 'tel', label: 'Phone', icon: <Phone size={18} />, description: 'Phone number' },
      { type: 'number', label: 'Number', icon: <Hash size={18} />, description: 'Numeric input' },
      { type: 'url', label: 'URL', icon: <Link size={18} />, description: 'Website link' }
    ],
    selection: [
      { type: 'select', label: 'Dropdown', icon: <List size={18} />, description: 'Select one option' },
      { type: 'radio', label: 'Radio', icon: <CheckSquare size={18} />, description: 'Choose one' },
      { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={18} />, description: 'Yes/No option' },
      { type: 'multiselect', label: 'Multi-Select', icon: <List size={18} />, description: 'Select multiple' }
    ],
    advanced: [
      { type: 'date', label: 'Date', icon: <Calendar size={18} />, description: 'Date picker' },
      { type: 'time', label: 'Time', icon: <Clock size={18} />, description: 'Time picker' },
      { type: 'file', label: 'File Upload', icon: <FileUp size={18} />, description: 'Upload files' },
      { type: 'rating', label: 'Rating', icon: <Star size={18} />, description: 'Star rating' },
      { type: 'signature', label: 'Signature', icon: <PenTool size={18} />, description: 'Draw signature' }
    ]
  };

  const addField = (type) => {
    const isLayoutField = ['heading1', 'heading2', 'paragraph', 'divider'].includes(type);
    const newField = {
      id: Date.now(),
      type,
      label: isLayoutField ? '' : `New ${type} field`,
      content: isLayoutField ? '' : undefined,
      placeholder: '',
      required: false,
      width: 'full',
      options: ['select', 'radio', 'multiselect'].includes(type) ? ['Option 1', 'Option 2'] : undefined
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

  const tabs = [
    { id: 'layout', label: 'Layout', icon: <Columns size={16} /> },
    { id: 'input', label: 'Input Fields', icon: <Type size={16} /> },
    { id: 'selection', label: 'Selection', icon: <CheckSquare size={16} /> },
    { id: 'advanced', label: 'Advanced', icon: <Star size={16} /> }
  ];

  // Group fields into rows based on their widths
  const getFieldRows = () => {
    const rows = [];
    let currentRow = [];
    let currentRowWidth = 0;

    fields.forEach(field => {
      const fieldWidth = field.width || 'full';
      const widthMap = {
        'full': 1,
        'half': 0.5,
        'third': 0.333,
        'two-thirds': 0.666
      };
      const width = widthMap[fieldWidth];

      if (currentRowWidth + width > 1.01 || fieldWidth === 'full') {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [field];
        currentRowWidth = width;
      } else {
        currentRow.push(field);
        currentRowWidth += width;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const renderFieldInPreview = (field) => {
    const widthMap = {
      'full': '100%',
      'half': 'calc(50% - 8px)',
      'third': 'calc(33.333% - 10px)',
      'two-thirds': 'calc(66.666% - 8px)'
    };

    const fieldWidth = widthMap[field.width || 'full'];

    // Layout fields
    if (field.type === 'heading1') {
      return (
        <div style={{ width: fieldWidth }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>
            {field.content || 'Main Heading'}
          </h1>
        </div>
      );
    }
    if (field.type === 'heading2') {
      return (
        <div style={{ width: fieldWidth }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', margin: '0 0 12px 0' }}>
            {field.content || 'Sub Heading'}
          </h2>
        </div>
      );
    }
    if (field.type === 'paragraph') {
      return (
        <div style={{ width: fieldWidth }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0', lineHeight: '1.6' }}>
            {field.content || 'Paragraph text...'}
          </p>
        </div>
      );
    }
    if (field.type === 'divider') {
      return (
        <div style={{ width: '100%' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />
        </div>
      );
    }

    // Regular form fields
    return (
      <div style={{ width: fieldWidth }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px'
        }}>
          {field.label}
          {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
        {field.type === 'select' || field.type === 'multiselect' ? (
          <select style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'white'
          }}>
            <option>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            placeholder={field.placeholder}
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        ) : field.type === 'checkbox' ? (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" style={{ width: '16px', height: '16px' }} />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              {field.placeholder || 'Check this box'}
            </span>
          </label>
        ) : field.type === 'radio' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {field.options?.map((opt, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="radio" name={`field_${field.id}`} />
                <span style={{ fontSize: '14px', color: '#374151' }}>{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type={field.type}
            placeholder={field.placeholder}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)', gap: '24px' }}>
      {/* Left Sidebar - Field Types */}
      <div style={{ 
        width: '320px', 
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            Add Fields
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
            Click to add to your form
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 12px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Field Types Grid */}
        <div style={{ 
          flex: 1,
          overflow: 'auto',
          padding: '16px'
        }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            {fieldCategories[activeTab]?.map((fieldType) => (
              <button
                key={fieldType.type}
                onClick={() => addField(fieldType.type)}
                style={{
                  padding: '12px',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.background = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                <div style={{ color: '#3b82f6' }}>
                  {fieldType.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {fieldType.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {fieldType.description}
                  </div>
                </div>
                <Plus size={16} style={{ color: '#9ca3af' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Form Builder */}
      <div style={{ 
        flex: 1,
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#111827' }}>
              Form Builder
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
              {fields.length} field{fields.length !== 1 ? 's' : ''} • Drag to reorder • Multi-column support
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
              style={{
                padding: '6px 12px',
                background: previewMode === 'preview' ? '#3b82f6' : '#ffffff',
                color: previewMode === 'preview' ? '#ffffff' : '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {previewMode === 'edit' ? 'Preview Layout' : 'Edit Mode'}
            </button>
            {fields.length > 0 && (
            <button
              onClick={clearAll}
              style={{
                padding: '8px 16px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fee2e2';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              Clear All Fields
            </button>
          )}
          </div>
        </div>

        <div style={{ 
          flex: 1,
          overflow: 'auto',
          padding: '24px'
        }}>
          {fields.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #e5e7eb'
            }}>
              <Plus size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '500', color: '#6b7280' }}>
                Start building your form
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>
                Click on field types from the left sidebar to add them here
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
                {fields.map((field) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    onUpdateField={updateField}
                    onDeleteField={deleteField}
                    onDuplicateField={duplicateField}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
        {previewMode === 'preview' && fields.length > 0 && (
          <div style={{
            padding: '24px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            marginTop: '16px'
          }}>
            <h3 style={{ 
              margin: '0 0 20px', 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '12px'
            }}>
              Form Preview - Multi-Column Layout
            </h3>
            <div>
              {getFieldRows().map((row, rowIndex) => (
                <div key={rowIndex} style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  {row.map(field => renderFieldInPreview(field))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernFormBuilder;
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
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
  Settings,
  GitBranch,
  Columns2,
  Columns3,
  Square,
  FileSignature
} from 'lucide-react';
import ConditionalLogic from './ConditionalLogic';
import { theme } from '../../styles/theme';

// Draggable field type button
const DraggableFieldType = ({ fieldType }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `field-type-${fieldType.type}`,
    data: { fieldType }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        padding: '12px',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'grab',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
      {...listeners}
      {...attributes}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.background = '#eff6ff';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.background = '#ffffff';
        }
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
    </div>
  );
};

// Row component that can contain 1-3 columns
const FormRow = ({ row, rowIndex, onUpdateRow, onDeleteRow, onUpdateField, onDeleteField }) => {
  const [columns, setColumns] = useState(row.columns || 1);
  const { isOver, setNodeRef } = useDroppable({
    id: `row-${rowIndex}`,
    data: { rowIndex }
  });
  
  const handleColumnChange = (newColumns) => {
    setColumns(newColumns);
    onUpdateRow(rowIndex, { ...row, columns: newColumns });
  };

  const getFieldWidth = () => {
    return '100%'; // Since we're using grid, each field takes full width of its grid cell
  };

  return (
    <div style={{
      marginBottom: '20px',
      padding: '16px',
      background: '#f9fafb',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      {/* Row Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
            Row {rowIndex + 1}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => handleColumnChange(1)}
              style={{
                padding: '4px 8px',
                background: columns === 1 ? '#3b82f6' : '#ffffff',
                color: columns === 1 ? '#ffffff' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="1 Column"
            >
              <Square size={14} />
              1 Col
            </button>
            <button
              onClick={() => handleColumnChange(2)}
              style={{
                padding: '4px 8px',
                background: columns === 2 ? '#3b82f6' : '#ffffff',
                color: columns === 2 ? '#ffffff' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="2 Columns"
            >
              <Columns2 size={14} />
              2 Col
            </button>
            <button
              onClick={() => handleColumnChange(3)}
              style={{
                padding: '4px 8px',
                background: columns === 3 ? '#3b82f6' : '#ffffff',
                color: columns === 3 ? '#ffffff' : '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="3 Columns"
            >
              <Columns3 size={14} />
              3 Col
            </button>
          </div>
        </div>
        <button
          onClick={() => onDeleteRow(rowIndex)}
          style={{
            padding: '4px',
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Delete Row"
        >
          <X size={16} />
        </button>
      </div>

      {/* Fields Container */}
      <div 
        ref={setNodeRef}
        style={{
          display: 'grid',
          gridTemplateColumns: columns === 1 ? '1fr' : columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
          gap: '16px',
          minHeight: '80px',
          padding: '8px',
          background: isOver ? '#eff6ff' : '#ffffff',
          borderRadius: '8px',
          border: isOver ? '2px dashed #3b82f6' : '1px dashed #d1d5db',
          transition: 'all 0.2s',
          position: 'relative'
        }}
      >
        {row.fields.length === 0 ? (
          <>
            {/* Show column dividers for multi-column layouts */}
            {columns > 1 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                bottom: '8px',
                left: columns === 2 ? '50%' : '33.33%',
                width: '1px',
                background: 'linear-gradient(to bottom, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 0
              }} />
            )}
            {columns === 3 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                bottom: '8px',
                left: '66.66%',
                width: '1px',
                background: 'linear-gradient(to bottom, transparent 0%, #e5e7eb 20%, #e5e7eb 80%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 0
              }} />
            )}
            
            {/* Column placeholders */}
            {Array.from({ length: columns }, (_, colIndex) => (
              <div 
                key={colIndex}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '60px',
                  color: '#9ca3af',
                  fontSize: '13px',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '4px',
                  background: 'rgba(249, 250, 251, 0.5)',
                  border: '1px dashed transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>Column {colIndex + 1}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>Drag field here</div>
                </div>
              </div>
            ))}
          </>
        ) : (
          row.fields.map((field, fieldIndex) => (
            <FieldCard
              key={field.id}
              field={field}
              width={getFieldWidth()}
              allFields={rows.flatMap(r => r.fields)}
              onUpdate={(updates) => onUpdateField(rowIndex, fieldIndex, updates)}
              onDelete={() => onDeleteField(rowIndex, fieldIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Individual field card
const FieldCard = ({ field, width, allFields = [], onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConditionalLogic, setShowConditionalLogic] = useState(false);
  const isLayoutField = ['heading1', 'heading2', 'paragraph', 'divider'].includes(field.type);
  const hasConditions = field.conditions && field.conditions.length > 0;

  return (
    <div style={{
      width,
      padding: '12px',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '500',
          color: '#374151'
        }}>
          {isLayoutField ? field.type.replace('1', ' 1').replace('2', ' 2') : field.label}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {!isLayoutField && (
            <button
              onClick={() => setShowConditionalLogic(true)}
              style={{
                padding: '2px',
                background: hasConditions ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: 'none',
                color: hasConditions ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
              title="Conditional Logic"
            >
              <GitBranch size={14} />
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              padding: '2px',
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            <Settings size={14} />
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '2px',
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer'
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {isEditing && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: '#f9fafb',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {isLayoutField ? (
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: '#6b7280' }}>
                Content
              </label>
              <textarea
                value={field.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder={`Enter ${field.type} content...`}
                rows={field.type === 'paragraph' ? 3 : 1}
                style={{
                  width: '100%',
                  padding: '6px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px', color: '#6b7280' }}>
                  Label
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => onUpdate({ label: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px', color: '#6b7280' }}>
                  Placeholder
                </label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => onUpdate({ placeholder: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                />
                <span style={{ color: '#6b7280' }}>Required</span>
              </label>
              {(field.type === 'select' || field.type === 'radio' || field.type === 'multiselect') && (
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#6b7280' }}>
                    Options (one per line)
                  </label>
                  <textarea
                    value={field.options?.join('\n') || ''}
                    onChange={(e) => onUpdate({ 
                      options: e.target.value.split('\n').filter(opt => opt.trim()) 
                    })}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Conditional Logic Modal */}
      {showConditionalLogic && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowConditionalLogic(false)}>
          <div style={{
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            background: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            <ConditionalLogic
              field={field}
              allFields={allFields}
              onUpdate={onUpdate}
              onClose={() => setShowConditionalLogic(false)}
            />
          </div>
        </div>
      )}

      {/* Visual indicator for fields with conditions */}
      {hasConditions && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
          color: 'white',
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '4px',
          fontWeight: '600'
        }}>
          CONDITIONAL
        </div>
      )}
    </div>
  );
};

// Main Form Builder Component
const RowBasedFormBuilder = ({ onFieldsChange, initialFields = [], initialRows = [], formSettings, onSettingsChange, onShowTemplates }) => {
  const [rows, setRows] = useState(() => {
    // If we have initialRows structure, use that
    if (initialRows && initialRows.length > 0) {
      return initialRows;
    }
    
    // Otherwise, try to build from initialFields
    if (initialFields.length > 0) {
      const rowsMap = new Map();
      let currentRowId = Date.now();
      let currentRow = { id: currentRowId, columns: 1, fields: [] };
      
      initialFields.forEach(field => {
        currentRow.fields.push(field);
        if (currentRow.fields.length >= (field.columns || 1)) {
          rowsMap.set(currentRowId, currentRow);
          currentRowId = Date.now() + Math.random();
          currentRow = { id: currentRowId, columns: 1, fields: [] };
        }
      });
      
      if (currentRow.fields.length > 0) {
        rowsMap.set(currentRowId, currentRow);
      }
      
      return Array.from(rowsMap.values());
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState('input');
  const [pdfHeader, setPdfHeader] = useState(formSettings?.pdfHeader || '');
  const [pdfSubheader, setPdfSubheader] = useState(formSettings?.pdfSubheader || '');
  const [pdfDate, setPdfDate] = useState(formSettings?.pdfDate || new Date().toISOString().split('T')[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [activeId, setActiveId] = useState(null);
  
  // Sync pdfDate when formSettings changes
  useEffect(() => {
    if (formSettings?.pdfDate) {
      setPdfDate(formSettings.pdfDate);
    }
  }, [formSettings?.pdfDate]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Field categories
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

  // Add new row
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      columns: 1,
      fields: []
    };
    setRows([...rows, newRow]);
  };

  // Add field to a specific row
  const addFieldToRow = (rowIndex, fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType.type,
      label: fieldType.label,
      placeholder: '',
      required: false,
      content: '',
      options: ['select', 'radio', 'multiselect'].includes(fieldType.type) ? ['Option 1', 'Option 2'] : undefined
    };

    const updatedRows = [...rows];
    updatedRows[rowIndex].fields.push(newField);
    setRows(updatedRows);
    updateParentFields(updatedRows);
  };

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && over.data.current?.rowIndex !== undefined) {
      const fieldType = active.data.current?.fieldType;
      if (fieldType) {
        addFieldToRow(over.data.current.rowIndex, fieldType);
      }
    }
    
    setActiveId(null);
  };

  // Update row
  const updateRow = (rowIndex, updates) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updates };
    setRows(updatedRows);
    updateParentFields(updatedRows);
  };

  // Delete row
  const deleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    updateParentFields(updatedRows);
  };

  // Update field
  const updateField = (rowIndex, fieldIndex, updates) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].fields[fieldIndex] = {
      ...updatedRows[rowIndex].fields[fieldIndex],
      ...updates
    };
    setRows(updatedRows);
    updateParentFields(updatedRows);
  };

  // Delete field
  const deleteField = (rowIndex, fieldIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].fields.splice(fieldIndex, 1);
    setRows(updatedRows);
    updateParentFields(updatedRows);
  };

  // Update parent component with flat field list and row information
  const updateParentFields = (updatedRows) => {
    const flatFields = [];
    const rowsStructure = [];
    updatedRows.forEach(row => {
      const rowData = { ...row, fields: [] };
      row.fields.forEach(field => {
        const fieldWithMeta = { ...field, columns: row.columns, rowId: row.id };
        flatFields.push(fieldWithMeta);
        rowData.fields.push(fieldWithMeta);
      });
      rowsStructure.push(rowData);
    });
    onFieldsChange(flatFields, rowsStructure); // Pass both flat fields and rows structure
  };

  // Save PDF settings
  const savePdfSettings = () => {
    const settings = {
      pdfHeader,
      pdfSubheader,
      pdfDate
    };
    onSettingsChange(settings);
    // Also save to sessionStorage
    sessionStorage.setItem('formSettings', JSON.stringify(settings));
    setShowSettings(false);
  };

  const tabs = [
    { id: 'layout', label: 'Layout', icon: <Columns size={16} /> },
    { id: 'input', label: 'Input Fields', icon: <Type size={16} /> },
    { id: 'selection', label: 'Selection', icon: <CheckSquare size={16} /> },
    { id: 'advanced', label: 'Advanced', icon: <Star size={16} /> }
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
          {/* PDF Settings Button */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                width: '100%',
                padding: '10px',
                background: showSettings ? '#3b82f6' : '#f3f4f6',
                color: showSettings ? '#ffffff' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FileSignature size={16} />
              PDF Header Settings
            </button>
          </div>

          {showSettings ? (
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  PDF Header Title
                </label>
                <input
                  type="text"
                  value={pdfHeader}
                  onChange={(e) => setPdfHeader(e.target.value)}
                  placeholder="Enter PDF header (e.g., Application Form)"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  PDF Subtitle
                </label>
                <input
                  type="text"
                  value={pdfSubheader}
                  onChange={(e) => setPdfSubheader(e.target.value)}
                  placeholder="Enter PDF subtitle (optional)"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Form Date
                </label>
                <input
                  type="date"
                  value={pdfDate}
                  onChange={(e) => {
                    setPdfDate(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={savePdfSettings}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Save Settings
                </button>
                <button
                  onClick={() => {
                    setPdfHeader('');
                    setPdfSubheader('');
                    setPdfDate(new Date().toISOString().split('T')[0]);
                    const settings = { pdfHeader: '', pdfSubheader: '', pdfDate: new Date().toISOString().split('T')[0] };
                    onSettingsChange(settings);
                    sessionStorage.setItem('formSettings', JSON.stringify(settings));
                  }}
                  style={{
                    padding: '8px',
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ 
                padding: '20px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                  Add Fields
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                  Drag fields to rows in your form
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

              {/* Field Types */}
              <div style={{ 
                flex: 1,
                overflow: 'auto',
                padding: '16px'
              }}>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {fieldCategories[activeTab]?.map((fieldType) => (
                    <DraggableFieldType key={fieldType.type} fieldType={fieldType} />
                  ))}
                </div>
              </div>
            </>
          )}
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
                Build multi-column forms with flexible row layouts
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={onShowTemplates}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={16} />
                Templates
              </button>
              <button
                onClick={addRow}
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                Add Row
              </button>
            </div>
          </div>

          <div style={{ 
            flex: 1,
            overflow: 'auto',
            padding: '24px'
          }}>
            {rows.length === 0 ? (
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
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#9ca3af' }}>
                  Click "Add Row" to create your first row, then drag fields into it
                </p>
              </div>
            ) : (
              rows.map((row, index) => (
                <FormRow
                  key={row.id}
                  row={row}
                  rowIndex={index}
                  onUpdateRow={updateRow}
                  onDeleteRow={deleteRow}
                  onUpdateField={updateField}
                  onDeleteField={deleteField}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {activeId && (
        <DragOverlay>
          <div style={{
            padding: '8px 12px',
            background: '#3b82f6',
            color: '#ffffff',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            Drag to a row
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default RowBasedFormBuilder;
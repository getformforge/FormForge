import React, { useState } from 'react';
import { Eye, EyeOff, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ConditionalLogic = ({ field, allFields, onUpdate, onClose }) => {
  const [conditions, setConditions] = useState(field.conditions || []);
  const [showHelp, setShowHelp] = useState(false);

  // Get fields that can be used as condition triggers (exclude current field)
  const availableFields = allFields.filter(f => 
    f.id !== field.id && 
    ['select', 'radio', 'checkbox', 'text', 'email', 'number'].includes(f.type)
  );

  const addCondition = () => {
    const newCondition = {
      id: Date.now(),
      action: 'show', // show or hide
      logic: 'all', // all or any
      rules: [{
        fieldId: '',
        operator: 'equals', // equals, not_equals, contains, greater_than, less_than
        value: ''
      }]
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (conditionId, updates) => {
    setConditions(conditions.map(c => 
      c.id === conditionId ? { ...c, ...updates } : c
    ));
  };

  const deleteCondition = (conditionId) => {
    setConditions(conditions.filter(c => c.id !== conditionId));
  };

  const addRule = (conditionId) => {
    setConditions(conditions.map(c => {
      if (c.id === conditionId) {
        return {
          ...c,
          rules: [...c.rules, {
            fieldId: '',
            operator: 'equals',
            value: ''
          }]
        };
      }
      return c;
    }));
  };

  const updateRule = (conditionId, ruleIndex, updates) => {
    setConditions(conditions.map(c => {
      if (c.id === conditionId) {
        const newRules = [...c.rules];
        newRules[ruleIndex] = { ...newRules[ruleIndex], ...updates };
        return { ...c, rules: newRules };
      }
      return c;
    }));
  };

  const deleteRule = (conditionId, ruleIndex) => {
    setConditions(conditions.map(c => {
      if (c.id === conditionId) {
        return {
          ...c,
          rules: c.rules.filter((_, idx) => idx !== ruleIndex)
        };
      }
      return c;
    }));
  };

  const saveConditions = () => {
    onUpdate({ conditions: conditions.length > 0 ? conditions : undefined });
    alert('✅ Conditional logic saved!');
    onClose();
  };

  const getFieldOptions = (fieldId) => {
    const field = allFields.find(f => f.id === fieldId);
    if (!field) return [];
    
    if (field.type === 'select' || field.type === 'radio') {
      return field.options || [];
    }
    if (field.type === 'checkbox') {
      return ['checked', 'unchecked'];
    }
    return [];
  };

  const styles = {
    container: {
      padding: '20px',
      background: '#ffffff',
      borderRadius: '12px',
      maxHeight: '70vh',
      overflowY: 'auto'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '12px',
      borderBottom: '2px solid #e5e7eb'
    },
    title: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1f2937'
    },
    helpButton: {
      padding: '6px 12px',
      background: '#f3f4f6',
      border: 'none',
      borderRadius: '6px',
      color: '#6b7280',
      fontSize: '13px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    helpBox: {
      background: '#eff6ff',
      border: '1px solid #3b82f6',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      fontSize: '13px',
      color: '#1e40af'
    },
    conditionCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      background: '#f9fafb'
    },
    conditionHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    actionSelect: {
      padding: '6px 10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500'
    },
    logicToggle: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      fontSize: '14px',
      color: '#6b7280'
    },
    rule: {
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr 2fr auto',
      gap: '8px',
      alignItems: 'center',
      marginBottom: '8px',
      padding: '8px',
      background: '#ffffff',
      borderRadius: '6px'
    },
    select: {
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px',
      background: '#ffffff'
    },
    input: {
      padding: '6px 8px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '13px'
    },
    addButton: {
      padding: '8px 16px',
      background: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    deleteButton: {
      padding: '4px',
      background: 'transparent',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: '1px solid #e5e7eb'
    },
    saveButton: {
      padding: '10px 20px',
      background: 'linear-gradient(45deg, #ff6b35, #e63946)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    cancelButton: {
      padding: '10px 20px',
      background: '#f3f4f6',
      color: '#6b7280',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Conditional Logic for "{field.label}"</h3>
        <button 
          style={styles.helpButton}
          onClick={() => setShowHelp(!showHelp)}
        >
          {showHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Help
        </button>
      </div>

      {showHelp && (
        <div style={styles.helpBox}>
          <strong>How Conditional Logic Works:</strong><br />
          • Show or hide this field based on other field values<br />
          • Use "ALL" to require all conditions to be met<br />
          • Use "ANY" to require at least one condition to be met<br />
          • Combine multiple rules for complex logic
        </div>
      )}

      {availableFields.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
          Add other fields to your form first to use conditional logic.
        </div>
      ) : (
        <>
          {conditions.map((condition, condIndex) => (
            <div key={condition.id} style={styles.conditionCard}>
              <div style={styles.conditionHeader}>
                <select
                  style={styles.actionSelect}
                  value={condition.action}
                  onChange={(e) => updateCondition(condition.id, { action: e.target.value })}
                >
                  <option value="show">
                    {condition.action === 'show' ? '👁️' : ''} Show field
                  </option>
                  <option value="hide">
                    {condition.action === 'hide' ? '🚫' : ''} Hide field
                  </option>
                </select>
                
                <span style={{ color: '#6b7280', fontSize: '14px' }}>when</span>
                
                <div style={styles.logicToggle}>
                  <label>
                    <input
                      type="radio"
                      name={`logic-${condition.id}`}
                      value="all"
                      checked={condition.logic === 'all'}
                      onChange={() => updateCondition(condition.id, { logic: 'all' })}
                    />
                    ALL
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`logic-${condition.id}`}
                      value="any"
                      checked={condition.logic === 'any'}
                      onChange={() => updateCondition(condition.id, { logic: 'any' })}
                    />
                    ANY
                  </label>
                </div>
                
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  of these conditions are met:
                </span>
                
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteCondition(condition.id)}
                  title="Delete condition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {condition.rules.map((rule, ruleIndex) => (
                <div key={ruleIndex} style={styles.rule}>
                  <select
                    style={styles.select}
                    value={rule.fieldId}
                    onChange={(e) => updateRule(condition.id, ruleIndex, { 
                      fieldId: e.target.value,
                      value: '' // Reset value when field changes
                    })}
                  >
                    <option value="">Select field...</option>
                    {availableFields.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </select>

                  <select
                    style={styles.select}
                    value={rule.operator}
                    onChange={(e) => updateRule(condition.id, ruleIndex, { operator: e.target.value })}
                  >
                    <option value="equals">equals</option>
                    <option value="not_equals">not equals</option>
                    {rule.fieldId && ['text', 'email'].includes(
                      allFields.find(f => f.id === rule.fieldId)?.type
                    ) && (
                      <option value="contains">contains</option>
                    )}
                    {rule.fieldId && ['number'].includes(
                      allFields.find(f => f.id === rule.fieldId)?.type
                    ) && (
                      <>
                        <option value="greater_than">greater than</option>
                        <option value="less_than">less than</option>
                      </>
                    )}
                  </select>

                  {rule.fieldId && (
                    <>
                      {getFieldOptions(rule.fieldId).length > 0 ? (
                        <select
                          style={styles.select}
                          value={rule.value}
                          onChange={(e) => updateRule(condition.id, ruleIndex, { value: e.target.value })}
                        >
                          <option value="">Select value...</option>
                          {getFieldOptions(rule.fieldId).map((opt, idx) => (
                            <option key={idx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          style={styles.input}
                          value={rule.value}
                          onChange={(e) => updateRule(condition.id, ruleIndex, { value: e.target.value })}
                          placeholder="Enter value..."
                        />
                      )}
                    </>
                  )}

                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteRule(condition.id, ruleIndex)}
                    disabled={condition.rules.length === 1}
                    title="Delete rule"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                style={{ ...styles.addButton, fontSize: '12px', padding: '6px 12px' }}
                onClick={() => addRule(condition.id)}
              >
                <Plus size={12} />
                Add Rule
              </button>
            </div>
          ))}

          <button style={styles.addButton} onClick={addCondition}>
            <Plus size={16} />
            Add Condition
          </button>
        </>
      )}

      <div style={styles.footer}>
        <button style={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button style={styles.saveButton} onClick={saveConditions}>
          Save Conditions
        </button>
      </div>
    </div>
  );
};

export default ConditionalLogic;
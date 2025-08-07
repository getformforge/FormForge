// Evaluates conditional logic rules to determine if a field should be visible
export const evaluateFieldConditions = (field, formData, allFields) => {
  // If no conditions, field is always visible
  if (!field.conditions || field.conditions.length === 0) {
    return true;
  }

  // Process each condition
  for (const condition of field.conditions) {
    const rulesResults = condition.rules.map(rule => evaluateRule(rule, formData, allFields));
    
    // Evaluate based on logic (all or any)
    let conditionMet = false;
    if (condition.logic === 'all') {
      conditionMet = rulesResults.every(result => result === true);
    } else if (condition.logic === 'any') {
      conditionMet = rulesResults.some(result => result === true);
    }
    
    // Apply action (show or hide)
    if (condition.action === 'show') {
      // Show field only if condition is met
      if (!conditionMet) return false;
    } else if (condition.action === 'hide') {
      // Hide field if condition is met
      if (conditionMet) return false;
    }
  }
  
  // If we've passed all conditions, field is visible
  return true;
};

// Evaluates a single rule
const evaluateRule = (rule, formData, allFields) => {
  if (!rule.fieldId || rule.value === undefined || rule.value === '') {
    return false;
  }

  const fieldValue = formData[rule.fieldId];
  const targetField = allFields.find(f => f.id === rule.fieldId);
  
  // Handle checkbox fields specially
  if (targetField && targetField.type === 'checkbox') {
    const isChecked = fieldValue === true || fieldValue === 'checked';
    if (rule.value === 'checked') {
      return rule.operator === 'equals' ? isChecked : !isChecked;
    } else if (rule.value === 'unchecked') {
      return rule.operator === 'equals' ? !isChecked : isChecked;
    }
  }

  // Handle empty field values
  if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
    return false;
  }

  // Convert values to strings for comparison
  const actualValue = String(fieldValue).toLowerCase();
  const expectedValue = String(rule.value).toLowerCase();

  switch (rule.operator) {
    case 'equals':
      return actualValue === expectedValue;
    
    case 'not_equals':
      return actualValue !== expectedValue;
    
    case 'contains':
      return actualValue.includes(expectedValue);
    
    case 'greater_than':
      return parseFloat(fieldValue) > parseFloat(rule.value);
    
    case 'less_than':
      return parseFloat(fieldValue) < parseFloat(rule.value);
    
    default:
      return false;
  }
};

// Get all visible fields based on current form data
export const getVisibleFields = (fields, formData) => {
  return fields.filter(field => evaluateFieldConditions(field, formData, fields));
};

// Check if any fields have conditions
export const hasConditionalFields = (fields) => {
  return fields.some(field => field.conditions && field.conditions.length > 0);
};
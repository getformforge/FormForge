import React, { useState } from 'react';
import { FileText, Star, Users, Clock, ArrowRight, Search, X } from 'lucide-react';
import { theme } from '../styles/theme';
import { templates, templateCategories, popularTemplates } from '../templates';

const Templates = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || 
      template.category.toLowerCase() === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template) => {
    // Convert template fields to FormForge format
    const formFields = template.fields.map((field, index) => ({
      ...field,
      id: Date.now() + index, // Ensure unique IDs
    }));
    
    onSelectTemplate(formFields, template.name);
    onClose();
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
      padding: '20px'
    },
    container: {
      background: '#ffffff',
      borderRadius: theme.borderRadius.xl,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: `1px solid ${theme.colors.secondary[200]}`,
      padding: '40px',
      width: '100%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.black,
      background: theme.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: theme.spacing[3]
    },
    subtitle: {
      color: theme.colors.secondary[600],
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.medium
    },
    searchBar: {
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto 30px',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '16px 20px 16px 50px',
      background: theme.colors.secondary[50],
      border: `2px solid ${theme.colors.secondary[200]}`,
      borderRadius: theme.borderRadius.lg,
      color: theme.colors.secondary[900],
      fontSize: '16px',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: theme.colors.primary[500]
    },
    categories: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '40px',
      flexWrap: 'wrap'
    },
    categoryButton: (active) => ({
      padding: '12px 24px',
      borderRadius: '25px',
      border: active ? `2px solid ${theme.colors.primary[500]}` : `2px solid ${theme.colors.secondary[200]}`,
      background: active ? theme.colors.primary[50] : theme.colors.secondary[50],
      color: active ? theme.colors.primary[600] : theme.colors.secondary[600],
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }),
    popularSection: {
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: theme.colors.secondary[900],
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    templatesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px'
    },
    templateCard: {
      background: theme.colors.secondary[50],
      border: `1px solid ${theme.colors.secondary[200]}`,
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    templateHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    templateIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      background: theme.gradients.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    },
    templateName: {
      fontSize: '18px',
      fontWeight: '700',
      color: theme.colors.secondary[900],
      flex: 1
    },
    templateCategory: {
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '12px',
      background: theme.colors.primary[50],
      color: theme.colors.primary[600],
      fontWeight: '600'
    },
    templateDescription: {
      color: theme.colors.secondary[600],
      fontSize: '14px',
      marginBottom: '16px',
      lineHeight: '1.5'
    },
    templateStats: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px'
    },
    templateStat: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: theme.colors.secondary[500]
    },
    useButton: {
      width: '100%',
      padding: '12px',
      background: theme.gradients.primary,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease'
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: theme.colors.secondary[100],
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.7)'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={styles.closeButton}>
          <X size={20} />
        </button>
        
        <div style={styles.header}>
          <h1 style={styles.title}>Professional Templates</h1>
          <p style={styles.subtitle}>Choose from our library of proven document templates</p>
        </div>

        <div style={styles.searchBar}>
          <Search size={20} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.categories}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={styles.categoryButton(selectedCategory === 'all')}
          >
            All Templates
          </button>
          {templateCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={styles.categoryButton(selectedCategory === category.id)}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {selectedCategory === 'all' && (
          <div style={styles.popularSection}>
            <h2 style={styles.sectionTitle}>
              <Star size={20} color="#ffaa00" />
              Most Popular
            </h2>
            <div style={styles.templatesGrid}>
              {popularTemplates.map(template => (
                <div
                  key={template.id}
                  style={styles.templateCard}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div style={styles.templateHeader}>
                    <div style={styles.templateIcon}>
                      {template.category === 'Business' ? '💼' : 
                       template.category === 'Legal' ? '⚖️' : 
                       template.category === 'Medical' ? '🏥' : '📋'}
                    </div>
                    <div style={styles.templateName}>{template.name}</div>
                    <div style={styles.templateCategory}>{template.category}</div>
                  </div>
                  <div style={styles.templateDescription}>{template.description}</div>
                  <div style={styles.templateStats}>
                    <div style={styles.templateStat}>
                      <FileText size={14} />
                      {template.fields.length} fields
                    </div>
                    <div style={styles.templateStat}>
                      <Users size={14} />
                      Popular
                    </div>
                    <div style={styles.templateStat}>
                      <Clock size={14} />
                      2 min setup
                    </div>
                  </div>
                  <button style={styles.useButton}>
                    Use Template <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={styles.sectionTitle}>
            <FileText size={20} />
            {selectedCategory === 'all' ? 'All Templates' : 
             templateCategories.find(cat => cat.id === selectedCategory)?.name + ' Templates'}
          </h2>
          <div style={styles.templatesGrid}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                style={styles.templateCard}
                onClick={() => handleSelectTemplate(template)}
              >
                <div style={styles.templateHeader}>
                  <div style={styles.templateIcon}>
                    {template.category === 'Business' ? '💼' : 
                     template.category === 'Legal' ? '⚖️' : 
                     template.category === 'Medical' ? '🏥' : '📋'}
                  </div>
                  <div style={styles.templateName}>{template.name}</div>
                  <div style={styles.templateCategory}>{template.category}</div>
                </div>
                <div style={styles.templateDescription}>{template.description}</div>
                <div style={styles.templateStats}>
                  <div style={styles.templateStat}>
                    <FileText size={14} />
                    {template.fields.length} fields
                  </div>
                  <div style={styles.templateStat}>
                    <Users size={14} />
                    Professional
                  </div>
                  <div style={styles.templateStat}>
                    <Clock size={14} />
                    2 min setup
                  </div>
                </div>
                <button style={styles.useButton}>
                  Use Template <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
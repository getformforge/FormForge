import React, { useState } from 'react';
import { FileText, Star, Users, Clock, ArrowRight, Search } from 'lucide-react';
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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)',
      padding: '20px'
    },
    container: {
      background: 'linear-gradient(135deg, rgba(45, 45, 45, 0.98), rgba(30, 30, 30, 0.98))',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255, 107, 53, 0.2)',
      border: '2px solid rgba(255, 107, 53, 0.3)',
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
      fontSize: '2.5rem',
      fontWeight: '900',
      background: 'linear-gradient(45deg, #ff6b35, #ffaa00)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '12px',
      fontFamily: 'Inter, sans-serif'
    },
    subtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '18px',
      fontWeight: '500'
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
      background: 'rgba(255, 255, 255, 0.1)',
      border: '2px solid rgba(255, 107, 53, 0.3)',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '16px',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 107, 53, 0.7)'
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
      border: active ? '2px solid #ff6b35' : '2px solid rgba(255, 255, 255, 0.2)',
      background: active ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 255, 255, 0.05)',
      color: active ? '#ff6b35' : 'rgba(255,255,255,0.8)',
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
      color: '#ffffff',
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
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 107, 53, 0.2)',
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
      background: 'linear-gradient(45deg, #ff6b35, #ffaa00)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px'
    },
    templateName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ffffff',
      flex: 1
    },
    templateCategory: {
      fontSize: '12px',
      padding: '4px 8px',
      borderRadius: '12px',
      background: 'rgba(255, 107, 53, 0.2)',
      color: '#ff6b35',
      fontWeight: '600'
    },
    templateDescription: {
      color: 'rgba(255,255,255,0.7)',
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
      color: 'rgba(255,255,255,0.6)'
    },
    useButton: {
      width: '100%',
      padding: '12px',
      background: 'linear-gradient(45deg, #ff6b35, #e63946)',
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
      background: 'rgba(255, 255, 255, 0.1)',
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
          ×
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
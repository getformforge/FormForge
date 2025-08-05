import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import FormBuilderApp from './FormBuilderApp';
import InvoiceGenerator from './pages/InvoiceGenerator';
import ContractGenerator from './pages/ContractGenerator';
import { templates } from './templates';

const AppRouter = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleStartInvoice = (template) => {
    // Store the template in sessionStorage and redirect to form builder
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    window.location.href = '/builder';
  };

  const handleStartContract = (template) => {
    // Store the template in sessionStorage and redirect to form builder
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    window.location.href = '/builder';
  };

  const handleNavigate = (destination) => {
    switch (destination) {
      case 'medical':
        const medicalTemplate = templates.find(t => t.id === 'medical-intake');
        if (medicalTemplate) {
          sessionStorage.setItem('selectedTemplate', JSON.stringify(medicalTemplate));
          window.location.href = '/builder';
        }
        break;
      case 'rental':
        const rentalTemplate = templates.find(t => t.id === 'rental-agreement');
        if (rentalTemplate) {
          sessionStorage.setItem('selectedTemplate', JSON.stringify(rentalTemplate));
          window.location.href = '/builder';
        }
        break;
      case 'nda':
        const ndaTemplate = templates.find(t => t.id === 'nda-agreement');
        if (ndaTemplate) {
          sessionStorage.setItem('selectedTemplate', JSON.stringify(ndaTemplate));
          window.location.href = '/builder';
        }
        break;
      case 'builder':
        window.location.href = '/builder';
        break;
      default:
        break;
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home Page - Overview/Landing */}
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          
          {/* Form Builder Application */}
          <Route path="/builder" element={<FormBuilderApp />} />
          
          {/* SEO Landing Pages */}
          <Route 
            path="/invoice-generator" 
            element={<InvoiceGenerator onStartInvoice={handleStartInvoice} />} 
          />
          <Route 
            path="/contract-generator" 
            element={<ContractGenerator onStartContract={handleStartContract} />} 
          />
          
          {/* Redirect old URLs */}
          <Route path="/templates/invoice" element={<Navigate to="/invoice-generator" replace />} />
          <Route path="/templates/contract" element={<Navigate to="/contract-generator" replace />} />
          <Route path="/app" element={<Navigate to="/builder" replace />} />
          
          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
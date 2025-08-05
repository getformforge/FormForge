import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import FormPDFApp from './App';
import InvoiceGenerator from './pages/InvoiceGenerator';
import ContractGenerator from './pages/ContractGenerator';
import { landingPages } from './templates';

const AppRouter = () => {
  const handleStartInvoice = (template) => {
    // Store the template in sessionStorage and redirect to main app
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    window.location.href = '/';
  };

  const handleStartContract = (template) => {
    // Store the template in sessionStorage and redirect to main app
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    window.location.href = '/';
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main FormForge Application */}
          <Route path="/" element={<FormPDFApp />} />
          
          {/* Landing Pages */}
          <Route 
            path="/invoice-generator" 
            element={<InvoiceGenerator onStartInvoice={handleStartInvoice} />} 
          />
          <Route 
            path="/contract-generator" 
            element={<ContractGenerator onStartContract={handleStartContract} />} 
          />
          
          {/* Redirect old URLs if needed */}
          <Route path="/templates/invoice" element={<Navigate to="/invoice-generator" replace />} />
          <Route path="/templates/contract" element={<Navigate to="/contract-generator" replace />} />
          
          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
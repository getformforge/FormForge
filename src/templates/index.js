import { invoiceTemplate } from './invoiceTemplate';
import { contractTemplate } from './contractTemplate';
import { medicalIntakeTemplate } from './medicalIntakeTemplate';
import { rentalAgreementTemplate } from './rentalAgreementTemplate';
import { ndaTemplate } from './ndaTemplate';

// Template categories
export const templateCategories = [
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Professional business documents'
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: '⚖️',
    description: 'Contracts and legal agreements'
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: '🏥',
    description: 'Healthcare and medical forms'
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    icon: '🏠',
    description: 'Property and rental documents'
  }
];

// All available templates
export const templates = [
  invoiceTemplate,
  contractTemplate,
  medicalIntakeTemplate,
  rentalAgreementTemplate,
  ndaTemplate
];

// Get templates by category
export const getTemplatesByCategory = (categoryId) => {
  return templates.filter(template => 
    template.category.toLowerCase() === categoryId
  );
};

// Get template by ID
export const getTemplateById = (templateId) => {
  return templates.find(template => template.id === templateId);
};

// Popular templates (most used)
export const popularTemplates = [
  invoiceTemplate,
  contractTemplate,
  ndaTemplate,
  medicalIntakeTemplate
];

// SEO landing pages mapping
export const landingPages = {
  'invoice-generator': {
    template: invoiceTemplate,
    title: 'Free Invoice Generator | Create Professional Invoices',
    description: 'Generate professional invoices in seconds. Free invoice template with PDF download. Perfect for freelancers and small businesses.',
    keywords: 'invoice generator, free invoice, freelance invoice, professional invoice template'
  },
  'contract-generator': {
    template: contractTemplate,
    title: 'Freelance Contract Generator | Professional Service Agreements',
    description: 'Create professional freelance contracts and service agreements. Legal template with PDF download. Protect your business.',
    keywords: 'freelance contract, service agreement, contract template, freelancer contract'
  },
  'medical-intake-form': {
    template: medicalIntakeTemplate,
    title: 'Medical Intake Form Generator | Patient Forms for Healthcare',
    description: 'Create professional medical intake forms for your practice. HIPAA-compliant patient forms with PDF generation.',
    keywords: 'medical intake form, patient intake, healthcare forms, medical practice forms'
  },
  'rental-agreement': {
    template: rentalAgreementTemplate,
    title: 'Rental Agreement Generator | Professional Lease Contracts',
    description: 'Generate professional rental agreements and lease contracts. Perfect for landlords and property managers.',
    keywords: 'rental agreement, lease contract, landlord forms, property rental agreement'
  },
  'nda-generator': {
    template: ndaTemplate,
    title: 'NDA Generator | Non-Disclosure Agreement Templates',
    description: 'Create professional NDAs and confidentiality agreements. Protect your business information with legal templates.',
    keywords: 'NDA generator, non-disclosure agreement, confidentiality agreement, business NDA'
  }
};
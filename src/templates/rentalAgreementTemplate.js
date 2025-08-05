export const rentalAgreementTemplate = {
  id: 'rental-agreement',
  name: 'Residential Rental Agreement',
  category: 'Real Estate',
  description: 'Professional rental lease agreement for landlords and property managers',
  fields: [
    {
      id: 'lease_date',
      type: 'date',
      label: 'Lease Agreement Date',
      required: true
    },
    {
      id: 'landlord_name',
      type: 'text',
      label: 'Landlord/Owner Name',
      required: true,
      placeholder: 'Property Management LLC'
    },
    {
      id: 'landlord_address',
      type: 'textarea',
      label: 'Landlord Address',
      required: true,
      placeholder: '456 Business Ave\nCity, State 12345'
    },
    {
      id: 'tenant_name',
      type: 'text',
      label: 'Tenant Name(s)',
      required: true,
      placeholder: 'John Doe, Jane Doe'
    },
    {
      id: 'property_address',
      type: 'textarea',
      label: 'Rental Property Address',
      required: true,
      placeholder: '123 Rental Street\nCity, State 12345'
    },
    {
      id: 'lease_term',
      type: 'select',
      label: 'Lease Term',
      required: true,
      options: [
        '6 months',
        '12 months',
        '18 months',
        '24 months',
        'Month-to-month',
        'Other'
      ]
    },
    {
      id: 'lease_start_date',
      type: 'date',
      label: 'Lease Start Date',
      required: true
    },
    {
      id: 'lease_end_date',
      type: 'date',
      label: 'Lease End Date',
      required: true
    },
    {
      id: 'monthly_rent',
      type: 'number',
      label: 'Monthly Rent Amount ($)',
      required: true,
      placeholder: '1500'
    },
    {
      id: 'security_deposit',
      type: 'number',
      label: 'Security Deposit ($)',
      required: true,
      placeholder: '1500'
    },
    {
      id: 'pet_policy',
      type: 'select',
      label: 'Pet Policy',
      required: true,
      options: [
        'No pets allowed',
        'Cats allowed',
        'Dogs allowed',
        'Cats and dogs allowed',
        'All pets allowed with approval'
      ]
    },
    {
      id: 'pet_deposit',
      type: 'number',
      label: 'Pet Deposit ($) - if applicable',
      required: false,
      placeholder: '500'
    },
    {
      id: 'utilities_included',
      type: 'textarea',
      label: 'Utilities Included in Rent',
      required: false,
      placeholder: 'Water, sewer, trash (tenant pays electric, gas, internet)'
    },
    {
      id: 'parking_spaces',
      type: 'number',
      label: 'Number of Parking Spaces',
      required: false,
      placeholder: '2'
    },
    {
      id: 'maintenance_responsibility',
      type: 'textarea',
      label: 'Maintenance Responsibilities',
      required: true,
      placeholder: 'Tenant responsible for routine maintenance, landlord handles major repairs...'
    },
    {
      id: 'smoking_policy',
      type: 'select',
      label: 'Smoking Policy',
      required: true,
      options: [
        'No smoking anywhere on property',
        'Smoking allowed outdoors only',
        'Smoking allowed'
      ]
    },
    {
      id: 'renewal_terms',
      type: 'textarea',
      label: 'Lease Renewal Terms',
      required: false,
      placeholder: 'Terms for lease renewal, rent increases, notice requirements...'
    },
    {
      id: 'additional_terms',
      type: 'textarea',
      label: 'Additional Terms and Conditions',
      required: false,
      placeholder: 'Any additional rules, restrictions, or agreements...'
    },
    {
      id: 'landlord_signature',
      type: 'signature',
      label: 'Landlord Signature',
      required: true
    },
    {
      id: 'tenant_signature',
      type: 'signature',
      label: 'Tenant Signature',
      required: true
    }
  ],
  pdfStyle: 'legal-document',
  seoKeywords: ['rental agreement', 'lease agreement', 'rental contract', 'landlord forms', 'property rental'],
  targetAudience: 'Landlords, Property Managers, Real Estate Professionals'
};
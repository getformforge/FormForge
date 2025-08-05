export const contractTemplate = {
  id: 'freelance-contract',
  name: 'Freelance Service Agreement',
  category: 'Legal',
  description: 'Professional freelance contract template',
  fields: [
    {
      id: 'contract_date',
      type: 'date',
      label: 'Contract Date',
      required: true
    },
    {
      id: 'client_name',
      type: 'text',
      label: 'Client Name',
      required: true,
      placeholder: 'ABC Company Inc.'
    },
    {
      id: 'client_address',
      type: 'textarea',
      label: 'Client Address',
      required: true,
      placeholder: '123 Business Street\nCity, State 12345'
    },
    {
      id: 'freelancer_name',
      type: 'text',
      label: 'Freelancer Name',
      required: true,
      placeholder: 'John Doe'
    },
    {
      id: 'freelancer_address',
      type: 'textarea',
      label: 'Freelancer Address',
      required: true,
      placeholder: '456 Home Street\nCity, State 67890'
    },
    {
      id: 'project_description',
      type: 'textarea',
      label: 'Project Description',
      required: true,
      placeholder: 'Detailed description of work to be performed...'
    },
    {
      id: 'project_timeline',
      type: 'text',
      label: 'Project Timeline',
      required: true,
      placeholder: '30 days from contract signing'
    },
    {
      id: 'total_compensation',
      type: 'number',
      label: 'Total Compensation ($)',
      required: true,
      placeholder: '5000'
    },
    {
      id: 'payment_schedule',
      type: 'select',
      label: 'Payment Schedule',
      required: true,
      options: [
        '50% upfront, 50% on completion',
        '25% upfront, 75% on completion',
        'Full payment upfront',
        'Payment on completion',
        'Monthly installments'
      ]
    },
    {
      id: 'deliverables',
      type: 'textarea',
      label: 'Deliverables',
      required: true,
      placeholder: 'List of specific deliverables...'
    },
    {
      id: 'revision_rounds',
      type: 'number',
      label: 'Included Revision Rounds',
      required: true,
      placeholder: '3'
    },
    {
      id: 'intellectual_property',
      type: 'select',
      label: 'Intellectual Property Rights',
      required: true,
      options: [
        'Client owns all rights',
        'Freelancer retains rights',
        'Shared ownership',
        'License to use'
      ]
    },
    {
      id: 'confidentiality',
      type: 'checkbox',
      label: 'Include Confidentiality Clause',
      required: false
    },
    {
      id: 'termination_clause',
      type: 'textarea',
      label: 'Termination Terms',
      required: true,
      placeholder: 'Either party may terminate with 7 days written notice...'
    }
  ],
  pdfStyle: 'legal-document',
  seoKeywords: ['freelance contract', 'service agreement', 'freelancer contract template', 'work agreement'],
  targetAudience: 'Freelancers, Independent Contractors, Small Agencies'
};
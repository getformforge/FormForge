export const ndaTemplate = {
  id: 'nda-agreement',
  name: 'Non-Disclosure Agreement (NDA)',
  category: 'Legal',
  description: 'Professional NDA for protecting confidential business information',
  fields: [
    {
      id: 'agreement_date',
      type: 'date',
      label: 'Agreement Date',
      required: true
    },
    {
      id: 'disclosing_party',
      type: 'text',
      label: 'Disclosing Party (Company Name)',
      required: true,
      placeholder: 'ABC Corporation'
    },
    {
      id: 'disclosing_party_address',
      type: 'textarea',
      label: 'Disclosing Party Address',
      required: true,
      placeholder: '123 Business Street\nCity, State 12345'
    },
    {
      id: 'receiving_party',
      type: 'text',
      label: 'Receiving Party (Name/Company)',
      required: true,
      placeholder: 'John Doe / XYZ Company'
    },
    {
      id: 'receiving_party_address',
      type: 'textarea',
      label: 'Receiving Party Address',
      required: true,
      placeholder: '456 Individual Lane\nCity, State 67890'
    },
    {
      id: 'purpose',
      type: 'textarea',
      label: 'Purpose of Disclosure',
      required: true,
      placeholder: 'Evaluation of potential business partnership, employment discussion, etc.'
    },
    {
      id: 'confidential_information',
      type: 'textarea',
      label: 'Definition of Confidential Information',
      required: true,
      placeholder: 'Trade secrets, business plans, financial information, customer lists, technical data, etc.'
    },
    {
      id: 'agreement_type',
      type: 'select',
      label: 'Agreement Type',
      required: true,
      options: [
        'Mutual NDA (both parties disclose)',
        'One-way NDA (only one party discloses)'
      ]
    },
    {
      id: 'duration_years',
      type: 'select',
      label: 'Agreement Duration',
      required: true,
      options: [
        '1 year',
        '2 years',
        '3 years',
        '5 years',
        '10 years',
        'Indefinite'
      ]
    },
    {
      id: 'permitted_use',
      type: 'textarea',
      label: 'Permitted Use of Information',
      required: true,
      placeholder: 'Information may only be used for evaluation purposes and may not be shared with third parties...'
    },
    {
      id: 'return_requirement',
      type: 'checkbox',
      label: 'Require return/destruction of materials upon request',
      required: false
    },
    {
      id: 'governing_law',
      type: 'text',
      label: 'Governing Law (State)',
      required: true,
      placeholder: 'California'
    },
    {
      id: 'jurisdiction',
      type: 'text',
      label: 'Legal Jurisdiction (City, State)',
      required: true,
      placeholder: 'Los Angeles, California'
    },
    {
      id: 'remedy_clause',
      type: 'select',
      label: 'Remedy for Breach',
      required: true,
      options: [
        'Monetary damages only',
        'Injunctive relief available',
        'Both monetary damages and injunctive relief'
      ]
    },
    {
      id: 'exceptions',
      type: 'textarea',
      label: 'Exceptions to Confidentiality',
      required: false,
      placeholder: 'Information that is publicly available, independently developed, etc.'
    },
    {
      id: 'additional_terms',
      type: 'textarea',
      label: 'Additional Terms',
      required: false,
      placeholder: 'Any additional clauses or special conditions...'
    },
    {
      id: 'disclosing_party_signature',
      type: 'signature',
      label: 'Disclosing Party Signature',
      required: true
    },
    {
      id: 'disclosing_party_title',
      type: 'text',
      label: 'Disclosing Party Title',
      required: true,
      placeholder: 'CEO, President, etc.'
    },
    {
      id: 'receiving_party_signature',
      type: 'signature',
      label: 'Receiving Party Signature',
      required: true
    },
    {
      id: 'receiving_party_title',
      type: 'text',
      label: 'Receiving Party Title (if applicable)',
      required: false,
      placeholder: 'CTO, Consultant, etc.'
    }
  ],
  pdfStyle: 'legal-document',
  seoKeywords: ['NDA', 'non-disclosure agreement', 'confidentiality agreement', 'business NDA', 'legal contract'],
  targetAudience: 'Businesses, Startups, Entrepreneurs, Legal Professionals'
};
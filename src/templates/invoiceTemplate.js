export const invoiceTemplate = {
  id: 'invoice',
  name: 'Professional Invoice',
  category: 'Business',
  description: 'Create professional invoices for your freelance work',
  fields: [
    {
      id: 'invoice_number',
      type: 'text',
      label: 'Invoice Number',
      required: true,
      placeholder: 'INV-001'
    },
    {
      id: 'invoice_date',
      type: 'date',
      label: 'Invoice Date',
      required: true
    },
    {
      id: 'due_date',
      type: 'date',
      label: 'Due Date',
      required: true
    },
    {
      id: 'client_name',
      type: 'text',
      label: 'Client Name',
      required: true,
      placeholder: 'Acme Corporation'
    },
    {
      id: 'client_email',
      type: 'email',
      label: 'Client Email',
      required: true,
      placeholder: 'client@company.com'
    },
    {
      id: 'client_address',
      type: 'textarea',
      label: 'Client Address',
      required: false,
      placeholder: '123 Business St\nCity, State 12345'
    },
    {
      id: 'your_name',
      type: 'text',
      label: 'Your Name/Business',
      required: true,
      placeholder: 'Your Business Name'
    },
    {
      id: 'your_address',
      type: 'textarea',
      label: 'Your Address',
      required: false,
      placeholder: '456 Freelancer Ave\nCity, State 67890'
    },
    {
      id: 'service_description',
      type: 'textarea',
      label: 'Service Description',
      required: true,
      placeholder: 'Web development services for Q4 2024'
    },
    {
      id: 'hours_worked',
      type: 'number',
      label: 'Hours Worked',
      required: false,
      placeholder: '40'
    },
    {
      id: 'hourly_rate',
      type: 'number',
      label: 'Hourly Rate ($)',
      required: false,
      placeholder: '75'
    },
    {
      id: 'total_amount',
      type: 'number',
      label: 'Total Amount ($)',
      required: true,
      placeholder: '3000'
    },
    {
      id: 'payment_terms',
      type: 'select',
      label: 'Payment Terms',
      required: true,
      options: [
        'Net 30 days',
        'Net 15 days',
        'Due on receipt',
        'Net 60 days'
      ]
    },
    {
      id: 'payment_methods',
      type: 'textarea',
      label: 'Payment Methods',
      required: false,
      placeholder: 'Bank transfer, PayPal, Check'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      required: false,
      placeholder: 'Thank you for your business!'
    }
  ],
  pdfStyle: 'professional-invoice',
  seoKeywords: ['invoice generator', 'freelance invoice', 'professional invoice', 'invoice template'],
  targetAudience: 'Freelancers, Small Business Owners, Consultants'
};
export const medicalIntakeTemplate = {
  id: 'medical-intake',
  name: 'Medical Intake Form',
  category: 'Medical',
  description: 'Comprehensive patient intake form for medical practices',
  fields: [
    {
      id: 'patient_name',
      type: 'text',
      label: 'Patient Full Name',
      required: true,
      placeholder: 'John Doe'
    },
    {
      id: 'date_of_birth',
      type: 'date',
      label: 'Date of Birth',
      required: true
    },
    {
      id: 'gender',
      type: 'select',
      label: 'Gender',
      required: true,
      options: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    {
      id: 'address',
      type: 'textarea',
      label: 'Home Address',
      required: true,
      placeholder: '123 Main Street\nCity, State 12345'
    },
    {
      id: 'phone',
      type: 'text',
      label: 'Phone Number',
      required: true,
      placeholder: '(555) 123-4567'
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'patient@example.com'
    },
    {
      id: 'emergency_contact_name',
      type: 'text',
      label: 'Emergency Contact Name',
      required: true,
      placeholder: 'Jane Smith'
    },
    {
      id: 'emergency_contact_phone',
      type: 'text',
      label: 'Emergency Contact Phone',
      required: true,
      placeholder: '(555) 987-6543'
    },
    {
      id: 'insurance_provider',
      type: 'text',
      label: 'Insurance Provider',
      required: false,
      placeholder: 'Blue Cross Blue Shield'
    },
    {
      id: 'policy_number',
      type: 'text',
      label: 'Insurance Policy Number',
      required: false,
      placeholder: 'ABC123456789'
    },
    {
      id: 'chief_complaint',
      type: 'textarea',
      label: 'Chief Complaint / Reason for Visit',
      required: true,
      placeholder: 'Describe the main reason for your visit today...'
    },
    {
      id: 'current_medications',
      type: 'textarea',
      label: 'Current Medications',
      required: false,
      placeholder: 'List all medications, vitamins, and supplements you currently take...'
    },
    {
      id: 'allergies',
      type: 'textarea',
      label: 'Allergies (Drug, Food, Environmental)',
      required: false,
      placeholder: 'List any known allergies...'
    },
    {
      id: 'medical_history',
      type: 'textarea',
      label: 'Previous Medical History',
      required: false,
      placeholder: 'Previous surgeries, hospitalizations, major illnesses...'
    },
    {
      id: 'family_history',
      type: 'textarea',
      label: 'Family Medical History',
      required: false,
      placeholder: 'Significant medical conditions in family members...'
    },
    {
      id: 'smoking_status',
      type: 'select',
      label: 'Smoking Status',
      required: false,
      options: ['Never smoked', 'Former smoker', 'Current smoker']
    },
    {
      id: 'alcohol_use',
      type: 'select',
      label: 'Alcohol Use',
      required: false,
      options: ['None', 'Occasional', 'Moderate', 'Heavy']
    },
    {
      id: 'consent_treatment',
      type: 'checkbox',
      label: 'I consent to medical treatment and examination',
      required: true
    },
    {
      id: 'hipaa_acknowledgment',
      type: 'checkbox',
      label: 'I acknowledge receipt of HIPAA Privacy Notice',
      required: true
    },
    {
      id: 'patient_signature',
      type: 'signature',
      label: 'Patient Signature',
      required: true
    }
  ],
  pdfStyle: 'medical-form',
  seoKeywords: ['medical intake form', 'patient intake', 'medical history form', 'healthcare form'],
  targetAudience: 'Medical Practices, Clinics, Healthcare Providers'
};
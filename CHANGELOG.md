# FormForge Changelog

## [2.0.0] - August 2025

### 🎉 Major Release: Production-Ready SaaS Platform

### ✨ New Features
- **Production Stripe Integration**: Complete payment system with live API keys
- **Automatic Plan Updates**: Webhook integration for subscription lifecycle management
- **Customer Portal**: Users can manage subscriptions directly
- **Firebase Admin SDK**: Server-side operations for secure plan management
- **Enhanced PDF Generation**: 
  - Multi-page support with proper pagination
  - Embedded signature images (not just text)
  - Configurable date headers
  - Accurate page break previews
- **Improved Form Sharing**:
  - Wider public forms (900px max width)
  - Better responsive design
  - Fixed undefined theme errors

### 🐛 Bug Fixes
- Fixed PDF preview showing single page when PDF had multiple pages
- Fixed date appearing in footer instead of header
- Fixed signature showing as code block in preview
- Fixed Copy Link button styling inconsistency
- Fixed undefined formTheme error in PublicFormPage
- Fixed git commit error with 'nul' file
- Fixed Firebase Admin import missing in webhook handler

### 🔧 Technical Improvements
- Complete backend API infrastructure with Vercel Functions
- Firebase Admin SDK integration for server operations
- Proper CORS handling in serverless functions
- Environment variable configuration for production secrets
- Improved error handling and logging

### 📝 Documentation
- Added FIREBASE_ADMIN_SETUP.md for backend configuration
- Added STRIPE_SETUP_CHECKLIST.md for payment integration
- Created manual update scripts for troubleshooting
- Updated API documentation with webhook endpoints

### 🚀 Deployment
- Successfully deployed to production at www.getformforge.com
- Vercel auto-deployment configured from GitHub
- Production environment variables configured
- Stripe webhooks active and processing

---

## [1.5.0] - August 2025

### ✨ New Features
- **Row-Based Form Builder**: Complete redesign with multi-column support
- **Drag and Drop**: Full drag-and-drop functionality for form elements
- **Template Integration**: Professional templates (Invoice, Contract, Medical, etc.)
- **Usage Dashboard**: Real-time tracking of forms, submissions, and PDFs
- **CSV Export**: Export submission data to CSV format

### 🎨 UI/UX Improvements
- Modern, clean interface with improved typography
- Better spacing and visual hierarchy
- Responsive design improvements
- Professional button styling
- Enhanced modal designs

---

## [1.0.0] - July 2025

### 🎉 Initial Production Release
- Core form builder with 15+ field types
- PDF generation capabilities
- User authentication with Firebase
- Basic form sharing functionality
- Free tier implementation
- Initial UI/UX design
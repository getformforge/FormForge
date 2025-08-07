# FormForge - Professional Form Builder & PDF Generator

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://www.getformforge.com)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)](https://firebase.google.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-green)](https://stripe.com/)

## 🚀 Overview

FormForge is a production-ready SaaS platform that empowers businesses to create professional forms, collect submissions, and generate PDFs. Built with modern web technologies and enterprise-grade security, FormForge offers a comprehensive solution for digital form management.

**Live Production**: [https://www.getformforge.com](https://www.getformforge.com)

## ✨ Key Features

### Form Builder
- **15+ Field Types**: Text, email, date, file upload, signatures, ratings, and more
- **Drag-and-Drop Interface**: Intuitive field reordering with @dnd-kit
- **Multi-Column Layouts**: Create 1, 2, or 3 column responsive forms
- **Conditional Logic**: Show/hide fields based on user input
- **Professional Templates**: Pre-built forms for invoices, contracts, medical intake, NDAs

### Form Management
- **Save & Load Forms**: Create reusable form templates
- **Duplicate Forms**: Clone existing forms with one click
- **Public Sharing**: Share forms via unique URLs
- **Real-time Submissions**: Collect responses without requiring authentication
- **CSV Export**: Export submission data for analysis

### PDF Generation
- **Professional PDFs**: Generate branded documents instantly
- **Custom Headers**: Add company branding and information
- **Multi-page Support**: Automatic pagination for long forms
- **Signature Integration**: Include digital signatures in PDFs
- **Blank Templates**: Generate empty forms for printing

### Business Features
- **Subscription Plans**: Free, Pro ($9.99/mo), Business ($29.99/mo)
- **Usage Tracking**: Monitor forms, submissions, and PDF generation
- **Customer Portal**: Manage subscriptions and billing
- **Secure Payments**: PCI-compliant payment processing via Stripe
- **Analytics Dashboard**: Track form performance and usage

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Firebase SDK** - Authentication and database
- **Stripe Elements** - Secure payment forms
- **jsPDF** - PDF generation
- **@dnd-kit** - Drag and drop functionality

### Backend
- **Firebase Firestore** - NoSQL database
- **Firebase Auth** - User authentication
- **Vercel Functions** - Serverless API endpoints
- **Stripe API** - Payment processing
- **Firebase Admin SDK** - Server-side operations

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Stripe account
- Vercel account (for deployment)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/getformforge/FormForge.git
cd FormForge
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy to Vercel**
```bash
vercel
```

3. **Configure Environment Variables in Vercel Dashboard**
- Add all environment variables from `.env.local`
- Add production Stripe keys for live mode
- Configure Firebase service account for API endpoints

### Environment Variables Required

#### Client-side (VITE_ prefix):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_STRIPE_PUBLISHABLE_KEY`

#### Server-side (API endpoints):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string)

## 📁 Project Structure

```
FormForge/
├── api/                    # Serverless API endpoints
│   ├── create-checkout-session.js
│   ├── create-portal-session.js
│   └── stripe-webhook.js
├── src/
│   ├── components/        # React components
│   │   ├── form/         # Form builder components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── pages/            # Page components
│   ├── services/         # Business logic
│   ├── styles/           # Theme and styles
│   ├── templates/        # Form templates
│   └── utils/            # Utility functions
├── public/               # Static assets
└── vercel.json          # Vercel configuration
```

## 💳 Pricing Plans

| Feature | Free | Pro ($9.99/mo) | Business ($29.99/mo) |
|---------|------|----------------|---------------------|
| Forms | 3 | Unlimited | Unlimited |
| Submissions/month | 100 | 1,000 | 10,000 |
| PDFs/month | 10 | 100 | 1,000 |
| Custom Branding | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |

## 🔒 Security

- **Authentication**: Firebase Auth with secure session management
- **Data Isolation**: Firestore security rules ensure user data privacy
- **Payment Security**: PCI-compliant payment processing via Stripe
- **Rate Limiting**: Protection against abuse (PDF: 10/hour, Forms: 5/hour)
- **Environment Variables**: Sensitive keys stored securely
- **CORS Configuration**: Proper API endpoint protection

## 📝 API Documentation

### Endpoints

#### POST `/api/create-checkout-session`
Creates a Stripe checkout session for subscription upgrades.

#### POST `/api/create-portal-session`
Creates a Stripe customer portal session for subscription management.

#### POST `/api/stripe-webhook`
Handles Stripe webhook events for subscription lifecycle management.

## 🧪 Testing

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

- **Documentation**: See `CURRENT_STATUS_DECEMBER_2024.md` for detailed status
- **Issues**: [GitHub Issues](https://github.com/getformforge/FormForge/issues)
- **Email**: support@getformforge.com (coming soon)

## 🎉 Acknowledgments

- Built with React and Firebase
- Payment processing by Stripe
- Hosted on Vercel
- Icons by Lucide React

---

**FormForge** - Building better forms for better business
© 2024 FormForge. All rights reserved.
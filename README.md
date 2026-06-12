# CvForge 🚀

A full-stack web application that leverages AI to help users optimize, parse, and generate professionally formatted CVs with ATS score analysis.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Claude AI](https://img.shields.io/badge/Claude-AI-412991?logo=openai)

---

## 📋 Overview

CvForge is an intelligent CV optimization platform that helps job seekers create, enhance, and tailor their CVs for maximum impact. The application combines modern web technologies with AI-powered CV generation to deliver a seamless user experience.

### Key Capabilities
- 📄 **CV Parsing**: Upload PDF or DOCX files and extract content automatically
- 🤖 **AI-Powered Generation**: Generate or tailor CVs using Claude AI based on job descriptions
- 📊 **ATS Score Analysis**: Evaluate CV compatibility with Applicant Tracking Systems
- 🎨 **Multiple Templates**: Choose from professionally designed CV templates
- 👁️ **Live Preview**: Real-time CV preview in multiple formats
- ⬇️ **PDF Export**: Download polished CVs ready for submission
- 💳 **Premium Features**: Stripe integration for subscription management
- 📈 **Usage Tracking**: Monitor API usage and feature limits

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5.2** - Web framework
- **Claude API** - AI-powered CV generation
- **Supabase** - PostgreSQL database & authentication
- **Firebase** - Authentication
- **Stripe** - Payment processing

### File Processing
- **PDFKit** - PDF generation
- **pdf-parse** - PDF parsing
- **Mammoth** - Word document parsing
- **Multer** - File upload handling

### Additional Tools
- **PostCSS & Autoprefixer** - CSS processing
- **dotenv** - Environment variable management

---

## 🎯 Features

### Core Features
- ✅ User authentication with Firebase
- ✅ CV file upload (PDF, DOCX)
- ✅ Intelligent CV parsing using AI
- ✅ ATS compatibility scoring
- ✅ AI-tailored CV generation
- ✅ Multiple professional templates
- ✅ Real-time CV preview
- ✅ PDF download with formatting
- ✅ Usage limits and tracking
- ✅ Premium subscription via Stripe

### User Experience
- 🎬 Smooth animations with Framer Motion
- 📱 Responsive design for all devices
- 🌓 Clean, modern UI with Tailwind CSS
- ⚡ Fast performance with Vite
- 🔐 Secure authentication flows

---

## 📁 Project Structure

```
CvForge/
├── backend/
│   ├── routes/            # API routes (generate, stripe, usage)
│   ├── utils/             # Backend utilities
│   │   ├── claudeApi.js   # Claude API integration
│   │   ├── cvTemplates.js # CV design templates
│   │   └── parseCV.js     # CV parsing logic
│   ├── pdf-generator.js   # PDF generation
│   ├── index.js           # Express server
│   ├── uploads/           # Temporary file storage
│   └── downloads/         # Generated CV storage
├── public/                # Static assets (images, template preview, etc.)
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components
│   ├── context/           # Auth context
│   ├── hooks/             # Custom hooks (useAuth, useUsage)
│   ├── lib/               # Supabase client
│   ├── utils/             # Utility functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                   # Local environment variables
├── .gitignore             # Git ignored files
├── index.html             # Frontend entry HTML page
├── package.json           # Project dependencies & scripts
├── package-lock.json      # NPM lockfile
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account
- Supabase account
- Claude API key
- Stripe account (for payment features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cvforge.git
   cd cvforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

**Development Mode:**

```bash
# Terminal 1 - Frontend (from root)
npm run dev

# Terminal 2 - Backend (from backend/)
cd backend
npm run dev
```

**Production Build:**

```bash
# Frontend build
npm run build

# Preview production build
npm run preview
```

---

## 🔌 API Endpoints

### Generate CV
```
POST /api/generate
- Upload CV file
- Provide job description (optional)
- Returns: AI-tailored CV
```

### ATS Score
```
POST /api/score
- Analyze CV against job requirements
- Returns: ATS compatibility score & recommendations
```

### Stripe Integration
```
POST /api/stripe/checkout
- Create premium subscription
- Returns: Stripe session
```

### Usage Tracking
```
GET /api/usage
- Fetch user's API usage stats
- Returns: Current limits & usage data
```

---

## 🎨 Key Components

### Frontend Components
- **UploadZone** - Drag-and-drop file upload
- **ATSScore** - Real-time ATS analysis display
- **CVPreview** - Live CV preview in multiple templates
- **PaywallModal** - Premium feature upgrade prompt
- **UsageBadge** - Display remaining API credits
- **LoadingSteps** - Animated progress indicator

### Backend Utilities
- **claudeApi.js** - Claude API integration for CV generation
- **cvTemplates.js** - 5 customizable CV design templates
- **parseCV.js** - Intelligent CV content extraction
- **pdf-generator.js** - PDF rendering & download

---

## 💡 How It Works

1. **Upload** - User uploads their CV (PDF or DOCX)
2. **Parse** - Backend extracts content and structure
3. **Analyze** - AI provides ATS score & improvement suggestions
4. **Generate** - Claude AI creates tailored CV based on job description
5. **Preview** - User previews CV in multiple templates
6. **Download** - Generate and download formatted PDF

---

## 🔐 Security Features

- ✅ Firebase authentication for user security
- ✅ Supabase row-level security policies
- ✅ File upload validation and size limits
- ✅ Environment variable protection
- ✅ CORS configuration for API safety
- ✅ Secure API routes with authentication

---

## 📊 Performance Optimizations

- ⚡ Vite for fast development and optimized builds
- 🎬 Framer Motion for smooth, performant animations
- 📦 Code splitting and lazy loading
- 🖼️ Optimized image delivery
- 🚀 Server-side PDF generation to reduce client load

---

## 🚦 Roadmap

- [ ] Batch CV generation
- [ ] Resume recommendations engine
- [ ] Interview preparation module
- [ ] LinkedIn profile integration
- [ ] Multi-language support
- [ ] Mobile native app
- [ ] Team collaboration features

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact

For questions or support, please reach out or open an issue on GitHub.

**Live Demo:** [Coming Soon]

---

## 🙏 Acknowledgments

- Claude API for powerful AI capabilities
- Stripe for payment processing
- Supabase for database solutions
- React and Vite communities for excellent tools

---

**Built with ❤️ by Aniq Valliani**


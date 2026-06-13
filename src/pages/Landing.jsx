// src/pages/Landing.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Upload, 
  Shield, 
  Zap, 
  CheckCircle,
  Star,
  Palette,
  Target,
  RefreshCw,
  Eye,
  FileJson,
  Layout,
  Briefcase,
  Code,
  PenTool,
  BarChart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Removed auto-redirect so users can see the landing page even if logged in.

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 pt-20 sm:pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
          <div className="absolute top-0 -left-48 h-96 w-96 rounded-full bg-gray-200/30 blur-3xl" />
          <div className="absolute bottom-0 -right-48 h-96 w-96 rounded-full bg-gray-300/20 blur-3xl" />
        </div>
        
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-4 sm:mb-6 inline-flex animate-fade-in items-center rounded-full border border-gray-200/50 bg-white/60 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 backdrop-blur-sm transition-all hover:bg-white/80">
              <Sparkles className="mr-1.5 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4 text-gray-600" />
              <span className="whitespace-nowrap">3 free customizations</span>
              <span className="mx-1.5 sm:mx-2 text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">AI-powered</span>
            </div>
            
            {/* Headline - Responsive sizes */}
            <h1 className="mx-auto max-w-3xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 px-4">
              Transform Your CV
              <span className="relative ml-2 inline-block">
                for Each Job
                <svg 
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full animate-draw-line hidden sm:block" 
                  height="6" 
                  viewBox="0 0 300 6" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ strokeDasharray: 300, strokeDashoffset: isHovered ? 0 : 300 }}
                >
                  <path d="M1 4.5C100 2 200 2 299 4.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 px-4">
              Upload your CV + job description. Our AI tailors your CV to match the role, 
              with unique designs for every application.
            </p>
            
            {/* CTA Button */}
            <div className="mt-6 sm:mt-8 px-4">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                Try It Free
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <p className="mt-3 text-xs sm:text-sm text-gray-500">Join 10,000+ job seekers • 3 free customizations</p>
            </div>

            {/* Visual hint - Better mobile layout */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-60 px-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Upload className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                <span className="text-xs text-gray-500 whitespace-nowrap">Upload PDF</span>
              </div>
              <div className="h-3 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Target className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                <span className="text-xs text-gray-500 whitespace-nowrap">Job Description</span>
              </div>
              <div className="h-3 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                <span className="text-xs text-gray-500 whitespace-nowrap">AI Customization</span>
              </div>
              <div className="h-3 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Layout className="h-3 sm:h-4 w-3 sm:w-4 text-gray-400" />
                <span className="text-xs text-gray-500 whitespace-nowrap">Unique Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-t border-gray-200 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-3 sm:mb-4 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs sm:text-sm text-gray-700">
              <Zap className="mr-1 h-3 w-3" />
              Simple Process
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 px-4">
              Three steps to your tailored CV
            </h2>
            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-gray-600 px-4">
              Every application gets a fresh, customized CV that stands out
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-3 px-4 sm:px-0">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="mx-auto mb-4 sm:mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-none border border-gray-200 bg-white shadow-sm transition-all group-hover:shadow-md group-hover:border-gray-300">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{step.number}</span>
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Powered by advanced AI
            </h2>
            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-gray-600">
              Every CV is uniquely optimized for your target role
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-none border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300"
              >
                <div className="mb-3 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-none bg-gray-50 text-gray-700 transition-all duration-300 group-hover:bg-gray-100">
                  {feature.icon}
                </div>
                <h3 className="mb-1.5 text-base sm:text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Design Preview - Updated with better image/illustration */}
      <section id="design" className="border-t border-gray-200 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="px-4 sm:px-0">
              <div className="mb-3 sm:mb-4 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs sm:text-sm text-gray-700">
                <Palette className="mr-1 h-3 w-3" />
                Unique Every Time
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                Every CV gets a fresh design
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
                No two CVs look the same. Our AI generates a unique layout, color scheme, and typography for each job application - making your application memorable.
              </p>
              <ul className="mt-4 sm:mt-6 space-y-2 sm:space-y-2.5">
                {designBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="h-4 w-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Improved Visual Design Showcase */}
            <div className="relative px-4 sm:px-0">
              <div className="rounded-none border border-gray-200 bg-white p-3 sm:p-4 shadow-sm">
                {/* CV Design Showcase */}
                <div className="space-y-4">
                  {/* CV Header with different style options */}
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                    <div>
                      <div className="h-6 w-48 rounded bg-gray-900/10 mb-2" />
                      <div className="h-3 w-32 rounded bg-gray-200" />
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gray-100" />
                  </div>
                  
                  {/* Professional Summary */}
                  <div>
                    <div className="h-4 w-24 rounded bg-gray-800/10 mb-2" />
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded bg-gray-200" />
                      <div className="h-2 w-5/6 rounded bg-gray-200" />
                      <div className="h-2 w-4/6 rounded bg-gray-200" />
                    </div>
                  </div>
                  
                  {/* Work Experience */}
                  <div>
                    <div className="h-4 w-28 rounded bg-gray-800/10 mb-2" />
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="h-3 w-32 rounded bg-gray-300" />
                          <div className="h-2 w-20 rounded bg-gray-200" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 w-full rounded bg-gray-200" />
                          <div className="h-2 w-5/6 rounded bg-gray-200" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="h-3 w-36 rounded bg-gray-300" />
                          <div className="h-2 w-20 rounded bg-gray-200" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 w-full rounded bg-gray-200" />
                          <div className="h-2 w-4/6 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <div className="h-4 w-20 rounded bg-gray-800/10 mb-2" />
                    <div className="flex flex-wrap gap-1.5">
                      <div className="h-5 w-16 rounded bg-gray-100" />
                      <div className="h-5 w-20 rounded bg-gray-100" />
                      <div className="h-5 w-14 rounded bg-gray-100" />
                      <div className="h-5 w-24 rounded bg-gray-100" />
                    </div>
                  </div>
                </div>
                
                {/* Style variation indicators */}
                <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-200"></div>
                  <div className="flex-1 text-right">
                    <span className="text-xs text-gray-400">Style variant #42</span>
                  </div>
                </div>
              </div>
              
              {/* Floating badges showing different designs */}
              <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 flex gap-1 sm:gap-2">
                <div className="rounded-md border border-gray-200 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-600 shadow-sm whitespace-nowrap">
                  🎨 Modern
                </div>
                <div className="rounded-md border border-gray-200 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-600 shadow-sm whitespace-nowrap hidden sm:block">
                  ✨ Creative
                </div>
              </div>
              <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3">
                <div className="rounded-md border border-gray-200 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs text-gray-600 shadow-sm whitespace-nowrap">
                  🔄 Dynamic
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-200 bg-gray-50 px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-4 text-center">
            <div className="rounded-none border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">10K+</div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">CVs customized</div>
            </div>
            <div className="rounded-none border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">4.8</div>
              <div className="mt-1 flex justify-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">User rating</div>
            </div>
            <div className="rounded-none border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">3x</div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">More interviews</div>
            </div>
            <div className="rounded-none border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">30s</div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">Processing time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-16 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Landed their dream jobs
            </h2>
            <p className="mx-auto mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-gray-600">
              See how tailored CVs made the difference
            </p>
          </div>

          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-none border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-1 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-2.5 sm:h-3 w-2.5 sm:w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{testimonial.text}"</p>
                <div className="mt-4 sm:mt-5">
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-12 sm:py-16 md:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-none border border-gray-200 bg-white p-6 sm:p-8 md:p-10 shadow-lg">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gray-50 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gray-50 blur-3xl" />
            
            <div className="relative text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                Ready to stand out?
              </h2>
              <p className="mx-auto mt-2 sm:mt-3 max-w-md text-sm text-gray-600 px-4">
                Upload your CV and a job description. Get a tailored CV with unique design - completely free.
              </p>
              <button
                onClick={handleGetStarted}
                className="mt-4 sm:mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 sm:px-7 py-2.5 sm:py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 w-full sm:w-auto max-w-xs"
              >
                Start Customizing
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-gray-500 px-4">
                ✨ 3 free customizations • No credit card • Unique design every time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-gray-900">CVForge</h3>
              <p className="mt-2 text-xs text-gray-500">AI-powered CV customization</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                <li><a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a></li>
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Resources</h4>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Job search tips</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Legal</h4>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
            <p>© 2024 CVForge. Tailor your CV for every opportunity.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes draw-line {
          from {
            stroke-dashoffset: 300;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-draw-line {
          animation: draw-line 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Updated steps for CV customization
const steps = [
  { number: "01", title: "Upload your CV", description: "Upload your existing CV as PDF - we'll extract and analyze your content" },
  { number: "02", title: "Paste job description", description: "Share the job you're targeting. Our AI finds the key requirements" },
  { number: "03", title: "Get tailored CV", description: "Receive a customized CV with unique design, optimized for that specific role" }
];

// Updated features for CV customization
const features = [
  {
    icon: <Upload className="h-5 w-5" />,
    title: "PDF CV Parsing",
    description: "Upload any PDF CV. Our AI extracts your work history, skills, education - everything."
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Job Description Matching",
    description: "Paste any job description. We identify keywords and tailor your CV to match perfectly."
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Content Rewriting",
    description: "Your bullet points get rewritten to highlight achievements relevant to each specific role."
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: "Unique Design Generation",
    description: "Every CV gets a fresh, professional layout. No two look the same - making you memorable."
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Fast Processing",
    description: "Lightning-fast AI processing. Get your tailored CV in under 30 seconds."
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Endless Customizations",
    description: "Apply to 100+ jobs. Each application gets its own uniquely tailored CV and design."
  }
];

// Design benefits
const designBenefits = [
  "Unique layout for every job application",
  "Dynamic color schemes based on industry",
  "Typography optimized for readability",
  "ATS-friendly while being visually striking",
  "Export as high-quality PDF instantly"
];

// Updated testimonials
const testimonials = [
  {
    text: "I applied to 20 jobs with generic CVs and heard nothing. Used CVForge for 5 applications and got 3 interviews. The tailored approach works!",
    name: "David Kim",
    role: "Product Manager at Stripe"
  },
  {
    text: "The unique design feature is genius. Recruiters commented on how my CV stood out. Landed my dream job at Google after using this.",
    name: "Jessica Chen",
    role: "Software Engineer"
  },
  {
    text: "Tailoring my CV for each role used to take hours. Now it's 30 seconds. Best investment in my job search ever.",
    name: "Marcus Williams",
    role: "Marketing Director"
  }
];

export default LandingPage;
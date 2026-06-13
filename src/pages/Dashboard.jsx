// src/pages/Dashboard.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  X,
  Trash2,
  Link as LinkIcon,
  Sparkles,
  Loader,
  ChevronRight,
  Download,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  BarChart3,
  Menu,
  LayoutDashboard,
  LayoutTemplate,
  History,
  Settings,
  User,
  LogOut,
  Bell,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter = ({ value, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    
    if (end === 0) {
      setCount(0);
      return;
    }

    let totalMilSecDur = 1500;
    let incrementTime = Math.max(10, totalMilSecDur / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{count}{String(value).includes('%') ? '%' : ''}</span>;
};

// Progress Bar Component
const ProgressBar = ({ value, color = 'gray', size = 'md' }) => {
  const colors = {
    gray: 'bg-slate-900',
    light: 'bg-slate-400',
    dark: 'bg-slate-800'
  };
  
  const sizes = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  
  return (
    <div className={`w-full bg-slate-200/50 overflow-hidden ${sizes[size]}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`${colors[color]} h-full`}
      />
    </div>
  );
};

// Button Component
const Button = ({ children, variant = 'primary', size = 'md', icon, iconPosition = 'left', disabled = false, onClick, className = '' }) => {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_2px_10px_rgb(0,0,0,0.12)] hover:shadow-[0_4px_14px_rgb(0,0,0,0.16)]',
    secondary: 'bg-white/70 text-slate-900 border border-slate-900/10 hover:border-slate-900/10 hover:bg-white/85 backdrop-blur-xl shadow-[0_2px_8px_rgb(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.08)]'
  };
  
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};

// Card Component - Glassy Design
const Card = ({ children, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-xl border border-slate-900/10 shadow-[0_8px_32px_rgb(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_8px_32px_rgb(0,0,0,0.12)] hover:bg-white/85 ${className}`}>
    {children}
  </div>
);

const Dashboard = () => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [keywordMatch, setKeywordMatch] = useState(0);
  const [skillsDetected, setSkillsDetected] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [resumeStrength, setResumeStrength] = useState('Good');
  const [previewScale, setPreviewScale] = useState(1);
  const [usage, setUsage] = useState({ used: 0, limit: 3 });
  const [generatedCV, setGeneratedCV] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [uploadedCVUrl, setUploadedCVUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Processing steps
  const processingSteps = [
    { icon: FileText, text: "Analyzing Resume Structure...", progress: 25 },
    { icon: Target, text: "Matching Job Keywords...", progress: 50 },
    { icon: BarChart3, text: "Optimizing ATS Structure...", progress: 75 },
    { icon: Sparkles, text: "Generating Tailored Resume...", progress: 100 }
  ];

  const defaultTemplates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design with strong headings and visual balance.',
      layout: 'single-column',
      features: ['Bold headers', 'Content-focused sections', 'Clear skill highlights']
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Executive-level structure with refined typography and polished spacing.',
      layout: 'two-column',
      features: ['Elegant layout', 'Premium section flow', 'ATS-friendly structure']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, crisp layout that keeps the focus on your achievements.',
      layout: 'single-column',
      features: ['Minimal styling', 'Clean whitespace', 'Easy readability']
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Modern creative layout with accent blocks and visual hierarchy.',
      layout: 'two-column',
      features: ['Accent sections', 'Sidebar details', 'Modern typography']
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional recruiter-friendly layout with trusted structure.',
      layout: 'single-column',
      features: ['Structured sections', 'Professional margins', 'Clear hierarchy']
    },
    {
      id: 'elegant',
      name: 'Elegant',
      description: 'Sophisticated two-column design with a distinct sidebar.',
      layout: 'two-column',
      features: ['Dark sidebar', 'Timeline style', 'High contrast']
    }
  ];

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resumes', label: 'My Resumes', icon: FileText },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    const fetchUsage = async () => {
      const storageKey = user ? `usage_${user.id}` : 'demo_usage';
      try {
        if (user) {
          const response = await fetch(`http://localhost:5000/api/usage/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUsage({ used: data.used, limit: data.limit === 'Unlimited' ? Infinity : data.limit });
            return;
          }
        }
        // Fallback to local storage if backend fails or guest user
        const localUsed = parseInt(localStorage.getItem(storageKey) || '0');
        setUsage({ used: localUsed, limit: 3 });
      } catch (error) {
        console.error('Failed to fetch usage:', error);
        const localUsed = parseInt(localStorage.getItem(storageKey) || '0');
        setUsage({ used: localUsed, limit: 3 });
      }
    };
    fetchUsage();
  }, [user]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/generate/templates');
        const data = await response.json();
        if (response.ok && Array.isArray(data.templates)) {
          setTemplates(data.templates);
          return;
        }
      } catch (error) {
        console.error('Failed to load templates:', error);
      }
      setTemplates(defaultTemplates);
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedCVUrl) {
        URL.revokeObjectURL(uploadedCVUrl);
      }
    };
  }, [uploadedCVUrl]);

  const remainingGenerations = usage.limit - usage.used;

  // Handle file drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or DOCX file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (uploadedCVUrl) {
      URL.revokeObjectURL(uploadedCVUrl);
    }
    setCvFile(file);
    setUploadedCVUrl(URL.createObjectURL(file));
  };

  const removeFile = () => {
    if (uploadedCVUrl) {
      URL.revokeObjectURL(uploadedCVUrl);
    }
    setCvFile(null);
    setUploadedCVUrl(null);
  };


  const handleGenerate = async () => {
    if (usage.used >= usage.limit) {
      setShowLimitModal(true);
      return;
    }

    setIsProcessing(true);
    setProcessingStep(0);
    setCurrentStep(3);
    
    // Start progressing through steps for UI feel
    let currentStepIndex = 0;
    const progressInterval = setInterval(() => {
      if (currentStepIndex < processingSteps.length - 1) {
        setProcessingStep(++currentStepIndex);
      }
    }, 2000);

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('jobDescription', jobDescription);
      formData.append('userId', user?.id || 'demo-user');

      const response = await fetch('http://localhost:5000/api/generate/cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProcessingStep(processingSteps.length - 1); // 100%

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate CV');
      }

      // Set the analysis data from the backend
      setAtsScore(Number(data.analysis?.atsScore ?? 0));
      setKeywordMatch(Number(data.analysis?.keywordMatch ?? 0));
      setSkillsDetected(data.analysis?.detectedSkills || []);
      setMissingKeywords(data.analysis?.missingKeywords || []);

      setTimeout(() => {
        const selectedTemplate = data.template || data.templateUsed || null;

      setGeneratedCV({
          id: data.cvId || 1,
          fileName: cvFile?.name || 'resume.pdf',
          atsScore: Number(data.analysis?.atsScore ?? 0),
          keywordMatch: Number(data.analysis?.keywordMatch ?? 0),
          downloadUrl: `http://localhost:5000${data.downloadUrl}`,
          templateUsed: selectedTemplate
        });
        setSelectedTemplateId(selectedTemplate?.id || null);
        
        // Update usage locally to reflect immediate changes
        setUsage(prev => {
          const newUsed = prev.used + 1;
          const storageKey = user ? `usage_${user.id}` : 'demo_usage';
          localStorage.setItem(storageKey, newUsed.toString());
          return { ...prev, used: newUsed };
        });

        setCurrentStep(3);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      alert('Error generating CV: ' + error.message);
      setIsProcessing(false);
    }
  };

  const handleGenerateWithTemplate = async (templateId) => {
    if (usage.used >= usage.limit) {
      setShowLimitModal(true);
      return;
    }
    if (!cvFile || !jobDescription.trim()) {
      alert('Please upload your CV and add a job description first.');
      return;
    }

    setTemplateLoading(templateId);
    setIsProcessing(true);
    setProcessingStep(0);
    let currentStepIndex = 0;
    const progressInterval = setInterval(() => {
      if (currentStepIndex < processingSteps.length - 1) {
        setProcessingStep(++currentStepIndex);
      }
    }, 2000);

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('jobDescription', jobDescription);
      formData.append('userId', user?.id || 'demo-user');
      formData.append('templateId', templateId);

      const response = await fetch('http://localhost:5000/api/generate/cv-with-template', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      clearInterval(progressInterval);
      setProcessingStep(processingSteps.length - 1);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate CV with template');
      }

      setAtsScore(Number(data.analysis?.atsScore ?? 0));
      setKeywordMatch(Number(data.analysis?.keywordMatch ?? 0));
      setSkillsDetected(data.analysis?.detectedSkills || []);
      setMissingKeywords(data.analysis?.missingKeywords || []);

      setGeneratedCV({
        id: data.cvId || 1,
        fileName: cvFile?.name || 'resume.pdf',
        atsScore: Number(data.analysis?.atsScore ?? 0),
        keywordMatch: Number(data.analysis?.keywordMatch ?? 0),
        downloadUrl: `http://localhost:5000${data.downloadUrl}`,
        templateUsed: data.template || data.templateUsed || { id: templateId }
      });
      setSelectedTemplateId(templateId);

      setUsage(prev => {
        const newUsed = prev.used + 1;
        const storageKey = user ? `usage_${user.id}` : 'demo_usage';
        localStorage.setItem(storageKey, newUsed.toString());
        return { ...prev, used: newUsed };
      });

      setCurrentStep(4);
      setTemplateLoading(false);
      setIsProcessing(false);
    } catch (error) {
      clearInterval(progressInterval);
      alert('Template generation failed: ' + error.message);
      setTemplateLoading(false);
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && cvFile) {
      setCurrentStep(2);
    } else if (currentStep === 2 && jobDescription.trim()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownload = () => {
    if (generatedCV && generatedCV.downloadUrl) {
      window.open(generatedCV.downloadUrl, '_blank');
    }
  };

  const handleRegenerate = () => {
    setCurrentStep(2);
    setGeneratedCV(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const steps = [
    { number: 1, title: 'Upload CV', completed: currentStep > 1 },
    { number: 2, title: 'Job Description', completed: currentStep > 2 },
    { number: 3, title: 'AI Optimization', completed: currentStep > 3 },
    { number: 4, title: 'Download', completed: currentStep > 4 }
  ];
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-slate-50/80 backdrop-blur-xl border-r border-slate-900/10 z-40 shadow-xl lg:translate-x-0 lg:static"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-900/10">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-sm bg-slate-900 shadow-sm">
              <FileText className="w-4 h-4 text-white" />
              <Sparkles className="w-3 h-3 text-slate-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              CV<span className="text-gray-500">Forge</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-slate-200/60 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-900/10">
            <div className="flex items-center gap-3 p-2 rounded-sm hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-sm bg-slate-900 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-slate-900">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-900/10">
          <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side */}
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-sm hover:bg-slate-100 transition-colors flex-shrink-0"
                >
                  <Menu className="w-5 h-5 text-slate-900" />
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 truncate">Create Your Tailored CV</h1>
                  <p className="text-xs sm:text-sm text-slate-600 hidden sm:block truncate">Optimize your resume for ATS systems</p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                {/* Usage Badge */}
                <div className="hidden sm:flex items-center gap-2 rounded-sm border border-slate-900/10 bg-white/70 backdrop-blur-xl px-2 md:px-3 py-1.5 shadow-sm">
                  <div className="flex items-center gap-1">
                    {[...Array(usage.limit)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          i < usage.used ? 'bg-slate-400' : 'bg-slate-900'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
                    {remainingGenerations} left
                  </span>
                </div>

                {/* Notifications */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-sm hover:bg-slate-100 transition-colors relative"
                  >
                    <Bell className="w-4 md:w-5 h-4 md:h-5 text-slate-900" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-slate-600 rounded-full"></span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/95 backdrop-blur-xl rounded-sm border border-slate-900/10 shadow-lg z-50">
                      <div className="p-3 border-b border-slate-900/10">
                        <p className="font-medium text-slate-900 text-sm">Notifications</p>
                      </div>
                      <div className="p-3 text-center text-sm text-slate-600">
                        No new notifications
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-sm hover:bg-slate-100 transition-colors hidden sm:block"
                >
                  {darkMode ? <Sun className="w-4 md:w-5 h-4 md:h-5 text-slate-900" /> : <Moon className="w-4 md:w-5 h-4 md:h-5 text-slate-900" />}
                </button>

                {/* User Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 md:p-1.5 rounded-sm hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-sm bg-slate-900 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-sm border border-slate-900/10 shadow-lg z-50">
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Step Progress */}
            <div className="mb-8 md:mb-10 overflow-x-auto">
              <div className="flex items-center justify-between relative min-w-[500px] sm:min-w-0 px-4 sm:px-0">
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-200/50 -z-10" />
                <div 
                  className="absolute left-0 top-5 h-0.5 bg-slate-900 transition-all duration-500 -z-10"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
                
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                    <div className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center text-xs sm:text-sm font-semibold
                      transition-all duration-300 z-10
                      ${step.completed || currentStep > index 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-300' 
                        : currentStep === index + 1 
                          ? 'bg-white/70 border-2 border-slate-900 text-slate-900' 
                          : 'bg-slate-100 text-slate-400'}
                    `}>
                      {step.completed ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium text-center ${currentStep >= index + 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Upload CV */}
                {currentStep === 1 && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card className="p-6">
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`
                          relative border border-dashed transition-all duration-300
                          ${dragActive 
                            ? 'border-slate-900/40 bg-slate-50/40' 
                            : 'border-slate-900/10 bg-slate-50/20 hover:border-slate-900/10'}
                        `}
                      >
                        <input
                          type="file"
                          id="cv-upload"
                          accept=".pdf,.docx"
                          onChange={handleFileChange}
                          className={`absolute inset-0 cursor-pointer opacity-0 z-10 ${cvFile ? 'pointer-events-none' : ''}`}
                        />
                        
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                          {!cvFile ? (
                            <>
                              <div className="mb-4 rounded-sm bg-slate-100/50 p-4">
                                <Upload className="h-8 w-8 text-slate-600" />
                              </div>
                              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                Upload your CV
                              </h3>
                              <p className="mb-4 text-sm text-slate-600">
                                Drag and drop or click to browse
                              </p>
                              <p className="text-xs text-slate-500">
                                Supports PDF, DOCX (Max 5MB)
                              </p>
                            </>
                          ) : (
                            <div className="w-full max-w-md">
                              <div className="flex items-center gap-3 border border-slate-900/10 bg-slate-50/40 backdrop-blur-lg p-4 mb-4">
                                <FileText className="h-8 w-8 text-slate-700" />
                                <div className="flex-1 text-left">
                                  <p className="text-sm font-medium text-slate-900">
                                    {cvFile.name}
                                  </p>
                                  <p className="text-xs text-slate-600">
                                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB • {cvFile.type === 'application/pdf' ? 'PDF' : 'DOCX'}
                                  </p>
                                </div>
                                <button
                                  onClick={removeFile}
                                  className="rounded-sm p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="mt-3 text-xs text-green-600 flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                File ready to upload
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <Button
                          onClick={handleNext}
                          disabled={!cvFile}
                          icon={<ArrowRight className="w-4 h-4" />}
                          iconPosition="right"
                        >
                          Continue
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Step 2: Job Description */}
                {currentStep === 2 && !isProcessing && !generatedCV && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="p-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Add Job Description</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Paste the job description to tailor your CV to match the role
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">
                            Job Description
                          </label>
                          <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="w-full h-48 px-4 py-3 rounded-sm border border-slate-900/10 bg-white/50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/20 font-mono text-sm"
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            {jobDescription.length} characters • Minimum 10 characters required
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between mt-6 gap-3">
                        <Button variant="secondary" onClick={handleBack}>
                          Back
                        </Button>
                        <Button
                          onClick={() => handleGenerate()}
                          disabled={!jobDescription.trim() || jobDescription.length < 10}
                        >
                          Generate CV
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: Choose Template Design */}
                {currentStep === 3 && !isProcessing && generatedCV && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Choose Your CV Design</h3>
                          <p className="text-sm text-slate-600">
                            Pick the design that best represents your professional style.
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">
                          {templates.length} templates available
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.length > 0 ? (
                          templates.map((template) => {
                            const isSelected = selectedTemplateId === template.id;
                            return (
                              <Card key={template.id} className="p-4 border border-slate-900/10 overflow-hidden hover:border-slate-400 transition-colors">
                                {/* Visual Preview Box */}
                                <div className="h-32 w-full mb-4 rounded-sm overflow-hidden border border-slate-200 bg-slate-50 relative group-hover:shadow-md transition-shadow">
                                  {template.id === 'elegant' && (
                                    <div className="flex w-full h-full">
                                      <div className="w-1/3 h-full bg-slate-900 p-2 flex flex-col gap-1.5 items-center">
                                        <div className="w-6 h-6 rounded-full border-2 border-red-500 mt-1"></div>
                                        <div className="w-full h-0.5 bg-slate-700 mt-2"></div>
                                        <div className="w-3/4 h-0.5 bg-slate-600"></div>
                                        <div className="w-3/4 h-0.5 bg-slate-600"></div>
                                      </div>
                                      <div className="w-2/3 h-full bg-white p-3 flex flex-col gap-1.5">
                                        <div className="w-1/2 h-2 bg-slate-800 mb-1"></div>
                                        <div className="w-full h-1 bg-slate-200"></div>
                                        <div className="w-5/6 h-1 bg-slate-200"></div>
                                        <div className="flex gap-2 mt-2">
                                          <div className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></div>
                                          <div className="w-full flex flex-col gap-1">
                                            <div className="w-1/3 h-1.5 bg-slate-800"></div>
                                            <div className="w-full h-1 bg-slate-200"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'academic' && (
                                    <div className="flex flex-col w-full h-full bg-white relative">
                                      <div className="w-1/3 h-full bg-slate-100 absolute left-0 top-0"></div>
                                      <div className="w-full h-1/3 bg-slate-200 mt-2 z-10 flex flex-col items-center justify-center gap-1 border-y border-slate-300">
                                        <div className="w-1/2 h-2 bg-slate-800"></div>
                                        <div className="w-1/3 h-1 bg-slate-500"></div>
                                      </div>
                                      <div className="flex w-full h-full z-10 pt-10">
                                        <div className="w-1/3 p-2 flex flex-col gap-2">
                                          <div className="w-3/4 h-1.5 bg-slate-700"></div>
                                          <div className="w-full h-1 bg-slate-400"></div>
                                          <div className="w-full h-1 bg-slate-400"></div>
                                        </div>
                                        <div className="w-2/3 p-2 pl-4 flex flex-col gap-1.5">
                                          <div className="flex items-center gap-1">
                                            <div className="w-1 h-1 bg-slate-600"></div>
                                            <div className="w-1/2 h-1.5 bg-slate-800"></div>
                                          </div>
                                          <div className="w-full h-1 bg-slate-300"></div>
                                          <div className="w-5/6 h-1 bg-slate-300"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'corporate' && (
                                    <div className="flex flex-col w-full h-full bg-white">
                                      <div className="w-full h-1/3 bg-slate-700 flex items-center p-2 gap-2">
                                        <div className="w-6 h-6 rounded-full border border-white"></div>
                                        <div className="flex flex-col gap-1">
                                          <div className="w-16 h-2 bg-white"></div>
                                          <div className="w-10 h-1 bg-slate-300"></div>
                                        </div>
                                      </div>
                                      <div className="flex w-full h-2/3">
                                        <div className="w-1/3 h-full p-2 border-r border-slate-100 flex flex-col gap-1.5">
                                          <div className="w-3/4 h-1.5 bg-slate-700 border-b border-slate-300 pb-1"></div>
                                          <div className="w-full h-1 bg-slate-300"></div>
                                          <div className="w-5/6 h-1 bg-slate-300"></div>
                                        </div>
                                        <div className="w-2/3 h-full p-2 flex flex-col gap-1.5">
                                          <div className="w-1/2 h-1.5 bg-slate-700 border-b border-slate-300 pb-1"></div>
                                          <div className="w-full h-1 bg-slate-300"></div>
                                          <div className="w-4/5 h-1 bg-slate-300"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'navy' && (
                                    <div className="flex flex-col w-full h-full bg-white relative">
                                      <div className="w-full h-1/3 bg-blue-900 flex items-center p-2 pl-12 gap-2 z-10">
                                        <div className="flex flex-col gap-1">
                                          <div className="w-16 h-2 bg-white"></div>
                                          <div className="w-10 h-1 bg-blue-200"></div>
                                        </div>
                                      </div>
                                      <div className="absolute top-2 left-2 w-8 h-10 rounded-t-full bg-slate-200 border-2 border-white z-20"></div>
                                      <div className="flex w-full h-2/3">
                                        <div className="w-1/3 h-full bg-slate-100 p-2 pt-4 flex flex-col gap-1.5">
                                          <div className="w-3/4 h-1.5 bg-blue-900"></div>
                                          <div className="w-full h-1 bg-slate-400"></div>
                                          <div className="w-5/6 h-1 bg-slate-400"></div>
                                        </div>
                                        <div className="w-2/3 h-full p-2 flex flex-col gap-1.5">
                                          <div className="w-1/2 h-1.5 bg-blue-900"></div>
                                          <div className="w-full h-1 bg-slate-300"></div>
                                          <div className="w-4/5 h-1 bg-slate-300"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'modern' && (
                                    <div className="flex flex-col w-full h-full bg-white">
                                      <div className="w-full h-1/4 bg-slate-900 p-2">
                                        <div className="w-1/3 h-2 bg-white mb-1"></div>
                                        <div className="w-1/4 h-1 bg-slate-400"></div>
                                      </div>
                                      <div className="w-full h-3/4 p-2 flex flex-col gap-1">
                                        <div className="w-1/4 h-1.5 bg-blue-600 mt-1"></div>
                                        <div className="w-full h-1 bg-slate-200"></div>
                                        <div className="w-5/6 h-1 bg-slate-200"></div>
                                        <div className="w-1/4 h-1.5 bg-blue-600 mt-1"></div>
                                        <div className="flex gap-2">
                                          <div className="w-1/2 h-1 bg-slate-200"></div>
                                          <div className="w-1/2 h-1 bg-slate-200"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'classic' && (
                                    <div className="flex flex-col w-full h-full bg-white p-3 items-center">
                                      <div className="w-1/2 h-2 bg-slate-900 mb-1"></div>
                                      <div className="w-3/4 h-0.5 bg-slate-400 mb-2"></div>
                                      <div className="w-full flex flex-col gap-1">
                                        <div className="w-1/4 h-1.5 bg-slate-800 mx-auto mt-1"></div>
                                        <div className="w-full h-1 bg-slate-200"></div>
                                        <div className="w-5/6 h-1 bg-slate-200 mx-auto"></div>
                                        <div className="w-1/4 h-1.5 bg-slate-800 mx-auto mt-1"></div>
                                        <div className="w-full h-1 bg-slate-200"></div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'creative' && (
                                    <div className="flex w-full h-full bg-white">
                                      <div className="w-1/3 h-full bg-blue-50 p-2 flex flex-col gap-2">
                                        <div className="w-1/2 h-1.5 bg-blue-600"></div>
                                        <div className="w-full h-0.5 bg-blue-200"></div>
                                        <div className="w-full h-0.5 bg-blue-200"></div>
                                      </div>
                                      <div className="w-2/3 h-full p-3 flex flex-col gap-1.5">
                                        <div className="w-1/2 h-2 bg-slate-900 ml-auto"></div>
                                        <div className="w-1/3 h-1 bg-blue-500 ml-auto mb-2"></div>
                                        <div className="w-1/3 h-1.5 bg-slate-800 ml-auto mt-1"></div>
                                        <div className="w-full flex gap-1 mt-1">
                                          <div className="w-1/4 h-1 bg-slate-200"></div>
                                          <div className="w-3/4 h-1 bg-slate-200"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'minimal' && (
                                    <div className="flex flex-col w-full h-full bg-white p-3 items-center gap-1.5">
                                      <div className="w-2/3 h-3 bg-slate-900 mt-2"></div>
                                      <div className="w-1/2 h-1 bg-slate-400"></div>
                                      <div className="w-full h-[1px] bg-slate-200 my-1"></div>
                                      <div className="w-full flex flex-col gap-1 text-left">
                                        <div className="w-1/4 h-1.5 bg-slate-900"></div>
                                        <div className="w-full h-1 bg-slate-200"></div>
                                        <div className="w-5/6 h-1 bg-slate-200"></div>
                                      </div>
                                    </div>
                                  )}
                                  {template.id === 'professional' && (
                                    <div className="flex flex-col w-full h-full bg-white p-2">
                                      <div className="w-full h-8 bg-slate-100 mb-2 p-1 pl-2 flex flex-col justify-center gap-1">
                                        <div className="w-1/2 h-2 bg-slate-900"></div>
                                        <div className="w-1/4 h-1 bg-slate-400"></div>
                                      </div>
                                      <div className="flex w-full h-full gap-2 px-1">
                                        <div className="w-1/3 flex flex-col gap-1">
                                          <div className="w-1/2 h-1 bg-slate-800"></div>
                                          <div className="w-full h-0.5 bg-slate-200"></div>
                                          <div className="w-full h-0.5 bg-slate-200"></div>
                                        </div>
                                        <div className="w-2/3 flex flex-col gap-1">
                                          <div className="w-1/4 h-1 bg-slate-800"></div>
                                          <div className="w-full h-0.5 bg-slate-200"></div>
                                          <div className="w-5/6 h-0.5 bg-slate-200"></div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {isSelected && (
                                    <div className="absolute inset-0 bg-slate-900/10 border-2 border-slate-900 flex items-center justify-center">
                                      <div className="bg-slate-900 text-white rounded-full p-1">
                                        <CheckCircle className="w-5 h-5" />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                                    <p className="text-xs text-slate-500">{template.description}</p>
                                  </div>
                                  <span className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-700 bg-slate-100/60 rounded-sm">
                                    {template.layout.replace('-', ' ')}
                                  </span>
                                </div>
                                <div className="mb-4 flex flex-wrap gap-2">
                                  {template.features.map((feature, idx) => (
                                    <span key={idx} className="px-2 py-1 text-xs bg-slate-100/50 text-slate-700 rounded-sm border border-slate-900/10">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                  <Button
                                    size="sm"
                                    variant={isSelected ? 'primary' : 'secondary'}
                                    onClick={() => {
                                      if (isSelected) {
                                        handleDownload();
                                      } else {
                                        handleGenerateWithTemplate(template.id);
                                      }
                                    }}
                                    disabled={templateLoading && templateLoading !== template.id}
                                  >
                                    {templateLoading === template.id
                                      ? 'Generating...'
                                      : isSelected
                                      ? 'Download this template'
                                      : 'Use this template'}
                                  </Button>
                                  {isSelected && (
                                    <span className="text-xs text-slate-500">Selected</span>
                                  )}
                                </div>
                              </Card>
                            );
                          })
                        ) : (
                          <div className="col-span-full text-sm text-slate-600">
                            Loading template options...
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between gap-3 mt-6">
                        <Button variant="secondary" onClick={handleBack}>
                          Back
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Step 3: AI Processing */}
                {currentStep === 3 && isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="text-center py-12">
                      <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-sm border-4 border-slate-900/10" />
                        <div 
                          className="absolute inset-0 border-4 border-slate-900 transition-all duration-500"
                          style={{ 
                            clipPath: `inset(0 ${100 - (processingSteps[processingStep]?.progress || 0)}% 0 0)`,
                            transform: 'rotate(-90deg)'
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-slate-900 animate-pulse" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {processingSteps[processingStep]?.text}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Please wait while our AI optimizes your resume
                      </p>
                      
                      <div className="mt-6 space-y-3">
                        {processingSteps.map((step, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`
                              w-6 h-6 rounded-sm flex items-center justify-center text-xs
                              ${index <= processingStep ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}
                            `}>
                              {index < processingStep ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : index === processingStep ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <span className={`text-sm ${index <= processingStep ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                              {step.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Step 4: Download & Done */}
                {currentStep === 4 && generatedCV && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <Card className="text-center py-12">
                      <div className="w-20 h-20 rounded-sm bg-slate-100/50 border border-slate-900/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-slate-800" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        Your CV is Ready!
                      </h3>
                      <p className="text-slate-600 mb-6">
                        Your resume has been successfully formatted and is ready to download.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          onClick={handleDownload}
                          icon={<Download className="w-4 h-4" />}
                          size="lg"
                        >
                          Download CV
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleRegenerate}
                          size="lg"
                        >
                          Upload Different CV
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Right Sidebar - Live Preview */}
              <div className="lg:col-span-1 space-y-6 sticky top-24 h-fit">
                {/* Live Resume Preview */}
                {currentStep === 1 && (
                  <Card className="relative p-6 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/10">
                      <div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Live Resume Preview</h3>
                        <p className="text-xs text-slate-600 mt-1">Preview your uploaded CV</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      {uploadedCVUrl && cvFile?.type === 'application/pdf' ? (
                        <div className="rounded-sm overflow-hidden border border-slate-900/10 w-full h-[500px]">
                          <iframe
                            title="Uploaded CV Preview Sidebar"
                            src={uploadedCVUrl}
                            className="w-full h-full"
                          />
                        </div>
                      ) : uploadedCVUrl ? (
                        <div className="flex h-64 items-center justify-center bg-slate-50 text-sm text-slate-500 rounded-sm border border-slate-900/10">
                          Preview available only for PDF uploads.
                        </div>
                      ) : (
                        <div className="flex h-64 items-center justify-center bg-slate-50 text-sm text-slate-500 rounded-sm border border-slate-900/10 border-dashed">
                          Upload a PDF to see preview
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {currentStep === 2 && (
                  <Card className="relative p-6 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/10">
                      <div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Job Description</h3>
                        <p className="text-xs text-slate-600 mt-1">Provide job details</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-900 mb-2">Why This Step?</p>
                        <ul className="text-slate-600 text-xs space-y-1.5">
                          <li className="flex gap-2">
                            <Target className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>Tailors your CV to match the role</span>
                          </li>
                          <li className="flex gap-2">
                            <TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>Improves ATS compatibility</span>
                          </li>
                          <li className="flex gap-2">
                            <Award className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>Highlights relevant skills</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 mb-1">Tips</p>
                        <ul className="text-slate-600 text-xs space-y-1">
                          <li>• Copy full job posting</li>
                          <li>• Include requirements</li>
                          <li>• Add nice-to-haves too</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}

                {currentStep === 3 && (
                  <Card className="relative p-6 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-900"></div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/10">
                      <div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Design Selection</h3>
                        <p className="text-xs text-slate-600 mt-1">Choose your style</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium text-slate-900 mb-3">Analysis Results</p>
                        <div className="space-y-3">
                          <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                            <p className="text-xs text-slate-600 mb-1">ATS Score</p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-slate-900">{Math.round(atsScore)}</p>
                              <p className="text-xs text-slate-500">/100</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                            <p className="text-xs text-slate-600 mb-1">Keyword Match</p>
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-slate-900">{Math.round(keywordMatch)}</p>
                              <p className="text-xs text-slate-500">%</p>
                            </div>
                          </div>
                          {skillsDetected && skillsDetected.length > 0 && (
                            <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                              <p className="text-xs text-slate-600 mb-2">Detected Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {skillsDetected.slice(0, 4).map((skill, idx) => (
                                  <span key={idx} className="px-2 py-0.5 text-xs bg-slate-900 text-white rounded-sm">
                                    {skill}
                                  </span>
                                ))}
                                {skillsDetected.length > 4 && (
                                  <span className="px-2 py-0.5 text-xs text-slate-600">+{skillsDetected.length - 4} more</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-slate-900 mb-2">Selected Template</p>
                        {selectedTemplateId ? (
                          <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                            <p className="font-semibold text-slate-900">
                              {templates.find(t => t.id === selectedTemplateId)?.name || selectedTemplateId}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              {templates.find(t => t.id === selectedTemplateId)?.description}
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-500 text-xs">Select a template to preview</p>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {currentStep === 4 && (
                  <Card className="relative p-6 overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-600"></div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/10">
                      <div>
                        <h3 className="font-bold text-slate-900 tracking-tight">Ready to Download</h3>
                        <p className="text-xs text-slate-600 mt-1">Your CV is prepared</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="p-3 rounded-sm bg-green-50 border border-green-200">
                        <p className="text-green-900 font-medium flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Processing complete
                        </p>
                        <p className="text-xs text-green-700 mt-1">Click download to get your CV</p>
                      </div>
                      {generatedCV && (
                        <div>
                          <p className="font-medium text-slate-900 mb-1">Generated File</p>
                          <div className="p-2 rounded-sm bg-slate-100/50 border border-slate-900/10">
                            <p className="text-xs text-slate-600 truncate">{generatedCV.fileName}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Premium Upgrade Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-xl rounded-sm shadow-2xl max-w-md w-full overflow-hidden border border-slate-900/10"
          >
            <div className="p-6 text-center space-y-6">
              <div className="w-16 h-16 bg-slate-100/50 border border-slate-900/10 text-slate-800 rounded-sm flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">You've reached your free limit!</h2>
              <p className="text-slate-700 text-sm leading-relaxed">
                You've successfully used all 3 of your free CV generations. 
                Move to Premium to unlock unlimited generations, premium templates, and advanced ATS optimization.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={() => navigate('/upgrade')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                >
                  Upgrade to Premium
                </Button>
                <Button 
                  onClick={() => setShowLimitModal(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Dashboard;
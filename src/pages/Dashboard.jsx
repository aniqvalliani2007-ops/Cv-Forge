// src/pages/Dashboard.jsx  –  100% frontend, no backend needed
import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, FileText, ArrowRight, CheckCircle, Trash2,
  Sparkles, Loader, Download, Target, TrendingUp, Award,
  BarChart3, Menu, LayoutDashboard, LayoutTemplate,
  History, Settings, User, Bell, Moon, Sun
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { parsePDFFile } from '../utils/parseCV';
import { generateTailoredCV } from '../utils/openrouterApi';
import { generatePDF } from '../utils/pdfGenerator';
import { getAllTemplates, getTemplateById, getRandomTemplate } from '../utils/cvTemplates';
import { getUsage, incrementUsage } from '../utils/usageService';

// ── Small UI primitives ──────────────────────────────────────────────────────
const ProgressBar = ({ value }) => (
  <div className="w-full bg-slate-200/50 overflow-hidden h-2">
    <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-slate-900 h-full" />
  </div>
);

const Btn = ({ children, variant = 'primary', size = 'md', icon, iconPos = 'left', disabled, onClick, className = '' }) => {
  const v = { primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm', secondary: 'bg-white/70 text-slate-900 border border-slate-900/10 hover:bg-white backdrop-blur-xl' };
  const s = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${v[variant]} ${s[size]} ${className}`}>
      {icon && iconPos === 'left' && icon}{children}{icon && iconPos === 'right' && icon}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-xl border border-slate-900/10 shadow-[0_8px_32px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgb(0,0,0,0.12)] hover:bg-white/85 transition-all ${className}`}>
    {children}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [keywordMatch, setKeywordMatch] = useState(0);
  const [skillsDetected, setSkillsDetected] = useState([]);
  const [usage, setUsage] = useState({ used: 0, limit: 3 });
  const [generatedCVData, setGeneratedCVData] = useState(null);
  const [generatedPDFDoc, setGeneratedPDFDoc] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [uploadedCVUrl, setUploadedCVUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const templates = getAllTemplates();

  const processingSteps = [
    { text: 'Analyzing Resume Structure...', progress: 25 },
    { text: 'Matching Job Keywords...', progress: 50 },
    { text: 'Optimizing ATS Structure...', progress: 75 },
    { text: 'Generating Tailored Resume...', progress: 100 },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const steps = [
    { number: 1, title: 'Upload CV', completed: currentStep > 1 },
    { number: 2, title: 'Job Description', completed: currentStep > 2 },
    { number: 3, title: 'AI Optimization', completed: currentStep > 3 },
    { number: 4, title: 'Download', completed: currentStep > 4 },
  ];

  // Load usage on mount
  useEffect(() => {
    getUsage(user?.id).then(u => setUsage({ used: u.used, limit: u.isPremium ? Infinity : u.limit }));
  }, [user]);

  useEffect(() => () => { if (uploadedCVUrl) URL.revokeObjectURL(uploadedCVUrl); }, [uploadedCVUrl]);

  const remainingGenerations = usage.limit === Infinity ? '∞' : usage.limit - usage.used;

  // ── File handling ──────────────────────────────────────────────────────────
  const handleDrag = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const f = e.dataTransfer.files?.[0]; if (f) validateAndSetFile(f);
  }, []);

  const validateAndSetFile = (file) => {
    const valid = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!valid.includes(file.type)) { alert('Please upload a PDF file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); return; }
    if (uploadedCVUrl) URL.revokeObjectURL(uploadedCVUrl);
    setCvFile(file);
    setUploadedCVUrl(URL.createObjectURL(file));
  };

  const removeFile = () => {
    if (uploadedCVUrl) URL.revokeObjectURL(uploadedCVUrl);
    setCvFile(null); setUploadedCVUrl(null);
  };

  // ── Core generation ────────────────────────────────────────────────────────
  const runGeneration = async (templateId = null) => {
    if (usage.used >= usage.limit) { setShowLimitModal(true); return null; }

    setIsProcessing(true); setProcessingStep(0); setCurrentStep(3);

    // Animate progress steps
    const interval = setInterval(() => {
      setProcessingStep(p => p < processingSteps.length - 1 ? p + 1 : p);
    }, 2000);

    try {
      // Step 1 – parse PDF
      setProcessingStep(0);
      const parsedCV = await parsePDFFile(cvFile);

      // Step 2 – pick template
      setProcessingStep(1);
      const template = templateId ? getTemplateById(templateId) : getRandomTemplate();

      // Step 3 – call OpenRouter
      setProcessingStep(2);
      const tailoredCV = await generateTailoredCV(parsedCV, jobDescription, template);

      // Step 4 – generate PDF in browser
      setProcessingStep(3);
      const pdfDoc = generatePDF(tailoredCV, template);

      clearInterval(interval);
      setProcessingStep(processingSteps.length - 1);

      setAtsScore(Number(tailoredCV.analysis?.atsScore ?? 0));
      setKeywordMatch(Number(tailoredCV.analysis?.keywordMatch ?? 0));
      setSkillsDetected(tailoredCV.analysis?.detectedSkills || []);
      setGeneratedCVData(tailoredCV);
      setGeneratedPDFDoc(pdfDoc);
      setSelectedTemplateId(template.id);

      await incrementUsage(user?.id);
      setUsage(prev => ({ ...prev, used: prev.used + 1 }));

      setIsProcessing(false);
      return pdfDoc;
    } catch (err) {
      clearInterval(interval);
      setIsProcessing(false);
      alert(`Error: ${err.message}`);
      setCurrentStep(2);
      return null;
    }
  };

  const handleGenerate = async () => {
    const pdf = await runGeneration(null);
    if (pdf) setCurrentStep(3);
  };

  const handleGenerateWithTemplate = async (templateId) => {
    if (!cvFile || !jobDescription.trim()) { alert('Upload your CV and add a job description first.'); return; }
    setTemplateLoading(templateId);
    const pdf = await runGeneration(templateId);
    setTemplateLoading(false);
    if (pdf) setCurrentStep(4);
  };

  const handleDownload = (pdfDoc = generatedPDFDoc) => {
    if (!pdfDoc) return;
    pdfDoc.save(`cv_tailored_${Date.now()}.pdf`);
  };

  const handleSignOut = async () => { await signOut(); navigate('/login'); };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white transition-colors duration-300 flex">

        {/* Sidebar */}
        <motion.aside initial={{ x: -280 }} animate={{ x: sidebarOpen ? 0 : -280 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-0 bottom-0 w-64 bg-slate-50/80 backdrop-blur-xl border-r border-slate-900/10 z-40 shadow-xl lg:translate-x-0 lg:static lg:shadow-none">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-900/10">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-sm bg-slate-900 shadow-sm">
                <FileText className="w-4 h-4 text-white" />
                <Sparkles className="w-3 h-3 text-slate-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">CV<span className="text-gray-500">Forge</span></span>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-all ${activeTab === id ? 'bg-slate-200/60 text-slate-900' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-900/10">
              <div className="flex items-center gap-3 p-2 rounded-sm hover:bg-slate-100 cursor-pointer">
                <div className="w-9 h-9 rounded-sm bg-slate-900 flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

          {/* Header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-900/10 flex-shrink-0">
            <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-sm hover:bg-slate-100 flex-shrink-0">
                    <Menu className="w-5 h-5 text-slate-900" />
                  </button>
                  <div className="min-w-0">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 truncate">Create Your Tailored CV</h1>
                    <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">AI-powered, 100% in your browser</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-2 rounded-sm border border-slate-900/10 bg-white/70 px-2 md:px-3 py-1.5 shadow-sm">
                    <div className="flex gap-1">
                      {[...Array(Math.min(usage.limit, 3))].map((_, i) => (
                        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i < usage.used ? 'bg-slate-400' : 'bg-slate-900'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-slate-700 whitespace-nowrap">{remainingGenerations} left</span>
                  </div>
                  <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-sm hover:bg-slate-100 hidden sm:block">
                    {darkMode ? <Sun className="w-5 h-5 text-slate-900" /> : <Moon className="w-5 h-5 text-slate-900" />}
                  </button>
                  <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-1.5 rounded-sm hover:bg-slate-100">
                      <div className="w-8 h-8 rounded-sm bg-slate-900 flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-sm border border-slate-900/10 shadow-lg z-50">
                        <button onClick={() => { setShowUserMenu(false); navigate('/upgrade'); }} className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-slate-50">Upgrade to Pro</button>
                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">

              {/* Step progress */}
              <div className="mb-8 overflow-x-auto">
                <div className="flex items-center justify-between relative min-w-[420px] sm:min-w-0">
                  <div className="absolute left-0 right-0 top-5 h-0.5 bg-slate-200/50 -z-10" />
                  <div className="absolute left-0 top-5 h-0.5 bg-slate-900 transition-all duration-500 -z-10" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
                  {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 min-w-0">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-sm flex items-center justify-center text-xs sm:text-sm font-semibold z-10 transition-all ${step.completed || currentStep > i ? 'bg-slate-900 text-white shadow-lg' : currentStep === i + 1 ? 'bg-white/70 border-2 border-slate-900 text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
                        {step.completed ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium text-center ${currentStep >= i + 1 ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6">

                  {/* Step 1 – Upload */}
                  {currentStep === 1 && !isProcessing && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="p-6">
                        <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                          className={`relative border border-dashed transition-all ${dragActive ? 'border-slate-900/40 bg-slate-50/40' : 'border-slate-900/10 bg-slate-50/20 hover:border-slate-900/20'}`}>
                          <input type="file" accept=".pdf" onChange={e => { if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]); }}
                            className={`absolute inset-0 cursor-pointer opacity-0 z-10 ${cvFile ? 'pointer-events-none' : ''}`} />
                          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            {!cvFile ? (
                              <>
                                <div className="mb-4 rounded-sm bg-slate-100/50 p-4"><Upload className="h-8 w-8 text-slate-600" /></div>
                                <h3 className="mb-2 text-lg font-semibold text-slate-900">Upload your CV</h3>
                                <p className="mb-2 text-sm text-slate-600">Drag and drop or click to browse</p>
                                <p className="text-xs text-slate-500">PDF only • Max 5MB</p>
                              </>
                            ) : (
                              <div className="w-full max-w-md">
                                <div className="flex items-center gap-3 border border-slate-900/10 bg-slate-50/40 p-4 mb-3">
                                  <FileText className="h-8 w-8 text-slate-700 flex-shrink-0" />
                                  <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{cvFile.name}</p>
                                    <p className="text-xs text-slate-600">{(cvFile.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                                  </div>
                                  <button onClick={removeFile} className="rounded-sm p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600"><Trash2 className="h-4 w-4" /></button>
                                </div>
                                <p className="text-xs text-green-600 flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3" />File ready</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end mt-6">
                          <Btn onClick={() => setCurrentStep(2)} disabled={!cvFile} icon={<ArrowRight className="w-4 h-4" />} iconPos="right">Continue</Btn>
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 2 – Job Description */}
                  {currentStep === 2 && !isProcessing && !generatedCVData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="p-6">
                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-slate-900">Add Job Description</h3>
                          <p className="text-sm text-slate-600 mt-1">Paste the job description to tailor your CV</p>
                        </div>
                        <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                          placeholder="Paste the job description here..." rows={8}
                          className="w-full px-4 py-3 rounded-sm border border-slate-900/10 bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm resize-none" />
                        <p className="text-xs text-slate-500 mt-1">{jobDescription.length} characters</p>
                        <div className="flex justify-between mt-5 gap-3">
                          <Btn variant="secondary" onClick={() => setCurrentStep(1)}>Back</Btn>
                          <Btn onClick={handleGenerate} disabled={jobDescription.trim().length < 10}>Generate CV</Btn>
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 3 – Processing */}
                  {currentStep === 3 && isProcessing && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className="text-center py-12">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <div className="absolute inset-0 rounded-sm border-4 border-slate-900/10" />
                          <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="w-8 h-8 text-slate-900 animate-pulse" /></div>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{processingSteps[processingStep]?.text}</h3>
                        <p className="text-sm text-slate-600 mb-6">Please wait while our AI optimizes your resume</p>
                        <div className="max-w-xs mx-auto space-y-3 text-left">
                          {processingSteps.map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs flex-shrink-0 ${i <= processingStep ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {i < processingStep ? <CheckCircle className="w-4 h-4" /> : i === processingStep ? <Loader className="w-3 h-3 animate-spin" /> : i + 1}
                              </div>
                              <span className={`text-sm ${i <= processingStep ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{step.text}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 3 – Template picker (after generation) */}
                  {currentStep === 3 && !isProcessing && generatedCVData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">Choose Your CV Design</h3>
                            <p className="text-sm text-slate-600">Pick a design, click to generate & download instantly</p>
                          </div>
                          <span className="text-xs text-slate-500">{templates.length} templates</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {templates.map((template) => {
                            const isSelected = selectedTemplateId === template.id;
                            return (
                              <Card key={template.id} className="p-4 border border-slate-900/10 hover:border-slate-400 transition-colors">
                                {/* Mini preview */}
                                <div className="h-24 w-full mb-3 rounded-sm overflow-hidden border border-slate-200 bg-slate-50 relative">
                                  <TemplateMiniPreview id={template.id} />
                                  {isSelected && (
                                    <div className="absolute inset-0 bg-slate-900/10 border-2 border-slate-900 flex items-center justify-center">
                                      <div className="bg-slate-900 text-white rounded-full p-1"><CheckCircle className="w-5 h-5" /></div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                                    <p className="text-xs text-slate-500">{template.description}</p>
                                  </div>
                                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 bg-slate-100 rounded-sm whitespace-nowrap ml-2">
                                    {template.layout.replace('-', ' ')}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {template.features.map((f, i) => (
                                    <span key={i} className="px-1.5 py-0.5 text-[10px] bg-slate-100/50 text-slate-600 rounded-sm border border-slate-900/10">{f}</span>
                                  ))}
                                </div>
                                <Btn size="sm" variant={isSelected ? 'primary' : 'secondary'}
                                  disabled={templateLoading && templateLoading !== template.id}
                                  onClick={() => isSelected ? handleDownload() : handleGenerateWithTemplate(template.id)}>
                                  {templateLoading === template.id ? 'Generating...' : isSelected ? '⬇ Download' : 'Use template'}
                                </Btn>
                              </Card>
                            );
                          })}
                        </div>
                        <div className="mt-6 flex justify-between gap-3">
                          <Btn variant="secondary" onClick={() => { setCurrentStep(2); setGeneratedCVData(null); }}>Back</Btn>
                          {selectedTemplateId && <Btn onClick={() => setCurrentStep(4)} icon={<ArrowRight className="w-4 h-4" />} iconPos="right">Continue to Download</Btn>}
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 4 – Download */}
                  {currentStep === 4 && generatedPDFDoc && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="text-center py-12 px-6">
                        <div className="w-20 h-20 rounded-sm bg-slate-100/50 border border-slate-900/10 flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-10 h-10 text-slate-800" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Your CV is Ready!</h3>
                        <p className="text-slate-600 mb-6 text-sm">Tailored and formatted — ready to download as PDF</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Btn onClick={() => handleDownload()} icon={<Download className="w-4 h-4" />} size="lg">Download PDF</Btn>
                          <Btn variant="secondary" onClick={() => { setCurrentStep(1); setCvFile(null); setJobDescription(''); setGeneratedCVData(null); setGeneratedPDFDoc(null); setSelectedTemplateId(null); }} size="lg">Start Again</Btn>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </div>

                {/* Right sidebar */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
                  {currentStep === 1 && (
                    <Card className="relative p-5 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
                      <h3 className="font-bold text-slate-900 mb-1">Live CV Preview</h3>
                      <p className="text-xs text-slate-600 mb-4">Your uploaded document</p>
                      {uploadedCVUrl ? (
                        <div className="rounded-sm overflow-hidden border border-slate-900/10 w-full h-80 sm:h-[500px]">
                          <iframe src={uploadedCVUrl} title="CV Preview" className="w-full h-full" />
                        </div>
                      ) : (
                        <div className="flex h-64 items-center justify-center bg-slate-50 text-sm text-slate-400 rounded-sm border border-dashed border-slate-900/10">
                          Upload a PDF to preview
                        </div>
                      )}
                    </Card>
                  )}

                  {currentStep === 2 && (
                    <Card className="relative p-5 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
                      <h3 className="font-bold text-slate-900 mb-1">Why This Step?</h3>
                      <ul className="text-slate-600 text-xs space-y-2 mt-3">
                        <li className="flex gap-2"><Target className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Tailors your CV to match the role</span></li>
                        <li className="flex gap-2"><TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Improves ATS compatibility</span></li>
                        <li className="flex gap-2"><Award className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Highlights relevant skills</span></li>
                        <li className="flex gap-2"><BarChart3 className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>Calculates your ATS score</span></li>
                      </ul>
                      <p className="font-medium text-slate-900 text-xs mt-4 mb-2">Tips</p>
                      <ul className="text-slate-500 text-xs space-y-1">
                        <li>• Copy the full job posting</li>
                        <li>• Include requirements section</li>
                        <li>• Add nice-to-haves too</li>
                      </ul>
                    </Card>
                  )}

                  {(currentStep === 3 || currentStep === 4) && (
                    <Card className="relative p-5 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
                      <h3 className="font-bold text-slate-900 mb-1">Analysis Results</h3>
                      <div className="space-y-3 mt-3">
                        <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                          <p className="text-xs text-slate-600 mb-1">ATS Score</p>
                          <div className="flex items-baseline gap-1 mb-1.5">
                            <p className="text-2xl font-bold text-slate-900">{Math.round(atsScore)}</p>
                            <p className="text-xs text-slate-500">/100</p>
                          </div>
                          <ProgressBar value={atsScore} />
                        </div>
                        <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                          <p className="text-xs text-slate-600 mb-1">Keyword Match</p>
                          <div className="flex items-baseline gap-1 mb-1.5">
                            <p className="text-2xl font-bold text-slate-900">{Math.round(keywordMatch)}</p>
                            <p className="text-xs text-slate-500">%</p>
                          </div>
                          <ProgressBar value={keywordMatch} />
                        </div>
                        {skillsDetected.length > 0 && (
                          <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                            <p className="text-xs text-slate-600 mb-2">Detected Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {skillsDetected.slice(0, 6).map((s, i) => (
                                <span key={i} className="px-2 py-0.5 text-xs bg-slate-900 text-white rounded-sm">{s}</span>
                              ))}
                              {skillsDetected.length > 6 && <span className="text-xs text-slate-500 self-center">+{skillsDetected.length - 6}</span>}
                            </div>
                          </div>
                        )}
                        {selectedTemplateId && (
                          <div className="p-3 rounded-sm bg-slate-100/50 border border-slate-900/10">
                            <p className="text-xs text-slate-600 mb-1">Template</p>
                            <p className="font-semibold text-slate-900 text-sm capitalize">{selectedTemplateId}</p>
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

        {/* Usage limit modal */}
        {showLimitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white/95 rounded-sm shadow-2xl max-w-md w-full border border-slate-900/10 p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-sm flex items-center justify-center mx-auto"><Sparkles className="w-8 h-8 text-slate-800" /></div>
              <h2 className="text-2xl font-bold text-slate-900">Free limit reached</h2>
              <p className="text-slate-600 text-sm">You've used all 3 free CV generations. Upgrade to Pro for unlimited customizations.</p>
              <div className="flex flex-col gap-3 pt-2">
                <Btn onClick={() => { setShowLimitModal(false); navigate('/upgrade'); }} className="w-full">Upgrade to Pro</Btn>
                <Btn variant="secondary" onClick={() => setShowLimitModal(false)} className="w-full">Maybe Later</Btn>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Template mini-preview thumbnails ─────────────────────────────────────────
function TemplateMiniPreview({ id }) {
  const previews = {
    modern: <div className="flex flex-col w-full h-full bg-white"><div className="w-full h-1/4 bg-slate-900 p-2"><div className="w-1/3 h-2 bg-white mb-1" /><div className="w-1/4 h-1 bg-slate-400" /></div><div className="w-full h-3/4 p-2 flex flex-col gap-1"><div className="w-1/4 h-1.5 bg-blue-600 mt-1" /><div className="w-full h-1 bg-slate-200" /><div className="w-5/6 h-1 bg-slate-200" /></div></div>,
    classic: <div className="flex flex-col w-full h-full bg-white p-3 items-center"><div className="w-1/2 h-2 bg-slate-900 mb-1" /><div className="w-3/4 h-0.5 bg-slate-400 mb-2" /><div className="w-full flex flex-col gap-1"><div className="w-1/4 h-1.5 bg-slate-800 mt-1" /><div className="w-full h-1 bg-slate-200" /><div className="w-5/6 h-1 bg-slate-200" /></div></div>,
    creative: <div className="flex w-full h-full bg-white"><div className="w-1/3 h-full bg-blue-50 p-2 flex flex-col gap-2"><div className="w-1/2 h-1.5 bg-blue-600" /><div className="w-full h-0.5 bg-blue-200" /><div className="w-full h-0.5 bg-blue-200" /></div><div className="w-2/3 h-full p-3 flex flex-col gap-1.5"><div className="w-1/2 h-2 bg-slate-900" /><div className="w-1/3 h-1 bg-blue-500 mb-2" /><div className="w-full h-1 bg-slate-200" /></div></div>,
    minimal: <div className="flex flex-col w-full h-full bg-white p-3 items-center gap-1.5"><div className="w-2/3 h-3 bg-slate-900 mt-2" /><div className="w-1/2 h-1 bg-slate-400" /><div className="w-full h-[1px] bg-slate-200 my-1" /><div className="w-full flex flex-col gap-1"><div className="w-1/4 h-1.5 bg-slate-900" /><div className="w-full h-1 bg-slate-200" /></div></div>,
    professional: <div className="flex flex-col w-full h-full bg-white p-2"><div className="w-full h-8 bg-slate-100 mb-2 p-1 pl-2 flex flex-col justify-center gap-1"><div className="w-1/2 h-2 bg-slate-900" /><div className="w-1/4 h-1 bg-slate-400" /></div><div className="flex w-full h-full gap-2 px-1"><div className="w-1/3 flex flex-col gap-1"><div className="w-full h-0.5 bg-slate-200" /><div className="w-full h-0.5 bg-slate-200" /></div><div className="w-2/3 flex flex-col gap-1"><div className="w-full h-0.5 bg-slate-200" /></div></div></div>,
    elegant: <div className="flex w-full h-full bg-white"><div className="w-1/3 h-full bg-slate-900 p-2 flex flex-col gap-1.5 items-center"><div className="w-6 h-6 rounded-full border-2 border-red-500 mt-1" /><div className="w-full h-0.5 bg-slate-700 mt-2" /><div className="w-3/4 h-0.5 bg-slate-600" /></div><div className="w-2/3 h-full bg-white p-3 flex flex-col gap-1.5"><div className="w-1/2 h-2 bg-slate-800 mb-1" /><div className="w-full h-1 bg-slate-200" /></div></div>,
    academic: <div className="flex flex-col w-full h-full bg-white"><div className="w-full h-1/3 bg-slate-200 flex items-center justify-center gap-1 border-y border-slate-300"><div className="w-1/2 h-2 bg-slate-800" /></div><div className="flex w-full h-full"><div className="w-1/3 bg-slate-100 p-2 flex flex-col gap-1"><div className="w-3/4 h-1.5 bg-slate-700" /><div className="w-full h-1 bg-slate-400" /></div><div className="w-2/3 p-2 flex flex-col gap-1.5"><div className="w-full h-1 bg-slate-300" /></div></div></div>,
    corporate: <div className="flex flex-col w-full h-full bg-white"><div className="w-full h-1/3 bg-slate-700 flex items-center p-2 gap-2"><div className="w-6 h-6 rounded-full border border-white" /><div className="flex flex-col gap-1"><div className="w-10 h-1.5 bg-white" /><div className="w-8 h-1 bg-slate-300" /></div></div><div className="flex w-full h-2/3 p-2 gap-2"><div className="w-1/3 flex flex-col gap-1"><div className="w-full h-1 bg-slate-300" /></div><div className="w-2/3 flex flex-col gap-1"><div className="w-full h-1 bg-slate-300" /></div></div></div>,
    navy: <div className="flex flex-col w-full h-full bg-white"><div className="w-full h-1/3 bg-blue-900 flex items-center p-2"><div className="flex flex-col gap-1"><div className="w-14 h-2 bg-white" /><div className="w-10 h-1 bg-blue-200" /></div></div><div className="flex w-full h-2/3"><div className="w-1/3 h-full bg-slate-100 p-2 flex flex-col gap-1"><div className="w-3/4 h-1.5 bg-blue-900" /></div><div className="w-2/3 p-2 flex flex-col gap-1"><div className="w-full h-1 bg-slate-300" /></div></div></div>,
  };
  return previews[id] || previews.modern;
}

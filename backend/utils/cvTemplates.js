// 5 unique templates with different styles, colors, and layouts
// Each user gets a RANDOM template for unique design every time

const templates = {
    modern: {
        id: 'modern',
        name: 'Modern',
        style: 'modern',
        description: 'Clean, contemporary design with accent colors',
        colors: {
            primary: '#0f172a',
            secondary: '#2563eb',
            accent: '#f1f5f9',
            text: '#334155',
            textLight: '#64748b'
        },
        fonts: {
            heading: 'Helvetica-Bold',
            body: 'Helvetica'
        },
        layout: 'single-column',
        features: ['Gradient header', 'Two-column skills', 'Modern typography']
    },

    classic: {
        id: 'classic',
        name: 'Classic',
        style: 'classic',
        description: 'Traditional, timeless design trusted by recruiters',
        colors: {
            primary: '#1e293b',
            secondary: '#475569',
            accent: '#f8fafc',
            text: '#334155',
            textLight: '#64748b'
        },
        fonts: {
            heading: 'Times-Bold',
            body: 'Times-Roman'
        },
        layout: 'single-column',
        features: ['Elegant borders', 'Traditional formatting', 'Recruiter-friendly']
    },

    creative: {
        id: 'creative',
        name: 'Creative',
        style: 'creative',
        description: 'Bold, innovative design for creative industries',
        colors: {
            primary: '#2563eb',
            secondary: '#3b82f6',
            light: '#eff6ff',
            text: '#1e293b',
            textLight: '#64748b'
        },
        fonts: {
            heading: 'Helvetica-Bold',
            body: 'Helvetica'
        },
        layout: 'two-column',
        features: ['Sidebar design', 'Color accents', 'Modern layout']
    },

    minimal: {
        id: 'minimal',
        name: 'Minimal',
        style: 'minimal',
        description: 'Clean, distraction-free design focusing on content',
        colors: {
            primary: '#111111',
            secondary: '#333333',
            accent: '#f5f5f5',
            text: '#1a1a1a',
            textLight: '#666666'
        },
        fonts: {
            heading: 'Helvetica-Bold',
            body: 'Helvetica'
        },
        layout: 'single-column',
        features: ['Minimalist design', 'Clean spacing', 'Content-focused']
    },

    professional: {
        id: 'professional',
        name: 'Professional',
        style: 'professional',
        description: 'Executive-level design for senior roles',
        colors: {
            primary: '#0a0a0a',
            secondary: '#2d2d2d',
            accent: '#f5f5f5',
            text: '#1a1a1a',
            textLight: '#6b6b6b'
        },
        fonts: {
            heading: 'Helvetica-Bold',
            body: 'Helvetica'
        },
        layout: 'two-column',
        features: ['Executive style', 'Premium finish', 'ATS optimized']
    },

    elegant: {
        id: 'elegant',
        name: 'Elegant',
        style: 'elegant',
        description: 'Sophisticated two-column design with a distinct sidebar.',
        colors: {
            primary: '#111827',
            secondary: '#dc2626',
            accent: '#fef2f2',
            text: '#1f2937',
            textLight: '#6b7280',
            sidebarText: '#f9fafb'
        },
        fonts: {
            heading: 'Helvetica-Bold',
            body: 'Helvetica'
        },
        layout: 'two-column',
        features: ['Dark sidebar', 'Timeline style', 'High contrast']
    },

    academic: {
        id: 'academic',
        name: 'Academic',
        style: 'academic',
        description: 'Clean academic layout with gray sidebar and header.',
        colors: {
            primary: '#e5e7eb', // header and sidebar bg
            secondary: '#4b5563', // triangle icons / accents
            accent: '#ffffff',
            text: '#374151',
            textLight: '#6b7280',
            sidebarText: '#374151'
        },
        fonts: {
            heading: 'Times-Bold',
            body: 'Times-Roman'
        },
        layout: 'two-column',
        features: ['Gray Header', 'Sidebar profile', 'Academic feel']
    },

    corporate: {
        id: 'corporate',
        name: 'Corporate',
        style: 'corporate',
        description: 'Executive dark header with clean split layout.',
        colors: {
            primary: '#3f3f46', // Dark gray header
            secondary: '#71717a', // subheadings
            accent: '#ffffff',
            text: '#27272a',
            textLight: '#52525b',
            sidebarText: '#27272a'
        },
        fonts: {
            heading: 'Helvetica-Bold',
            body: 'Helvetica'
        },
        layout: 'two-column',
        features: ['Dark Header', 'Clean Layout', 'Professional']
    },

    navy: {
        id: 'navy',
        name: 'Navy',
        style: 'navy',
        description: 'Modern navy header with light gray sidebar.',
        colors: {
            primary: '#1e3a8a', // Navy blue header
            secondary: '#1e40af', 
            accent: '#f3f4f6', // Light gray sidebar
            text: '#1f2937',
            textLight: '#4b5563',
            sidebarText: '#1f2937'
        },
        fonts: {
            heading: 'Helvetica-Bold',
            body: 'Helvetica'
        },
        layout: 'two-column',
        features: ['Navy Header', 'Gray Sidebar', 'Modern Profile']
    }
};

// Get a random template (ensures every user gets a different style)
const getRandomTemplate = () => {
    const templateList = Object.values(templates);
    const randomIndex = Math.floor(Math.random() * templateList.length);
    return templateList[randomIndex];
};

// Get template by ID
const getTemplateById = (templateId) => {
    return templates[templateId] || templates.modern;
};

// Get all templates
const getAllTemplates = () => {
    return Object.values(templates);
};

// Get template count
const getTemplateCount = () => {
    return Object.keys(templates).length;
};

module.exports = {
    getRandomTemplate,
    getTemplateById,
    getAllTemplates,
    getTemplateCount,
    templates
};
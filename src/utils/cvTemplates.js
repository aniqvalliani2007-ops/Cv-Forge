// src/utils/cvTemplates.js
export const templates = {
  modern: { id:'modern', name:'Modern', style:'modern', description:'Clean, contemporary design with accent colors', layout:'single-column', features:['Gradient header','Two-column skills','Modern typography'], colors:{ primary:'#0f172a', secondary:'#2563eb', accent:'#f1f5f9', text:'#334155', textLight:'#64748b' } },
  classic: { id:'classic', name:'Classic', style:'classic', description:'Traditional, timeless design trusted by recruiters', layout:'single-column', features:['Elegant borders','Traditional formatting','Recruiter-friendly'], colors:{ primary:'#1e293b', secondary:'#475569', accent:'#f8fafc', text:'#334155', textLight:'#64748b' } },
  creative: { id:'creative', name:'Creative', style:'creative', description:'Bold, innovative design for creative industries', layout:'two-column', features:['Sidebar design','Color accents','Modern layout'], colors:{ primary:'#2563eb', secondary:'#3b82f6', light:'#eff6ff', text:'#1e293b', textLight:'#64748b' } },
  minimal: { id:'minimal', name:'Minimal', style:'minimal', description:'Clean, distraction-free design focusing on content', layout:'single-column', features:['Minimalist design','Clean spacing','Content-focused'], colors:{ primary:'#111111', secondary:'#333333', accent:'#f5f5f5', text:'#1a1a1a', textLight:'#666666' } },
  professional: { id:'professional', name:'Professional', style:'professional', description:'Executive-level design for senior roles', layout:'two-column', features:['Executive style','Premium finish','ATS optimized'], colors:{ primary:'#0a0a0a', secondary:'#2d2d2d', accent:'#f5f5f5', text:'#1a1a1a', textLight:'#6b6b6b' } },
  elegant: { id:'elegant', name:'Elegant', style:'elegant', description:'Sophisticated two-column design with a distinct sidebar', layout:'two-column', features:['Dark sidebar','Timeline style','High contrast'], colors:{ primary:'#111827', secondary:'#dc2626', accent:'#fef2f2', text:'#1f2937', textLight:'#6b7280', sidebarText:'#f9fafb' } },
  academic: { id:'academic', name:'Academic', style:'academic', description:'Clean academic layout with structured sections', layout:'two-column', features:['Gray Header','Structured sections','Academic feel'], colors:{ primary:'#374151', secondary:'#4b5563', text:'#1f2937', textLight:'#6b7280' } },
  corporate: { id:'corporate', name:'Corporate', style:'corporate', description:'Executive dark header with clean split layout', layout:'two-column', features:['Dark Header','Clean Layout','Professional'], colors:{ primary:'#3f3f46', secondary:'#71717a', text:'#27272a', textLight:'#52525b' } },
  navy: { id:'navy', name:'Navy', style:'navy', description:'Modern navy header with light sidebar', layout:'two-column', features:['Navy Header','Gray Sidebar','Modern Profile'], colors:{ primary:'#1e3a8a', secondary:'#1e40af', accent:'#f3f4f6', text:'#1f2937', textLight:'#4b5563', sidebarText:'#1f2937' } }
};

export const getRandomTemplate = () => {
  const list = Object.values(templates);
  return list[Math.floor(Math.random() * list.length)];
};

export const getTemplateById = (id) => templates[id] || templates.modern;
export const getAllTemplates = () => Object.values(templates);

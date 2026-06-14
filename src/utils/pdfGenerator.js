// src/utils/pdfGenerator.js
// Browser-based PDF generation using jsPDF

import jsPDF from 'jspdf';

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;

export const generatePDF = (tailoredCV, template) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const style = template.style || template.id || 'modern';

  switch (style) {
    case 'classic': renderClassic(doc, tailoredCV, template); break;
    case 'creative': renderCreative(doc, tailoredCV, template); break;
    case 'minimal': renderMinimal(doc, tailoredCV, template); break;
    case 'elegant': renderElegant(doc, tailoredCV, template); break;
    case 'professional': renderProfessional(doc, tailoredCV, template); break;
    case 'academic': renderAcademic(doc, tailoredCV, template); break;
    case 'corporate': renderCorporate(doc, tailoredCV, template); break;
    case 'navy': renderNavy(doc, tailoredCV, template); break;
    default: renderModern(doc, tailoredCV, template);
  }

  return doc;
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const setFill = (doc, hex) => { const [r, g, b] = hexToRgb(hex); doc.setFillColor(r, g, b); };
const setDraw = (doc, hex) => { const [r, g, b] = hexToRgb(hex); doc.setDrawColor(r, g, b); };
const setTxt  = (doc, hex) => { const [r, g, b] = hexToRgb(hex); doc.setTextColor(r, g, b); };

const wrapText = (doc, text, x, y, maxW, lineH) => {
  const lines = doc.splitTextToSize(text || '', maxW);
  doc.text(lines, x, y);
  return y + lines.length * lineH;
};

const checkBreak = (doc, y, needed, marginTop = MARGIN) => {
  if (y + needed > PAGE_H - MARGIN) {
    doc.addPage();
    return marginTop;
  }
  return y;
};

// ── Modern Template ──────────────────────────────────────────────────────────
const renderModern = (doc, cv, template) => {
  const c = template.colors || { primary:'#0f172a', secondary:'#2563eb', text:'#334155', textLight:'#64748b', accent:'#f1f5f9' };
  const info = cv.personalInfo || {};
  const analysis = cv.analysis || {};

  // Header bar
  setFill(doc, c.primary); doc.rect(0, 0, PAGE_W, 38, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); setTxt(doc, '#ffffff');
  doc.text(info.name || 'Your Name', MARGIN, 16);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text(cv.professionalTitle || '', MARGIN, 24);
  const contact = [info.email, info.phone, info.location].filter(Boolean).join('  |  ');
  doc.setFontSize(8); doc.text(contact, MARGIN, 31);

  let y = 46;

  // Section heading helper
  const sectionHead = (title, yy) => {
    yy = checkBreak(doc, yy, 14, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); setTxt(doc, c.primary);
    doc.text(title, MARGIN, yy);
    setDraw(doc, c.secondary); doc.setLineWidth(0.5);
    doc.line(MARGIN, yy + 2, PAGE_W - MARGIN, yy + 2);
    return yy + 7;
  };

  y = sectionHead('Professional Summary', y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setTxt(doc, c.text);
  y = wrapText(doc, analysis.optimizedSummary || '', MARGIN, y, CONTENT_W, 5) + 6;

  y = sectionHead('Work Experience', y);
  for (const exp of (analysis.optimizedExperience || [])) {
    y = checkBreak(doc, y, 18, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setTxt(doc, c.secondary);
    doc.text(exp.title || '', MARGIN, y);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.textLight);
    y += 5; doc.text(exp.company || '', MARGIN, y); y += 5;
    doc.setFont('helvetica', 'normal'); setTxt(doc, c.text);
    for (const ach of (exp.achievements || []).slice(0, 4)) {
      y = checkBreak(doc, y, 6, 10);
      doc.setFontSize(9);
      doc.text('•', MARGIN + 1, y);
      y = wrapText(doc, ach, MARGIN + 5, y, CONTENT_W - 5, 4.5) + 1;
    }
    y += 4;
  }

  y = sectionHead('Skills', y);
  const skillLine = (analysis.detectedSkills || cv.skills || []).join('  •  ');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setTxt(doc, c.text);
  y = wrapText(doc, skillLine, MARGIN, y, CONTENT_W, 5) + 6;

  if ((cv.education || []).length > 0) {
    y = sectionHead('Education', y);
    for (const edu of cv.education) {
      y = checkBreak(doc, y, 12, 10);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setTxt(doc, c.secondary);
      doc.text(edu.degree || '', MARGIN, y);
      doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.textLight);
      y += 5; doc.text(edu.institution || '', MARGIN, y); y += 6;
    }
  }
};

// ── Classic Template ─────────────────────────────────────────────────────────
const renderClassic = (doc, cv, template) => {
  const c = template.colors || { primary:'#1e293b', secondary:'#475569', text:'#334155', textLight:'#64748b' };
  const info = cv.personalInfo || {};
  const analysis = cv.analysis || {};

  let y = MARGIN;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); setTxt(doc, c.primary);
  doc.text(info.name || 'Your Name', MARGIN, y); y += 8;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); setTxt(doc, c.secondary);
  doc.text(cv.professionalTitle || '', MARGIN, y); y += 5;
  doc.setFontSize(8.5); setTxt(doc, c.textLight);
  doc.text([info.email, info.phone, info.location].filter(Boolean).join('  |  '), MARGIN, y); y += 4;
  setDraw(doc, c.secondary); doc.setLineWidth(0.3); doc.line(MARGIN, y, PAGE_W - MARGIN, y); y += 7;

  const sectionHead = (title, yy) => {
    yy = checkBreak(doc, yy, 12, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setTxt(doc, c.primary);
    doc.text(title.toUpperCase(), MARGIN, yy); yy += 2;
    doc.setLineWidth(0.2); setDraw(doc, c.secondary); doc.line(MARGIN, yy, PAGE_W - MARGIN, yy);
    return yy + 5;
  };

  y = sectionHead('Professional Summary', y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setTxt(doc, c.text);
  y = wrapText(doc, analysis.optimizedSummary || '', MARGIN, y, CONTENT_W, 5) + 6;

  y = sectionHead('Professional Experience', y);
  for (const exp of (analysis.optimizedExperience || [])) {
    y = checkBreak(doc, y, 16, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setTxt(doc, c.primary);
    doc.text(exp.title || '', MARGIN, y);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.secondary);
    y += 5; doc.text(exp.company || '', MARGIN, y); y += 5;
    doc.setFont('helvetica', 'normal'); setTxt(doc, c.text);
    for (const ach of (exp.achievements || []).slice(0, 4)) {
      y = checkBreak(doc, y, 6, 10);
      doc.text('•', MARGIN + 1, y);
      y = wrapText(doc, ach, MARGIN + 5, y, CONTENT_W - 5, 4.5) + 1;
    }
    y += 4;
  }

  y = sectionHead('Skills', y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setTxt(doc, c.text);
  y = wrapText(doc, (analysis.detectedSkills || []).join('  •  '), MARGIN, y, CONTENT_W, 5) + 6;

  if ((cv.education || []).length > 0) {
    y = sectionHead('Education', y);
    for (const edu of cv.education) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setTxt(doc, c.primary);
      doc.text(edu.degree || '', MARGIN, y);
      doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.secondary);
      y += 5; doc.text(edu.institution || '', MARGIN, y); y += 6;
    }
  }
};

// ── Creative Template (two-column) ───────────────────────────────────────────
const renderCreative = (doc, cv, template) => {
  const c = template.colors || { primary:'#2563eb', secondary:'#3b82f6', light:'#eff6ff', text:'#1e293b', textLight:'#64748b' };
  const info = cv.personalInfo || {};
  const analysis = cv.analysis || {};
  const SW = 68; const RX = SW + 8; const RW = PAGE_W - RX - MARGIN;

  setFill(doc, c.light); doc.rect(0, 0, SW, PAGE_H, 'F');

  // Left column
  let ly = 14;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setTxt(doc, c.primary);
  doc.text('CONTACT', 8, ly); ly += 7;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); setTxt(doc, c.text);
  [info.email, info.phone, info.location].filter(Boolean).forEach(v => { doc.text(v, 8, ly, { maxWidth: SW - 10 }); ly += 6; });
  ly += 4;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setTxt(doc, c.primary); doc.text('SKILLS', 8, ly); ly += 7;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); setTxt(doc, c.text);
  (analysis.detectedSkills || []).slice(0, 12).forEach(s => { doc.text(`• ${s}`, 8, ly, { maxWidth: SW - 10 }); ly += 5.5; });

  if ((cv.education || []).length > 0) {
    ly += 4;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setTxt(doc, c.primary); doc.text('EDUCATION', 8, ly); ly += 7;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); setTxt(doc, c.text);
    cv.education.forEach(e => { ly = wrapText(doc, e.degree, 8, ly, SW - 10, 4.5) + 2; doc.setFont('helvetica', 'italic'); ly = wrapText(doc, e.institution, 8, ly, SW - 10, 4.5) + 3; doc.setFont('helvetica', 'normal'); });
  }

  // Right column
  let ry = 14;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); setTxt(doc, c.primary);
  doc.text(info.name || 'Your Name', RX, ry); ry += 7;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); setTxt(doc, c.secondary);
  doc.text(cv.professionalTitle || '', RX, ry); ry += 8;

  const rHead = (title, yy) => {
    yy = checkBreak(doc, yy, 12, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setTxt(doc, c.primary); doc.text(title, RX, yy);
    setDraw(doc, c.primary); doc.setLineWidth(0.3); doc.line(RX, yy + 2, PAGE_W - MARGIN, yy + 2);
    return yy + 7;
  };

  ry = rHead('PROFILE', ry);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setTxt(doc, c.text);
  ry = wrapText(doc, analysis.optimizedSummary || '', RX, ry, RW, 5) + 7;

  ry = rHead('EXPERIENCE', ry);
  for (const exp of (analysis.optimizedExperience || [])) {
    ry = checkBreak(doc, ry, 16, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setTxt(doc, c.secondary); doc.text(exp.title || '', RX, ry);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.textLight); ry += 5; doc.text(exp.company || '', RX, ry); ry += 5;
    doc.setFont('helvetica', 'normal'); setTxt(doc, c.text);
    for (const ach of (exp.achievements || []).slice(0, 4)) { ry = checkBreak(doc, ry, 6, 10); doc.text('•', RX + 1, ry); ry = wrapText(doc, ach, RX + 5, ry, RW - 6, 4.5) + 1; }
    ry += 4;
  }
};

// ── Minimal Template ─────────────────────────────────────────────────────────
const renderMinimal = (doc, cv, template) => {
  const c = template.colors || { text:'#111111', textLight:'#666666' };
  const info = cv.personalInfo || {};
  const analysis = cv.analysis || {};
  let y = 18;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(24); setTxt(doc, c.text);
  doc.text(info.name || 'Your Name', PAGE_W / 2, y, { align: 'center' }); y += 8;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11); setTxt(doc, c.textLight);
  doc.text(cv.professionalTitle || '', PAGE_W / 2, y, { align: 'center' }); y += 6;
  doc.setFontSize(8.5);
  doc.text([info.email, info.phone, info.location].filter(Boolean).join('  |  '), PAGE_W / 2, y, { align: 'center' }); y += 5;
  setDraw(doc, '#dddddd'); doc.setLineWidth(0.3); doc.line(MARGIN, y, PAGE_W - MARGIN, y); y += 7;

  const sHead = (t, yy) => {
    yy = checkBreak(doc, yy, 12, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setTxt(doc, c.text); doc.text(t, MARGIN, yy); return yy + 6;
  };

  y = sHead('ABOUT', y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setTxt(doc, c.textLight);
  y = wrapText(doc, analysis.optimizedSummary || '', MARGIN, y, CONTENT_W, 5) + 7;

  y = sHead('EXPERIENCE', y);
  for (const exp of (analysis.optimizedExperience || [])) {
    y = checkBreak(doc, y, 14, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setTxt(doc, c.text); doc.text(exp.title || '', MARGIN, y);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.textLight); y += 5; doc.text(exp.company || '', MARGIN, y); y += 5;
    doc.setFont('helvetica', 'normal');
    for (const ach of (exp.achievements || []).slice(0, 4)) { doc.text('•', MARGIN + 1, y); y = wrapText(doc, ach, MARGIN + 5, y, CONTENT_W - 5, 4.5) + 1; }
    y += 4;
  }

  y = sHead('SKILLS', y);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setTxt(doc, c.textLight);
  y = wrapText(doc, (analysis.detectedSkills || []).join('   •   '), MARGIN, y, CONTENT_W, 5) + 7;

  if ((cv.education || []).length > 0) {
    y = sHead('EDUCATION', y);
    for (const edu of cv.education) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setTxt(doc, c.text); doc.text(edu.degree || '', MARGIN, y);
      doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.textLight); y += 5; doc.text(edu.institution || '', MARGIN, y); y += 6;
    }
  }
};

// ── Elegant Template ─────────────────────────────────────────────────────────
const renderElegant = (doc, cv, template) => {
  const c = template.colors || { primary:'#111827', secondary:'#dc2626', text:'#1f2937', textLight:'#6b7280', sidebarText:'#f9fafb' };
  const info = cv.personalInfo || {};
  const analysis = cv.analysis || {};
  const SW = 65; const RX = SW + 10; const RW = PAGE_W - RX - MARGIN;

  setFill(doc, c.primary); doc.rect(0, 0, SW, PAGE_H, 'F');

  // Initials circle
  setFill(doc, '#1f2937'); doc.circle(SW / 2, 28, 18, 'F');
  setDraw(doc, c.secondary); doc.setLineWidth(0.8); doc.circle(SW / 2, 28, 18);
  const initials = (info.name || 'YN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  doc.setFont('helvetica', 'bold'); doc.setFontSize(16); setTxt(doc, '#ffffff');
  doc.text(initials, SW / 2, 32, { align: 'center' });

  let ly = 54;
  const lHead = (t) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); setTxt(doc, '#ffffff'); doc.text(t, 6, ly);
    setDraw(doc, c.secondary); doc.setLineWidth(0.3); doc.line(6, ly + 2, SW - 6, ly + 2); ly += 7;
  };
  lHead('CONTACT');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); setTxt(doc, '#d1d5db');
  [info.phone, info.email, info.location].filter(Boolean).forEach(v => { ly = wrapText(doc, v, 6, ly, SW - 8, 4) + 1; });
  ly += 4;
  lHead('SKILLS');
  (analysis.detectedSkills || []).slice(0, 12).forEach(s => {
    setFill(doc, c.secondary); doc.circle(8, ly - 1, 1, 'F');
    setTxt(doc, '#d1d5db'); doc.text(s, 12, ly, { maxWidth: SW - 14 }); ly += 5;
  });

  // Right column
  let ry = 14;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); setTxt(doc, c.text);
  doc.text(info.name || 'Your Name', RX, ry); ry += 7;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setTxt(doc, c.secondary);
  doc.text(cv.professionalTitle || '', RX, ry); ry += 8;

  const rHead = (t, yy) => {
    yy = checkBreak(doc, yy, 12, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setTxt(doc, c.text); doc.text(t, RX, yy);
    setDraw(doc, c.textLight); doc.setLineWidth(0.2); doc.line(RX, yy + 2, PAGE_W - MARGIN, yy + 2);
    return yy + 7;
  };

  ry = rHead('ABOUT ME', ry);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setTxt(doc, c.textLight);
  ry = wrapText(doc, analysis.optimizedSummary || '', RX, ry, RW, 5) + 7;

  ry = rHead('WORK EXPERIENCE', ry);
  for (const exp of (analysis.optimizedExperience || [])) {
    ry = checkBreak(doc, ry, 16, 10);
    setFill(doc, c.secondary); doc.circle(RX + 2, ry - 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setTxt(doc, c.text); doc.text(exp.title || '', RX + 7, ry);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); setTxt(doc, c.secondary); ry += 5; doc.text(exp.company || '', RX + 7, ry); ry += 5;
    doc.setFont('helvetica', 'normal'); setTxt(doc, c.textLight);
    for (const ach of (exp.achievements || []).slice(0, 4)) { doc.text('•', RX + 7, ry); ry = wrapText(doc, ach, RX + 12, ry, RW - 14, 4.5) + 1; }
    ry += 4;
  }

  if ((cv.education || []).length > 0) {
    ry = rHead('EDUCATION', ry);
    for (const edu of cv.education) {
      setFill(doc, c.secondary); doc.circle(RX + 2, ry - 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); setTxt(doc, c.text); doc.text(edu.degree || '', RX + 7, ry);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setTxt(doc, c.textLight); ry += 5; doc.text(edu.institution || '', RX + 7, ry); ry += 6;
    }
  }
};

// ── Professional Template ────────────────────────────────────────────────────
const renderProfessional = (doc, cv, template) => {
  const c = template.colors || { primary:'#0a0a0a', secondary:'#2d2d2d', accent:'#f5f5f5', text:'#1a1a1a', textLight:'#6b6b6b' };
  const info = cv.personalInfo || {};
  const analysis = cv.analysis || {};
  const SW = 65; const RX = SW + 10; const RW = PAGE_W - RX - MARGIN;

  setFill(doc, c.accent); doc.rect(0, 0, PAGE_W, 26, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); setTxt(doc, c.primary);
  doc.text(info.name || 'Your Name', MARGIN, 16);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); setTxt(doc, c.textLight);
  doc.text(cv.professionalTitle || '', MARGIN, 22);

  let ly = 34; let ry = 34;
  const lHead = (t) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); setTxt(doc, c.primary); doc.text(t, MARGIN, ly); ly += 5; };
  const rHead = (t, yy) => { yy = checkBreak(doc, yy, 12, 10); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); setTxt(doc, c.primary); doc.text(t, RX, yy); setDraw(doc, c.secondary); doc.setLineWidth(0.2); doc.line(RX, yy + 2, PAGE_W - MARGIN, yy + 2); return yy + 7; };

  lHead('CONTACT');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setTxt(doc, c.textLight);
  [info.email, info.phone, info.location].filter(Boolean).forEach(v => { ly = wrapText(doc, v, MARGIN, ly, SW - 4, 4.5) + 1; });
  ly += 4;
  lHead('SKILLS');
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); setTxt(doc, c.textLight);
  (analysis.detectedSkills || []).slice(0, 12).forEach(s => { doc.text(`✓ ${s}`, MARGIN, ly, { maxWidth: SW - 4 }); ly += 5; });
  if ((cv.education || []).length > 0) {
    ly += 4; lHead('EDUCATION');
    cv.education.forEach(e => { doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); setTxt(doc, c.primary); doc.text(e.degree || '', MARGIN, ly); doc.setFont('helvetica', 'italic'); doc.setFontSize(8); setTxt(doc, c.textLight); ly += 5; doc.text(e.institution || '', MARGIN, ly); ly += 6; doc.setFont('helvetica', 'normal'); });
  }

  ry = rHead('PROFILE', ry);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); setTxt(doc, c.textLight);
  ry = wrapText(doc, analysis.optimizedSummary || '', RX, ry, RW, 5) + 7;
  ry = rHead('EXPERIENCE', ry);
  for (const exp of (analysis.optimizedExperience || [])) {
    ry = checkBreak(doc, ry, 16, 10);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); setTxt(doc, c.secondary); doc.text(exp.title || '', RX, ry);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); setTxt(doc, c.textLight); ry += 5; doc.text(exp.company || '', RX, ry); ry += 5;
    doc.setFont('helvetica', 'normal');
    for (const ach of (exp.achievements || []).slice(0, 4)) { doc.text('•', RX + 1, ry); ry = wrapText(doc, ach, RX + 5, ry, RW - 6, 4.5) + 1; }
    ry += 4;
  }
};

// ── Academic Template ─────────────────────────────────────────────────────────
const renderAcademic = (doc, cv, template) => renderModern(doc, cv, { ...template, colors: { primary:'#374151', secondary:'#4b5563', text:'#1f2937', textLight:'#6b7280', accent:'#e5e7eb' } });

// ── Corporate Template ────────────────────────────────────────────────────────
const renderCorporate = (doc, cv, template) => renderClassic(doc, cv, { ...template, colors: { primary:'#3f3f46', secondary:'#71717a', text:'#27272a', textLight:'#52525b' } });

// ── Navy Template ─────────────────────────────────────────────────────────────
const renderNavy = (doc, cv, template) => renderElegant(doc, cv, { ...template, colors: { primary:'#1e3a8a', secondary:'#1e40af', text:'#1f2937', textLight:'#4b5563', sidebarText:'#f9fafb' } });

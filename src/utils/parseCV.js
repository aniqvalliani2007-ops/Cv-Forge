// src/utils/parseCV.js
// Browser-based CV parser using pdfjs-dist

import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;

// Parse PDF file in the browser
export const parsePDFFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return parseStructuredData(fullText);
};

// Parse plain text CV
export const parseTextCV = (text) => {
  return parseStructuredData(text);
};

// Main parser
const parseStructuredData = (text) => {
  const personalInfo = extractPersonalInfo(text);
  return {
    personalInfo,
    summary: extractSection(text, ['summary', 'profile', 'about', 'objective'], 500),
    experience: extractExperience(text),
    education: extractEducation(text),
    skills: extractSkills(text),
    certifications: extractCertifications(text),
    rawText: text
  };
};

const extractPersonalInfo = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Name: first line that looks like a proper name
  let name = '';
  for (const line of lines.slice(0, 5)) {
    if (/^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$/.test(line.trim())) {
      name = line.trim();
      break;
    }
  }
  if (!name) {
    const nameMatch = text.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,3})/m);
    if (nameMatch) name = nameMatch[1];
  }

  const emailMatch = text.match(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/);
  const locationMatch = text.match(/(?:Location|Address|Based in|City):\s*([^,\n]+(?:,\s*[^,\n]+)?)/i);

  return {
    name: name.trim(),
    email: emailMatch?.[0]?.trim() || '',
    phone: phoneMatch?.[0]?.trim() || '',
    location: locationMatch?.[1]?.trim() || ''
  };
};

const extractSection = (text, sectionNames, maxLength = 500) => {
  for (const name of sectionNames) {
    const pattern = new RegExp(`${name}[\\s\\n]*:?[\\s\\n]*([\\s\\S]{20,${maxLength}})`, 'i');
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1].trim().substring(0, maxLength);
    }
  }
  return '';
};

const extractExperience = (text) => {
  const experiences = [];
  const expSection = extractSection(text, ['experience', 'work experience', 'employment', 'work history'], 3000);
  if (!expSection) return experiences;

  const jobPattern = /([A-Za-z\s]+(?:Developer|Engineer|Manager|Director|Lead|Specialist|Consultant|Analyst|Designer|Architect|Administrator|Coordinator|Executive|Officer|Head))[\s\S]*?(?=(?:[A-Z][a-z]+\s(?:Developer|Engineer|Manager)|$))/gi;

  let match;
  while ((match = jobPattern.exec(expSection)) !== null && experiences.length < 5) {
    const jobText = match[0];
    const titleMatch = jobText.match(/^([A-Za-z\s]+(?:Developer|Engineer|Manager|Director|Lead|Specialist|Consultant|Analyst|Designer|Architect))/i);
    const companyMatch = jobText.match(/(?:at|@|for)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i);
    const achievements = [];
    const bullets = jobText.match(/[•\-*]\s*([^•\-*\n]+)/g);
    if (bullets) {
      bullets.forEach(p => {
        const clean = p.replace(/[•\-*]\s*/, '').trim();
        if (clean.length > 10) achievements.push(clean);
      });
    }
    if (titleMatch || companyMatch) {
      experiences.push({
        title: titleMatch?.[1]?.trim() || 'Position',
        company: companyMatch?.[1]?.trim() || 'Company',
        achievements: achievements.slice(0, 4)
      });
    }
  }
  return experiences;
};

const extractEducation = (text) => {
  const education = [];
  const eduSection = extractSection(text, ['education', 'academic', 'qualifications'], 1000);
  if (!eduSection) return education;

  const degreePatterns = [
    /(Bachelor|Master|PhD|B\.Sc|M\.Sc|B\.A|M\.A|B\.Tech|M\.Tech|MBA|BEng|MEng|BSc|MSc)[\s\S]{0,100}(?:in|of)\s([^,\n]+)/i,
    /(BS|MS|BA|MA|PhD)\s+in\s+([^,\n]+)/i,
  ];

  for (const pattern of degreePatterns) {
    const match = eduSection.match(pattern);
    if (match) {
      const instMatch = eduSection.match(/(?:University|College|Institute|School)\s+of\s+([^,\n]+)/i);
      education.push({
        degree: match[0].trim(),
        institution: instMatch?.[0] || ''
      });
      break;
    }
  }
  return education;
};

const extractSkills = (text) => {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'React', 'Angular', 'Vue',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'REST API', 'GraphQL',
    'Tailwind', 'CSS', 'HTML', 'Next.js', 'Redux', 'TensorFlow', 'PyTorch', 'SQL',
    'Linux', 'CI/CD', 'Agile', 'Scrum', 'Figma', 'Photoshop', 'Excel', 'Power BI',
    'Tableau', 'Salesforce', 'SAP', 'JIRA', 'Confluence'
  ];

  const found = new Set();
  const lower = text.toLowerCase();
  for (const skill of skillKeywords) {
    if (lower.includes(skill.toLowerCase())) found.add(skill);
  }
  return Array.from(found).slice(0, 15);
};

const extractCertifications = (text) => {
  const certs = [];
  const patterns = [
    /(Certified|Certificate|Certification)[\s\S]{0,50}(?:in|of|:)\s*([^,\n]+)/gi,
    /(AWS|Azure|Google|Microsoft|CompTIA)\s+(?:Certified|Certificate)[\s\S]{0,50}/gi,
  ];
  for (const pattern of patterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const cert = m[0].trim();
      if (cert.length > 5 && cert.length < 100) certs.push(cert);
    }
  }
  return [...new Set(certs)].slice(0, 5);
};

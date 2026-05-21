const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Parse CV file and extract structured content
const parseCVFile = async (filePath, fileType) => {
    try {
        let extractedText = '';

        // Extract text based on file type
        if (fileType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text;
        } else if (fileType.includes('word')) {
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
        } else {
            throw new Error('Unsupported file format');
        }

        // Parse the extracted text into structured data
        const structuredCV = await parseStructuredData(extractedText);

        return structuredCV;

    } catch (error) {
        console.error('Error parsing CV:', error);
        throw error;
    }
};

// Parse extracted text into structured CV data
const parseStructuredData = async (text) => {
    // Extract personal information
    const personalInfo = extractPersonalInfo(text);

    // Extract sections
    const sections = {
        summary: extractSection(text, ['summary', 'profile', 'about'], 300),
        experience: extractExperience(text),
        education: extractEducation(text),
        skills: extractSkills(text),
        certifications: extractCertifications(text)
    };

    return {
        personalInfo,
        ...sections,
        rawText: text
    };
};

// Extract personal information
const extractPersonalInfo = (text) => {
    // Name patterns
    const namePatterns = [
        /^([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,3})/m,
        /Name:\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/i,
    ];

    let name = '';
    for (const pattern of namePatterns) {
        const match = text.match(pattern);
        if (match) {
            name = match[1];
            break;
        }
    }

    // Email pattern
    const emailPattern = /\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/;
    const email = text.match(emailPattern)?.[0] || '';

    // Phone pattern
    const phonePattern = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/;
    const phone = text.match(phonePattern)?.[0] || '';

    // Location pattern
    const locationPattern = /(?:Location|Address|Based in):\s*([^,\n]+(?:,\s*[^,\n]+)?)/i;
    const locationMatch = text.match(locationPattern);
    const location = locationMatch ? locationMatch[1] : '';

    return {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim()
    };
};

// Extract specific section from text
const extractSection = (text, sectionNames, maxLength = 500) => {
    for (const sectionName of sectionNames) {
        const patterns = [
            new RegExp(`${sectionName}[\\s\\n]*:?[\\s\\n]*([^\\n]+(?:\\n[^A-Z][^\\n]*)*)`, 'i'),
            new RegExp(`${sectionName}[\\s\\n]+([^\\n]+(?:\\n[^A-Z][^\\n]*)*)`, 'i'),
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                let content = match[1].trim();
                if (content.length > maxLength) {
                    content = content.substring(0, maxLength) + '...';
                }
                return content;
            }
        }
    }
    return '';
};

// Extract work experience
const extractExperience = (text) => {
    const experiences = [];

    const expSection = extractSection(text, ['experience', 'work experience', 'employment', 'work history'], 2000);

    if (!expSection) return experiences;

    // Pattern for job entries
    const jobPattern = /([A-Za-z\s]+(?:Developer|Engineer|Manager|Director|Lead|Specialist|Consultant|Analyst|Designer|Architect|Administrator|Coordinator))[\s\S]*?(?=(?:[A-Z][a-z]+ (?:Developer|Engineer|Manager)|$))/gi;

    let match;
    while ((match = jobPattern.exec(expSection)) !== null && experiences.length < 4) {
        const jobText = match[0];

        // Extract title
        const titleMatch = jobText.match(/^([A-Za-z\s]+(?:Developer|Engineer|Manager|Director|Lead|Specialist|Consultant|Analyst|Designer|Architect))/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract company
        const companyMatch = jobText.match(/(?:at|@|for)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/i);
        const company = companyMatch ? companyMatch[1].trim() : '';

        // Extract achievements
        const achievements = [];
        const bulletPoints = jobText.match(/[•\-*]\s*([^•\-*\n]+)/g);

        if (bulletPoints) {
            bulletPoints.forEach(point => {
                const cleanPoint = point.replace(/[•\-*]\s*/, '').trim();
                if (cleanPoint.length > 10) {
                    achievements.push(cleanPoint);
                }
            });
        }

        if (title || company) {
            experiences.push({
                title: title || 'Position',
                company: company || 'Company',
                achievements: achievements.slice(0, 4)
            });
        }
    }

    return experiences;
};

// Extract education
const extractEducation = (text) => {
    const education = [];

    const eduSection = extractSection(text, ['education', 'academic background', 'qualifications'], 1000);

    if (!eduSection) return education;

    // Education patterns
    const degreePatterns = [
        /(Bachelor|Master|PhD|B\.Sc|M\.Sc|B\.A|M\.A|B\.Tech|M\.Tech|MBA)[\s\S]{0,100}(?:in|of)\s([^,\n]+)/i,
        /(BS|MS|BA|MA|PhD)\s+in\s+([^,\n]+)/i,
    ];

    for (const pattern of degreePatterns) {
        const match = eduSection.match(pattern);
        if (match) {
            education.push({
                degree: match[0].trim(),
                institution: '',
                year: ''
            });
            break;
        }
    }

    // Extract institution names
    const institutionPattern = /(?:University|College|Institute|School)\s+of\s+([^,\n]+)/i;
    const institutionMatch = eduSection.match(institutionPattern);
    if (institutionMatch && education.length > 0) {
        education[0].institution = institutionMatch[0];
    }

    return education;
};

// Extract skills
const extractSkills = (text) => {
    const skillKeywords = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Angular', 'Vue', 'Node.js',
        'Express', 'Django', 'Flask', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker',
        'Kubernetes', 'Git', 'REST API', 'GraphQL', 'Tailwind', 'CSS', 'HTML5'
    ];

    const foundSkills = new Set();
    const lowerText = text.toLowerCase();

    for (const skill of skillKeywords) {
        if (lowerText.includes(skill.toLowerCase())) {
            foundSkills.add(skill);
        }
    }

    return Array.from(foundSkills).slice(0, 12);
};

// Extract certifications
const extractCertifications = (text) => {
    const certifications = [];
    const certPatterns = [
        /(Certified|Certificate|Certification)[\s\S]{0,50}(?:in|of|:)\s*([^,\n]+)/gi,
        /(AWS|Azure|Google|Microsoft)\s+(?:Certified|Certificate)[\s\S]{0,50}/gi,
    ];

    for (const pattern of certPatterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const cert = match[0].trim();
            if (cert.length > 5 && cert.length < 100) {
                certifications.push(cert);
            }
        }
    }

    return [...new Set(certifications)].slice(0, 5);
};

module.exports = { parseCVFile, parseStructuredData };
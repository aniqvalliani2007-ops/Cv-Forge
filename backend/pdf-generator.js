const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate PDF with unique design based on template
const generatePDF = async (tailoredCV, template, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const timestamp = Date.now();
            const uniqueId = Math.random().toString(36).substring(7);
            const filename = `cv_${userId}_${timestamp}_${uniqueId}.pdf`;
            const outputPath = path.join(__dirname, 'downloads', filename);

            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const writeStream = fs.createWriteStream(outputPath);
            doc.pipe(writeStream);

            // Render based on template style
            switch (template.style) {
                case 'modern':
                    await renderModernTemplate(doc, tailoredCV, template);
                    break;
                case 'classic':
                    await renderClassicTemplate(doc, tailoredCV, template);
                    break;
                case 'creative':
                    await renderCreativeTemplate(doc, tailoredCV, template);
                    break;
                case 'minimal':
                    await renderMinimalTemplate(doc, tailoredCV, template);
                    break;
                case 'professional':
                    await renderProfessionalTemplate(doc, tailoredCV, template);
                    break;
                case 'elegant':
                    await renderElegantTemplate(doc, tailoredCV, template);
                    break;
                case 'academic':
                    await renderAcademicTemplate(doc, tailoredCV, template);
                    break;
                case 'corporate':
                    await renderCorporateTemplate(doc, tailoredCV, template);
                    break;
                case 'navy':
                    await renderNavyTemplate(doc, tailoredCV, template);
                    break;
                default:
                    await renderModernTemplate(doc, tailoredCV, template);
            }

            doc.end();

            writeStream.on('finish', () => {
                resolve(outputPath);
            });

            writeStream.on('error', reject);

        } catch (error) {
            reject(error);
        }
    });
};

// Modern Template with improved alignment and design
const renderModernTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#0f172a',
        secondary: '#2563eb',
        accent: '#f1f5f9',
        text: '#334155',
        textLight: '#64748b'
    };

    // Header with gradient bar
    doc.rect(0, 0, doc.page.width, 140).fill(colors.primary);

    // Name
    doc.fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(cv.personalInfo.name || 'Your Name', 50, 45);

    // Title
    doc.font('Helvetica')
        .fontSize(12)
        .text(cv.professionalTitle || (cv.analysis.optimizedSummary ? cv.analysis.optimizedSummary.split('.')[0] : 'Professional'), 50, 85);

    // Contact info
    const contactInfo = [cv.personalInfo.email, cv.personalInfo.phone, cv.personalInfo.location].filter(Boolean).join('   |   ');
    doc.fillColor(colors.accent)
        .fontSize(10)
        .text(contactInfo, 50, 110);

    let yPos = 170;

    const checkPageBreak = (heightNeeded) => {
        if (yPos + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            yPos = 50;
        }
    };

    // Professional Summary
    checkPageBreak(100);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Professional Summary', 50, yPos);

    doc.moveTo(50, yPos + 20).lineTo(doc.page.width - 50, yPos + 20).strokeColor(colors.secondary).lineWidth(2).stroke();

    yPos += 35;
    doc.fillColor(colors.text)
        .font('Helvetica')
        .fontSize(10)
        .text(cv.analysis.optimizedSummary, 50, yPos, {
            width: doc.page.width - 100,
            align: 'justify',
            lineGap: 3
        });

    yPos += doc.heightOfString(cv.analysis.optimizedSummary, { width: doc.page.width - 100, lineGap: 3 }) + 30;

    // Work Experience
    checkPageBreak(50);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Work Experience', 50, yPos);

    doc.moveTo(50, yPos + 20).lineTo(doc.page.width - 50, yPos + 20).strokeColor(colors.secondary).lineWidth(2).stroke();

    yPos += 35;

    for (const exp of cv.analysis.optimizedExperience) {
        checkPageBreak(60);
        doc.fillColor(colors.secondary)
            .font('Helvetica-Bold')
            .fontSize(12)
            .text(exp.title, 50, yPos);

        doc.fillColor(colors.textLight)
            .font('Helvetica-Oblique')
            .fontSize(10)
            .text(exp.company, 50, yPos + 16);

        yPos += 35;

        for (const achievement of exp.achievements.slice(0, 4)) {
            const textWidth = doc.page.width - 120;
            const textHeight = doc.heightOfString(achievement, { width: textWidth, lineGap: 2 });
            checkPageBreak(textHeight + 10);

            doc.fillColor(colors.secondary).font('Helvetica').fontSize(10).text('•', 55, yPos);
            doc.fillColor(colors.text)
                .font('Helvetica')
                .fontSize(10)
                .text(achievement, 70, yPos, { width: textWidth, lineGap: 2 });

            yPos += textHeight + 8;
        }
        yPos += 15;
    }

    // Skills Section
    checkPageBreak(80);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Skills', 50, yPos);

    doc.moveTo(50, yPos + 20).lineTo(doc.page.width - 50, yPos + 20).strokeColor(colors.secondary).lineWidth(2).stroke();

    yPos += 35;

    const midPoint = doc.page.width / 2;
    let leftY = yPos;
    let rightY = yPos;

    cv.analysis.detectedSkills.forEach((skill, index) => {
        const isLeft = index % 2 === 0;
        const currentY = isLeft ? leftY : rightY;
        const xPos = isLeft ? 50 : midPoint;

        checkPageBreak(25);

        doc.fillColor(colors.secondary).font('Helvetica').fontSize(10).text('•', xPos, currentY);
        doc.fillColor(colors.text)
            .font('Helvetica')
            .fontSize(10)
            .text(skill, xPos + 15, currentY);

        if (isLeft) leftY += 20;
        else rightY += 20;
    });

    yPos = Math.max(leftY, rightY) + 20;

    // Education
    if (cv.education && cv.education.length > 0) {
        checkPageBreak(60);
        doc.fillColor(colors.primary)
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('Education', 50, yPos);

        doc.moveTo(50, yPos + 20).lineTo(doc.page.width - 50, yPos + 20).strokeColor(colors.secondary).lineWidth(2).stroke();

        yPos += 35;

        for (const edu of cv.education) {
            checkPageBreak(50);
            doc.fillColor(colors.secondary)
                .font('Helvetica-Bold')
                .fontSize(11)
                .text(edu.degree, 50, yPos);

            doc.fillColor(colors.textLight)
                .font('Helvetica')
                .fontSize(10)
                .text(edu.institution, 50, yPos + 16);

            yPos += 40;
        }
    }
};

// Classic Template
const renderClassicTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#1e293b',
        secondary: '#475569',
        text: '#334155',
        textLight: '#64748b'
    };

    let yPos = 50;

    const checkPageBreak = (heightNeeded) => {
        if (yPos + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            yPos = 50;
        }
    };

    // Header with border
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(24)
        .text(cv.personalInfo.name || 'Your Name', 50, yPos);

    doc.moveTo(50, yPos + 35)
        .lineTo(doc.page.width - 50, yPos + 35)
        .stroke(colors.secondary);

    yPos += 50;

    // Title
    doc.fillColor(colors.secondary)
        .font('Helvetica')
        .fontSize(12)
        .text(cv.professionalTitle || (cv.analysis.optimizedSummary ? cv.analysis.optimizedSummary.split('.')[0] : 'Professional'), 50, yPos);

    yPos += 20;

    // Contact info
    const contactInfo = [cv.personalInfo.email, cv.personalInfo.phone, cv.personalInfo.location].filter(Boolean).join('  |  ');
    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(10)
        .text(contactInfo, 50, yPos);

    yPos += 30;

    // Summary
    checkPageBreak(100);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('PROFESSIONAL SUMMARY', 50, yPos);

    yPos += 20;
    doc.fillColor(colors.text)
        .font('Helvetica')
        .fontSize(10)
        .text(cv.analysis.optimizedSummary, 50, yPos, {
            width: doc.page.width - 100,
            align: 'justify',
            lineGap: 2
        });

    yPos += doc.heightOfString(cv.analysis.optimizedSummary, { width: doc.page.width - 100, lineGap: 2 }) + 25;

    // Experience
    checkPageBreak(50);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('PROFESSIONAL EXPERIENCE', 50, yPos);

    yPos += 25;

    for (const exp of cv.analysis.optimizedExperience) {
        checkPageBreak(60);
        doc.fillColor(colors.primary)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(exp.title, 50, yPos);

        doc.fillColor(colors.secondary)
            .font('Helvetica-Oblique')
            .fontSize(10)
            .text(exp.company, 50, yPos + 15);

        yPos += 35;

        for (const achievement of exp.achievements.slice(0, 4)) {
            const textWidth = doc.page.width - 110;
            const textHeight = doc.heightOfString(achievement, { width: textWidth, lineGap: 2 });
            checkPageBreak(textHeight + 10);

            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text('•', 55, yPos);
            doc.fillColor(colors.text)
                .font('Helvetica')
                .fontSize(10)
                .text(achievement, 65, yPos, { width: textWidth, lineGap: 2 });

            yPos += textHeight + 6;
        }
        yPos += 15;
    }

    // Skills
    checkPageBreak(80);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('SKILLS', 50, yPos);

    yPos += 20;

    const skillsText = cv.analysis.detectedSkills.join('  •  ');
    doc.fillColor(colors.text)
        .font('Helvetica')
        .fontSize(10)
        .text(skillsText, 50, yPos, {
            width: doc.page.width - 100,
            lineGap: 4
        });

    yPos += doc.heightOfString(skillsText, { width: doc.page.width - 100, lineGap: 4 }) + 25;

    // Education
    if (cv.education && cv.education.length > 0) {
        checkPageBreak(60);
        doc.fillColor(colors.primary)
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('EDUCATION', 50, yPos);

        yPos += 25;

        for (const edu of cv.education) {
            checkPageBreak(50);
            doc.fillColor(colors.primary)
                .font('Helvetica-Bold')
                .fontSize(11)
                .text(edu.degree, 50, yPos);

            doc.fillColor(colors.secondary)
                .font('Helvetica-Oblique')
                .fontSize(10)
                .text(edu.institution, 50, yPos + 15);

            yPos += 40;
        }
    }
};

// Creative Template
const renderCreativeTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#2563eb',
        secondary: '#3b82f6',
        light: '#eff6ff',
        text: '#1e293b',
        textLight: '#64748b'
    };

    const leftWidth = doc.page.width * 0.35;
    const rightX = leftWidth + 30;
    const rightWidth = doc.page.width - rightX - 40;

    // Draw left column background for the current page
    const drawLeftBackground = () => {
        doc.rect(0, 0, leftWidth, doc.page.height).fill(colors.light);
    };

    drawLeftBackground();

    // Profile section
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('CONTACT', 30, 50);

    doc.fillColor(colors.text)
        .font('Helvetica')
        .fontSize(9);

    let contactY = 80;
    if (cv.personalInfo.email) { doc.text(cv.personalInfo.email, 30, contactY); contactY += 20; }
    if (cv.personalInfo.phone) { doc.text(cv.personalInfo.phone, 30, contactY); contactY += 20; }
    if (cv.personalInfo.location) { doc.text(cv.personalInfo.location, 30, contactY); contactY += 20; }

    contactY += 20;
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('SKILLS', 30, contactY);

    let skillY = contactY + 30;
    cv.analysis.detectedSkills.slice(0, 10).forEach(skill => {
        doc.fillColor(colors.secondary).font('Helvetica').fontSize(10).text('•', 30, skillY);
        doc.fillColor(colors.text).font('Helvetica').fontSize(10).text(skill, 40, skillY);
        skillY += 20;
    });

    let rightY = 50;

    const checkRightPageBreak = (heightNeeded) => {
        if (rightY + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            drawLeftBackground();
            rightY = 50;
        }
    };

    // Right column - main content
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(24)
        .text(cv.personalInfo.name || 'Your Name', rightX, rightY);

    rightY += 30;
    doc.fillColor(colors.secondary)
        .font('Helvetica')
        .fontSize(12)
        .text(cv.professionalTitle || (cv.analysis.optimizedSummary ? cv.analysis.optimizedSummary.split('.')[0] : 'Professional'), rightX, rightY);

    rightY += 35;

    // Summary
    checkRightPageBreak(100);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('PROFILE', rightX, rightY);

    rightY += 25;
    doc.fillColor(colors.text)
        .font('Helvetica')
        .fontSize(10)
        .text(cv.analysis.optimizedSummary, rightX, rightY, { width: rightWidth, align: 'justify', lineGap: 2 });

    rightY += doc.heightOfString(cv.analysis.optimizedSummary, { width: rightWidth, lineGap: 2 }) + 30;

    checkRightPageBreak(50);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('EXPERIENCE', rightX, rightY);

    rightY += 30;

    for (const exp of cv.analysis.optimizedExperience) {
        checkRightPageBreak(60);

        doc.fillColor(colors.secondary)
            .font('Helvetica-Bold')
            .fontSize(12)
            .text(exp.title, rightX, rightY);

        doc.fillColor(colors.textLight)
            .font('Helvetica-Oblique')
            .fontSize(10)
            .text(exp.company, rightX, rightY + 16);

        rightY += 35;

        for (const achievement of exp.achievements.slice(0, 4)) {
            const textHeight = doc.heightOfString(achievement, { width: rightWidth - 15, lineGap: 2 });
            checkRightPageBreak(textHeight + 10);

            doc.fillColor(colors.secondary).font('Helvetica').fontSize(10).text('•', rightX + 5, rightY);
            doc.fillColor(colors.text)
                .font('Helvetica')
                .fontSize(10)
                .text(achievement, rightX + 15, rightY, { width: rightWidth - 15, lineGap: 2 });

            rightY += textHeight + 6;
        }
        rightY += 15;
    }

    // Education
    if (cv.education && cv.education.length > 0) {
        checkRightPageBreak(60);
        doc.fillColor(colors.primary)
            .font('Helvetica-Bold')
            .fontSize(14)
            .text('EDUCATION', rightX, rightY);

        rightY += 30;

        for (const edu of cv.education) {
            checkRightPageBreak(50);
            doc.fillColor(colors.secondary)
                .font('Helvetica-Bold')
                .fontSize(11)
                .text(edu.degree, rightX, rightY);

            doc.fillColor(colors.textLight)
                .font('Helvetica-Oblique')
                .fontSize(10)
                .text(edu.institution, rightX, rightY + 16);

            rightY += 40;
        }
    }
};

// Minimal Template
const renderMinimalTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        text: '#111111',
        textLight: '#666666',
        border: '#eeeeee'
    };

    let yPos = 50;

    const checkPageBreak = (heightNeeded) => {
        if (yPos + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            yPos = 50;
        }
    };

    // Simple header
    doc.fillColor(colors.text)
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(cv.personalInfo.name || 'Your Name', 50, yPos, { align: 'center' });

    yPos += 35;

    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(12)
        .text(cv.professionalTitle || (cv.analysis.optimizedSummary ? cv.analysis.optimizedSummary.split('.')[0] : 'Professional'), 50, yPos, { align: 'center' });

    yPos += 25;

    const contactLine = [cv.personalInfo.email, cv.personalInfo.phone, cv.personalInfo.location].filter(Boolean).join('  |  ');
    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(10)
        .text(contactLine, 50, yPos, { align: 'center' });

    yPos += 30;
    doc.moveTo(50, yPos).lineTo(doc.page.width - 50, yPos).lineWidth(1).strokeColor(colors.border).stroke();
    yPos += 25;

    // Summary
    checkPageBreak(100);
    doc.fillColor(colors.text)
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('ABOUT', 50, yPos);

    yPos += 20;
    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(10)
        .text(cv.analysis.optimizedSummary, 50, yPos, {
            width: doc.page.width - 100,
            align: 'justify',
            lineGap: 3
        });

    yPos += doc.heightOfString(cv.analysis.optimizedSummary, { width: doc.page.width - 100, lineGap: 3 }) + 30;

    // Experience
    checkPageBreak(50);
    doc.fillColor(colors.text)
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('EXPERIENCE', 50, yPos);

    yPos += 25;

    for (const exp of cv.analysis.optimizedExperience) {
        checkPageBreak(60);
        doc.fillColor(colors.text)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(exp.title, 50, yPos);

        doc.fillColor(colors.textLight)
            .font('Helvetica-Oblique')
            .fontSize(10)
            .text(exp.company, 50, yPos + 16);

        yPos += 35;

        for (const achievement of exp.achievements.slice(0, 4)) {
            const textWidth = doc.page.width - 110;
            const textHeight = doc.heightOfString(achievement, { width: textWidth, lineGap: 2 });
            checkPageBreak(textHeight + 10);

            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text('•', 55, yPos);
            doc.fillColor(colors.textLight)
                .font('Helvetica')
                .fontSize(10)
                .text(achievement, 65, yPos, { width: textWidth, lineGap: 2 });

            yPos += textHeight + 8;
        }
        yPos += 15;
    }

    // Skills
    checkPageBreak(80);
    doc.fillColor(colors.text)
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('SKILLS', 50, yPos);

    yPos += 20;

    const skillsText = cv.analysis.detectedSkills.join('   •   ');
    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(10)
        .text(skillsText, 50, yPos, {
            width: doc.page.width - 100,
            lineGap: 4
        });

    yPos += doc.heightOfString(skillsText, { width: doc.page.width - 100, lineGap: 4 }) + 30;

    // Education
    if (cv.education && cv.education.length > 0) {
        checkPageBreak(60);
        doc.fillColor(colors.text)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text('EDUCATION', 50, yPos);

        yPos += 25;

        for (const edu of cv.education) {
            checkPageBreak(50);
            doc.fillColor(colors.text)
                .font('Helvetica-Bold')
                .fontSize(11)
                .text(edu.degree, 50, yPos);

            doc.fillColor(colors.textLight)
                .font('Helvetica-Oblique')
                .fontSize(10)
                .text(edu.institution, 50, yPos + 16);

            yPos += 40;
        }
    }
};

// Professional Template
const renderProfessionalTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#0a0a0a',
        secondary: '#2d2d2d',
        accent: '#f5f5f5',
        text: '#1a1a1a',
        textLight: '#6b6b6b'
    };

    let yPos = 50;

    // Name and title box
    doc.rect(50, yPos, doc.page.width - 100, 100).fill(colors.accent);

    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(cv.personalInfo.name || 'Your Name', 70, yPos + 25);

    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(12)
        .text(cv.professionalTitle || (cv.analysis.optimizedSummary ? cv.analysis.optimizedSummary.split('.')[0] : 'Professional'), 70, yPos + 65);

    yPos += 130;

    // Two column layout
    const leftWidth = doc.page.width * 0.35;
    const rightX = leftWidth + 50;
    const rightWidth = doc.page.width - rightX - 50;

    const checkRightPageBreak = (heightNeeded) => {
        if (rightY + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            rightY = 50;
        }
    };

    // Left column
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('CONTACT', 50, yPos);

    let leftY = yPos + 25;
    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10);
    if (cv.personalInfo.email) { doc.text(cv.personalInfo.email, 50, leftY); leftY += 20; }
    if (cv.personalInfo.phone) { doc.text(cv.personalInfo.phone, 50, leftY); leftY += 20; }
    if (cv.personalInfo.location) { doc.text(cv.personalInfo.location, 50, leftY); leftY += 20; }

    leftY += 20;

    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('SKILLS', 50, leftY);

    leftY += 25;
    cv.analysis.detectedSkills.slice(0, 10).forEach(skill => {
        doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(`✓ ${skill}`, 50, leftY);
        leftY += 20;
    });

    if (cv.education && cv.education.length > 0) {
        leftY += 20;
        doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(12).text('EDUCATION', 50, leftY);
        leftY += 25;
        for (const edu of cv.education) {
            doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(10).text(edu.degree, 50, leftY);
            doc.fillColor(colors.textLight).font('Helvetica-Oblique').fontSize(9).text(edu.institution, 50, leftY + 14);
            leftY += 35;
        }
    }

    // Right column
    let rightY = yPos;

    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('PROFILE', rightX, rightY);

    rightY += 25;
    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(10)
        .text(cv.analysis.optimizedSummary, rightX, rightY, { width: rightWidth, align: 'justify', lineGap: 2 });

    rightY += doc.heightOfString(cv.analysis.optimizedSummary, { width: rightWidth, lineGap: 2 }) + 35;

    checkRightPageBreak(50);
    doc.fillColor(colors.primary)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('EXPERIENCE', rightX, rightY);

    rightY += 25;

    for (const exp of cv.analysis.optimizedExperience) {
        checkRightPageBreak(60);

        doc.fillColor(colors.secondary)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(exp.title, rightX, rightY);

        doc.fillColor(colors.textLight)
            .font('Helvetica-Oblique')
            .fontSize(10)
            .text(exp.company, rightX, rightY + 16);

        rightY += 35;

        for (const achievement of exp.achievements.slice(0, 4)) {
            const textHeight = doc.heightOfString(achievement, { width: rightWidth - 15, lineGap: 2 });
            checkRightPageBreak(textHeight + 10);

            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text('•', rightX + 5, rightY);
            doc.fillColor(colors.textLight)
                .font('Helvetica')
                .fontSize(10)
                .text(achievement, rightX + 15, rightY, { width: rightWidth - 15, lineGap: 2 });

            rightY += textHeight + 6;
        }
        rightY += 15;
    }
};

// Elegant Template (Two-column with dark sidebar)
const renderElegantTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#111827',
        secondary: '#dc2626',
        text: '#1f2937',
        textLight: '#6b7280',
        sidebarText: '#f9fafb'
    };

    const sidebarWidth = doc.page.width * 0.35;
    const rightX = sidebarWidth + 30;
    const rightWidth = doc.page.width - sidebarWidth - 60;

    const drawSidebarBg = () => {
        doc.rect(0, 0, sidebarWidth, doc.page.height).fill(colors.primary);
    };
    drawSidebarBg();

    let sidebarY = 50;

    doc.circle(sidebarWidth / 2, sidebarY + 40, 40).lineWidth(3).strokeColor(colors.secondary).stroke();
    const initials = (cv.personalInfo.name || 'YN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    doc.fillColor(colors.sidebarText).font('Helvetica-Bold').fontSize(24).text(initials, (sidebarWidth / 2) - 50, sidebarY + 28, { width: 100, align: 'center' });

    sidebarY += 100;

    doc.fillColor(colors.sidebarText).font('Helvetica-Bold').fontSize(12).text('CONTACT', 20, sidebarY);
    doc.moveTo(20, sidebarY + 18).lineTo(sidebarWidth - 20, sidebarY + 18).lineWidth(1).strokeColor(colors.secondary).stroke();

    sidebarY += 28;

    doc.font('Helvetica').fontSize(10).fillColor(colors.sidebarText);
    if (cv.personalInfo.phone) { doc.text(cv.personalInfo.phone, 20, sidebarY); sidebarY += 16; }
    if (cv.personalInfo.email) { doc.text(cv.personalInfo.email, 20, sidebarY); sidebarY += 16; }
    if (cv.personalInfo.location) { doc.text(cv.personalInfo.location, 20, sidebarY); sidebarY += 16; }

    sidebarY += 10;

    doc.font('Helvetica-Bold').fontSize(12).text('SKILLS', 20, sidebarY);
    doc.moveTo(20, sidebarY + 18).lineTo(sidebarWidth - 20, sidebarY + 18).strokeColor(colors.secondary).stroke();

    sidebarY += 28;

    doc.font('Helvetica').fontSize(10);
    cv.analysis.detectedSkills.slice(0, 10).forEach(skill => {
        doc.circle(25, sidebarY + 4, 2).fill(colors.secondary);
        doc.fillColor(colors.sidebarText).text(skill, 35, sidebarY);
        sidebarY += 16;
    });

    let mainY = 50;

    const checkMainPageBreak = (heightNeeded) => {
        if (mainY + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            drawSidebarBg();
            mainY = 50;
        }
    };

    const nameText = cv.personalInfo.name || 'Your Name';
    doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(28).text(nameText, rightX, mainY, { width: rightWidth });

    mainY += doc.heightOfString(nameText, { width: rightWidth, lineGap: 2 }) + 5;

    const titleText = cv.professionalTitle || (cv.analysis.optimizedSummary ? cv.analysis.optimizedSummary.split('.')[0] : 'Professional');
    doc.fillColor(colors.secondary).font('Helvetica-Bold').fontSize(14).text(titleText, rightX, mainY, { width: rightWidth });

    mainY += doc.heightOfString(titleText, { width: rightWidth, lineGap: 2 }) + 15;

    checkMainPageBreak(100);
    doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(12).text('ABOUT ME', rightX, mainY);
    doc.moveTo(rightX, mainY + 15).lineTo(doc.page.width - 30, mainY + 15).strokeColor(colors.textLight).stroke();

    mainY += 25;

    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(cv.analysis.optimizedSummary, rightX, mainY, { width: rightWidth, align: 'justify', lineGap: 2 });
    mainY += doc.heightOfString(cv.analysis.optimizedSummary, { width: rightWidth, lineGap: 2 }) + 30;

    checkMainPageBreak(50);
    doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(12).text('WORK EXPERIENCE', rightX, mainY);
    doc.moveTo(rightX, mainY + 15).lineTo(doc.page.width - 30, mainY + 15).strokeColor(colors.textLight).stroke();

    mainY += 25;

    if (cv.analysis.optimizedExperience && cv.analysis.optimizedExperience.length > 0) {
        for (const exp of cv.analysis.optimizedExperience) {
            checkMainPageBreak(60);

            doc.circle(rightX + 5, mainY + 5, 3).fill(colors.secondary);

            doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(11).text(exp.title, rightX + 15, mainY);
            doc.fillColor(colors.secondary).font('Helvetica-Bold').fontSize(10).text(exp.company, rightX + 15, mainY + 16);

            mainY += 35;

            if (exp.achievements && exp.achievements.length > 0) {
                for (const achievement of exp.achievements.slice(0, 4)) {
                    const textHeight = doc.heightOfString(achievement, { width: rightWidth - 15, lineGap: 2 });
                    checkMainPageBreak(textHeight + 10);

                    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text('•', rightX + 15, mainY);
                    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(achievement, rightX + 25, mainY, { width: rightWidth - 25, lineGap: 2 });
                    mainY += textHeight + 6;
                }
            }
            mainY += 15;
        }
    }

    if (cv.education && cv.education.length > 0) {
        checkMainPageBreak(60);
        doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(12).text('EDUCATION', rightX, mainY);
        doc.moveTo(rightX, mainY + 15).lineTo(doc.page.width - 30, mainY + 15).strokeColor(colors.textLight).stroke();

        mainY += 25;

        for (const edu of cv.education) {
            checkMainPageBreak(50);
            doc.circle(rightX + 5, mainY + 5, 3).fill(colors.secondary);

            doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(11).text(edu.degree, rightX + 15, mainY);
            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(edu.institution, rightX + 15, mainY + 16);

            mainY += 35;
        }
    }
};

// Academic Template
const renderAcademicTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#e5e7eb',
        secondary: '#4b5563',
        text: '#374151',
        textLight: '#6b7280'
    };

    const sidebarWidth = doc.page.width * 0.35;
    const rightX = sidebarWidth + 30;
    const rightWidth = doc.page.width - sidebarWidth - 60;

    // Header block
    doc.rect(0, 30, doc.page.width, 100).fill(colors.primary);

    // Name & Title
    const nameText = (cv.personalInfo.name || 'Your Name').toUpperCase();
    doc.fillColor(colors.text)
        .font('Helvetica-Bold')
        .fontSize(26)
        .text(nameText, 30, 50, { width: doc.page.width - 60, align: 'center' });

    const titleY = 50 + doc.heightOfString(nameText, { width: doc.page.width - 60, align: 'center' }) + 5;
    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(12)
        .text(cv.professionalTitle || 'Professional', 30, titleY, { width: doc.page.width - 60, align: 'center' });

    // Sidebar Content
    const drawSidebarBg = () => {
        doc.rect(0, 130, sidebarWidth, doc.page.height - 130).fill('#f3f4f6');
    };
    drawSidebarBg();

    let leftY = 160;
    doc.fillColor(colors.text)
        .font('Helvetica-Bold')
        .fontSize(11)
        .text('PROFILE', 30, leftY);

    leftY += 20;
    doc.fillColor(colors.textLight)
        .font('Helvetica')
        .fontSize(10)
        .text(cv.analysis.optimizedSummary, 30, leftY, { width: sidebarWidth - 50, align: 'justify', lineGap: 2 });

    leftY += doc.heightOfString(cv.analysis.optimizedSummary, { width: sidebarWidth - 50, lineGap: 2 }) + 30;

    doc.fillColor(colors.text)
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('CONTACT ME', 30, leftY);
    doc.moveTo(30, leftY + 18).lineTo(sidebarWidth - 30, leftY + 18).lineWidth(1).strokeColor(colors.primary).stroke();

    leftY += 28;
    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10);
    if (cv.personalInfo.phone) {
        doc.text(`Phone: ${cv.personalInfo.phone}`, 30, leftY);
        leftY += 16;
    }
    if (cv.personalInfo.email) {
        doc.text(`Email: ${cv.personalInfo.email}`, 30, leftY);
        leftY += 16;
    }
    if (cv.personalInfo.location) {
        doc.text(`Address: ${cv.personalInfo.location}`, 30, leftY);
        leftY += 16;
    }

    // Right Column
    let rightY = 160;

    const checkRightPageBreak = (heightNeeded) => {
        if (rightY + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            drawSidebarBg();
            rightY = 50;
        }
    };

    const drawHeading = (text, y) => {
        // Draw triangle
        doc.moveTo(rightX - 15, y + 2)
            .lineTo(rightX - 5, y + 6)
            .lineTo(rightX - 15, y + 10)
            .fill(colors.secondary);

        doc.fillColor(colors.text)
            .font('Helvetica-Bold')
            .fontSize(12)
            .text(text, rightX, y);
    };

    drawHeading('WORK EXPERIENCE', rightY);
    rightY += 25;

    for (const exp of cv.analysis.optimizedExperience) {
        checkRightPageBreak(60);

        doc.fillColor(colors.text)
            .font('Helvetica-Bold')
            .fontSize(11)
            .text(exp.company, rightX, rightY);

        doc.fillColor(colors.textLight)
            .font('Helvetica-Oblique')
            .fontSize(10)
            .text(exp.title, rightX, rightY + 16);

        rightY += 35;

        for (const ach of exp.achievements.slice(0, 4)) {
            const textHeight = doc.heightOfString(ach, { width: rightWidth - 15, lineGap: 2 });
            checkRightPageBreak(textHeight + 10);

            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text('•', rightX, rightY);
            doc.fillColor(colors.textLight)
                .font('Helvetica')
                .fontSize(10)
                .text(ach, rightX + 15, rightY, { width: rightWidth - 15, lineGap: 2 });
            rightY += textHeight + 6;
        }
        rightY += 15;
    }

    if (cv.education && cv.education.length > 0) {
        checkRightPageBreak(50);
        drawHeading('EDUCATION', rightY);
        rightY += 25;

        for (const edu of cv.education) {
            checkRightPageBreak(50);
            doc.fillColor(colors.text)
                .font('Helvetica-Bold')
                .fontSize(11)
                .text(edu.institution, rightX, rightY);

            doc.fillColor(colors.textLight)
                .font('Helvetica-Oblique')
                .fontSize(10)
                .text(edu.degree, rightX, rightY + 16);

            rightY += 40;
        }
    }

    checkRightPageBreak(50);
    drawHeading('SKILLS', rightY);
    rightY += 25;

    cv.analysis.detectedSkills.slice(0, 10).forEach(skill => {
        checkRightPageBreak(20);
        doc.fillColor(colors.textLight)
            .font('Helvetica')
            .fontSize(10)
            .text(`• ${skill}`, rightX, rightY);
        rightY += 16;
    });
};

// Corporate Template
const renderCorporateTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#3f3f46',
        secondary: '#71717a',
        text: '#27272a',
        textLight: '#52525b'
    };

    // Dark Header
    doc.rect(0, 0, doc.page.width, 140).fill(colors.primary);

    // Profile photo placeholder
    doc.circle(90, 70, 45).lineWidth(2).strokeColor('#ffffff').stroke();
    const initials = (cv.personalInfo.name || 'YN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(28).text(initials, 40, 56, { width: 100, align: 'center' });

    // Name & Title
    const nameText = cv.personalInfo.name || 'Your Name';
    doc.fillColor('#ffffff')
        .font('Helvetica-Bold')
        .fontSize(28)
        .text(nameText, 160, 50, { width: doc.page.width - 200 });

    const titleY = 50 + doc.heightOfString(nameText, { width: doc.page.width - 200 }) + 5;
    doc.font('Helvetica')
        .fontSize(12)
        .text(cv.professionalTitle || 'Professional', 160, titleY, { width: doc.page.width - 200 });

    // Columns
    const leftWidth = doc.page.width * 0.35;
    const rightX = leftWidth + 30;
    const rightWidth = doc.page.width - rightX - 30;

    // Left Column
    let leftY = 170;
    const drawLeftHeading = (text) => {
        doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(12).text(text, 40, leftY);
        doc.moveTo(40, leftY + 18).lineTo(leftWidth, leftY + 18).lineWidth(1).strokeColor(colors.secondary).stroke();
        leftY += 28;
    };

    drawLeftHeading('Contact');
    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10);
    if (cv.personalInfo.phone) { doc.text(`Phone: ${cv.personalInfo.phone}`, 40, leftY); leftY += 16; }
    if (cv.personalInfo.email) { doc.text(`Email: ${cv.personalInfo.email}`, 40, leftY); leftY += 16; }
    if (cv.personalInfo.location) { doc.text(`Address: ${cv.personalInfo.location}`, 40, leftY); leftY += 16; }
    leftY += 10;

    if (cv.education && cv.education.length > 0) {
        drawLeftHeading('Education');
        for (const edu of cv.education) {
            doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(10).text(edu.degree, 40, leftY);
            doc.fillColor(colors.textLight).font('Helvetica').fontSize(9).text(edu.institution, 40, leftY + 14);
            leftY += 28;
        }
    }

    drawLeftHeading('Skills');
    cv.analysis.detectedSkills.slice(0, 10).forEach(skill => {
        doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(`• ${skill}`, 40, leftY);
        leftY += 16;
    });

    // Right Column
    let rightY = 170;

    const checkRightPageBreak = (heightNeeded) => {
        if (rightY + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            rightY = 50;
        }
    };

    const drawRightHeading = (text) => {
        doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(12).text(text, rightX, rightY);
        doc.moveTo(rightX, rightY + 18).lineTo(doc.page.width - 40, rightY + 18).lineWidth(1).strokeColor(colors.secondary).stroke();
        rightY += 28;
    };

    drawRightHeading('About Me');
    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(cv.analysis.optimizedSummary, rightX, rightY, { width: rightWidth, align: 'justify', lineGap: 2 });
    rightY += doc.heightOfString(cv.analysis.optimizedSummary, { width: rightWidth, lineGap: 2 }) + 35;

    checkRightPageBreak(50);
    drawRightHeading('Experience');

    for (const exp of cv.analysis.optimizedExperience) {
        checkRightPageBreak(60);

        doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(11).text(exp.title, rightX, rightY);
        doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(exp.company, rightX, rightY + 16);
        rightY += 35;

        for (const ach of exp.achievements.slice(0, 4)) {
            const textHeight = doc.heightOfString(ach, { width: rightWidth - 15, lineGap: 2 });
            checkRightPageBreak(textHeight + 10);

            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text('•', rightX, rightY);
            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(ach, rightX + 15, rightY, { width: rightWidth - 15, lineGap: 2 });
            rightY += textHeight + 6;
        }
        rightY += 15;
    }
};

// Navy Template
const renderNavyTemplate = async (doc, cv, template) => {
    const colors = template.colors || {
        primary: '#1e3a8a',
        secondary: '#1e40af',
        text: '#1f2937',
        textLight: '#4b5563'
    };

    const sidebarWidth = doc.page.width * 0.35;
    const rightX = sidebarWidth + 30;
    const rightWidth = doc.page.width - sidebarWidth - 60;

    // Navy Header
    doc.rect(0, 0, doc.page.width, 160).fill(colors.primary);

    // Arch Photo placeholder
    doc.save();
    doc.roundedRect(40, 40, 100, 120, 50).clip();
    doc.rect(40, 40, 100, 120).fill('#e5e7eb');
    doc.restore();
    const initials = (cv.personalInfo.name || 'YN').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    doc.fillColor('#9ca3af').font('Helvetica-Bold').fontSize(28).text(initials, 40, 86, { width: 100, align: 'center' });

    // Name & Title
    const nameText = (cv.personalInfo.name || 'Your Name').toUpperCase();
    doc.fillColor('#ffffff')
        .font('Times-Bold')
        .fontSize(32)
        .text(nameText, 160, 60, { width: doc.page.width - 200 });

    const titleY = 60 + doc.heightOfString(nameText, { width: doc.page.width - 200 }) + 5;
    doc.font('Helvetica-Bold')
        .fontSize(12)
        .text(cv.professionalTitle || 'Professional', 160, titleY, { width: doc.page.width - 200 });

    const drawSidebarBg = () => {
        doc.rect(0, 160, sidebarWidth, doc.page.height - 160).fill('#f3f4f6');
    };
    drawSidebarBg();

    // Left Column
    let leftY = 190;
    const drawLeftHeading = (text) => {
        doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(12).text(text, 30, leftY);
        doc.moveTo(30, leftY + 18).lineTo(sidebarWidth - 30, leftY + 18).lineWidth(1).strokeColor(colors.primary).stroke();
        leftY += 28;
    };

    drawLeftHeading('Contact');
    doc.fillColor(colors.text).font('Helvetica').fontSize(10);
    if (cv.personalInfo.phone) { doc.text(`Phone: ${cv.personalInfo.phone}`, 30, leftY); leftY += 16; }
    if (cv.personalInfo.email) { doc.text(`Email: ${cv.personalInfo.email}`, 30, leftY); leftY += 16; }
    if (cv.personalInfo.location) { doc.text(`Loc: ${cv.personalInfo.location}`, 30, leftY); leftY += 16; }
    leftY += 10;

    if (cv.education && cv.education.length > 0) {
        drawLeftHeading('Education');
        for (const edu of cv.education) {
            doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(10).text(edu.institution, 30, leftY);
            doc.fillColor(colors.text).font('Helvetica').fontSize(9).text(edu.degree, 30, leftY + 14);
            leftY += 28;
        }
    }

    drawLeftHeading('Skills');
    cv.analysis.detectedSkills.slice(0, 10).forEach(skill => {
        doc.fillColor(colors.text).font('Helvetica').fontSize(10).text(`• ${skill}`, 30, leftY);
        leftY += 16;
    });

    // Right Column
    let rightY = 190;

    const checkRightPageBreak = (heightNeeded) => {
        if (rightY + heightNeeded > doc.page.height - 50) {
            doc.addPage();
            drawSidebarBg();
            rightY = 50;
        }
    };

    const drawRightHeading = (text) => {
        doc.fillColor(colors.primary).font('Helvetica-Bold').fontSize(14).text(text, rightX, rightY);
        doc.moveTo(rightX, rightY + 18).lineTo(doc.page.width - 30, rightY + 18).lineWidth(1).strokeColor(colors.primary).stroke();
        rightY += 28;
    };

    drawRightHeading('About Me');
    doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(cv.analysis.optimizedSummary, rightX, rightY, { width: rightWidth, align: 'justify', lineGap: 2 });
    rightY += doc.heightOfString(cv.analysis.optimizedSummary, { width: rightWidth, lineGap: 2 }) + 35;

    checkRightPageBreak(50);
    drawRightHeading('Work Experience');

    for (const exp of cv.analysis.optimizedExperience) {
        checkRightPageBreak(60);

        doc.fillColor(colors.text).font('Helvetica-Bold').fontSize(12).text(exp.title, rightX, rightY);
        doc.fillColor(colors.textLight).font('Helvetica-Bold').fontSize(10).text(exp.company, rightX, rightY + 16);
        rightY += 35;

        for (const ach of exp.achievements.slice(0, 4)) {
            const textHeight = doc.heightOfString(ach, { width: rightWidth - 15, lineGap: 2 });
            checkRightPageBreak(textHeight + 10);

            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text('•', rightX, rightY);
            doc.fillColor(colors.textLight).font('Helvetica').fontSize(10).text(ach, rightX + 15, rightY, { width: rightWidth - 15, lineGap: 2 });
            rightY += textHeight + 6;
        }
        rightY += 15;
    }
};

module.exports = { generatePDF };
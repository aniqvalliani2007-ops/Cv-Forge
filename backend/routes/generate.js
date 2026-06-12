const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { parseCVFile } = require('../utils/parseCV');
const { generateTailoredCV } = require('../utils/claudeApi');
const { getRandomTemplate, getTemplateById } = require('../utils/cvTemplates');

const router = express.Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Generate tailored CV endpoint with random unique design
router.post('/cv', upload.single('cv'), async (req, res) => {
    try {
        const { jobDescription, userId } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No CV file uploaded' });
        }

        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        // Check if user can generate (Bypassed temporarily for testing)
        // const { data: canGenerate, error: checkError } = await supabase
        //     .rpc('can_user_generate', { p_user_id: userId });

        // if (checkError || !canGenerate) {
        //     return res.status(403).json({ error: 'Generation limit reached. Please upgrade to premium.' });
        // }

        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        // Parse the uploaded CV
        console.log('Parsing CV file...');
        const parsedCV = await parseCVFile(filePath, fileType);

        // Get a RANDOM UNIQUE template for this user
        // This ensures every user gets a different style
        const randomTemplate = getRandomTemplate();
        console.log(`Selected template: ${randomTemplate.name} (${randomTemplate.id})`);

        // Generate tailored CV using AI with the random template
        console.log('Generating tailored CV with AI...');
        const tailoredCV = await generateTailoredCV(parsedCV, jobDescription, randomTemplate);

        const analysis = {
            atsScore: Number(tailoredCV.analysis?.atsScore ?? 0),
            keywordMatch: Number(tailoredCV.analysis?.keywordMatch ?? 0),
            detectedSkills: Array.isArray(tailoredCV.analysis?.detectedSkills) ? tailoredCV.analysis.detectedSkills : [],
            missingKeywords: Array.isArray(tailoredCV.analysis?.missingKeywords) ? tailoredCV.analysis.missingKeywords : [],
            optimizedSummary: tailoredCV.analysis?.optimizedSummary || '',
            optimizedExperience: Array.isArray(tailoredCV.analysis?.optimizedExperience) ? tailoredCV.analysis.optimizedExperience : []
        };

        // Generate PDF with unique design based on template
        const { generatePDF } = require('../pdf-generator');
        const pdfPath = await generatePDF(tailoredCV, randomTemplate, userId);
        const pdfFilename = path.basename(pdfPath);

        // Save to Supabase
        const { data: savedCV, error: saveError } = await supabase
            .rpc('save_generated_cv', {
                p_user_id: userId,
                p_original_filename: req.file.originalname,
                p_job_description: jobDescription,
                p_template_id: randomTemplate.id,
                p_tailored_cv_url: `/downloads/${pdfFilename}`,
                p_ats_score: analysis.atsScore,
                p_keyword_match: analysis.keywordMatch,
                p_detected_skills: analysis.detectedSkills,
                p_missing_keywords: analysis.missingKeywords
            });

        // Update user usage
        await supabase.rpc('update_user_usage_after_generation', { p_user_id: userId });

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: 'CV generated successfully',
            downloadUrl: `/downloads/${pdfFilename}`,
            templateUsed: randomTemplate,
            template: tailoredCV.template,
            cvId: savedCV,
            analysis,
            preview: tailoredCV.preview
        });

    } catch (error) {
        console.error('Generation error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
});

// Generate CV with specific template (for regeneration)
router.post('/cv-with-template', upload.single('cv'), async (req, res) => {
    try {
        const { jobDescription, templateId, userId } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No CV file uploaded' });
        }

        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        // Parse the uploaded CV
        const parsedCV = await parseCVFile(filePath, fileType);

        // Get specific template
        const template = getTemplateById(templateId);

        // Generate tailored CV using AI
        const tailoredCV = await generateTailoredCV(parsedCV, jobDescription, template);

        const analysis = {
            atsScore: Number(tailoredCV.analysis?.atsScore ?? 0),
            keywordMatch: Number(tailoredCV.analysis?.keywordMatch ?? 0),
            detectedSkills: Array.isArray(tailoredCV.analysis?.detectedSkills) ? tailoredCV.analysis.detectedSkills : [],
            missingKeywords: Array.isArray(tailoredCV.analysis?.missingKeywords) ? tailoredCV.analysis.missingKeywords : [],
            optimizedSummary: tailoredCV.analysis?.optimizedSummary || '',
            optimizedExperience: Array.isArray(tailoredCV.analysis?.optimizedExperience) ? tailoredCV.analysis.optimizedExperience : []
        };

        // Generate PDF
        const { generatePDF } = require('../pdf-generator');
        const pdfPath = await generatePDF(tailoredCV, template, userId);
        const pdfFilename = path.basename(pdfPath);

        // Save to Supabase
        await supabase.rpc('save_generated_cv', {
            p_user_id: userId,
            p_original_filename: req.file.originalname,
            p_job_description: jobDescription,
            p_template_id: template.id,
            p_tailored_cv_url: `/downloads/${pdfFilename}`,
            p_ats_score: analysis.atsScore,
            p_keyword_match: analysis.keywordMatch,
            p_detected_skills: analysis.detectedSkills,
            p_missing_keywords: analysis.missingKeywords
        });

        // Clean up
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            downloadUrl: `/downloads/${pdfFilename}`,
            templateUsed: template,
            template: tailoredCV.template,
            analysis
        });

    } catch (error) {
        console.error('Generation error:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
    }
});

// Get available templates
router.get('/templates', (req, res) => {
    const { getAllTemplates } = require('../utils/cvTemplates');
    const templates = getAllTemplates();
    res.json({ templates });
});

// Download CV
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../downloads', filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

module.exports = router;
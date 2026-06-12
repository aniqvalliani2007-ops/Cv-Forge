const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
const defaultBaseUrl = apiKey?.startsWith('sk-or-')
    ? 'https://openrouter.ai/api/v1'
    : 'https://api.openai.com/v1';

let baseUrl = process.env.OPENAI_BASE_URL;
if (baseUrl === 'https://openrouter.ai/v1') {
    baseUrl = 'https://openrouter.ai/api/v1';
}

const openai = new OpenAI({
    apiKey,
    baseURL: baseUrl || defaultBaseUrl
});

const modelName = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Generate tailored CV using AI
const generateTailoredCV = async (parsedCV, jobDescription, template) => {
    try {
        const prompt = `
      You are an expert resume writer and ATS optimization specialist. 
      
      ORIGINAL CV DATA:
      ${JSON.stringify(parsedCV, null, 2)}
      
      JOB DESCRIPTION:
      ${jobDescription}
      
      SELECTED TEMPLATE STYLE: ${template.name}
      Template Description: ${template.description}
      
      TASK: Create a tailored, ATS-optimized resume that matches the job description.
      
      Return a JSON object with the following structure:
      {
        "personalInfo": {
          "name": "string",
          "email": "string", 
          "phone": "string",
          "location": "string"
        },
        "professionalTitle": "string (tailored to job)",
        "analysis": {
          "atsScore": number (0-100),
          "keywordMatch": number (0-100),
          "detectedSkills": ["skill1", "skill2"],
          "missingKeywords": ["keyword1", "keyword2"],
          "optimizedSummary": "string (200-300 chars, tailored to job)",
          "optimizedExperience": [
            {
              "title": "string",
              "company": "string",
              "achievements": ["achievement1", "achievement2"]
            }
          ]
        },
        "education": [
          {
            "degree": "string",
            "institution": "string"
          }
        ],
        "skills": ["skill1", "skill2"],
        "certifications": ["cert1", "cert2"],
        "preview": {
          "firstName": "string",
          "lastName": "string",
          "jobTitle": "string",
          "summary": "string (short version)",
          "topSkills": ["skill1", "skill2", "skill3"]
        }
      }
      
      IMPORTANT GUIDELINES:
      1. Achievements should be quantifiable with metrics when possible
      2. Use keywords from the job description naturally
      3. Keep formatting clean and professional
      4. ATS score should be realistic based on keyword matching
    `;

        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const tailoredCV = JSON.parse(response.choices[0].message.content);

        // Add template information
        tailoredCV.template = {
            id: template.id,
            name: template.name,
            style: template.style
        };

        return tailoredCV;

    } catch (error) {
        console.error('AI generation error:', error);
        throw new Error('Failed to generate tailored CV: ' + error.message);
    }
};

module.exports = { generateTailoredCV };
// src/utils/openrouterApi.js
// Calls OpenRouter API directly from the browser

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini';

export const generateTailoredCV = async (parsedCV, jobDescription, template) => {
  const prompt = `You are an expert resume writer and ATS optimization specialist.

ORIGINAL CV DATA:
${JSON.stringify(parsedCV, null, 2)}

JOB DESCRIPTION:
${jobDescription}

SELECTED TEMPLATE STYLE: ${template.name}
Template Description: ${template.description}

TASK: Create a tailored, ATS-optimized resume that matches the job description.

Return a JSON object with EXACTLY this structure:
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
  "certifications": ["cert1"],
  "preview": {
    "firstName": "string",
    "lastName": "string",
    "jobTitle": "string",
    "summary": "string",
    "topSkills": ["skill1", "skill2", "skill3"]
  }
}

IMPORTANT:
1. Use keywords from the job description naturally
2. Achievements should be quantifiable with metrics when possible
3. ATS score should be realistic based on keyword matching
4. Keep all original personal info (name, email, phone)`;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'CVForge'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  const tailoredCV = JSON.parse(content);
  tailoredCV.template = { id: template.id, name: template.name, style: template.style };
  return tailoredCV;
};

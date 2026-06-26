// src/utils/openrouterApi.js
// Calls OpenRouter API directly from the browser with free model fallback

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

// List of free models to try in order
const FREE_MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-7b-it:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'qwen/qwen-2-7b-instruct:free',
  'huggingfaceh4/zephyr-7b-beta:free',
  'openchat/openchat-7b:free',
  'nousresearch/nous-capybara-7b:free',
  'gryphe/mythomist-7b:free',
  'undi95/toppy-m-7b:free'
];

const callOpenRouter = async (model, prompt) => {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'CVForge'
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  return response.json();
};

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

  // Try the configured model first
  let lastError = null;
  let modelsToTry = [MODEL, ...FREE_MODELS.filter(m => m !== MODEL)];

  for (const model of modelsToTry) {
    try {
      console.log(`Trying model: ${model}`);
      const data = await callOpenRouter(model, prompt);
      
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      const tailoredCV = JSON.parse(content);
      tailoredCV.template = { id: template.id, name: template.name, style: template.style };
      
      console.log(`✅ Success with model: ${model}`);
      return tailoredCV;
    } catch (error) {
      console.warn(`❌ Model ${model} failed:`, error.message);
      lastError = error;
      
      // If it's a credits/auth issue, try next model
      if (error.message.includes('credits') || 
          error.message.includes('endpoints') || 
          error.message.includes('afford') ||
          error.message.includes('rate limit')) {
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }

  // If all models failed
  throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

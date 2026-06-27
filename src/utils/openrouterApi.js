// src/utils/openrouterApi.js
// Calls OpenRouter API directly from the browser

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Use the cheapest PAID models that actually work (free tier is broken)
// These cost almost nothing: ~$0.01 per CV generation
const WORKING_MODELS = [
  'google/gemini-flash-1.5',           // $0.075/1M tokens - VERY CHEAP
  'openai/gpt-4o-mini',                // $0.15/1M tokens  
  'meta-llama/llama-3.1-8b-instruct',  // $0.05/1M tokens - CHEAPEST
  'anthropic/claude-3-haiku',          // $0.25/1M tokens
];

const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemini-flash-1.5';

const callOpenRouter = async (model, prompt) => {
  console.log(`🔄 Calling OpenRouter with model: ${model}`);
  
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
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('❌ OpenRouter API Error:', data);
    throw new Error(data.error?.message || `API error: ${response.status} - ${JSON.stringify(data)}`);
  }

  return data;
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

Return ONLY a valid JSON object with EXACTLY this structure (no markdown, no extra text):
{
  "personalInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string"
  },
  "professionalTitle": "string (tailored to job)",
  "analysis": {
    "atsScore": 85,
    "keywordMatch": 78,
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
4. Keep all original personal info (name, email, phone)
5. Return ONLY valid JSON, no markdown code blocks`;

  console.log('🚀 Starting CV generation...');
  console.log('📋 Parsed CV:', parsedCV);
  console.log('📄 Job description length:', jobDescription.length);
  console.log('🔑 API Key present:', !!OPENROUTER_API_KEY);

  let lastError = null;
  const modelsToTry = [MODEL, ...WORKING_MODELS.filter(m => m !== MODEL)];

  for (const model of modelsToTry) {
    try {
      console.log(`\n🔄 Trying model: ${model}`);
      const data = await callOpenRouter(model, prompt);
      
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('❌ No content in response:', data);
        throw new Error('No response from AI');
      }

      console.log('📦 Raw AI response (first 200 chars):', content.substring(0, 200));

      // Clean the response (remove markdown if present)
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\n?/g, '');
      }

      const tailoredCV = JSON.parse(cleanContent);
      tailoredCV.template = { id: template.id, name: template.name, style: template.style };
      
      console.log(`✅ SUCCESS with model: ${model}`);
      console.log('📊 Generated CV:', tailoredCV);
      return tailoredCV;
      
    } catch (error) {
      console.error(`\n❌ Model ${model} FAILED:`, error.message);
      console.error('Full error:', error);
      lastError = error;
      
      const errorMsg = error.message.toLowerCase();
      
      // Check specific error types
      if (errorMsg.includes('credits') || errorMsg.includes('insufficient')) {
        console.error('💰 NO CREDITS - Add credits at: https://openrouter.ai/settings/credits');
        throw new Error('No credits available. Please add credits to your OpenRouter account at: https://openrouter.ai/settings/credits');
      }
      
      if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
        console.warn('⏱️ Rate limited, trying next model...');
        continue;
      }
      
      if (errorMsg.includes('instantiation') || errorMsg.includes('not found')) {
        console.warn('🚫 Model not available, trying next...');
        continue;
      }
      
      if (errorMsg.includes('json')) {
        console.warn('📝 JSON parse failed, trying next model...');
        continue;
      }
      
      // Unknown error - try next model
      console.warn('⚠️ Unknown error, trying next model...');
      continue;
    }
  }

  // All models failed
  const finalError = `All models failed. OpenRouter's free tier is unavailable. Please add $5 to your account at https://openrouter.ai/settings/credits\n\nLast error: ${lastError?.message || 'Unknown'}`;
  console.error('❌ FINAL ERROR:', finalError);
  throw new Error(finalError);
};

// src/utils/openrouterApi.js
// Calls OpenRouter API directly from the browser with free model fallback + mock mode

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

// Enable mock mode if all APIs fail (for demo/urgent situations)
const ENABLE_MOCK_FALLBACK = false; // DISABLED - Only use real API

// List of models to try in order - FREE models that work (January 2025)
const FREE_MODELS = [
  'google/gemini-2.0-flash-exp:free',      // Google's latest free model
  'google/gemini-flash-1.5-8b:free',       // Smaller Gemini
  'mistralai/mistral-small:free',          // Mistral's free tier
  'meta-llama/llama-3.2-3b-instruct:free', // Meta Llama 3.2
  'meta-llama/llama-3.2-1b-instruct:free', // Smaller Llama
  'google/gemma-2-9b-it:free',             // Google Gemma
  'microsoft/phi-3-mini-128k-instruct:free', // Microsoft Phi
  'qwen/qwen-2-7b-instruct:free',          // Alibaba Qwen
];

// Paid models as backup (very cheap)
const PAID_MODELS = [
  'openai/gpt-4o-mini',           // $0.15/1M tokens
  'google/gemini-flash-1.5',      // $0.075/1M tokens
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
      temperature: 0.7,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  return response.json();
};

// Mock CV generator for when all APIs fail
const generateMockTailoredCV = (parsedCV, jobDescription, template) => {
  console.log('🎭 Using MOCK mode - generating demo CV');
  
  const keywords = extractKeywords(jobDescription);
  const skills = parsedCV.skills?.length > 0 ? parsedCV.skills : ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'];
  
  return {
    personalInfo: parsedCV.personalInfo || {
      name: parsedCV.personalInfo?.name || 'John Doe',
      email: parsedCV.personalInfo?.email || 'john@example.com',
      phone: parsedCV.personalInfo?.phone || '+1234567890',
      location: parsedCV.personalInfo?.location || 'New York, USA'
    },
    professionalTitle: determineProfessionalTitle(jobDescription, parsedCV),
    analysis: {
      atsScore: Math.floor(Math.random() * 15) + 80, // 80-95
      keywordMatch: Math.floor(Math.random() * 20) + 75, // 75-95
      detectedSkills: skills.slice(0, 8),
      missingKeywords: keywords.slice(0, 3),
      optimizedSummary: generateOptimizedSummary(parsedCV, jobDescription),
      optimizedExperience: optimizeExperience(parsedCV.experience || [], jobDescription)
    },
    education: parsedCV.education || [{
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology'
    }],
    skills: skills,
    certifications: parsedCV.certifications || [],
    preview: {
      firstName: parsedCV.personalInfo?.name?.split(' ')[0] || 'John',
      lastName: parsedCV.personalInfo?.name?.split(' ').slice(1).join(' ') || 'Doe',
      jobTitle: determineProfessionalTitle(jobDescription, parsedCV),
      summary: generateOptimizedSummary(parsedCV, jobDescription),
      topSkills: skills.slice(0, 5)
    }
  };
};

const extractKeywords = (text) => {
  const common = ['experience', 'strong', 'excellent', 'good', 'required', 'preferred', 'knowledge'];
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const freq = {};
  words.forEach(w => {
    if (!common.includes(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

const determineProfessionalTitle = (jobDescription, parsedCV) => {
  const jobTitles = ['Software Engineer', 'Full Stack Developer', 'Frontend Developer', 
                     'Backend Developer', 'DevOps Engineer', 'Data Engineer', 'Product Manager'];
  
  for (const title of jobTitles) {
    if (jobDescription.toLowerCase().includes(title.toLowerCase())) {
      return title;
    }
  }
  
  if (parsedCV.experience?.[0]?.title) {
    return parsedCV.experience[0].title;
  }
  
  return 'Software Engineer';
};

const generateOptimizedSummary = (parsedCV, jobDescription) => {
  const title = determineProfessionalTitle(jobDescription, parsedCV);
  const experience = parsedCV.experience?.length || 0;
  const skills = parsedCV.skills?.slice(0, 3).join(', ') || 'various technologies';
  
  return `Experienced ${title} with ${experience > 0 ? experience + '+ years' : 'proven expertise'} in ${skills}. Passionate about delivering high-quality solutions and driving technical excellence. Strong problem-solving abilities and collaborative team player.`;
};

const optimizeExperience = (experiences, jobDescription) => {
  if (!experiences || experiences.length === 0) {
    return [{
      title: 'Software Engineer',
      company: 'Tech Company',
      achievements: [
        'Developed and maintained scalable web applications',
        'Collaborated with cross-functional teams to deliver projects',
        'Improved system performance by 40% through optimization'
      ]
    }];
  }
  
  return experiences.slice(0, 3).map(exp => ({
    title: exp.title || 'Position',
    company: exp.company || 'Company',
    achievements: exp.achievements?.length > 0 
      ? exp.achievements.map(a => enhanceAchievement(a, jobDescription))
      : ['Delivered high-quality work and exceeded expectations']
  }));
};

const enhanceAchievement = (achievement, jobDescription) => {
  if (achievement.match(/\d+%|\$\d+|\d+ users/)) {
    return achievement; // Already has metrics
  }
  
  const metrics = ['30%', '50%', '2x', '40%'];
  const metric = metrics[Math.floor(Math.random() * metrics.length)];
  
  if (achievement.length < 60) {
    return `${achievement}, improving efficiency by ${metric}`;
  }
  
  return achievement;
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

  // Try FREE models first, then paid as backup
  let lastError = null;
  let modelsToTry = [MODEL, ...FREE_MODELS.filter(m => m !== MODEL), ...PAID_MODELS];

  console.log('🚀 Starting CV generation with fallback models...');
  console.log('📋 Parsed CV data:', parsedCV);
  console.log('📄 Job description length:', jobDescription.length);

  for (const model of modelsToTry) {
    try {
      console.log(`🔄 Trying model: ${model}`);
      const data = await callOpenRouter(model, prompt);
      
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      console.log('📦 Raw AI response:', content.substring(0, 200) + '...');

      // Clean the response (remove markdown if present)
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\n?/g, '');
      }

      const tailoredCV = JSON.parse(cleanContent);
      tailoredCV.template = { id: template.id, name: template.name, style: template.style };
      
      console.log(`✅ Success with model: ${model}`);
      console.log('📊 Generated CV data:', tailoredCV);
      return tailoredCV;
    } catch (error) {
      console.warn(`❌ Model ${model} failed:`, error.message);
      lastError = error;
      
      // Show user-friendly error in UI
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
        console.warn(`⏱️ Rate limited on ${model}, trying next model...`);
      } else if (errorMsg.includes('credits') || errorMsg.includes('afford')) {
        console.warn(`💰 No credits for ${model}, trying next model...`);
      } else if (errorMsg.includes('unavailable') || errorMsg.includes('endpoints')) {
        console.warn(`🚫 ${model} unavailable, trying next model...`);
      } else {
        console.warn(`⚠️ ${model} error: ${error.message}`);
      }
      
      // If it's a credits/auth/availability issue, try next model
      if (errorMsg.includes('credits') || 
          errorMsg.includes('endpoints') || 
          errorMsg.includes('afford') ||
          errorMsg.includes('unavailable') ||
          errorMsg.includes('rate limit') ||
          errorMsg.includes('429') ||
          errorMsg.includes('not available')) {
        continue;
      }
      
      // For JSON parsing errors, try next model
      if (error.message.includes('JSON')) {
        console.warn('📝 JSON parsing failed, trying next model...');
        continue;
      }
      
      // For other errors, throw immediately
      if (!ENABLE_MOCK_FALLBACK) {
        throw error;
      }
    }
  }

  // If all models failed and mock mode is enabled
  if (ENABLE_MOCK_FALLBACK) {
    console.warn('⚠️ All API models failed, using MOCK mode');
    const mockCV = generateMockTailoredCV(parsedCV, jobDescription, template);
    mockCV.template = { id: template.id, name: template.name, style: template.style };
    return mockCV;
  }

  // If all models failed
  throw new Error(`All free models failed. Please add credits to your OpenRouter account or try again later. Last error: ${lastError?.message || 'Unknown error'}`);
};

const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// ── 1. MOCK INTERVIEW SCHEMAS ──
const mockQuestionSchema = z.object({
  question: z
    .string()
    .describe("The next single interview question to ask the candidate."),
});

const answerEvaluationSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Score for this answer (0-100) based on accuracy, depth, and relevance.",
    ),
  feedback: z
    .string()
    .describe(
      "Constructive, short feedback highlighting strengths and key improvement areas.",
    ),
});

const sessionFeedbackSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall average score across all answers (0-100)."),
  feedbackReport: z
    .string()
    .describe(
      "A detailed summary review explaining how they did and next steps for learning.",
    ),
});

// ── 2. RESUME INTELLIGENCE SCHEMA ──
const resumeAnalysisSchema = z.object({
  atsScore: z.number().min(0).max(100).describe("ATS score from 0 to 100."),
  formattingProblems: z
    .array(z.string())
    .describe("Formatting, section titles, layout issues."),
  missingKeywords: z
    .array(z.string())
    .describe(
      "Important keywords or skills missing from the resume relative to the job description.",
    ),
  weakBulletPoints: z
    .array(
      z.object({
        before: z.string().describe("Original bullet point"),
        after: z
          .string()
          .describe(
            "Action-oriented, metrics-focused replacement bullet point",
          ),
      }),
    )
    .describe(
      "Original bullet points and suggestions to rewrite them with metrics and impact.",
    ),
  experienceQualityReport: z
    .string()
    .describe("General overview of formatting and content quality."),
});

// ── 3. LINKEDIN ANALYSIS SCHEMA ──
const linkedinAnalysisSchema = z.object({
  headlineSuggestions: z
    .array(z.string())
    .describe("3 search-optimized headlines incorporating target keywords."),
  aboutSuggestions: z
    .string()
    .describe(
      "A professional, high-impact Summary / About section for the profile.",
    ),
  experienceSuggestions: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      suggestions: z
        .string()
        .describe("Specific tips to enhance this specific experience section."),
    }),
  ),
});

// ── 4. ROADMAP SCHEMA ──
const adaptiveRoadmapSchema = z.object({
  weeks: z.array(
    z.object({
      weekNumber: z.number(),
      focus: z
        .string()
        .describe("The core technical or conceptual focus of this week."),
      tasks: z
        .array(z.string())
        .describe("Actions, labs, coding practices, or reading tasks."),
    }),
  ),
});

// ── 5. CAREER ASSISTANT CHAT SCHEMA ──
const careerAssistantSchema = z.object({
  response: z
    .string()
    .describe(
      "Comprehensive career advice. Reference the user's details if relevant.",
    ),
});

// ── SERVICE IMPLEMENTATIONS ──

/**
 * Robust retry helper with exponential backoff for Gemini API requests
 */
async function callGeminiWithRetry(fn, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(
        `Gemini call failed (attempt ${i + 1}/${retries}). Retrying in ${delay}ms...`,
        err.message || err,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

/**
 * Generate a dynamic mock interview question
 */
async function generateMockQuestion({
  role,
  experienceLevel,
  interviewType,
  chatHistory,
}) {
  let historyPrompt = "";
  if (chatHistory && chatHistory.length > 0) {
    historyPrompt = chatHistory
      .map(
        (msg) =>
          `${msg.role === "interviewer" ? "Interviewer" : "Candidate"}: ${msg.content}`,
      )
      .join("\n");
  }

  const prompt = `You are a professional hiring manager conducting a mock interview.
Role: ${role}
Experience Level: ${experienceLevel}
Interview Type: ${interviewType} (Technical, Behavioral, System Design, HR)

Here is the conversation history so far:
${historyPrompt}

Generate the next single interview question to ask the candidate. Keep it relevant, realistic, and adaptive based on their previous answers. Avoid asking questions already asked.`;

  try {
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: zodToJsonSchema(mockQuestionSchema),
        },
      }),
    );
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini API generateMockQuestion failed:", err);
    throw err;
  }
}

/**
 * Evaluate a single answer in a mock session
 */
async function evaluateAnswer({ question, answer }) {
  const prompt = `You are an expert technical recruiter. Evaluate the following candidate answer.
Question: ${question}
Candidate's Answer: ${answer}

Grade the answer out of 100. Be honest and constructive. Explain what parts were good, and what was missing.`;

  try {
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: zodToJsonSchema(answerEvaluationSchema),
        },
      }),
    );
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini API evaluateAnswer failed:", err);
    throw err;
  }
}

/**
 * Compile session scores and feedback
 */
async function generateSessionSummary({ role, interviewType, chatHistory }) {
  const historyText = chatHistory
    .map(
      (h) =>
        `${h.role === "interviewer" ? "Q" : "A"}: ${h.content} (Eval Score: ${h.evaluation?.score || "N/A"})`,
    )
    .join("\n");

  const prompt = `Summarize this mock interview session:
Role: ${role}
Interview Type: ${interviewType}
History & Grades:
${historyText}

Calculate the final overallScore (0-100) and generate a comprehensive feedbackReport detailing strengths, weaknesses, and structured tips for improvement.`;

  try {
    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: zodToJsonSchema(sessionFeedbackSchema),
        },
      }),
    );
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini API generateSessionSummary failed:", err);
    throw err;
  }
}

/**
 * Full resume ATS scanning and quality audit
 */
async function analyzeResume({ resumeText, jobDescription }) {
  const prompt = `Analyze the candidate's resume text against the target job description.
Resume Content:
${resumeText}

Target Job Description:
${jobDescription}

Perform a full audit:
1. ATS Score (0-100)
2. Formatting and design problems (missing contact details, bad sections)
3. Essential missing technical/behavioral keywords from the job description
4. Weak resume bullet points and provide strong, action-oriented, metrics-driven rewrites ("Before/After" format)
5. General experience quality review`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumeAnalysisSchema),
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini API analyzeResume failed:", err);
    throw err;
  }
}

/**
 * LinkedIn profile optimization suggestions
 */
async function analyzeLinkedIn({ profileText }) {
  const prompt = `Optimize the following LinkedIn profile details:
${profileText}

Generate:
1. 3 high-impact, search-optimized headlines.
2. An engaging, storytelling 'About' section layout.
3. Specific recommendations to optimize current work experiences.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(linkedinAnalysisSchema),
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini API analyzeLinkedIn failed:", err);
    throw err;
  }
}

/**
 * Generate a dynamic day-by-day or week-by-week learning roadmap
 */
async function generateAdaptiveRoadmap({
  targetRole,
  currentSkills,
  missingSkills,
  availableWeeks,
}) {
  const prompt = `Generate a personalized learning roadmap.
Target Role: ${targetRole}
Current Skills: ${currentSkills}
Missing Skills: ${missingSkills}
Available Time: ${availableWeeks} Weeks

Create a week-by-week plan detailing:
1. Core technical focus of each week
2. Actions, practical assignments, and study tasks to master the concepts`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(adaptiveRoadmapSchema),
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini API generateAdaptiveRoadmap failed:", err);
    throw err;
  }
}

/**
 * Contextual Career Coach chatbot
 */
async function chatCareerAssistant({
  message,
  chatHistory,
  resumeText,
  targetRole,
  skillGaps,
  resumeHistory,
}) {
  const historyPrompt = chatHistory
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
    )
    .join("\n");

  const prompt = `You are MockMate's official AI Career Coach.
Candidate Resume Context: ${resumeText || "None uploaded"}
Target Role: ${targetRole || "Not specified"}
Lacking Skills: ${skillGaps ? JSON.stringify(skillGaps) : "Not specified"}
Resume History: ${resumeHistory && resumeHistory.length ? resumeHistory.map((report) => `v${report.versionLabel || "1"} (${report.atsScore} ATS, ${report.sourceType || "pdf"})`).join(", ") : "None"}

Conversation History:
${historyPrompt}

User asks: "${message}"

Formulate a helpful, encouraging, and highly specific answer. Recommend actionable tasks, tech stacks, or roadmap steps. Keep it professional.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(careerAssistantSchema),
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    console.error("Gemini API chatCareerAssistant failed:", err);
    throw err;
  }
}

module.exports = {
  generateMockQuestion,
  evaluateAnswer,
  generateSessionSummary,
  analyzeResume,
  analyzeLinkedIn,
  generateAdaptiveRoadmap,
  chatCareerAssistant,
};

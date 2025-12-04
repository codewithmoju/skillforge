import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { topic, answers, difficulty, persona } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { checkRateLimit } = await import("@/lib/services/rateLimit");
    const rateLimitResult = await checkRateLimit(ip, "AI_GENERATION");

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      );
    }

    // Use gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct personalization context
    const personalizationContext = `
    USER CONTEXT:
    - Difficulty Level: ${difficulty?.level || "Beginner"} (${difficulty?.description || "Standard"})
    - Persona/Tone: ${persona?.name || "Standard Mentor"} (${persona?.description || "Helpful"})
    - Specific Goals/Answers: ${JSON.stringify(answers || [])}
    `;

    // PHASE 1: Generate lightweight skeleton only (fast, ~5 seconds)
    const skeletonPrompt = `
Create a LEARNING GUIDE SKELETON for: "${topic}"

${personalizationContext}

PURPOSE: This is a "ZERO TO HERO" ROADMAP showing the complete path from absolute beginner to world-class expert.
It must be a GUIDE showing WHAT to learn - NOT teaching material.
The content must be tailored to the USER CONTEXT above.

CRITICAL: Return ONLY valid JSON. NO markdown, NO code blocks, NO quotes in text.

{
  "goal": "${topic}",
  "overview": "What mastering this skill means (1 sentence)",
  "estimatedDuration": "Total time needed (e.g. '6-8 months')",
  "difficultyLevel": "${difficulty?.level || "Beginner"}",
  "theme": {
    "primary": "#hexcode (Main brand color, e.g. #F7DF1E for JS)",
    "secondary": "#hexcode (Complementary color)",
    "accent": "#hexcode (Highlight color)"
  },
  "prerequisites": [
    {
      "name": "Prerequisite skill",
      "reason": "Why you need this first"
    }
  ],
  "learningAreas": [
    {
      "id": "area_1",
      "name": "1. Foundations & Basics",
      "order": 1,
      "why": "Building the bedrock",
      "estimatedDuration": "Time to master",
      "difficulty": "Beginner",
      "topics": [
        {
          "id": "topic_1",
          "name": "Topic Name",
          "why": "Why this matters",
          "estimatedTime": "Time",
          "difficulty": "Beginner",
          "subtopics": [
            {
              "id": "sub_1",
              "name": "Specific Term/Concept",
              "why": "Importance"
            }
          ]
        }
      ]
    }
  ],
  "learningPath": ["Foundations", "Core Concepts", "Intermediate", "Advanced", "Mastery"]
}

REQUIREMENTS:
1. STRICTLY follow this 5-stage structure for "learningAreas":
   - Area 1: Foundations & Basics (Absolute zero, setup, syntax)
   - Area 2: Core Concepts & Standard Library (Competence)
   - Area 3: Intermediate Skills, Patterns & Tooling (Proficiency)
   - Area 4: Advanced Mastery, Internals & Performance (Expertise)
   - Area 5: Specialized Applications & Niche Edge Cases (Mastery)
2. 4-6 topics per area
3. 3-5 subtopics per topic (specific terms/concepts)
4. This is a GUIDE - list WHAT to learn.
5. Focus on terms, concepts, skills to master.
6. Keep text SHORT and clear.
7. NO quotes or apostrophes in text.
8. GENERATE A THEME: Pick valid hex codes that match the topic's brand identity.
9. ADAPT TO PERSONA: If the persona is "Hacker", use practical terms. If "Professor", use academic terms.

Return ONLY the JSON skeleton.
    `;

    const result = await model.generateContent(skeletonPrompt);
    const response = await result.response;
    const text = response.text();

    // Comprehensive JSON cleanup
    let jsonStr = text.trim();

    // Remove markdown code blocks
    jsonStr = jsonStr.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    // Remove any text before the first { and after the last }
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    // Fix common JSON errors
    jsonStr = jsonStr
      .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\r/g, "") // Remove carriage returns
      .replace(/\t/g, " ") // Replace tabs with spaces
      .replace(/\s+/g, " "); // Normalize whitespace

    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Attempted to parse:", jsonStr.substring(0, 500));
      throw new Error(`Invalid JSON from AI: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
    }

    return NextResponse.json({
      goal: data.goal,
      theme: data.theme,
      prerequisites: data.prerequisites,
      learningAreas: data.learningAreas,
      learningPath: data.learningPath
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json({
      error: "Failed to generate roadmap",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { topic, moduleTitle, lessonTitle, userLevel } = await req.json();

    if (!topic || !lessonTitle) {
      return NextResponse.json({ error: "Topic and lesson title are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a master game designer and tech mentor creating an EPIC learning mission. Your goal is to make learning feel like an adventure, not a chore.

Create a gamified, highly engaging lesson for:
🎯 Topic: "${topic}"
📦 Module: "${moduleTitle}"
🚀 Mission: "${lessonTitle}"
👤 Learner Level: ${userLevel || "Beginner"}

CRITICAL: Make this FUN and ENGAGING. Use analogies, real-world examples, and exciting language.

Return ONLY valid JSON with this EXACT structure:

{
  "title": "${lessonTitle}",
  "missionBriefing": "A short, exciting intro (2-3 sentences) that hooks the learner. Use phrases like 'Your mission...' or 'Imagine you're...' Make it feel like a quest!",
  "realWorldAnalogy": {
    "title": "The 'Aha!' Moment",
    "analogy": "A creative, relatable analogy that explains the concept in everyday terms. Example: 'Variables are like labeled boxes in a warehouse...'",
    "connection": "How this analogy connects to the actual technical concept (1-2 sentences)"
  },
  "powerUps": [
    "Key concept 1 - explained simply with an emoji",
    "Key concept 2 - explained simply with an emoji",
    "Key concept 3 - explained simply with an emoji"
  ],
  "interactiveDemo": {
    "title": "Hands-On Challenge",
    "description": "Brief setup for the code example (what we're building)",
    "code": "A practical, runnable code snippet with comments",
    "explanation": "Step-by-step breakdown of what the code does and WHY it matters"
  },
  "bossChallenge": {
    "question": "A challenging but fair quiz question that tests understanding",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why the correct answer is right AND why the others are wrong. Make it educational!"
  },
  "victoryRewards": [
    "What the learner can now do after completing this lesson",
    "A practical skill they've unlocked",
    "How this connects to their bigger learning journey"
  ]
}

REMEMBER:
- Use emojis sparingly but effectively
- Keep language exciting but professional
- Focus on PRACTICAL, REAL-WORLD applications
- Make analogies creative and memorable
- Code examples should be RUNNABLE and USEFUL
        `;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const lessonContent = JSON.parse(jsonStr);

    return NextResponse.json({ content: lessonContent });
  } catch (error) {
    console.error("Error generating lesson content:", error);
    return NextResponse.json({
      error: "Failed to generate lesson content",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

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
Create a comprehensive, engaging, and interactive educational lesson for:
Topic: "${topic}"
Module: "${moduleTitle}"
Lesson: "${lessonTitle}"
Learner Level: ${userLevel || "Beginner"}

The content should be structured as a JSON object with the following sections:

1. **Introduction**: Hook the learner, explain the 'why', and give a real-world analogy.
2. **Core Concept**: Deep dive into the theory with clear explanations.
3. **Interactive Examples**: Provide 2-3 code snippets or practical examples.
4. **Key Takeaways**: Bullet points of what to remember.
5. **Mini Quiz**: A simple 1-question quiz to test understanding (question, options, correct answer index, explanation).

Return ONLY valid JSON with this structure:
{
  "title": "${lessonTitle}",
  "introduction": "...",
  "content": "markdown string with headers, code blocks, and bold text...",
  "examples": [
    { "title": "Example 1", "code": "...", "explanation": "..." }
  ],
  "quiz": {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "..."
  }
}
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

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { topic, level, answers, difficulty, persona, userId } = await req.json(); // Expect userId from client

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const personalizationContext = `
        USER CONTEXT:
        - Difficulty Level: ${difficulty?.level || level || "Beginner"} (${difficulty?.description || "Standard"})
        - Persona/Tone: ${persona?.name || "Standard Instructor"} (${persona?.description || "Professional"})
        - Specific Goals/Answers: ${JSON.stringify(answers || [])}
        `;

        const prompt = `
        You are a world-class technical curriculum designer.
        Create a comprehensive, granular course syllabus for:
        Topic: "${topic}"
        
        ${personalizationContext}

        The course should be structured for "Atomic Learning" - breaking complex topics into small, digestible lessons.
        Avoid broad lessons like "Basics". Instead, use specific titles like "Your First Variable", "Understanding Loops", etc.
        
        If the persona is "Hacker", use practical, project-based titles.
        If the persona is "Professor", use academic, theoretical titles.

        Return ONLY valid JSON with this structure. DO NOT wrap the JSON in markdown code blocks (e.g. \`\`\`json ... \`\`\`). Return raw JSON only.
        {
            "title": "Course Title",
            "description": "A compelling description of what the user will learn.",
            "theme": {
                "primary": "#hexcode", // DOMINANT BRAND COLOR (e.g. #00ED64 for MongoDB, #61DAFB for React). Must be vibrant and recognizable.
                "secondary": "#hexcode", // COMPLEMENTARY PREMIUM COLOR. (e.g. #001E2B for MongoDB, #282C34 for React). Darker, richer tones.
                "accent": "#hexcode", // NEON ACCENT. High saturation for glows/borders. (e.g. #00FF9E or #FF00E6).
                "background": "#hexcode" // ULTRA-PREMIUM DARK BACKGROUND. (e.g. #02040a, #0b0c15). Deep, rich, almost black but tinted.
            },
            "modules": [
                {
                    "title": "Module Title",
                    "description": "Short module description",
                    "lessons": [
                        {
                            "title": "Lesson Title",
                            "description": "What this specific lesson covers"
                        }
                    ]
                }
            ]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Robust JSON extraction
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("No JSON found in response");
        }

        const jsonStr = text.substring(jsonStart, jsonEnd + 1);
        const syllabus = JSON.parse(jsonStr);

        // Return syllabus to client for saving
        return NextResponse.json({ syllabus });

    } catch (error) {
        console.error("Syllabus generation failed:", error);
        return NextResponse.json({ error: "Failed to generate syllabus" }, { status: 500 });
    }
}

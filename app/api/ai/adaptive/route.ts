import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { type, context } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let prompt = "";

        if (type === 'struggle') {
            prompt = `
            You are an expert AI tutor. The user is struggling with the following concept in a coding lesson.
            
            **Context:**
            Topic: ${context.topic}
            Current Section: ${context.sectionContent}
            Recent Mistakes: ${context.recentMistakes?.join(", ") || "Multiple incorrect attempts"}

            **Goal:**
            Generate a "Micro-Lesson" to explain this specific concept in a simpler, more intuitive way. Use an analogy if possible.
            
            **Output Format (JSON):**
            {
                "action": "micro-lesson",
                "content": {
                    "title": "Let's Break It Down",
                    "markdown": "Your explanation here (use bolding and clear language)."
                }
            }
            `;
        } else if (type === 'expert') {
            prompt = `
            You are an expert AI coding mentor. The user is breezing through the current lesson and needs a challenge.

            **Context:**
            Topic: ${context.topic}
            Current Section: ${context.sectionContent}

            **Goal:**
            Generate a "Hardcore Challenge" related to this topic. It should be a tough, thought-provoking question or a small coding scenario that tests deep understanding.

            **Output Format (JSON):**
            {
                "action": "challenge",
                "content": {
                    "title": "🔥 Hardcore Challenge",
                    "markdown": "The challenge description.",
                    "code": "Optional starter code or snippet if needed",
                    "hint": "A subtle hint"
                }
            }
            `;
        } else {
            return NextResponse.json({ action: 'none' });
        }

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const responseText = result.response.text();
        const data = JSON.parse(responseText);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Adaptive AI Error:", error);
        return NextResponse.json({ error: "Failed to generate adaptive content" }, { status: 500 });
    }
}

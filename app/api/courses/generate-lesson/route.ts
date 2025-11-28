import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { topic, lessonTitle, moduleTitle, previousContext, courseId, lessonId } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are an expert educational content creator for a gamified learning platform called "SkillForge".
        Your goal is to create a "Micro-Lesson" about "${lessonTitle}" which is part of the module "${moduleTitle}" in the course "${topic}".

        The lesson should be broken down into 3-4 "Atomic Sections".
        Each section must be short, punchy, and focused on ONE key concept.

        Structure the response as a JSON object with the following schema:
        {
            "title": "Exciting Lesson Title",
            "analogy": {
                "story": "A short, relatable real-world analogy (e.g., comparing variables to labeled boxes).",
                "connection": "How this analogy maps to the technical concept."
            },
            "diagram": "Mermaid JS chart code (graph TD or sequenceDiagram) visualizing the concept. Keep it simple.",
            "sections": [
                {
                    "type": "text",
                    "content": "Markdown text explaining the concept. Use bolding for key terms."
                },
                {
                    "type": "code",
                    "language": "python/javascript/etc",
                    "code": "Short code snippet demonstrating the concept.",
                    "explanation": "Brief explanation of what the code does."
                },
                {
                    "type": "interactive",
                    "interactionType": "fill-in-blank",
                    "question": "A question based STRICTLY on the above content.",
                    "codeContext": "Code or sentence with a ______ for the missing part.",
                    "answer": "The exact word or value that fills the blank (must be from the lesson content)."
                }
            ],
            "bossChallenge": {
                "title": "Name of the Boss (e.g., The Null Pointer Demon)",
                "description": "A short, dramatic scenario description.",
                "question": "A final challenge question that tests the core concept of the lesson.",
                "answer": "The correct answer to the challenge."
            }
        }
        
        IMPORTANT RULES:
        1. Keep it "Atomic": Short paragraphs, clear examples.
        2. Gamify it: Use an enthusiastic, encouraging tone.
        3. Visuals: The Mermaid diagram should be valid and simple. IMPORTANT: Enclose all node labels in double quotes (e.g., A["Label (Info)"]) to avoid syntax errors with special characters.
        4. Interactive: The "fill-in-blank" MUST be solvable by reading the previous sections. Do not ask for external knowledge.
        5. Output ONLY valid JSON. No markdown formatting around the JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const content = JSON.parse(jsonStr);

        // Store in Firestore if courseId is provided
        if (courseId && lessonId) {
            const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);
            await setDoc(lessonRef, {
                ...content,
                createdAt: new Date()
            });
        }

        return NextResponse.json({ content });

    } catch (error) {
        console.error("Lesson generation failed:", error);
        return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
    }
}

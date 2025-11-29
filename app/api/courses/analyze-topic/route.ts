import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Analyze the learning topic: "${topic}".
        
        Generate a "Character Creation" setup for a learner wanting to master this.
        
        Return JSON with this EXACT schema:
        {
            "questions": [
                {
                    "id": "q1",
                    "text": "A clarifying question to narrow down the scope (e.g. 'Web vs Data?' for Python)",
                    "options": ["Option A", "Option B", "Option C"]
                },
                {
                    "id": "q2",
                    "text": "A question about current experience or specific goals",
                    "options": ["Beginner", "Intermediate", "Advanced"]
                }
            ],
            "difficulties": [
                { 
                    "level": "Novice", 
                    "description": "I'm brand new. Explain it like I'm 5.", 
                    "xpMultiplier": 1.0 
                },
                { 
                    "level": "Apprentice", 
                    "description": "I know the basics. Challenge me.", 
                    "xpMultiplier": 1.2 
                },
                { 
                    "level": "Expert", 
                    "description": "I want deep internals and edge cases. No hand-holding.", 
                    "xpMultiplier": 1.5 
                }
            ],
            "personas": [
                {
                    "id": "mentor",
                    "name": "The Wise Mentor",
                    "description": "Patient, encouraging, uses simple analogies.",
                    "icon": "Brain"
                },
                {
                    "id": "hacker",
                    "name": "The Chill Hacker",
                    "description": "Fast-paced, practical, focuses on shipping code.",
                    "icon": "Terminal"
                },
                {
                    "id": "professor",
                    "name": "The Professor",
                    "description": "Rigorous, theoretical, focuses on 'why' it works.",
                    "icon": "BookOpen"
                }
            ]
        }

        CRITICAL: Return ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        let jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        // Extract JSON object if wrapped in text
        const firstBrace = jsonStr.indexOf("{");
        const lastBrace = jsonStr.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Topic analysis failed:", error);
        return NextResponse.json({ error: "Failed to analyze topic" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { history, currentLevel } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are an expert educational counselor and curriculum architect.
        Based on the user's learning history, suggest 3-4 personalized course topics to learn next.

        User Profile:
        - Current Level: ${currentLevel || 'Beginner'}
        - Learning History: ${JSON.stringify(history || [])}

        The recommendations should be:
        1. Logical next steps (e.g. if they learned "React Basics", suggest "Advanced React Patterns" or "Next.js").
        2. Related fields (e.g. if they learned "Frontend", suggest "Node.js" for Fullstack).
        3. Specific and catchy titles.

        Return ONLY valid JSON with this structure:
        {
            "recommendations": [
                {
                    "topic": "Course Topic",
                    "reason": "Why this is recommended (e.g. 'Based on your interest in React...')",
                    "difficulty": "Beginner" | "Intermediate" | "Advanced",
                    "color": "#hexcode" // A distinct color for the card
                }
            ]
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Recommendation generation failed:", error);
        return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
    }
}

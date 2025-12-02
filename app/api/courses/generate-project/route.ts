import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { moduleTitle, topic, difficulty } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Create a "BOSS BATTLE" Capstone Project for the module: "${moduleTitle}" in the course "${topic}".
        Difficulty Level: ${difficulty || "Intermediate"}

        The project should be a realistic, portfolio-worthy task.

        Return JSON with this schema:
        {
            "title": "Project Title",
            "scenario": "Immersive fiction: 'You are the Lead Architect at a startup...'",
            "objective": "Clear goal of what to build.",
            "requirements": [
                "Requirement 1 (User Story)",
                "Requirement 2 (Technical Constraint)",
                "Requirement 3 (Bonus)"
            ],
            "starterCode": "Boilerplate code to get started (optional, can be empty string)",
            "hints": [
                "Hint 1: Architecture tip",
                "Hint 2: Library recommendation"
            ],
            "evaluationCriteria": [
                "Code Quality",
                "Performance",
                "Feature Completeness"
            ]
        }
        
        Output ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const project = JSON.parse(jsonStr);

        return NextResponse.json({ project });

    } catch (error) {
        console.error("Project generation failed:", error);
        return NextResponse.json({ error: "Failed to generate project" }, { status: 500 });
    }
}

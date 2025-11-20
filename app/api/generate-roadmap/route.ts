import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Create a gamified learning roadmap for the topic: "${topic}".
      The roadmap should be broken down into 5-8 progressive levels (modules).
      
      Return ONLY a valid JSON object with the following structure:
      {
        "roadmap": [
          {
            "id": "unique_short_id",
            "title": "Creative Module Title",
            "level": 1,
            "lessons": 5, // number of lessons in this module
            "description": "Short description of what will be learned",
            "topics": ["Topic 1", "Topic 2", "Topic 3"]
          }
        ]
      }

      Make the titles exciting and gamified (e.g., "Novice's Awakening", "The Code Citadel").
      Ensure the levels are in logical learning order.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(jsonStr);

        // Add positions
        const roadmapWithPositions = data.roadmap.map((node: any, index: number) => ({
            ...node,
            position: { x: 50, y: index * 150 }
        }));

        return NextResponse.json({ roadmap: roadmapWithPositions });
    } catch (error) {
        console.error("Error generating roadmap:", error);
        return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { title, content } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are an expert educational scriptwriter.
        Convert the following technical lesson into an engaging, natural-sounding podcast dialogue between two hosts:
        
        **Host 1 (Alex):** Enthusiastic, curious, asks clarifying questions, makes relatable analogies.
        **Host 2 (Sam):** Expert, patient, explains concepts clearly, validates Alex's analogies.

        **Lesson Title:** ${title}
        **Lesson Content:**
        ${content}

        **Goal:** 
        Create a script that covers the key points of the lesson. Keep it under 3 minutes of speaking time (approx 400-500 words).
        The tone should be fun, energetic, and educational. Avoid reading code blocks character-by-character; instead, describe what the code does conceptually.

        **Output Format (JSON Array):**
        [
            { "speaker": "Alex", "text": "..." },
            { "speaker": "Sam", "text": "..." },
            ...
        ]
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        const responseText = result.response.text();
        const script = JSON.parse(responseText);

        return NextResponse.json({ script });

    } catch (error) {
        console.error("Podcast AI Error:", error);
        return NextResponse.json({ error: "Failed to generate podcast script" }, { status: 500 });
    }
}

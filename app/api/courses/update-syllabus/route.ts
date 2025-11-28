import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { currentSyllabus, failedLessonTitle, userScore, moduleIndex, lessonIndex } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        The user has failed the lesson "${failedLessonTitle}" with a score of ${userScore}%.
        The current syllabus has ${currentSyllabus.modules.length} modules.
        
        Your task is to generate a "Remedial Lesson" to help them understand the concept they failed.
        
        Return a JSON object representing the NEW LESSON to be inserted immediately after the current lesson.
        The lesson object must match this structure:
        {
            "title": "Remedial Training: [Concept Name]",
            "description": "A focused session to master [Concept] before moving forward.",
            "duration": "5 min",
            "type": "remedial"
        }

        Do NOT return the whole syllabus. Just the new lesson object.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const newLesson = JSON.parse(cleanText);

        return NextResponse.json({ newLesson });

    } catch (error) {
        console.error("Failed to update syllabus:", error);
        return NextResponse.json({ error: "Failed to evolve syllabus" }, { status: 500 });
    }
}

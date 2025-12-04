import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { topic, lessonTitle, moduleTitle, userProfile, courseId, lessonId, objectives } = await req.json();

        // Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { checkRateLimit } = await import("@/lib/services/rateLimit");
        const rateLimitResult = await checkRateLimit(ip, "AI_GENERATION");

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: "Rate limit exceeded",
                    resetTime: rateLimitResult.resetTime
                },
                { status: 429 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct personalization context
        const userContext = userProfile
            ? `
            TARGET AUDIENCE PROFILE:
            - Skill Level: ${userProfile.level || "Beginner"}
            - Goal: ${userProfile.goal || "Mastery"}
            - Learning Style: ${userProfile.learningStyle || "Visual & Practical"}
            - Interests: ${userProfile.interests?.join(", ") || "Tech, Innovation"}
            
            ADAPTATION INSTRUCTIONS:
            - ANALOGIES: Use VERY SIMPLE, EVERYDAY analogies (e.g. Lego, Sandwiches, Traffic) for Beginners. Avoid "Sci-Fi/Cyberpunk" unless explicitly requested.
            - TONE: ${userProfile.level === 'Expert' ? "Professional, concise, technical" : "Friendly, patient, helpful guide. NOT 'Commander' or 'Overlord'."}
            - DIFFICULTY ALIGNMENT: STRICTLY match the content to the "${userProfile.level || "Beginner"}" level. 
              - Beginner: Focus on "What" and "How". Use simple code. 
              - FORBIDDEN FOR BEGINNERS: APIs, Class Components, useEffect, Complex State, Memory Leaks, Optimization.
              - Expert: Focus on "Why", "Performance", and "Edge Cases".
            `
            : "TARGET AUDIENCE: Beginner. Tone: Friendly and helpful. Analogies: Simple (Lego, Cooking). FORBIDDEN: APIs, Complex State.";

        const prompt = `
        You are an elite technical mentor for "SkillForge".
        Your mission is to create a CLEAR, ACCESSIBLE, and ENGAGING learning experience.
        
        TOPIC: "${topic}"
        MODULE: "${moduleTitle}"
        LESSON: "${lessonTitle}"

        OBJECTIVES (MUST COVER):
        ${objectives && objectives.length > 0 ? objectives.map((o: any) => `- ${o.name}`).join("\n") : "- Comprehensive coverage of the lesson title."}
        
        ${userContext}

        GOAL: Create a "Zero to Hero" deep dive into this specific concept. 
        
        CRITICAL INSTRUCTIONS:
        1. RELEVANCE: All examples, debug challenges, and simulations MUST be directly related to "${lessonTitle}". Do not test unrelated concepts.
        2. OBJECTIVES: You MUST cover all the listed OBJECTIVES in the lesson sections.
        3. SIMPLICITY: Keep analogies simple. If explaining variables, use boxes. If explaining loops, use a chore list.
        3. PROGRESSION: Start simple, then go deep.
        4. HINTS: For interactive sections, provide "hints" that are small nudges, not the full answer.
        5. NO OVER-ENGINEERING: For Beginners, do NOT use "Reactopolis" or complex world-building. Keep it grounded.

        STRUCTURE:
        Generate a JSON object with this EXACT schema. The lesson must have 6-8 sections.

        {
            "title": "The Epic Lesson Title",
            "analogy": {
                "story": "A vivid, memorable story/analogy explaining the concept (approx. 100 words).",
                "connection": "Explicitly map the analogy elements to technical concepts."
            },
            "diagram": "Mermaid JS chart code. STRICT RULES: 1. Use 'graph TD' ONLY. 2. Labels must be SIMPLE TEXT ONLY (e.g. 'User Input', 'Process'). 3. ABSOLUTELY NO code syntax (like 'console.log', 'function()', '{}', '()') inside labels. 4. Do not use parentheses '()' or quotes inside labels. Example: graph TD; A[Start] --> B[Process Data]; B --> C[End];",
            "sections": [
                {
                    "type": "text",
                    "title": "Section Heading",
                    "content": "Deep explanation using markdown. Use bolding, lists, and clear hierarchy."
                },
                {
                    "type": "code",
                    "title": "Practical Implementation",
                    "language": "javascript/python/etc",
                    "code": "Production-ready code example.",
                    "explanation": "Line-by-line breakdown of the code."
                },
                {
                    "type": "simulation",
                    "title": "Roleplay Scenario",
                    "scenario": "You are a [Role] at [Company]. The system is failing because [Reason]. Your task is to...",
                    "role": "e.g. Senior DevOps Engineer",
                    "objective": "e.g. Fix the memory leak"
                },
                {
                    "type": "debug",
                    "title": "Bug Hunt Challenge",
                    "description": "This code has a subtle bug. Can you find it?",
                    "buggyCode": "Code with a logical or syntax error.",
                    "solution": "The corrected code.",
                    "explanation": "Why the bug happened and how to fix it."
                },
                {
                    "type": "deep_dive",
                    "title": "Under the Hood",
                    "content": "Advanced theory: How this works internally (memory, compilation, etc)."
                },
                {
                    "type": "interactive",
                    "title": "Knowledge Check",
                    "interactionType": "fill-in-blank",
                    "question": "A critical thinking question based on the lesson.",
                    "codeContext": "Code or text with ______.",
                    "answer": "The correct term."
                }
            ],
            "bossChallenge": {
                "title": "The Final Boss",
                "description": "A complex scenario requiring synthesis of all learned concepts.",
                "question": "The ultimate test question.",
                "answer": "The correct answer.",
                "hints": ["Hint 1: A small nudge.", "Hint 2: A bigger clue.", "Hint 3: The syntax structure."]
            },
            "cheatSheet": [
                "Key takeaway 1",
                "Key takeaway 2",
                "Best practice tip"
            ]
        }

        CRITICAL RULES:
        1. **Length & Depth**: This must be a SUBSTANTIAL lesson. No fluff. High signal-to-noise ratio.
        2. **Visuals**: The Mermaid diagram must be valid.
        3. **Variety**: Use a mix of Text, Code, Simulation, Debug, and Deep Dive sections.
        4. **Personalization**: If the user likes Sci-Fi, make the analogy Sci-Fi themed.
        5. **Output**: ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up JSON
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const content = JSON.parse(jsonStr);

        // Return content to client for saving
        return NextResponse.json({ content });

        return NextResponse.json({ content });

    } catch (error) {
        console.error("Lesson generation failed:", error);
        return NextResponse.json({ error: "Failed to generate lesson" }, { status: 500 });
    }
}

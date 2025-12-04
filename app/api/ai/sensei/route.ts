import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages, codeContext, lessonContext, userHistory } = await req.json();

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

        // Format user history for context
        const historyContext = userHistory && userHistory.length > 0
            ? userHistory.map((h: any) => `- ${h.type}: ${JSON.stringify(h.data)}`).join('\n')
            : "No recent history available.";

        const systemPrompt = `
        You are the "AI Sensei", a friendly, wise, and highly technical mentor for a coding student.
        
        Current Lesson Context:
        Title: ${lessonContext?.title}
        Current Section: ${lessonContext?.sectionContent}
        
        User's Recent Activity (Deep Memory):
        ${historyContext}

        Current Code in Editor:
        \`\`\`
        ${codeContext}
        \`\`\`

        Your Goal:
        1. Answer the student's question specifically about the code or lesson.
        2. Be concise but encouraging. Use emojis like 🧠, ⚡, 🛡️.
        3. If they are stuck, give a hint, not the full answer immediately.
        4. If they ask "What does this line do?", explain it simply.
        5. Keep responses under 3 sentences unless a deep explanation is requested.
        6. Use the "User's Recent Activity" to personalize your advice (e.g., "I see you struggled with the last quiz, let's take this slow.").
        `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to guide the student. 🥋" }],
                },
                ...messages.slice(0, -1).map((m: any) => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                }))
            ],
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error("AI Sensei failed:", error);
        return NextResponse.json({ error: "Sensei is meditating... (Error)" }, { status: 500 });
    }
}

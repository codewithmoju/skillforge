import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Use gemini-2.0-flash model as requested
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Create an EXTREMELY DETAILED and COMPREHENSIVE gamified learning roadmap for: "${topic}".

CRITICAL REQUIREMENTS:
1. GRANULARITY: Break down the topic into 10-15 highly specific modules
2. DEPTH: Each module should focus on ONE specific subtopic or skill area
3. PROGRESSION: Start from absolute basics and progress to advanced mastery
4. COMPLETENESS: Cover EVERY important aspect of the topic - leave nothing out
5. GUIDANCE-FOCUSED: Provide conceptual understanding, not step-by-step tutorials

STRUCTURE GUIDELINES:
- For programming languages: Cover syntax, data structures, OOP, async, testing, frameworks, best practices, etc.
- For technologies: Cover fundamentals, core concepts, advanced features, ecosystem, tools, deployment, optimization
- For skills: Cover theory, fundamentals, intermediate techniques, advanced strategies, real-world application
- Each module should have 5-8 lessons covering different aspects of that subtopic
- Include 6-10 specific topics per module that learners will explore

Return ONLY a valid JSON object with this exact structure:
{
  "roadmap": [
    {
      "id": "unique_short_id",
      "title": "Epic, Specific Module Title (e.g., 'Variables & Data Types Mastery', 'Async Programming Citadel')",
      "level": 1,
      "lessons": 6,
      "description": "Detailed 2-3 sentence description explaining EXACTLY what concepts will be covered, why they're important, and how they fit into the bigger picture",
      "topics": [
        "Specific Concept 1 (be very specific)",
        "Specific Concept 2",
        "Specific Concept 3",
        "Specific Concept 4",
        "Specific Concept 5",
        "Specific Concept 6",
        "Specific Concept 7",
        "Specific Concept 8"
      ]
    }
  ]
}

EXAMPLE PROGRESSION (for a programming language like JavaScript):
1. "Foundation Forge" - Variables, data types, operators, basic syntax
2. "Control Flow Citadel" - Conditionals, loops, switch statements, error handling basics
3. "Function Fundamentals" - Function declarations, parameters, return values, scope
4. "Array Architect" - Array methods, iteration, manipulation, advanced techniques
5. "Object Odyssey" - Object creation, properties, methods, prototypes
6. "DOM Dominion" - DOM manipulation, events, dynamic content
7. "Async Ascension" - Callbacks, promises, async/await, fetch API
8. "ES6+ Evolution" - Modern syntax, destructuring, spread, modules
9. "Class Constructor" - OOP concepts, classes, inheritance, encapsulation
10. "Testing Temple" - Unit testing, TDD, debugging strategies
11. "Framework Frontier" - React/Vue/Angular basics and ecosystem
12. "Performance Peak" - Optimization, memory management, best practices
13. "Tooling Mastery" - Build tools, package managers, dev environment
14. "Deployment Domain" - Hosting, CI/CD, production considerations
15. "Master's Summit" - Advanced patterns, architecture, real-world projects

Make each module title exciting and game-like while being SPECIFIC about what it covers.
Ensure comprehensive coverage - think of this as the ULTIMATE guide to mastering the topic.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    // Add positions for visualization
    const roadmapWithPositions = data.roadmap.map((node: any, index: number) => ({
      ...node,
      position: { x: 50, y: index * 150 }
    }));

    return NextResponse.json({ roadmap: roadmapWithPositions });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return NextResponse.json({
      error: "Failed to generate roadmap",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { topic, areaId } = await request.json();

    if (!topic || !areaId) {
      return NextResponse.json({
        error: "Topic and areaId are required"
      }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate DEEP DETAILS for ONE specific area - GUIDE not teaching
    const detailPrompt = `
Generate EXHAUSTIVE LEARNING GUIDE for this area in ${topic}:

Area ID: ${areaId}

PURPOSE: This is a "ZERO TO HERO" COMPREHENSIVE GUIDE listing EVERY term, concept, and skill to master.
This is NOT teaching material - teaching happens in courses.
This shows WHAT to learn, from zero knowledge to complete mastery, including MINOR DETAILS and EDGE CASES.

Return ONLY valid JSON. NO markdown, NO code blocks, NO quotes in text.

{
  "areaId": "${areaId}",
  "description": "What this area encompasses and why it matters",
  "learningObjectives": [
    "Master specific skill 1",
    "Understand concept 2",
    "Know term 3",
    "Grasp principle 4"
  ],
  "topics": [
    {
      "id": "topic_1",
      "name": "Topic Name",
      "description": "Specific terms and concepts this topic covers",
      "why": "Strategic value - why this specific topic is critical to mastery",
      "keyConcepts": [
        "Specific term 1",
        "Specific term 2",
        "Specific concept 3",
        "Specific principle 4",
        "Specific technique 5",
        "Specific pattern 6",
        "Minor detail 7",
        "Edge case 8"
      ],
      "practicalApplications": [
        "Where you use this knowledge",
        "What you can build with this",
        "Real scenarios requiring this"
      ],
      "subtopics": [
        {
          "id": "sub_1",
          "name": "Subtopic Name",
          "description": "Specific terms within this subtopic",
          "estimatedTime": "Time to master",
          "keyPoints": [
            "Specific term A",
            "Specific term B",
            "Concept C",
            "Principle D",
            "Technique E",
            "Pattern F",
            "Internal mechanic G",
            "Performance nuance H"
          ],
          "examples": [
            "Real-world use case 1",
            "Practical application 2",
            "Where this appears 3"
          ]
        }
      ]
    }
  ],
  "prerequisites": [
    {
      "description": "Terms and concepts this prerequisite includes",
      "estimatedTime": "Time to learn",
      "resources": [
        "Where to learn this 1",
        "Where to learn this 2"
      ]
    }
  ]
}

CRITICAL REQUIREMENTS:
1. List EVERY SINGLE term, concept, skill, and principle for this area
2. Be EXHAUSTIVELY detailed - include "minor details" and "edge cases"
3. Include "under-the-hood" concepts and internal mechanics
4. 8-15 key concepts per topic minimum (Go DEEP)
5. 6-10 key points per subtopic minimum
6. This is a GUIDE - list what to master, NOT how to do it
7. NO teaching explanations - just term names and WHY they matter
8. Focus on FROM NOTHING TO EVERYTHING approach

GOAL: After reading, learner knows EXACTLY what terms/concepts exist and must be mastered, even the obscure ones.

Return ONLY the JSON details.
    `;

    const result = await model.generateContent(detailPrompt);
    const response = await result.response;
    const text = response.text();

    // Comprehensive JSON cleanup
    let jsonStr = text.trim();

    // Remove markdown code blocks
    jsonStr = jsonStr.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    // Remove any text before the first { and after the last }
    const firstBrace = jsonStr.indexOf("{");
    const lastBrace = jsonStr.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    // Fix common JSON errors
    jsonStr = jsonStr
      .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
      .replace(/\n/g, " ") // Replace newlines with spaces
      .replace(/\r/g, "") // Remove carriage returns
      .replace(/\t/g, " ") // Replace tabs with spaces
      .replace(/\s+/g, " "); // Normalize whitespace

    let details;
    try {
      details = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Attempted to parse:", jsonStr.substring(0, 500));
      throw new Error(`Invalid JSON from AI: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
    }

    return NextResponse.json({ details });
  } catch (error) {
    console.error("Error generating area details:", error);
    return NextResponse.json({
      error: "Failed to generate area details",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

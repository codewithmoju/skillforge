import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function POST(req: Request) {
    try {
        const { topic, learningAreas, theme, difficulty, persona } = await req.json();

        if (!topic || !learningAreas) {
            return NextResponse.json({ error: "Topic and Learning Areas are required" }, { status: 400 });
        }

        console.log("Received Learning Areas:", JSON.stringify(learningAreas, null, 2));

        // Map Roadmap Learning Areas to Course Modules
        const modules = (learningAreas || []).map((area: any, areaIndex: number) => ({
            title: area.name || area.title || `Module ${areaIndex + 1}: Untitled`,
            description: area.why || area.description || `Mastering ${area.name || "this module"}`,
            lessons: (area.topics || []).flatMap((topic: any, topicIndex: number) => {
                // 1. Main Topic Lesson (Overview)
                const mainLesson = {
                    title: topic.name || topic.title || `Topic ${topicIndex + 1}`,
                    description: topic.why || topic.description || `Overview of ${topic.name}`,
                    objectives: [] // No subtopics here, as they are now separate lessons
                };

                // 2. Subtopic Lessons
                const subLessons = (topic.subtopics || []).map((sub: any, subIndex: number) => ({
                    title: sub.name || `Part ${subIndex + 1}: ${topic.name}`,
                    description: `Deep dive into ${sub.name} - a key component of ${topic.name}.`,
                    objectives: []
                }));

                return [mainLesson, ...subLessons];
            })
        }));

        const syllabus = {
            title: `Mastering ${topic}`,
            description: `A comprehensive course generated from your personalized roadmap to master ${topic}.`,
            theme: theme || {
                primary: "#3b82f6",
                secondary: "#1e40af",
                accent: "#60a5fa",
                background: "#0f172a"
            },
            modules
        };

        // Store in Firestore
        // Ensure no undefined values are passed
        const courseData = {
            topic: topic || "Untitled Course",
            level: difficulty?.level || "Beginner",
            syllabus: JSON.parse(JSON.stringify(syllabus)), // Remove any deep undefineds
            createdAt: new Date(),
            userId: "anonymous", // TODO: Replace with actual user ID
            source: "roadmap" // Tag to identify source
        };

        const courseRef = await addDoc(collection(db, "courses"), courseData);

        return NextResponse.json({ courseId: courseRef.id });

    } catch (error) {
        console.error("Course generation from roadmap failed:", error);
        return NextResponse.json({ error: "Failed to generate course" }, { status: 500 });
    }
}

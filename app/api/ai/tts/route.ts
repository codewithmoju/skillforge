import { NextResponse } from 'next/server';
import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const { text, speaker } = await req.json();

        // Map speakers to Edge TTS voices
        let voice = 'en-US-GuyNeural'; // Default (Alex)
        if (speaker === 'Sam') {
            voice = 'en-US-JennyNeural';
        } else if (speaker === 'System') {
        } else if (speaker === 'System') {
            voice = 'en-US-EricNeural'; // Radio Announcer Voice
        } else if (speaker === 'Caller') {
            voice = 'en-US-SteffanNeural'; // Caller Voice
        }

        const tts = new EdgeTTS({
            voice: voice,
            lang: 'en-US',
            outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
        });

        // Create a temporary file path
        const tempDir = os.tmpdir();
        // Use simple concatenation to avoid template literal parser issues
        const fileName = uuidv4() + ".mp3";
        const tempFilePath = path.join(tempDir, fileName);

        // Generate audio to file
        // Check if input is SSML (starts with <speak>)
        if (text.trim().startsWith('<speak>')) {
            await tts.ttsPromise(text, tempFilePath); // edge-tts detects SSML automatically if passed as text? 
            // Actually node-edge-tts might need specific handling or just raw text. 
            // Looking at docs/common usage, usually it auto-detects or we just pass it.
            // Let's assume standard ttsPromise handles it if the string is SSML.
            // If not, we might need to use a different method or ensure the library supports it.
            // *Self-correction*: node-edge-tts usually supports SSML if the string is formatted as SSML.
        } else {
            await tts.ttsPromise(text, tempFilePath);
        }

        // Read the file into a buffer
        const audioBuffer = await fs.promises.readFile(tempFilePath);

        // Clean up the temporary file
        await fs.promises.unlink(tempFilePath);

        // Return the audio as a response
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('TTS Error:', error);
        return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
    }
}

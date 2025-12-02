const { EdgeTTS } = require("node-edge-tts");
const fs = require("fs");
const path = require("path");

async function testTTS() {
    console.log("Testing node-edge-tts...");
    try {
        const tts = new EdgeTTS({
            voice: "en-US-GuyNeural",
            lang: "en-US",
            outputFormat: "audio-24khz-48kbitrate-mono-mp3"
        });

        const text = "Hello, this is a test of the node-edge-tts library.";
        const filePath = path.join(__dirname, "test-audio-node.mp3");

        console.log(`Generating audio for: "${text}"`);

        await tts.ttsPromise(text, filePath);

        const stats = fs.statSync(filePath);
        console.log(`Generated audio file size: ${stats.size} bytes`);

        if (stats.size > 0) {
            console.log("✅ Success! Audio saved.");
        } else {
            console.error("❌ Generated audio is empty!");
        }

    } catch (error) {
        console.error("TTS Error:", error);
    }
}

testTTS();

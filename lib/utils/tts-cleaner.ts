export function cleanTextForTTS(text: string): string {
    if (!text) return "";

    let cleaned = text;

    // 1. Remove Emojis (Ranges for common emojis)
    // This regex covers most common emoji ranges
    cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");

    // 2. Fix Slashes
    // Replace "UI/UX" with "UI UX" (or "UI and UX")
    // Replace "A/B" with "A B"
    cleaned = cleaned.replace(/\//g, " ");

    // 3. Fix Common Pronunciations / Abbreviations
    cleaned = cleaned.replace(/\bvs\.\b/gi, "versus");
    cleaned = cleaned.replace(/\betc\.\b/gi, "et cetera");
    cleaned = cleaned.replace(/\be\.g\.\b/gi, "for example");
    cleaned = cleaned.replace(/\bi\.e\.\b/gi, "that is");

    // 4. Remove Markdown bold/italic markers if present (sometimes AI leaves them)
    cleaned = cleaned.replace(/\*\*/g, "");
    cleaned = cleaned.replace(/\*/g, "");
    cleaned = cleaned.replace(/__/g, "");

    // 5. Collapse multiple spaces
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
}

import { useState, useEffect } from "react";

export function useScrambleText(text: string, trigger: boolean = true) {
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        if (!trigger) {
            setDisplay(text);
            return;
        }

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
        let iteration = 0;

        const interval = setInterval(() => {
            setDisplay(prev =>
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1;
        }, 25);

        return () => clearInterval(interval);
    }, [text, trigger]);

    return display;
}

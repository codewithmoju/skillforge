
const fs = require('fs');
const path = 'c:\\Edumate_AI\\skillforge\\app\\globals.css';

try {
    const content = fs.readFileSync(path, 'utf8');
    const lines = content.split(/\r?\n/);

    console.log(`Total lines: ${lines.length}`);

    if (lines.length < 900) {
        console.log("File is smaller than expected, aborting.");
        process.exit(1);
    }

    // Indices are 0-based.
    // Keep 0-719.
    // Skip 720-914.
    // Keep 915-end.

    console.log(`Line 721 (Index 720): ${lines[720]}`);
    console.log(`Line 915 (Index 914): ${lines[914]}`);
    console.log(`Line 916 (Index 915): ${lines[915]}`);

    const newLines = [...lines.slice(0, 720), ...lines.slice(915)];

    console.log(`New line count: ${newLines.length}`);

    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    console.log("File updated successfully.");

} catch (err) {
    console.error(err);
}

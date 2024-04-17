const fs = require('fs');
const readline = require('readline');

// File path to watch
const filePath = '.txt';

// Function to handle file changes
const fileChanged = (eventType, filename) => {
    if (filename && filename === filePath) {
        console.log(`File ${filePath} changed`);
        // Read last 10 numbers
        readLastLines(filePath, 10)
            .then(lines => {
                console.log('Last 10 numbers:');
                console.log(lines);
            })
            .catch(err => {
                console.error('Error reading file:', err);
            });
    }
};

// Watch for changes in the file
fs.watch(filePath, fileChanged);

console.log(`Watching ${filePath} for changes...`);

// Function to read last n lines from a file
const readLastLines = async (filePath, numLines) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let lines = [];
    for await (const line of rl) {
        lines.push(line);
        if (lines.length > numLines) {
            lines.shift();
        }
    }
    return lines;
};

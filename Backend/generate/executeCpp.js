const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputDir = path.join(__dirname, "outputs");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 🔧 Updated function to accept input
const executeCpp = (filePath, input = "") => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputPath = path.join(outputDir, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
        // Step 1: Compile the C++ code
        exec(`g++ "${filePath}" -o "${outputPath}"`, (compileErr, _, compileStderr) => {
            if (compileErr) {
                return reject({ error: compileStderr });
            }

            // Step 2: Run the compiled file with input
            const runProcess = exec(`"${outputPath}"`, (runErr, stdout, stderr) => {
                if (runErr) {
                    return reject({ error: stderr });
                }
                resolve(stdout);
            });

            // Step 3: Write input to the process
            if (input) {
                runProcess.stdin.write(input);
                runProcess.stdin.end();
            }
        });
    });
};

module.exports = {
    executeCpp,
};

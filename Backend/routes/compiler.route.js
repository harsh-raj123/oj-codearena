const express = require("express");
const router = express.Router();

const { generateFile } = require("../generate/generateFile");
const { executeCpp } = require("../generate/executeCpp");
const { executeC } = require("../generate/executeC");
const { executePython } = require("../generate/executePython");
const { executeJava } = require("../generate/executeJava");
const Problem = require("../Models/Problems");
const { aiCodeRivew, aiCodeReview } = require("./aiCodeReview");





router.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Code is required" });
  }

  try {
    const filePath = generateFile(language, code);
    let output;

    switch (language.toLowerCase()) {
      case "cpp":
        output = await executeCpp(filePath, input); // 👈 input passed
        break;
      case "c":
        output = await executeC(filePath, input);
        break;
      case "py":
      case "python":
        output = await executePython(filePath, input);
        break;
      case "java":
        output = await executeJava(filePath, input);
        break;
      default:
        return res.status(400).json({ success: false, error: "Unsupported language" });
    }

    res.json({ success: true, filePath, output });
  } catch (err) {
    res.status(500).json({ success: false, error: err.error || "Error executing code" });
  }
});



router.post("/submit", async (req, res) => {
    const { code, language = "cpp", problemId } = req.body;

    if (!code || !problemId) {
        return res.status(400).json({ success: false, error: "Code and problemId are required" });
    }

    try {
        // 1. Get the problem with testcases
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, error: "Problem not found" });
        }

        const filePath = generateFile(language, code);
        const testcases = problem.testcases;

        const results = [];

        for (const testcase of testcases) {
            let output;
            try {
                switch (language.toLowerCase()) {
                    case "cpp":
                        output = await executeCpp(filePath, testcase.input);
                        break;
                    case "c":
                        output = await executeC(filePath, testcase.input);
                        break;
                    case "python":
                    case "py":
                        output = await executePython(filePath, testcase.input);
                        break;
                    case "java":
                        output = await executeJava(filePath, testcase.input);
                        break;
                    default:
                        return res.status(400).json({ success: false, error: "Unsupported language" });
                }

                // Trim output and compare with expected
                const passed = output.trim() === testcase.output.trim();
                results.push({ input: testcase.input, expected: testcase.output, output, passed });

            } catch (err) {
                results.push({ input: testcase.input, expected: testcase.output, error: err.message, passed: false });
            }
        }

        const allPassed = results.every(result => result.passed);

        res.status(200).json({
            success: true,
            passed: allPassed,
            testResults: results
        });

    } catch (err) {
        res.status(500).json({ success: false, error: "Error processing submission", details: err.message });
    }
});


router.post("/ai-review", async (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Code is required for review",
    });
  }

  try {
    const review = await aiCodeReview(code);
    res.status(200).json({
      success: true,
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || "An error occurred during code review",
    });
  }
});

// module.exports = router;



module.exports = router;

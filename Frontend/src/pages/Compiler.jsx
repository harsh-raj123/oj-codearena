import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Compiler.css';
import { marked } from 'marked'; // <-- new

const Compiler = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [problem, setProblem] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [review, setReview] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`https://rishuharsh.xyz:3000/problems/${id}`);
        setProblem(res.data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    try {
      const res = await axios.post('https://rishuharsh.xyz:3000/compiler/run', {
        language,
        code,
        input: userInput,
      });
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error || "Execution failed");
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('https://localhost:3000/compiler/submit', {
        code,
        language,
        input: userInput,
        problemId: id,
      });
      setSubmitResult(res.data);
    } catch (err) {
      setSubmitResult({
        success: false,
        error: err.response?.data?.error || "Submission failed",
      });
    }
  };

  const handleReview = async () => {
    setLoadingReview(true);
    setReview('');
    try {
      const res = await axios.post('https://localhost:3000/compiler/ai-review', {
        code,
      });
      // convert markdown to HTML safely
      const html = marked(res.data.review);
      setReview(html);
    } catch (err) {
      setReview(err.response?.data?.error || "AI review failed");
    }
    setLoadingReview(false);
  };

  return (
    <div className="compiler-page">
      <div className="compiler-container">
        <div className="editor-section">
          <div className="top-bar">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="py">Python</option>
            </select>
            <button onClick={handleRun}>Run</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>

          <textarea
            placeholder="// Write your code here"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <textarea
            className="input-box"
            placeholder="// Enter custom input (optional)"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />

          <div className="output-box">
            <strong>Output:</strong>
            <pre>{output}</pre>
          </div>

          {submitResult && (
            <div className="submit-result">
              <strong>{submitResult.passed ? "Accepted ✅" : "Rejected ❌"}</strong>
              {submitResult.testResults && (
                <ul>
                  {submitResult.testResults.map((result, index) => (
                    <li key={index}>
                      <strong>Testcase {index + 1}:</strong> {result.passed ? "✅ Passed" : "❌ Failed"}
                    </li>
                  ))}
                </ul>
              )}
              {submitResult.error && <p>Error: {submitResult.error}</p>}
            </div>
          )}
        </div>

        <div className="problem-section">
          {problem ? (
            <>
              <h2>{problem.title}</h2>
              <p><strong>Difficulty:</strong> {problem.difficulty}</p>
              <p>{problem.description}</p>

              <button className="ai-review-btn" onClick={handleReview}>AI Review</button>

              {loadingReview && <p>Generating AI review...</p>}

              {review && (
                <div className="ai-review-box">
                  <strong>AI Code Review:</strong>
                  <div
                    className="review-scroll-area"
                    dangerouslySetInnerHTML={{ __html: review }}
                  />
                </div>
              )}
            </>
          ) : (
            <p>Loading problem...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compiler;

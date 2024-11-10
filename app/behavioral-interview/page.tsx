"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

// Add WebkitSpeechRecognition type
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function BehavioralInterview() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [context, setContext] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  // Voice input states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const API_URL = "http://localhost:8080/api";

  async function handleSubmit() {
    const response = await fetch(`${API_URL}/behavioral/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "start", name, role: position }),
    });

    const data = await response.json();
    setResponses([...responses, data.response]);
    setContext([...context, ""]);
  }

  async function handleSend() {
    const response = await fetch(`${API_URL}/behavioral/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: context[context.length - 1],
        context,
        name,
        position,
      }),
    });

    const data = await response.json();
    setResponses([...responses, data.response]);
    setContext([...context, ""]);
  }

  // Function to analyze STAR components in responses
  const analyzeSTARComponents = (answer: string) => {
    const hasKeywords = {
      situation: /situation|context|background|when|while/i.test(answer),
      task: /task|challenge|goal|needed to|had to/i.test(answer),
      action: /action|did|took|implemented|created|managed/i.test(answer),
      result: /result|outcome|finally|eventually|achieved|accomplished/i.test(
        answer
      ),
    };

    return Object.values(hasKeywords).filter(Boolean).length;
  };

  // Function to generate performance report
  const generateReport = () => {
    const answeredResponses = context.filter((c) => c.trim());
    const starScores = answeredResponses.map((answer) =>
      analyzeSTARComponents(answer)
    );
    const avgStarScore =
      starScores.reduce((acc, curr) => acc + curr, 0) / starScores.length;

    const report = `Behavioral Interview Report
    
Candidate: ${name}
Position: ${position}
Date: ${new Date().toLocaleDateString()}

Interview Summary:
${responses
  .map(
    (response, index) => `
Question ${index + 1}: ${response}
Response: ${context[index] || "No response"}

STAR Analysis: ${starScores[index] || 0}/4 components detected
${"-".repeat(50)}`
  )
  .join("\n")}

Performance Analysis:
1. Response Structure
   - Average STAR components per answer: ${avgStarScore.toFixed(1)}/4
   - Completeness of responses: ${Math.round(
     (answeredResponses.length / responses.length) * 100
   )}%

2. Communication Style
   - Average response length: ${Math.round(
     answeredResponses.reduce((acc, curr) => acc + curr.length, 0) /
       answeredResponses.length
   )} characters
   - Number of detailed examples provided: ${
     answeredResponses.filter((r) => r.length > 200).length
   }

3. Key Behavioral Competencies Demonstrated:
   - Ability to provide specific examples
   - Structured response formatting
   - Problem-solving approach
   - Self-reflection capabilities

Recommendations for Improvement:
${
  avgStarScore < 3
    ? "- Focus on including all STAR components in responses\n"
    : ""
}
${
  answeredResponses.some((r) => r.length < 150)
    ? "- Provide more detailed examples in responses\n"
    : ""
}
- Continue practicing with specific scenarios
- Keep focusing on quantifiable results
- Maintain clear structure in responses

Overall Assessment:
The candidate demonstrated ${
      avgStarScore > 3 ? "strong" : "developing"
    } behavioral interviewing skills, 
with particular strength in ${
      starScores.some((s) => s === 4)
        ? "providing complete STAR-formatted responses"
        : "sharing specific examples"
    }. 
The responses show ${
      answeredResponses.every((r) => r.length > 200)
        ? "good detail and depth"
        : "varying levels of detail"
    }.

Generated by Behavioral Interview Practice Tool`;

    return report;
  };

  // Function to download report
  const downloadReport = () => {
    const report = generateReport();
    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name
      .replace(/\s+/g, "-")
      .toLowerCase()}-behavioral-interview-report.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Function to start voice recording
  const startRecording = (index: number) => {
    setIsRecording(true);
    setRecordingIndex(index);

    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      setContext((prev) => {
        const newContext = [...prev];
        newContext[index] = transcript;
        return newContext;
      });
    };

    recognitionRef.current.start();
  };

  // Function to stop voice recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setRecordingIndex(null);
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Calculate number of answered questions
  const answeredQuestions = context.filter(
    (answer) => answer.trim() !== ""
  ).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-center font-bold mb-6">
          Behavioral Interview Practice
        </h1>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm">
              What is your name?
            </label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-2 text-sm">
              What role are you applying for?
            </label>
            <Input
              id="role"
              name="role"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <Button
            disabled={responses.length > 0}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Start Interview
          </Button>
        </form>

        {answeredQuestions >= 3 && (
          <div className="mt-6">
            <Button
              onClick={downloadReport}
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Interview Report
            </Button>
          </div>
        )}

        {responses.length > 0 &&
          responses.map((response, i) => (
            <div key={i}>
              <p className="my-5 text-justify">{response}</p>
              <div className="flex flex-row gap-2">
                <Input
                  value={context[i]}
                  onChange={(e) =>
                    setContext((prev) => {
                      const newContext = [...prev];
                      newContext[i] = e.target.value;
                      return newContext;
                    })
                  }
                  className="w-full bg-gray-800 border-gray-700 text-white"
                  required
                />
                <Button onClick={handleSend}>Send</Button>
                <Button
                  onClick={() => {
                    if (isRecording && recordingIndex === i) {
                      stopRecording();
                    } else {
                      startRecording(i);
                    }
                  }}
                  className={`p-2 rounded-full ${
                    isRecording && recordingIndex === i
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isRecording && recordingIndex === i ? (
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                    >
                      <path
                        fill="currentColor"
                        d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                      />
                    </svg>
                  )}
                </Button>
              </div>
              {isRecording && recordingIndex === i && (
                <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording...
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

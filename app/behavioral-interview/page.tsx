"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

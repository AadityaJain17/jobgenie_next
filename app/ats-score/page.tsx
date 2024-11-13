"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

const API_URL = "http://localhost:8080/api";

interface ATSResponse {
  jd: string;
  missing: string[];
  profile: string;
}

export default function Component() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<ATSResponse | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (file != null) {
      const data = new FormData();
      data.append("resume", file);
      data.append("jd", jobDescription);
      const response = await fetch(`${API_URL}/ats/analyze`, {
        method: "POST",
        body: data,
      });

      const res = await response.json();
      if (
        (res.analysis as string).startsWith("```json") ||
        (res.analysis as string).startsWith("```JSON")
      ) {
        const analysis = JSON.parse(
          res.analysis.slice("```json".length, res.analysis.length - 3)
        );
        setResponse({
          jd: analysis["JD Match"],
          missing: analysis["Missing Keywords"],
          profile: analysis["Profile Summary"],
        });
      } else {
        const analysis = JSON.parse(res.analysis);
        setResponse({
          jd: analysis["JD Match"],
          missing: analysis["Missing Keywords"],
          profile: analysis["Profile Summary"],
        });
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl text-center font-bold mb-6">
        ATS Resume Checker
      </h1>
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="mb-6">
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium mb-2"
            >
              Job Description
            </label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here..."
              className="min-h-[150px] bg-gray-700 border-gray-600 text-white"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Upload Your Resume
            </label>
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="resumeUpload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf"
              />
              <label htmlFor="resumeUpload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">
                  Drag and drop file here or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Limit 200MB per file • PDF
                </p>
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-green-400">
                File selected: {file.name}
              </p>
            )}
          </div>
          <Button onClick={handleAnalyze} className="w-full">
            Analyze
          </Button>
        </CardContent>
      </Card>
      {response && (
        <div className="mt-6 space-y-6 p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">
              Match Percentage
            </h2>
            <p className="text-5xl text-green-400">{response.jd}</p>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">
              Missing Keywords
            </h2>
            <div className="flex flex-wrap gap-2">
              {response.missing.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">
              Profile Summary
            </h2>
            <p className="text-gray-300">{response.profile}</p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { json } from "stream/consumers";

const API_URL = "http://localhost:8080/api";

interface atsResponse{
 jd:string,
 missing:string[],
 profile:string,
}


export default function ATSResumeChecker() {
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [response,setResponse] = useState<atsResponse|null>(null)
 
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
    if (file!=null){
      const data = new FormData();
      data.append("resume", file);
      data.append("jd",jobDescription)
       const response = await fetch(`${API_URL}/ats/analyze`, {
         method: "POST",
         body: data
       });

       const res = await response.json();
       if ((res.analysis as string).startsWith("```json") || (res.analysis as string).startsWith("```JSON")){
        const analysis = JSON.parse(res.analysis.slice("```json".length, res.analysis.length - 3)) 
        setResponse({
          jd:analysis["JD Match"],
          missing:analysis["Missing Keywords"],
          profile:analysis["Profile Summary"]
        })
        
      }
      else{
        const analysis = JSON.parse(
          res.analysis
        );
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
      <h1 className="text-2xl text-center font-bold mb-6">ATS Resume Checker</h1>
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
        <div
        
          className="p-4 bg-slate-800 m-2 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow"
        >
          <p className="text-lg font-semibold">{response.jd}</p>
          <p className="text-gray-600">{response.missing.map(m=> <span className="space-x-2">{m}</span>)}</p>
          <p className="text-gray-500">{response.profile}</p>
        </div>
      )}
    </div>
  );
}

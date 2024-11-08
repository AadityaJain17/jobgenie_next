"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download } from "lucide-react";

interface JobType {
  title: string;
  company: string;
  location: string;
  link: string;
}

export default function JobSearch() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:8080/api";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/jobs/search?keyword=${keyword}&location=${location}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      if (data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
      } else {
        setError("No jobs found matching your criteria.");
      }
    } catch (err) {
      setError("An error occurred while searching for jobs. Please try again.");
      console.error(err);
    }
  }

  function convertToCSV(jobs: JobType[]) {
    const header = ["Title", "Company", "Location", "Link"].join(",");
    const rows = jobs.map((job) =>
      [job.title, job.company, job.location, job.link].join(",")
    );
    return [header, ...rows].join("\n");
  }

  function downloadCSV() {
    const csv = convertToCSV(jobs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      const filename = `${keyword.replace(/\s+/g, "_")}_${location.replace(
        /\s+/g,
        "_"
      )}.csv`;
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="container mx-auto p-4  text-white">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Job Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                Position
              </label>
              <Input
                id="position"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                Location
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Search
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-400">
            {jobs.length > 0 && `${jobs.length} jobs found`}
          </div>
          {jobs.length > 0 && (
            <Button
              onClick={downloadCSV}
              variant="outline"
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          )}
        </CardFooter>
      </Card>

      {error && (
        <Alert
          variant="destructive"
          className="mt-4 bg-red-900 border-red-800 text-red-100"
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {jobs.length > 0 && (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">{job.company}</p>
                <p className="text-sm text-gray-400">{job.location}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  View Job
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

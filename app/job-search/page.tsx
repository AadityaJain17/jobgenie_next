"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Divide } from "lucide-react";

interface jobType {
  title: string;
  company: string;
  location: string;
  link: string;
}

export default function JobSearch() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [jobs,setJobs] = useState<jobType[]>([])

  const API_URL = "http://localhost:8080/api";

  async function handleSubmit() {
    const response = await fetch(`${API_URL}/jobs/search?keyword=${keyword}&location=${location}`, {
      method: "GET",

    });

    const data = await response.json();
    setJobs((prevJobs) => [...prevJobs, ...data.jobs]);
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-center font-bold mb-6">
          Job Search
        </h1>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm">
              Position
            </label>
            <Input
              id="name"
              name="name"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-2 text-sm">
              Location
            </label>
            <Input
              id="role"
              name="role"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-white"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Search
          </Button>
        </form>
        {jobs.length > 0 &&
          jobs.map((job, i) => (
            <div
              key={i}
              className="p-4 bg-slate-200 m-2 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-semibold">{job.title}</p>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <a
                href={job.link}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Link
              </a>
            </div>
          ))}
      </div>
    </div>
  );
}

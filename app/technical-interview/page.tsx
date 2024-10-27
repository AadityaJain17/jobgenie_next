"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TechnicalInterview() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [context, setContext] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const API_URL = "http://localhost:8080/api";

  async function handleSubmit() {
    const response = await fetch(`${API_URL}/interview/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'start', name, position})
            });

            const data = await response.json();
    setResponses([...responses,data.response]);
    setContext([...context,""])
  }
   async function handleSend() {
     const response = await fetch(`${API_URL}/interview/chat`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ message: context[context.length-1],context, name, position }),
     });

     const data = await response.json();
     setResponses([...responses, data.response]);
     setContext([...context, ""]);
   }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl text-center font-bold mb-6">
          Technical Interview Practice
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
        {/* {message && <p className="mt-4 text-green-400">{message}</p>} */}
        {responses.length > 0 &&
          responses.map((response, i) => (
            <>
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
                <Button onClick={handleSend}> Send </Button>
              </div>
            </>
          ))}
      </div>
    </div>
  );
}

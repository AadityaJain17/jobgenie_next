import { FileText, Laptop, Users, Search } from "lucide-react";

export default function JobGenie() {
  const features = [
    {
      icon: <FileText className="w-12 h-12 text-blue-500" />,
      title: "ATS Resume Checker",
      description: "Optimize your resume for ATS systems",
    },
    {
      icon: <Laptop className="w-12 h-12 text-blue-500" />,
      title: "Technical Interview",
      description: "Practice technical interviews with AI",
    },
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Behavioral Interview",
      description: "Master behavioral questions",
    },
    {
      icon: <Search className="w-12 h-12 text-blue-500" />,
      title: "Job Search",
      description: "Find your next opportunity",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-2 text-center">
        Welcome to JobGenie
      </h1>
      <p className="text-xl mb-12 text-center text-gray-500">
        Your AI-powered career assistant
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-slate-800 rounded-lg shadow p-6"
          >
            <div className="mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

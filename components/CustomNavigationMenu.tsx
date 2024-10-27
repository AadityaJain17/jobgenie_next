import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "./ui/navigation-menu";

export default function CustomNavigationMenu() {
  return (
    <div className="flex justify-center pt-10">
      {" "}
      {/* Centering horizontally and adding top padding */}
      <NavigationMenu className="bg-slate-800 shadow-lg rounded-full p-4">
        {" "}
        {/* Background color, shadow, rounded corners, and padding */}
        <NavigationMenuList className="flex space-x-4">
          {" "}
          {/* Space between items */}
          {[
            { href: "/", label: "HOME" },
            { href: "/ats-score", label: "ATS Resume Checker" },
            { href: "/technical-interview", label: "Technical Interview" },
            { href: "/behavioral-interview", label: "Behavioral Interview" },
            { href: "/job-search", label: "Job Search" },
          ].map(({ href, label }) => (
            <NavigationMenuItem key={href}>
              <Link href={href} passHref>
                <NavigationMenuLink className=" hover:text-white hover:bg-gray-900 rounded-full px-4 py-2 transition-colors">
                  {label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";

export default function JobSearch() {
  return (
    <main>
      <Menubar>
        <MenubarMenu>
          <Link href="/" passHref legacyBehavior>
            <MenubarTrigger>Home</MenubarTrigger>
          </Link>
        </MenubarMenu>
        {/* Add other menu items */}
      </Menubar>
      <h1>Job Search</h1>
      {/* Add your technical interview content here */}
      <div>
        <Input />
      </div>
    </main>
  );
}

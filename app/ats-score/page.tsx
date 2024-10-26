import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";

export default function ATSScore() {
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
      <h1>ATS Score Checker</h1>
      {/* Add your technical interview content here */}
      <div className="grid w-full max-w-sm items-center gap-1.5">
      {/* <Label htmlFor="picture">Picture</Label> */}
      <Input id="picture" type="file" />
    </div>
      <div>
        <Input />
      </div>
    </main>
  );
}

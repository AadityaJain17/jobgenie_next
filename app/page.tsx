import { Switch } from "@radix-ui/react-switch";
import { Input } from "@/components/ui/input";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Menubar>
        <MenubarMenu>
          <Link href="/" passHref legacyBehavior>
            <MenubarTrigger>Home</MenubarTrigger>
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <Link href="/technical-interview" passHref legacyBehavior>
            <MenubarTrigger>Technical Interview</MenubarTrigger>
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <Link href="/behavioral-interview" passHref legacyBehavior>
            <MenubarTrigger>Behavioral Interview</MenubarTrigger>
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <Link href="/ats-score" passHref legacyBehavior>
            <MenubarTrigger>ATS Score Check</MenubarTrigger>
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <Link href="/job-search" passHref legacyBehavior>
            <MenubarTrigger>Job Search</MenubarTrigger>
          </Link>
        </MenubarMenu>
      </Menubar>
      <div>
        <Input />
      </div>
      <div>
        <Switch>HI</Switch>
      </div>
    </main>
  );
}

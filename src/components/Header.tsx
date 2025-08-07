import { shadow } from "@/styles/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";

const Header = async () => {
  const user = await getUser();
  return (
    <header className="flex items-center justify-between w-full h-24 bg-popover px-3 sm:px-6" 
      style={{
        boxShadow: shadow
      }}
    >
      <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors">
        <Image
          src="/Favicon.png"
          alt="Logo"
          width={50}
          height={50}
          className="inline-block mr-2"
        />
        <h1 className="flex flex-col px-2 sm:px-4 text-xl font-semibold leading-6">
          Quick <span className="text-primary font-mono text-[1.4rem]">Note</span>
        </h1>
      </Link>

      <div className="flex items-center space-x-4">
        {user ? <LogOutButton /> : (
          <>
            <Button asChild className="hidden sm:block">
              <Link href="/signup" >
                Sign Up
              </Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href="/login">
                Log In
              </Link>
            </Button>
            
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  )
}

export default Header
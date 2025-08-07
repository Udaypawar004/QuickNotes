import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
    const user = await getUser(); 

    let notes: Note[] = [];

    if (user) {
        notes = await prisma.note.findMany({
            where: {
                authorId: user.id,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar mt-2">
        <SidebarGroup>
            <SidebarGroupLabel className="text-lg font-semibold text-muted-foreground">
                {user ? (
                    <div className="flex flex-col text-2xl">
                        Your notes
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        Please{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            log in
                        </Link>
                        {" "}
                        to access your notes.
                    </p>
                )}
            </SidebarGroupLabel>
            {user && notes.length > 0 ? <SidebarGroupContent notes={notes} /> : null}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;
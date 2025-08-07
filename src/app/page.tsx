import { getUser } from '@/auth/server';
import AskAIButton from '@/components/AskAiButton';
import NewNoteButton from '@/components/NewNoteButton';
import NoteTextInput from '@/components/NoteTextInput';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { prisma } from '@/db/prisma';
import React from 'react'

type props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const page = async ({ searchParams }: props) => {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  const noteId = Array.isArray(noteIdParam) 
    ? noteIdParam![0]
    : noteIdParam || ""; 

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id
    }
  })
  return (
    <div className="flex flex-col items-stretch justify-start pt-[5rem] overflow-hidden h-full gap-4">
      <div className='flex'>
        <SidebarTrigger className="cursor-pointer" />
        <div className='flex w-full max-w-4xl justify-end gap-2'>
          <AskAIButton user={user} />
          <NewNoteButton user={user} />
        </div>
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  )
}

export default page
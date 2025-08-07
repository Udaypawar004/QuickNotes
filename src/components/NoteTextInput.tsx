'use client'

import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Textarea } from './ui/textarea';
import { debounceTime } from '@/lib/constants';
import useNote from '@/hooks/useNote';
import { updateNoteAction } from '@/actions/notes';

type props = {
    noteId: string;
    startingNoteText: string;
}

let updateTimeout: NodeJS.Timeout;

const NoteTextInput = ({ noteId, startingNoteText }: props) => {
    const noteIdParam = useSearchParams().get("noteId") || "";
    const {noteText, setNoteText} = useNote();

    useEffect(() => {
        if (noteIdParam === noteId) {
          setNoteText(startingNoteText);
        }
    }, [startingNoteText, noteId, noteIdParam, setNoteText]);

    const handleUpdateNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Logic to update the note text in the database
        const text = e.target.value;
        setNoteText(text);

        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          updateNoteAction(noteId, text);
        }, debounceTime);
    }
  return (
    <Textarea 
      value={noteText}
      onChange={handleUpdateNote}
      placeholder='Write your note here...'
      className='custom-scrollbar w-full max-w-8xl h-screen overflow-hidden resize-none p-4 text-base sm:text-lg md:text-xl lg:text-2xl placeholder:text-muted-foreground'
      autoFocus
      data-note-id={noteId || noteIdParam}
      data-starting-text={startingNoteText}
    />
  )
}

export default NoteTextInput
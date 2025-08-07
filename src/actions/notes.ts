"use server"

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";

type Note = Awaited<ReturnType<typeof prisma.note.findFirst>>;

export async function updateNoteAction(noteID: string, text: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("User not authenticated, please log in.");
        }

        const updatedNote = await prisma.note.update({
            where: { id: noteID, authorId: user.id },
            data: { text },
        });
        
        return { errorMessage: null };
    } catch (error: any) {
        return { errorMessage: handleError(error) };
    }
}

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: handleError(error) };
  }
};

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    const userExists = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userExists) {
      throw new Error(`User with ID ${user.id} does not exist.`);
    }

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });
    return { errorMessage: null };
  } catch (error: any) {
  console.error("❌ Prisma note creation failed:", error);
  throw new Error("Failed to create note");
}
}

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
): Promise<string> => {
  const user = await getUser();
  if (!user) {
    throw new Error("You must be logged in to ask AI questions");
  }

  const notes: Note[] = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc"}
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes: string = notes
    .map((note) =>
      `
      Text: ${note?.text}
      Created at: ${note?.createdAt.toISOString()}
      Last updated: ${note?.updatedAt.toISOString()}
      `.trim(),
    )
    .join("\n");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chatHistory: Content[] = [
    {
      role: "user",
      parts: [
        {
          text: `
            You are a helpful assistant that answers questions about a user's notes.
            Assume all questions are related to the user's notes.
            Make sure that your answers are not too verbose and you speak succinctly.
            Your responses MUST be formatted in clean, valid HTML with proper structure.
            Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate.
            Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph.
            Avoid inline styles, JavaScript, or custom attributes.

            Here are the user's notes:
            ${formattedNotes}
          `,
        },
      ],
    },
  ];

  for (let i = 0; i < newQuestions.length - 1; i++) {
    chatHistory.push({
      role: "user",
      parts: [{ text: newQuestions[i] }],
    });
    if (responses.length > i) {
      chatHistory.push({
        role: "model",
        parts: [{ text: responses[i] }],
      });
    }
  }

  const chat = model.startChat({ history: chatHistory });

  const lastQuestion = newQuestions[newQuestions.length - 1];
  const result = await chat.sendMessage(lastQuestion);
  const response = result.response;
  const text = response.text();

  return text || "A problem has occurred";
};
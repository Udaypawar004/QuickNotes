'use server'

import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { toast } from "sonner";

export async function loginAction(email: string, password: string) {
    try {
        const { auth } = await createClient();
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return {errorMessage: "User account not found"};
        }
        const { error } = await auth.signInWithPassword({ email, password });
        if (error) {
            throw error;
        }
        return { errorMessage: null };
    } catch (error: any) {
        return { errorMessage: handleError(error) };
    }
}

export async function logoutAction() {
    try {
        const { auth } = await createClient();
        const { error } = await auth.signOut();
        if (error) {
            throw error;
        }
        return { errorMessage: null };
    } catch (error: any) {
        return { errorMessage: handleError(error) };
    }
}

export async function signupAction( email: string, password: string) {
    try {
        const { auth } = await createClient();
        const { data, error } = await auth.signUp({ email, password });
        if (error) {
            throw error;
        }

        const userId = data.user?.id;
        if (!userId) {
            throw new Error("User ID not found after signup");
        }

        await prisma.user.create({
            data: {
                id: userId,
                email,
            },
        })

        return { errorMessage: null };
    } catch (error: any) {
        return { errorMessage: handleError(error) };
    }
}
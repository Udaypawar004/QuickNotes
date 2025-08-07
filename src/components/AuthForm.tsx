'use client';

import { useRouter } from 'next/navigation';
import React from 'react'
import { CardContent, CardFooter } from './ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loginAction, signupAction } from '@/actions/users';

const AuthForm = ({ type }: { type: 'login' | 'signup' }) => {
    const isLogin = type === 'login';
    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {
            const email = e.currentTarget.email.value;
            const password = e.currentTarget.password.value;
            let errorMessage = null;
            let title = null;
            let description = null;
            if (isLogin) {
                errorMessage = (await loginAction( email, password )).errorMessage;
                // console.log("Error message: ", errorMessage);
                if (errorMessage) {
                    title = "Log in failed";
                    description = "Account not found. Click on the sign up button";
                } else {
                    title = "Logged In";
                    description = "You have successfully logged in.";
                }
            } else {
                errorMessage = (await signupAction(email, password)).errorMessage;
                // console.log("Error message: ", errorMessage);
                if (errorMessage) {
                    title = "Sign up failed";
                    description = "Internal server error...";
                } else {
                    title = "Account verification pending";
                    description = "Your account has been created successfully. check your mail to verify.";
                }
            }
            if (errorMessage) {
                toast.error(title, {
                    description: description,
                    action: {
                    label: "Sign up",
                    onClick: () => {
                        window.location.href = "/signup";
                    }
                }
                });
            } else {
                toast.success(title, {
                    description: description,
                });
                router.replace('/');
            }
        });
    }
  return (
    <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
            <h2 className='text-2xl font-bold text-center'>{isLogin ? 'Log In' : 'Sign Up'}</h2>
            <div className='space-y-2'>
                <label htmlFor="email" className='block text-sm font-medium'>Email</label>
                <input type="email" id="email" name="email" required className='w-full p-2 border rounded-lg' />
            </div>
            <div className='space-y-2'>
                <label htmlFor="password" className='block text-sm font-medium'>Password</label>
                <input type="password" id="password" name="password" required className='w-full p-2 border rounded-lg' />
            </div>
        </CardContent>
        <CardFooter className='mt-4 flex flex-col gap-6'>
            <button
            type="submit"
            className='w-full bg-blue-500 text-white flex items-center justify-center p-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer'
            >
            {isPending ? <Loader2 className='animate-spin' /> : isLogin ? 'Log In' : 'Sign Up'}
            </button>
            <p className='text-sm text-center text-gray-500'>
            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
            <a href={isLogin ? '/signup' : '/login'} className='text-blue-500 hover:underline'>
                {isLogin ? ' Sign Up' : ' Log In'}
            </a>
            </p>
        </CardFooter>
        
    </form>
  )
}
export default AuthForm
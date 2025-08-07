"use client"

import React from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { logoutAction } from '@/actions/users'

const LogOutButton = () => {
    const [loading, setLoading] = React.useState(false);
    const handleOnClick = async () => {
        setLoading(true);
        const { errorMessage } = await logoutAction();
        if (errorMessage) {
            toast.error(errorMessage, {
                description: "Please try again later.",
            });
        } else {
            toast.success("Logged out successfully!", {
                description: "You have been logged out.",
            });
        }
        setLoading(false);
    }
    
  return (
    <Button
        variant={"outline"}
        className='w-24 cursor-pointer'
        onClick={handleOnClick}
        disabled={loading}
    >
        {loading ? <Loader2 className='animate-spin' /> : "Log Out"}
    </Button>
  )
}

export default LogOutButton
import AuthForm from '@/components/AuthForm'
import { Card } from '@/components/ui/card'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-1 flex-col items-center mt-20'>
      <Card className='w-full max-w-md p-6'>
          <AuthForm type="signup" />
      </Card>
    </div>
  )
}

export default page
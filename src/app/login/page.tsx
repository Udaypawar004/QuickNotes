import AuthForm from '@/components/AuthForm'
import { Card } from '@/components/ui/card'
import React from 'react'

const Login = () => {
  return (
    <div className='flex flex-1 flex-col items-center mt-20'>
      <Card className='w-full max-w-md p-6'>
          <AuthForm type="login" />
      </Card>
    </div>
  )
}

export default Login
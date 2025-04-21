import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (<div className='min-h-screen w-full flex justify-center items-center bg-white dark:bg-blue-950'>
    <SignIn afterSignInUrl={'/agency'}/>
  </div>
  )
}

export default page



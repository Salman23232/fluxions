import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
    <ClerkProvider
        appearance={{baseTheme:dark}}>
        {children}
        </ClerkProvider>
    </div>
  )
}

export default layout
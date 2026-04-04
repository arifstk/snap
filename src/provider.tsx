// provider.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import React from 'react'

const Provider = ({children}: {children: React.ReactNode}) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default Provider;

// this provider will be used to wrap the entire app and provide the necessary context for authentication and other global states.

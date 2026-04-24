import React from 'react'

interface AuthLayouttProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayouttProps) {
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      {children}
    </div>
  )
}

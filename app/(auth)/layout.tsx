import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      {children}
    </div>
  )
}

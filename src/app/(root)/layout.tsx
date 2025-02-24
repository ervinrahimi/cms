import { ChatBot } from '@/components/chat/chat-bot/ChatBot'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CMS Project',
  description: 'Content Management System Project',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* ChatBot component is rendered here */}
      <ChatBot />

      {/* Clerk Auth Buttons */}
      <div className='clerk-auth-buttons'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Render children */}
      {children}
    </>
  )
}

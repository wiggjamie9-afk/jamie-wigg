import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Sunny's Cozy Quokka Bedtime Tales",
  description: 'Join Sunny the quokka on gentle adventures through the Australian bush. Beautiful bedtime stories for children ages 1-5.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-amber-50 to-orange-50">
        {children}
      </body>
    </html>
  )
}

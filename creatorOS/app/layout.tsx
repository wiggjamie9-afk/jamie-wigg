import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CreatorOS',
  description: 'All-in-one AI platform for creators: generate content, schedule posts, monetize, and get AI coaching',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}

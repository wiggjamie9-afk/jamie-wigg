import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RESONANCE - One lesson a day makes your brain bigger and brighter',
  description: 'Brain-building ecosystem with 21 AI-powered apps for personal growth',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {children}
      </body>
    </html>
  );
}

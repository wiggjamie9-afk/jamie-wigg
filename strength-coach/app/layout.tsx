import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fitness Companion',
  description: 'Your AI fitness coach with real-time voice guidance',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fitness Companion',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans overflow-hidden">
        {children}
      </body>
    </html>
  );
}

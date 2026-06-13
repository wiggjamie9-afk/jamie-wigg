import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Event Platform',
  description: 'Curated events for your community',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Event Platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
        <script src="https://unpkg.com/@ionic/core"></script>
        <script src="https://unpkg.com/@capacitor/core"></script>
      </body>
    </html>
  );
}

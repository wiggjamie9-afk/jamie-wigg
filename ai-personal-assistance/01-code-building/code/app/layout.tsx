import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sandbox Runner — Run Code Safely",
  description: "Isolated code execution + AI feedback. No setup required.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%232563EB' width='100' height='100'/><text x='50' y='75' font-size='60' fill='white' text-anchor='middle' font-weight='bold'>◾</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-slate-900 text-slate-100`}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}

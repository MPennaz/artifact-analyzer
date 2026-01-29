// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'artifact-analyzer',
  description: 'Artifact Analyzer'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          'min-h-screen bg-background text-foreground antialiased'
        ].join(' ')}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}



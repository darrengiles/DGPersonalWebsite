import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import Navigation from '@/components/Navigation';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Darren Giles | Personal Website',
  description: 'Personal portfolio website of Darren Giles - Product Manager',
  icons: {
    icon: '/logo.png',
    apple: '/logo192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <ThemeToggle />
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import Navigation from '@/components/Navigation';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import './globals.css';

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
      <body>
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

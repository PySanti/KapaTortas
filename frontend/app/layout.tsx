import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Rubik } from 'next/font/google';
const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${rubik.className} min-h-screen antialised bg-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}

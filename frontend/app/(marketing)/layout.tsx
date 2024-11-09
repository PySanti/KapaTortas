import type { Metadata } from 'next';
import '../globals.css';
import { Rubik } from 'next/font/google';
import Navbar from '../(views)/components/Navbar';
const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kapatortas',
  description: 'Kapatortas, las mejores tortas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${rubik.className} min-h-screen antialised bg-gray-50 antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

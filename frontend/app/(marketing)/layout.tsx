import type { Metadata } from 'next';
import '../globals.css';
import { Rubik } from 'next/font/google';
import Navbar from '../(views)/components/main-nav';
import Footer from "../(views)/components/footer"

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
        <div className='min-h-screen flex flex-col relative'>
          <Navbar />
          <main className='flex-grow pb-[footer-height] relative z-0'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

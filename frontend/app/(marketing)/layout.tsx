import type { Metadata } from "next";
import "../globals.css";
import { Rubik } from "next/font/google";
import Navbar from "../(views)/components/main-nav";
import Footer from "../(views)/components/footer";
import { marketingConfig } from "../models/config/marketing";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kapatortas",
  description: "Kapatortas, las mejores tortas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  return (
    <html lang="en">
      <body
        className={`${rubik.className} min-h-screen antialised bg-gray-50 antialiased`}
      >
        <SessionProvider>
          <div className="min-h-screen flex flex-col relative">
            <header className="sticky top-0 bg-gray-50 shadow inset-x-0 z-[10] ">
              <Navbar items={marketingConfig.mainNav} user={user} />
            </header>

            <main className="flex-grow pb-[footer-height] relative z-0">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}

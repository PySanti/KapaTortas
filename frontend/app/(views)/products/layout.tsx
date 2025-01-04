import Navbar from "../components/main-nav";
import Footer from "../components/footer";
import { marketingConfig } from "@/app/models/config/marketing";
import { auth } from "@/auth";

export default async function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-gray-50 shadow inset-x-0 z-[50]">
        <Navbar
          className="max-w-none"
          items={marketingConfig.mainNav}
          user={user}
        />
      </header>
      <main className="flex-grow pb-[footer-height] relative z-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}

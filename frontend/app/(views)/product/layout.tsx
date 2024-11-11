import Navbar from "../components/main-nav";
import Footer from "../components/footer";

export default async function ProductLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col relative">
          <Navbar />
          <main className='flex-grow pb-[footer-height] relative z-0'>{children}</main>
          <Footer />
        </div>
    )
}
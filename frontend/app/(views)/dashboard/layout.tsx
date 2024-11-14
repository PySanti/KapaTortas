import { auth } from '@/auth';
import { dashboardConfig } from '@/app/models/config/dashboard';
import Navbar from '../components/main-nav';
import Sidebar from '../components/sidebar';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='sticky top-0 bg-gray-50 shadow inset-x-0 z-[50]'>
        {/* <Navbar className='max-w-none' user={user} /> */}
        <Navbar className='max-w-none' user={user} />
      </header>

      <div className='container flex-1 items-start md:grid md:grid-cols-[160px_minmax(0,1fr)] md:gap-2 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-4'>
        <aside className='fixed top-14 pt-6 lg:pt-10 z-40 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block'>
          <div className='h-full pr-6'>
            <Sidebar items={dashboardConfig.sidebarNav} />
          </div>
        </aside>
        <main className='flex-1 flex-col'>{children}</main>
      </div>
    </div>
  );
}

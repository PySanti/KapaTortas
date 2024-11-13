import { auth } from '@/auth';
import SignOutButton from '../components/sign-out-button';

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className='py-6 md:py-10 space-y-4'>
      <h1 className='text-3xl font-bold tracking-tight text-gray-900 md:text-4xl'>
        {session?.user.name}
      </h1>
      <p className='text-2xl'> {session?.user.email}</p>
      <SignOutButton />
    </div>
  );
}

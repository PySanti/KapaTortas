import { useSession } from 'next-auth/react';

export default function getCurrentUser() {
  const session = useSession();

  return session.data?.user;
}

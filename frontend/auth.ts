import NextAuth, { User } from 'next-auth';
import authConfig from '@/auth.config';
import { Role } from './app/models/RolEnum';
import type { Adapter } from '@auth/core/adapters';

//* Augment the default session, user & JWT Token to include role and stripeCustomerId
declare module 'next-auth' {
  interface Session {
    user: User & {
      role: Role;
      stripeCustomerId: string;
    };
    token: {
      role: Role;
      stripeCustomerId: string;
    };
  }
  interface User {
    role: Role;
    stripeCustomerId: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    stripeCustomerId: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: 'jwt' },
  // secret: process.env.AUTH_SECRET,
  ...authConfig,
});

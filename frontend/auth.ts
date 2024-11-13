import NextAuth, { User } from 'next-auth';
import authConfig from '@/auth.config';
import { Rol } from './app/models/RolEnum';

//* Augment the default session, user & JWT Token to include role and stripeCustomerId
declare module 'next-auth' {
  interface Session {
    user: User & {
      rol: Rol;
      stripeCustomerId: string;
      // auth_token: string;
    };
    token: {
      rol: Rol;
      stripeCustomerId: string;
      // auth_token: string;
    };

    // auth_token: string;
  }
  interface User {
    rol: Rol;
    stripeCustomerId: string;
    // auth_token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    rol: Rol;
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

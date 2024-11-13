import { type Session, type User } from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { JWT } from 'next-auth/jwt';
import ClienteAPI from './app/controladores/api/users/ClienteAPI';
import { stripe } from '@/app/controladores/lib/stripe';
import passwordsMatch from './app/controladores/utilities/passwords-match';
import crearStripeId from './app/controladores/utilities/crear-stripeid';
import correoVerificado from './app/controladores/utilities/correo-verificado';
import { authRoutes, defaultLoginRedirect, publicRoutes } from './app/models/config/routes';
// import { authRoutes, defaultLoginRedirect, publicRoutes } from './config/routes';

export default {
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // If not credentials are provided, return null to indicate no user logged in
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        //* Check if user exists
        const cliente = await ClienteAPI.obtenerCliente(credentials.email as string);

        // Check if cliente is null
        if (!cliente || !cliente.perfil) {
          return null;
        }

        const { perfil: user } = cliente;

        // Check if user has a password
        if (!user.contraseña) {
          return null;
        }

        const isPasswordValid = await passwordsMatch(
          credentials?.email as string,
          credentials?.password as string
        );

        if (!isPasswordValid) {
          return null;
        }

        if (isPasswordValid) {
          console.log('Contraseña correcta');
        } else {
          console.log('Contraseña incorrecta');
        }

        //* Create a customer in stripe for the user (if not already created). This works only for the (credentialsProvider)
        //* This is created before the user is logged in for the first time

        if (user.nombre_completo && user.correo && !user.stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.correo,
            name: user.nombre_completo,
          });

          // 2. Actualizar el usuario con su id de cliente en Stripe
          await crearStripeId(user.correo, customer.id);

          console.log('Usuario creado en stripe');
        }

        // extend profile type and add auth_token

        return {
          name: user.nombre_completo || 'google123',
          email: user.correo,
          image: user.link_foto,
          rol: user.rol,
          stripeCustomerId: user.stripeCustomerId,
          auth_token: user.auth_token,
        };
      },
    }),
  ],
  events: {
    //* Create a customer in stripe for the user. This works only for the google provider
    createUser: async ({ user }) => {
      // 1. Create a customer in Stripe
      if (user.name && user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });

        // console.log('User created in stripe');

        // 2. Actualizar el usuario con su id de cliente en Stripe
        await crearStripeId(user.email, customer.id);
      }
    },
    //* Set true emailVerified if the user is created using the google provider
    async linkAccount({ user }) {
      await correoVerificado(user.email!);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow oauth users to sign in without verifying their email
      if (account?.provider === 'google') {
        if (user) {
          const idToken = account?.id_token;

          const url = `http://localhost:8000/api/perfiles/google_service/`;

          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                auth_token: idToken, // Send id token to backend
              }),
            });
            const data = await response.json();

            // Assign the `tokens` field from the API response to `user.auth_token`
            user.auth_token = data.tokens;
            return true;
          } catch (error) {
            return false;
          }
        }
      }

      //* Check if user exists
      const cliente = await ClienteAPI.obtenerCliente(user.email!);

      // Check if user is null
      if (!cliente || !cliente.perfil) {
        return false;
      }

      const isActive = cliente.perfil.is_active;

      if (!isActive) return false;

      return true;
    },
    authorized({ auth, request: { nextUrl } }) {
      const { pathname, search } = nextUrl;
      const isLoggedIn = !!auth?.user;

      console.log('Current pathname:', pathname);
      // console.log('Is logged in:', isLoggedIn);

      //* Check if the user is on an auth page
      const isOnAuthPage = authRoutes.some((page) => pathname.startsWith(page));
      // console.log('Is on auth page:', isOnAuthPage);

      //* Check if the user is on a public page
      const isOnUnprotectedPage =
        pathname === '/' || publicRoutes.some((page) => pathname.startsWith(page));
      // console.log('Is on unprotected page:', isOnUnprotectedPage);
      const isProtectedPage = !isOnUnprotectedPage;
      // console.log('Is protected page:', isProtectedPage);

      if (isOnAuthPage) {
        //* Redirect to /dashboard if logged in and is on an auth page
        if (isLoggedIn) {
          // console.log('Redirecting to dashboard from auth page');
          return Response.redirect(new URL(defaultLoginRedirect, nextUrl));
        }
      } else if (isProtectedPage) {
        //* Redirect to /login if not logged in but is on a protected page
        if (!isLoggedIn) {
          const from = encodeURIComponent(pathname + search); //* The /login page shall then use this `from` param as a `callbackUrl` upon successful sign-in
          // console.log('Redirecting to login from protected page');
          return Response.redirect(new URL(`/login?from=${from}`, nextUrl));
        }
      }

      //* Don't redirect if on an unprotected page or if logged in and is on a protected page
      return true;
    },
    async jwt({ token, user, session }) {
      // console.log('jwt callback', { token, user, session });

      const existingUser = await ClienteAPI.obtenerCliente(token?.email as string);

      // If no user exists
      if (!existingUser) return token;

      if (user) {
        if (user.auth_token) {
          token.auth_token = user.auth_token; // Add auth_token to token
        }

        return {
          ...token,
          rol: user.rol,
          // If it's null, set it to an empty string
          stripeCustomerId: user.stripeCustomerId || '',
        };
      }

      return token;
    },
    async session({ session, token, user }: { session: Session; token?: JWT; user?: User }) {
      // console.log('session callback', { session, token, user });

      if (token) {
        if (token.auth_token) {
          session.auth_token = token.auth_token as string;
        }
        return {
          ...session,
          user: {
            ...session.user,
            rol: token.rol,
            stripeCustomerId: token.stripeCustomerId,
          },
        };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

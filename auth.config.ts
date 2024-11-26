import type { NextAuthConfig } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';


// En précisant "signIn: '/login'", le user sera redirigé vers notre page de login custom plutot que sur la page de nextAuth.js par défault. 

export const authConfig = {
   pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },

  // un provider bidon pour tester. Error si pas de provider. 
  providers: [],
} satisfies NextAuthConfig;
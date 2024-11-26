import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
// ce fichier avec le nom middleware est toujours lu.. et doit avoir un export par défaut.
// si on veut supprimer nextAuth, faut renommer le fichier....
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher

  // toutes les routes sauf celles spécifiées par le motif d'exclusion comme /api, _next/static,
  // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],


  // pour pouvoir seeder sans renommer le fichier middleware
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|seed).*)']

};
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  /* images: {
    localPatterns: [
      {
        pathname: '/images/*',
        search: '',
      },
    ],
  },  */
  
  
  // config nécéssaire pour autoriser le partial pre rendering, 
  // qui permet en utilisant Suspense de react, 
  // de rendre sur une même page des partie dynamlic et d'autre static 
  // Mais il faut également, l'autoriser dans le le layout de notre route ! => ""export const experimental_ppr = true;"

  // la diff se verra surtout en prod, 
  // Next.js pré-affichera les parties statiques de la route et différera les parties dynamiques jusqu'à ce que l'utilisateur les demande.
   experimental: {
    ppr: 'incremental',
  }, 
};

export default nextConfig;

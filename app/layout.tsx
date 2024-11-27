import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import { Metadata } from 'next';

// ajout de metadata générique dans toutes mes pages, mais mais qu'on peut override dans chaque page.
export const metadata: Metadata = {
  title: {
    template: '%s | Mon beau site', // ici le signe %s sera remplacé par le titre spécific de chaque page, comme défini dans la page invoice.
    default: 'Acme Dashboard', // et la valeur si aucune donnée n'est présente uns des pages...
  },  description: 'Une belle description dans le layout',
  metadataBase: new URL('https://next-learn-dasboard.vercel.sh'),
}


// ici je peux modifier la balise HTML et la balise Body, et les changement seront partout présent dans mon app. 
// c'est également icic que je peux ajouter des métadata ! 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // antialiased => Tailwind CSS => Utilities for controlling the font smoothing of an element.
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

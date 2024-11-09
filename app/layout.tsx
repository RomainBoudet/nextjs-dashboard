import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';


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

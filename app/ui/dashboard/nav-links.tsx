"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", 
    href: "/dashboard/customers", 
    icon: UserGroupIcon 
  },
];

// ici avec Link, et Nextjs en général, on a du code-splitting :
/* 
A l'inverse d'une SPA sous REact, qui va charger toute l'app, 
ici Nextjs va uniquement charger le segment de route demandé
sans tous charger.
Et chaque page est est comme isolée, 
Si une erreur est renvoyée par une page, les autres pages vont continuer à fonctionner ! 
Et en Prod, quand le composant Link apparait dans le navigateur, Next/js va automatiquement télécharger le code qui est lié a la balise Link. 
Ainsi le code va déja être télécharger dans le background quand le user va cliquer sur le lien.
Et la page va changer en un instant. 
 */
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            // avec clsx on peut définr que quand le l'url est comme le href du lien, alors on défini un style particuler !
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

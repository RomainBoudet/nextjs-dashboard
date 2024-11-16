"use client";
// ==> c'est un client component, je peux utiliser des hook et des event listener dans ce fichier !

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
// avec useDebounce, je lui d'attendre quelque miliseconde avant de lancer la requete pour fetch les données, sinon on fetch les données a chaque nouvelle lettre !
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


 // function handlesearch(term: string) {
   const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    // URLSearchParams is a Web API that provides utility methods for manipulating the URL query parameters.
    // Instead of creating a complex string literal, you can use it to get the params string like ?page=1&query=a.
    const params = new URLSearchParams(searchParams);
    // si l'input du user est vide, alors je supprime les paramétres

    // quand le user tape un nouveau mot, on reset le numéro de page a 1
    params.set('page', '1');

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // je met a jour l'URL, désormais dés qu'un mot est rentré dans la barre de recherche, on le retrouve dans l'URL, mis a jour avec une query !
    replace(`${pathname}?${params.toString()}`)
  }, 300);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // On s'assure de la synchronisation entre le champs de recherche et l'url soit toujours lié, si un user tape une query dans l'url, ça met a jour la barre de recherche
        defaultValue={searchParams.get('query')?.toString()}
        // si utilisation de state pour stocker l'input, on utilise "value", mais ici la donnée est stockée dans l'URL, on peut utiliser defaultValue ! 
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}

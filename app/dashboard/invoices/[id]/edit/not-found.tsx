'use client'

import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import * as Sentry from "@sentry/nextjs";
import { useEffect } from 'react';
import { usePathname } from "next/navigation";



export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    // Capturer un événement personnalisé pour les erreurs 404
    Sentry.captureMessage("404 Not Found: Page missing", {
      level: "warning", // Définir le niveau de gravité
      tags: {
        route: pathname, // Ajouter un tag pour identifier la page
      },
    });
  }, []);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
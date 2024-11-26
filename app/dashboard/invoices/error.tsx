"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { usePathname } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
//! attention le error.digest est le même si c'est la même erreur qui arrive plusieur fois. 
//! ne permet pas de discriminer une erreur en particulier dans le dashboard sentry.

  useEffect(() => {
    // Optionally log the error to an error reporting service
    // arrive de sentry ici pour renvoyer les erreur sur le dashboard de Sentry
    Sentry.setUser({
      id: "1234", // Remplacez par l'ID de l'utilisateur authentifié
      email: "user@example.com", // Remplacez par l'e-mail
      username: "exampleUser", // Nom d'utilisateur, si applicable
    });


     Sentry.captureException(error, {
        tags: {
          route: pathname, // Ajoutez la route
          digest: error.digest, // Inclure le digest comme tag

        },
        extra: {
          digest: error.digest,
          stack: error.stack,
          message: error.message,
        },
      });


  }, [error, pathname]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      {error.digest && (
        <p className="text-sm text-gray-500 mt-2">
          Error ID: <span className="font-mono">{error.digest}</span>
        </p>
      )}
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}

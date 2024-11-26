"use client";

import { CustomerField } from "@/app/lib/definitions";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createInvoice, State } from "@/app/lib/actions";
import { useActionState, useState, useEffect } from "react";

/* 
En HTML, on passe normalement une URL a l'attribut action. Et ectte url est la destination ou le form data doit être envoyé. (souvent un endpoint API)
Cependant via Next.js Server ACtion crée un endpoint API POST; c'est pourquoi on n'a pas besoin de les crée manuellement. 
*/

//! il serait préférable de mettre en place zod en front uniquement
//! afin de laisser l'API faire son boulot de son coté avec Joi ou Zod pouvant faire son choix indépendamment...

type Errors = {
  customerId?: string[];
  amount?: string[];
  status?: string[];
};

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState: State = { message: null, errors: {} };
  /* 
   useActionSate permet de surveiller l'état des Server Actions dans notre composant client
          Suivre l'état de l'action : Est-ce que l'action est en cours, a réussi, ou a échoué ?
          Obtenir les résultats de l'action : Récupérer les données ou erreurs renvoyées par l'action.
          Gérer des chargements ou afficher des messages : Utiliser cet état pour afficher des indicateurs visuels comme des spinners ou des messages d'erreur.
  */
  const [state, formAction] = useActionState(createInvoice, initialState);
  console.log("state ==> ", state);

  // Garde les valeurs des champs du formulaire
  const [formValues, setFormValues] = useState({
    customerId: "",
    amount: "",
    status: "",
  });

  const [errorAfterUserChange, setErrorAfterUserChange] = useState<Errors>({});

  // Mise à jour des valeurs du formulaire
  const handleInputChange = (field: keyof typeof formValues, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));

    // Supprime l'erreur associée au champ modifié
    handleFieldChange(field);
  };

  // A chaque modification du user, j'enléve le champs qu'il vient de modifié du state errorAfterUserChange
  // pour discriminer les camps avec erreur mais qui viennent d'être modifié par le user avant envoie API
  const handleFieldChange = (field: keyof Errors) => {
    setErrorAfterUserChange((prevErrors) => {
      if (!prevErrors) return {}; // Protection contre un état `undefined` (au cas où)
      // Destructuration pour exclure la clé `field`
      const { [field]: _, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const hasErrors = (errors: Errors) => Object.keys(errors).length > 0;


  // Synchronisation entre `state` et `errorAfterUserChange`
  useEffect(() => {
    setErrorAfterUserChange(state.errors || {}); // On ré-initialise le localState a chaque changement du state ou objet vide
  }, [state]);

  console.log("errorAfterUserChange==>", errorAfterUserChange);

  console.log( Object.keys(errorAfterUserChange).length);

  return (
    <form action={formAction}>
      <div
        className="rounded-md bg-gray-50 p-4 md:p-6"
        aria-describedby="error"
      >
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={formValues.customerId}
              onChange={(e) => handleInputChange("customerId", e.target.value)}
              aria-describedby="customer-error" // Permet de faire le lien entre le select et l'affic-hage de l'erreur dans la div "customer-error"
              // les liseur d'écran vont lire cette description quand le user va intéragir avec le select pour les avertir d'une erreur.
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div
            id="customer-error"
            aria-live="polite"
            aria-atomic="true" // div qui fait le lien avec le select pour afficher l'erreur,
            // Le lecteur d'écran doit informer le user du changement de status mais uniquement lorsque le user est inactif pour ne pas le déranger.
          >
            {state.errors?.customerId &&
              errorAfterUserChange.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                value={formValues.amount}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                onChange={(e) => handleInputChange("amount", e.target.value)}
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount &&
              errorAfterUserChange.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  checked={formValues.status === "pending"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  aria-describedby="invoice-status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  checked={formValues.status === "paid"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  aria-describedby="invoice-status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="invoice-status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              Object.keys(errorAfterUserChange).length > 0 &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <div id="error" aria-live="polite" aria-atomic="true">
          {state.message &&  hasErrors(errorAfterUserChange) && (
            <p className="mt-2 text-sm text-red-500" key={state.message}>
              {state.message}
            </p>
          )}
        </div>
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}

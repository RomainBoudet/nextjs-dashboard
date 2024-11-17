"use server";
// ici, c'est un back avec une API...

import { z } from "zod";
import db from "@/app/lib/db";
import { expirePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // transforme automatiquement en number la string reçu ! Si la valeur ne peut pas être convertit en number, valeur rejetté !
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true }); // on se base sur le schéma pré-défino-i mais en omettant id et date, qui ne sont pas dans le formulaire.
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // si on a beaucoup d'entrée, on peut aussi utiliser => const rawFormData = Object.fromEntries(formData.entries())
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100; //=> toujours les valeurs en centimes !
  const date = new Date().toISOString().split("T")[0]; // une date. (pourrait être géré par postgres dans le back...)

  // j'ai désormais tous mes data prêtes a être envoyées en BDD !

  await db.query(
    `
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES ($1, $2, $3, $4)
    `,
    [customerId, amountInCents, status, date]
  );

  // On clear le cache et on envoit une nouvelle requete au server pour qu'il mette a jour les données.
  expirePath("/dashboard/invoices");
  // On redirige vers la page invoice dans la foulée.
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  await db.query(
    `
        UPDATE invoices
        SET
          customer_id = $1,
          amount = $2,
          status = $3
        WHERE id = $4
        `,
    [customerId, amountInCents, status, id]
  );

  expirePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// quand le user appuie sur le bouton, il éfface l'invoice en BDD, expirePath déclenche une nouvel appel au server et affiche la table sans l'invoice supprimé,
// et vu qu'on est déja sur la page /dashboard/invoice pas besoin de rediriger.
export async function deleteInvoice(id: string) {
    await db.query(`DELETE FROM invoices WHERE id = $1`, [id]);
    expirePath('/dashboard/invoices');
  }

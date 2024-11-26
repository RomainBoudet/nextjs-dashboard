"use server";
// ici, c'est un back avec une API...

import { z } from "zod";
import db from "@/app/lib/db";
import { expirePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true }); // on se base sur le schéma pré-définit mais en omettant id et date, qui ne sont pas dans le formulaire.
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // si on a beaucoup d'entrée, on peut aussi utiliser => const rawFormData = Object.fromEntries(formData.entries())
  // "safeParse" retoourne un objet qui contient succes ou error. Plus facile pour gérer la validation que "parse"
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  //
  /* 
  validatedFields.error?.flatten() ==> {
  formErrors: [],
  fieldErrors: {
    customerId: [ 'Please select a customer.' ],
    amount: [ 'Please enter an amount greater than $0.' ],
    status: [ 'Please select an invoice status.' ]
  }
} 
  */

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data; // le .data est présent uniquement si la cle success: true dans le validateFields
  const amountInCents = amount * 100; //=> toujours les valeurs en centimes !
  const date = new Date().toISOString().split("T")[0]; // une date. (pourrait être géré par postgres dans le back...)

  // j'ai désormais tous mes data prêtes a être envoyées en BDD !
  try {
    await db.query(
      `
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ($1, $2, $3, $4)
        `,
      [customerId, amountInCents, status, date]
    );
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // On clear le cache et on envoit une nouvelle requete au server pour qu'il mette a jour les données.
  expirePath("/dashboard/invoices");
  // On redirige vers la page invoice dans la foulée.
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  // throw new Error('Failed to update Invoice');
  try {
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
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Invoice.",
    };
  }

  expirePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// quand le user appuie sur le bouton, il éfface l'invoice en BDD, expirePath déclenche une nouvel appel au server et affiche la table sans l'invoice supprimé,
// et vu qu'on est déja sur la page /dashboard/invoice pas besoin de rediriger.
export async function deleteInvoice(id: string) {

  try {
    await db.query(`DELETE FROM invoices WHERE id = $1`, [id]);
    expirePath("/dashboard/invoices");
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Invoice.",
    };
  }
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

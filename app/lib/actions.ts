'use server';
// ici, c'est un back avec une API...


import { z } from 'zod';
import db from '@/app/lib/db';
import { expirePath } from 'next/cache';
import { redirect } from 'next/navigation';


const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // transforme automatiquement en number la string reçu ! Si la valeur ne peut pas être convertit en number, valeur rejetté !
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true }); // on se base sur le schéma pré-défino-i mais en omettant id et date, qui ne sont pas dans le formulaire.  
 
export async function createInvoice(formData: FormData) {
   // si on a beaucoup d'entrée, on peut aussi utiliser => const rawFormData = Object.fromEntries(formData.entries())
   const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100; //=> toujours les valeurs en centimes !
  const date = new Date().toISOString().split('T')[0]; // une date. (pourrait être géré par postgres dans le back...)

  // j'ai désormais tous mes data prêtes a être envoyées en BDD !

  await db.query(
    `
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES ($1, $2, $3, $4)
    `,
    [customerId, amountInCents, status, date]
  );

  expirePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}
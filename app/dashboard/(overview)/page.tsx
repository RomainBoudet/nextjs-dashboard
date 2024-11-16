import { Card } from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import CardWrapper from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";

import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from "../../lib/data";
import { Suspense } from "react";
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from "@/app/ui/skeletons";

export default async function Page() {
  // schema en waterFall, on doit attendre que chaque requête soit fini pour lancer la prochaine
  // Utile uniquement si on a besoin de valider une condition comprise dans une requete précédentes pour continuer.
  // SINON pour améliorer les performances, il faut fetcher les data en paralléle.

  /*   const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const {
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfInvoices,
    numberOfCustomers,
  } = await fetchCardData(); */

  //!  Pour initier les requêtes en parallele, on peut utiliser Promise.all() or Promise.allSettled()
  // mais attention, que se passe t'il si une requete est plus lente que les autres ??

  const data = await Promise.all([
    // fetchRevenue(),// fetch ralentie volontairement !
    // fetchLatestInvoices(),
    fetchCardData(),
  ]);

  // const revenue = data[0];
  // const latestInvoices = data[0];
  const totalPaidInvoices = data[0].totalPaidInvoices;
  const totalPendingInvoices = data[0].totalPendingInvoices;
  const numberOfInvoices = data[0].numberOfInvoices;
  const numberOfCustomers = data[0].numberOfCustomers;

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}

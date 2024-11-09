import SideNav from '@/app/ui/dashboard/sidenav';
 
// Le layout permet le : Patial rendering 
// l'avantage du Layout c'est que durant la navigation, seulement le composant page
//  va être mise a jour, et le layout ne sera pas mis a jour pour rien !

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
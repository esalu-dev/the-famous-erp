import { SidebarButton } from '@/components/dashboard/sidebarButton';
import { TopBar } from '@/components/dashboard/TopBar';
import {
  ChartColumnStacked,
  FileDollar,
  ShoppingBasket,
  ShoppingCart,
  Thunderbolt,
  Trolley,
  Person,
  Calendar,
} from '@gravity-ui/icons';
import { Separator } from '@heroui/react';
import logo from '../../../public/logo.png';
import { getSession } from '@/lib/auth';
import { AuthProvider } from '@/components/auth/AuthProvider';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <AuthProvider initialUser={session}>
      <div className="flex min-h-dvh max-w-dvw relative">
        <aside className="sticky top-0 flex h-dvh w-80 flex-col px-6 py-8 items-center bg-surface">
          <div>
            <img src={logo.src} alt="Logo de The Famous Pizza and Beer" className="h-24 w-auto" />
          </div>
          <p className="text-start text-gray-600 mt-2 text-xs">Enterprise Resource Planner</p>
          <section className="mt-10 w-full">
            <ul className="flex flex-col gap-2">
              <li>
                <SidebarButton icon={<ChartColumnStacked />} route="/app">
                  Inicio
                </SidebarButton>
              </li>
              <li>
                <SidebarButton icon={<Calendar />} route="/app/cierre">
                  Cierre del Día
                </SidebarButton>
              </li>
              <li>
                <SidebarButton icon={<FileDollar />} route="/app/precios">
                  Precios
                </SidebarButton>
              </li>
              <li>
                <SidebarButton icon={<ShoppingCart />} route="/app/insumos">
                  Insumos
                </SidebarButton>
              </li>
              <li>
                <SidebarButton icon={<Thunderbolt />} route="/app/servicios">
                  Servicios
                </SidebarButton>
              </li>
              <li>
                <SidebarButton icon={<ShoppingBasket />} route="/app/productos">
                  Productos
                </SidebarButton>
              </li>
              <li>
                <SidebarButton icon={<Trolley />} route="/app/proveedores">
                  Proveedores
                </SidebarButton>
              </li>
              <li>
                <SidebarButton icon={<Person />} route="/app/empleados">
                  Empleados
                </SidebarButton>
              </li>
            </ul>
          </section>
        </aside>
        <main className="flex flex-col relative w-full">
          <TopBar />
          <Separator />
          <div className="px-6 py-4">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}

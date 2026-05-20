import { SidebarButton } from '@/components/dashboard/sidebarButton';
import { TopBar } from '@/components/dashboard/TopBar';
import {
  ChartColumnStacked,
  FileDollar,
  ShoppingBasket,
  ShoppingCart,
  Thunderbolt,
  Trolley,
} from '@gravity-ui/icons';
import { Separator } from '@heroui/react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh max-w-dvw relative">
      <aside className="sticky top-0 flex h-dvh w-80 flex-col px-6 py-8 items-center bg-white">
        <h3 className="text-start px-8 text-xl text-focus font-bold">The Famous Pizza and Beer</h3>
        <p className="text-start text-gray-600 mt-2 text-xs">Enterprise Resource Planner</p>
        <section className="mt-10 w-full">
          <ul className="flex flex-col gap-2">
            <li>
              <SidebarButton icon={<ChartColumnStacked />} selected route="/app">
                Inicio
              </SidebarButton>
            </li>
            <li>
              <SidebarButton icon={<FileDollar />} route="/precios">
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
          </ul>
        </section>
      </aside>
      <main className="flex flex-col relative w-full">
        <TopBar />
        <Separator />
        <div className="px-6 py-4">{children}</div>
      </main>
    </div>
  );
}

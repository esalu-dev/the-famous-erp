import { SidebarButton } from "@/components/dashboard/sidebarButton";
import { ChartColumnStacked, FileDollar, ShoppingBasket, ShoppingCart, Thunderbolt, Trolley } from "@gravity-ui/icons";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-dvh w-dvw">
            <aside className="flex h-full w-80 flex-col px-6 py-8 items-center bg-focus">
                <h3 className="text-center text-3xl text-white font-bold">The Famous Pizza and Beer</h3>
                <p className="text-center text-white mt-2">Enterprise Resource Planner</p>
                <section className="mt-10 w-full">
                    <ul className="flex flex-col gap-2">
                        <li>
                            <SidebarButton icon={<ChartColumnStacked />} selected>
                            Inicio
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton icon={<FileDollar />}>   
                            Precios
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton icon={<ShoppingCart />}>
                            Insumos
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton icon={<Thunderbolt />}>   
                            Servicios
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton icon={<ShoppingBasket />}>
                            Productos
                            </SidebarButton>
                        </li>
                        <li>
                            <SidebarButton icon={<Trolley />}>   
                            Proveedores
                            </SidebarButton></li>
                    </ul>
                </section>
            </aside>
            <main className="flex size-full">
                {children}
            </main>
        </div>
    )
}
import { Button } from "@heroui/react";

export function SidebarButton({ children, icon, selected }: { children: React.ReactNode; icon: React.ReactNode; selected?: boolean }) {
    return (
        <Button className={`w-full h-12 text-left ${selected && 'font-bold text-yellow-600' }`}>
            {icon}
            <p className="text-left w-full">
                {children}
            </p>
            
        </Button>
    )
}
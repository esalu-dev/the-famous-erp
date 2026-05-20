import { Button, Link } from '@heroui/react';

export function SidebarButton({
  children,
  icon,
  selected,
  route,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  selected?: boolean;
  route: string;
}) {
  return (
    <Button className={`w-full h-12 text-left bg-white text-gray-600 ${selected && 'font-bold text-focus'}`}>
      {icon}
      <p className="text-left w-full">{children}</p>
      <a href={route} className="absolute inset-0 z-0" />
    </Button>
  );
}

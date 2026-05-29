'use client';

import { Button } from '@heroui/react';
import { usePathname } from 'next/navigation';

export function SidebarButton({
  children,
  icon,
  route,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  route: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <Button
      className={`relative w-full h-12 text-left justify-start gap-3 px-3 transition-all
        ${
          isActive
            ? 'bg-accent/10 text-accent font-semibold border-l-[3px] border-accent rounded-l-none'
            : 'bg-transparent text-default-foreground font-normal hover:bg-accent/10'
        }
      `}
    >
      <span className={isActive ? 'text-accent' : 'text-muted'}>{icon}</span>
      <p className="text-left w-full">{children}</p>
      <a href={route} className="absolute inset-0 z-0" />
    </Button>
  );
}

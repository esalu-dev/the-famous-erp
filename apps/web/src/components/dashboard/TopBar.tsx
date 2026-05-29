'use client';

import { ArrowRightFromSquare, Bell, ChevronDown } from '@gravity-ui/icons';
import { Avatar, Button, Dropdown, Label, Separator } from '@heroui/react';
import { useAuth } from '@/components/auth/AuthProvider';

export function TopBar() {
  const { user, logout, isLoggingOut } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-16 justify-end items-center gap-6 px-4 py-4 w-full">
      <Button isIconOnly variant="ghost" size="lg">
        <Bell />
      </Button>
      <Separator orientation="vertical"></Separator>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col text-right">
          <strong className="text-accent text-sm leading-none">{user?.nombre || 'Invitado'}</strong>
          <span className="text-gray-500 text-xs mt-1 leading-none">{user?.rol || 'Usuario'}</span>
        </div>
        <Avatar>
          <Avatar.Fallback>{getInitials(user?.nombre)}</Avatar.Fallback>
        </Avatar>
        <Dropdown>
          <Button isIconOnly variant="ghost">
            <ChevronDown />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu>
              <Dropdown.Item variant="danger" onPress={logout} isDisabled={isLoggingOut}>
                <ArrowRightFromSquare className="text-danger size-4 shrink-0" />
                <Label>Cerrar sesión</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
}

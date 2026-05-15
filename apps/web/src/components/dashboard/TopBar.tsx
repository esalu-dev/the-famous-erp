import { Bell } from '@gravity-ui/icons';
import { Avatar, Button, Separator } from '@heroui/react';

export function TopBar() {
  return (
    <div className="flex h-16 justify-end items-center gap-6 px-4 py-4 outline w-full">
      <Button isIconOnly variant="ghost" size="lg">
        <Bell />
      </Button>
      <Separator orientation="vertical"></Separator>
      <div className="flex gap-2 items-center">
        <div>
          <strong className="text-accent text-right">Miver Gatieza</strong>
          <p className="text-gray-600 text-sm text-right">Administrador</p>
        </div>
        <Avatar>
          <Avatar.Fallback>MV</Avatar.Fallback>
        </Avatar>
      </div>
    </div>
  );
}

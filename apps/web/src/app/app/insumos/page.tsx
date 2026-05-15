import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';

export default function InsumosPage() {
  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Insumos</h1>
      <span>
        <Button isIconOnly size="lg" className="absolute right-6 bottom-6">
          <Plus />
        </Button>
      </span>
    </div>
  );
}

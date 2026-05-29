'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { ProveedorForm } from './proveedorForm';

export const AddProveedorButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* boton +*/}
      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 bg-primary text-primary-foreground shadow-xl"
        onPress={() => setIsModalOpen(true)}
      >
        <Plus className="size-6" />
      </Button>

      {/* boton + */}
      <ProveedorForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

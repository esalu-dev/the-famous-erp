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
        className="absolute right-6 bottom-6 bg-primary text-primary-foreground shadow-md"
        onPress={() => setIsModalOpen(true)}
      >
        <Plus width={20} height={20} />
      </Button>

      {/* boton + */}
      <ProveedorForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

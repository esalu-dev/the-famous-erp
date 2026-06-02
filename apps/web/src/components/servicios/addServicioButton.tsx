'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { ServiciosForm } from './serviciosForm';

export const AddServicioButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 bg-primary text-primary-foreground shadow-xl"
        onPress={() => setIsModalOpen(true)}
      >
        <Plus className="size-6" />
      </Button>

      <ServiciosForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

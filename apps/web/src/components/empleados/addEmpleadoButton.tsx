'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { EmpleadoForm } from './empleadoForm';

export const AddEmpleadoButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* boton +*/}
      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 bg-primary text-primary-foreground shadow-xl z-50"
        onPress={() => setIsModalOpen(true)}
      >
        <Plus width={20} height={20} />
      </Button>

      {/* modal */}
      <EmpleadoForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
};

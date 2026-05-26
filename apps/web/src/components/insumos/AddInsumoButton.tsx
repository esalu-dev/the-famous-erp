'use client';

import { useState } from 'react';
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import { InsumoForm } from './InsumoForm';

export function AddInsumoButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 z-50"
        onPress={() => setIsOpen(true)}
      >
        <Plus />
      </Button>

      <InsumoForm isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

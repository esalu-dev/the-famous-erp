"use client";

import { useState } from "react";
import { InsumoForm } from "@/components/insumos/InsumoForm";
import { Plus } from '@gravity-ui/icons';
import { Button } from '@heroui/react';

export default function InsumosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1 className="font-bold text-3xl text-accent">Insumos</h1>
      <span>
        <Button isIconOnly size="lg" className="absolute right-6 bottom-6" onPress={() => setIsModalOpen(true)}>
          <Plus />
        </Button>
      </span>

      <InsumoForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

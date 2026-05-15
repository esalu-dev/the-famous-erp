//export default function Home() {
//  return <h1>Home page</h1>;
//}

//no encontre el boton + entonces lo puse qui pero tampooco lo pude probar 
"use client";

import { useState } from "react";
import { Plus } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { InsumoForm } from "@/components/insumos/InsumoForm";

export default function InsumosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (

    <div className="relative h-[calc(100vh-5rem)] w-full">
      
      <h1 className="text-2xl font-bold text-accent">Insumos</h1>

      
      <div className="mt-6">
        {/* <InsumosTable /> */}
      </div>

      {/*  Botón (+)*/}
      <Button
        isIconOnly
        variant="primary"
        className="absolute bottom-6 right-6 shadow-md"
        onPress={() => setIsModalOpen(true)}
      >
        <Plus width={20} height={20} />
      </Button>

      <InsumoForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

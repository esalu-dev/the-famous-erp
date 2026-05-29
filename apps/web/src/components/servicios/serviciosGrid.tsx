import { Card } from "@heroui/react";
import { AddServicioButton } from "./addServicioButton";
import { ServiciosCard } from "./serviciosCard";
import { TotalCard } from "./totalCard";

export function ServiciosGrid() {
  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-4 mt-6">
           <ServiciosCard 
                servicio="Spotify Bussines" 
                periodicidad="Mensual"
                estado="Vigente"
                costo={299}
                proximoPago={new Date('2024-07-15')}
                notas="Plan familiar para 5 personas"
            />
            <ServiciosCard 
                servicio="Adobe Creative Cloud" 
                periodicidad="Anual"
                estado="Vencido"
                costo={599}
                proximoPago={new Date('2023-12-01')}
                notas="Incluye Photoshop, Illustrator y Premiere Pro"
            />
        </div>
        <div className="mt-6">
            <TotalCard total={898} />
        </div>
         <AddServicioButton />
    </>
    
  );
}
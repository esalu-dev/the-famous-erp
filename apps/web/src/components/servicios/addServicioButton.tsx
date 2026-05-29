import { Plus } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { ServiciosForm } from "./serviciosForm";

export const AddServicioButton = () => {    
    return (
        <>
            <Button
                isIconOnly
                size="lg"
                className="fixed right-6 bottom-6 bg-primary text-primary-foreground shadow-xl"
            >
                <Plus className="size-6" />
            </Button>

            <ServiciosForm />
        </>
    );
}
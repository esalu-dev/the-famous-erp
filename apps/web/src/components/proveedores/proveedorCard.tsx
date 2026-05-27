import { Pencil } from "@gravity-ui/icons";
import { Button, Card, Chip } from "@heroui/react";
import {Factory} from '@gravity-ui/icons';
import {Boxes3} from '@gravity-ui/icons';
import {Handset} from '@gravity-ui/icons';
import {Envelope} from '@gravity-ui/icons';

export function ProveedorCard({
    nombre,
    razonSocial,
    tipoProveedor,
    telefono,
    email,
    estado,
}: {
    nombre: string;
    razonSocial: string;
    tipoProveedor: string;
    telefono: string;
    email: string;
    estado: 'activo' | 'inactivo';
}) {
    const categoryStyles = {
        activo: {
            color: 'accent',
            variant: 'soft',
        },
        inactivo: {
            color: 'default',
            variant: 'soft',
        }
    } as const;
    return (
        <Card className="w-full h-fit overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start gap-4">
                    <div className="w-fit h-fit overflow-hidden rounded-2xl bg-accent/20 p-4">
                        <Factory className="text-accent" />
                    </div>
                    <div className="flex flex-col">
                        <Card.Title className="font-bold text-base">
                        {nombre}
                        </Card.Title>
                        <span className="text-xs text-gray-600">
                        {razonSocial}
                        </span>
                    </div>
                    <div className="ml-auto">
                        <Chip
                            size="md"
                            color={estado ? categoryStyles[estado].color : categoryStyles.activo.color}
                            variant={estado ? categoryStyles[estado].variant : categoryStyles.activo.variant}
                            className="rounded-full font-bold w-fit"
                            >
                            {estado}
                        </Chip>
                    </div>
                </div>
                <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 p-0">
                <div className="flex items-center gap-2">
                    <Boxes3/>
                    <span className="text-sm text-gray-600">
                    {tipoProveedor}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Handset />
                    <span className="text-sm text-gray-600">
                    {telefono}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Envelope />
                    <span className="text-sm text-gray-600">
                    {email}
                    </span>
                </div>
                <Button className="w-full">
                    <Pencil />
                    Actualizar
                </Button>
                </Card.Footer>
            </div>
        </Card>
    );
}
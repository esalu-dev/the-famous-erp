import { Button, Card, Chip } from '@heroui/react';
import { Rectangles4, Pencil } from '@gravity-ui/icons';
import { Calendar } from '@gravity-ui/icons';

export function ServiciosCard({
    servicio,
    periodicidad,
    estado,
    costo, 
    proximoPago,
    notas,
    autorenovable = true,
    onEdit,
    onRenew,
    isRenewing = false,
}:{
    servicio: string;
    periodicidad: string;
    estado?: 'Vigente' | 'Vencido';
    costo: number;
    proximoPago: Date;
    notas: string;
    autorenovable?: boolean;
    onEdit?: () => void;
    onRenew?: () => void;
    isRenewing?: boolean;
}
) {
    const categoryStyles = {
        Vigente: {
        color: 'success',
        variant: 'soft',
        },
        Vencido: {
        color: 'danger',
        variant: 'soft',
        },
    } as const;
    return (
        <>
            <Card className="w-full h-full overflow-hidden">
                <div className="flex flex-col gap-4 p-4 h-full">
                    <div className="flex items-start gap-4">
                        <div className="w-fit h-fit overflow-hidden rounded-2xl bg-accent-soft-hover p-4">
                            <Rectangles4 className="text-accent size-5" />
                        </div>
                        <div className="flex flex-col">
                            <Card.Title className="font-bold text-base">{servicio}</Card.Title>
                            <span className="text-xs text-gray-600">
                                {periodicidad} • {autorenovable ? 'Automático' : 'Manual'}
                            </span>
                        </div>
                        <div className="ml-auto">
                            <Chip
                                size="md"
                                color={estado ? categoryStyles[estado].color : categoryStyles.Vigente.color}
                                variant={estado ? categoryStyles[estado].variant : categoryStyles.Vigente.variant}
                            >
                                {estado}
                            </Chip>
                        </div>
                    </div>
                    <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 p-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-surface-foreground">${costo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="text-gray-600"/>
                            <span className="text-sm text-gray-600">{proximoPago.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 min-h-6">
                            <span className="text-sm text-gray-500 line-clamp-2">
                                {notas ? notas : <span className="italic opacity-60">Sin notas adicionales</span>}
                            </span>
                        </div>
                        <div className="flex gap-2 w-full mt-2">
                            {!autorenovable && (
                                <Button 
                                    className="flex-1 bg-success text-success-foreground hover:bg-success/90 transition-all font-semibold" 
                                    onPress={onRenew}
                                    isDisabled={isRenewing}
                                >
                                    {isRenewing ? 'Registrando...' : 'Registrar Pago'}
                                </Button>
                            )}
                            <Button 
                                className={autorenovable ? "w-full" : "flex-1"} 
                                onPress={onEdit}
                                isDisabled={isRenewing}
                            >
                                <Pencil />
                                Actualizar
                            </Button>
                        </div>
                    </Card.Footer>
                </div>
            </Card>
        </>   
    );
}

import { Pencil } from '@gravity-ui/icons';
import { Button, Card, Chip } from '@heroui/react';

export function ProductosCard({
  titulo,
  precio,
  imagenUrl,
  margenGanancia,
  categoria,
  onEdit,
}: {
  titulo: string;
  precio: number;
  imagenUrl: string | null;
  margenGanancia: string;
  categoria: string;
  onEdit: () => void;
}) {
  return (
    <Card className="w-full h-80 overflow-hidden transition-all duration-200">
      <div className="absolute top-6 left-6 z-10">
        <Chip size="md" className="rounded-full w-fit font-semibold" color="accent">
          {categoria}
        </Chip>
      </div>
      <div className="relative w-full h-56 overflow-hidden rounded-2xl">
        <img
          alt="Pizza"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          src={imagenUrl || 'https://blocks.astratic.com/img/general-img-landscape.png'}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <Card.Header>
          <Card.Title className="pr-8 font-semibold text-md">{titulo}</Card.Title>
          <div className="flex items-center justify-between w-full">
            <span className="font-bold flex items-baseline gap-0.5">${precio}</span>
            <Chip size="md" className="rounded-full w-fit" variant="soft" color="success">
              {margenGanancia}
            </Chip>
          </div>
        </Card.Header>
        <div className="mt-4">
          <Button className="w-full" onPress={onEdit}>
            <Pencil />
            Actualizar
          </Button>
        </div>
      </div>
    </Card>
  );
}

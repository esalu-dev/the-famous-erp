import { Button, Separator } from '@heroui/react';
import { ProductosCard } from './productosCard';
import { Plus } from '@gravity-ui/icons';

export function ProductosGrid() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
        <ProductosCard
          titulo="Pizza Margarita"
          precio={100}
          imagenUrl="https://www.clarin.com/img/2023/08/01/SL3EslnOA_1200x630__1.jpg"
          margenGanancia="20% margen"
          categoria="Pizza"
        />
        <ProductosCard
          titulo="Pizza Pepperoni"
          precio={120}
          imagenUrl="https://www.cocinadelirante.com/sites/default/files/images/2023/08/receta-de-pizza-sin-horno.jpg"
          margenGanancia="25% margen"
          categoria="Bebidas"
        />
        <ProductosCard
          titulo="Pizza Hawaiana"
          precio={150}
          imagenUrl="https://babycocina.com/wp-content/uploads/2021/02/pizza-hawaiana.jpg"
          margenGanancia="30% margen"
          categoria="Complementos"
        />
      </div>
      <Button
        isIconOnly
        size="lg"
        className="fixed right-6 bottom-6 z-50 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105"
      >
        <Plus className="size-6" />
      </Button>
    </>
  );
}

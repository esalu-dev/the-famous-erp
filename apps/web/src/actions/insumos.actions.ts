'use server';

export interface Insumo {
  id?: string;
  nombre: string;
  tipo: string;
  unidadMedida: string;
  cantidadActual: number;
  cantidadMinima: number;
  precioActual: number;
  categoria?: string;
  //proveedor?: string;
  imagenUrl?: string | null;
}

export async function saveInsumoAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const nombre = formData.get('nombre');

  if (!nombre) {
    throw new Error('El nombre del insumo es obligatorio');
  }

  return {
    success: true,
    message: `Insumo "${nombre}" guardado correctamente`,
  };
}

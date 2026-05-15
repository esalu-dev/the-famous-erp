"use server";

// no se como lo tengan en la bd
export interface Insumo {
  id?: string;
  nombre: string;
  tipo: string;
  unidad: string;
  cantidadActual: number;
  cantidadMinima: number;
  precioActual: number;
  proveedor: string;
  foto?: File | null; 
}

export async function saveInsumoAction(formData: FormData): Promise<{ success: boolean; message: string; data?: any }> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const nombre = formData.get("nombre");
  
  if (!nombre) {
    throw new Error("El nombre del insumo es obligatorio");
  }

  return { 
    success: true, 
    message: `Insumo "${nombre}" guardado correctamente` 
  };
}
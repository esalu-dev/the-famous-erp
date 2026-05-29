'use server';

export interface Proveedor {
  id?: string;
  nombre: string;
  razonSocial?: string | null;
  rfc?: string | null;
  tipo?: string | null;
  contactoNombre?: string | null;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  estado?: string;
}

export async function saveProveedorAction(
  formData: FormData,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  // Simulacion de una llamada a una API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const nombre = formData.get('nombre');

  if (!nombre) {
    throw new Error('El nombre del proveedor es obligatorio');
  }

  return {
    success: true,
    message: `Proveedor "${nombre}" registrado exitosamente.`,
  };
}

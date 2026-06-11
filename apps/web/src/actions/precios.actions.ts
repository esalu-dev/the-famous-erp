'use server';

import { config } from '@/lib/config';

export interface PrecioHistorialEntry {
  id: string;
  insumoId: string;
  precioAnterior: number;
  precioNuevo: number;
  fecha: string;
  usuarioId: string;
  insumo?: {
    nombre: string;
    tipo: string;
    unidadMedida: string;
    precioActual: number;
  };
  usuario?: {
    nombre: string;
    correo: string;
  };
}

export async function getPrecioHistorialAction(): Promise<{
  success: boolean;
  data: PrecioHistorialEntry[];
  error?: string;
}> {
  try {
    const res = await fetch(`${config.services.analytics}/analytics/precio-historial`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Error al conectar con analytics-service: ${res.statusText}`);
    }

    const data = (await res.json()) as PrecioHistorialEntry[];
    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching precio historial:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

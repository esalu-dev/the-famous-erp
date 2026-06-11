'use client';

import { useState, useMemo } from 'react';
import { Card, Chip, Button, Input } from '@heroui/react';
import { FileDollar, Person } from '@gravity-ui/icons';
import { getPrecioHistorialAction, type PrecioHistorialEntry } from '@/actions/precios.actions';

interface PreciosClientProps {
  inicialHistorial: PrecioHistorialEntry[];
}

export function PreciosClient({ inicialHistorial }: PreciosClientProps) {
  const [historial, setHistorial] = useState<PrecioHistorialEntry[]>(inicialHistorial);
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await getPrecioHistorialAction();
      if (response.success) {
        setHistorial(response.data);
      }
    } catch (error) {
      console.error('Error refreshing prices history:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 1. Calculate Summary Stats
  const stats = useMemo(() => {
    const total = historial.length;
    let mayorAumento = 0;
    let mayorAumentoInsumo = '';
    let mayorDescuento = 0;
    let mayorDescuentoInsumo = '';

    historial.forEach((entry) => {
      const diff = Number(entry.precioNuevo) - Number(entry.precioAnterior);
      const name = entry.insumo?.nombre || 'Insumo';
      if (diff > 0 && diff > mayorAumento) {
        mayorAumento = diff;
        mayorAumentoInsumo = name;
      } else if (diff < 0 && Math.abs(diff) > mayorDescuento) {
        mayorDescuento = Math.abs(diff);
        mayorDescuentoInsumo = name;
      }
    });

    const ultimaFecha =
      historial.length > 0 ? new Date(historial[0].fecha).toLocaleString() : 'Sin registros';

    return {
      total,
      mayorAumento,
      mayorAumentoInsumo,
      mayorDescuento,
      mayorDescuentoInsumo,
      ultimaFecha,
    };
  }, [historial]);

  // 2. Filter History
  const filteredHistorial = useMemo(() => {
    return historial.filter((entry) => {
      const matchesSearch = (entry.insumo?.nombre || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesTipo = tipoFilter === 'all' || entry.insumo?.tipo === tipoFilter;

      return matchesSearch && matchesTipo;
    });
  }, [historial, searchQuery, tipoFilter]);

  // 3. Extract all unique types
  const tipos = useMemo(() => {
    const allTipos = new Set<string>();
    historial.forEach((entry) => {
      if (entry.insumo?.tipo) {
        allTipos.add(entry.insumo.tipo);
      }
    });
    return Array.from(allTipos);
  }, [historial]);

  return (
    <div className="flex flex-col gap-6 mt-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Updates */}
        <Card className="p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FileDollar className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Actualizaciones</span>
              <span className="text-xl font-bold">{stats.total}</span>
            </div>
          </div>
        </Card>

        {/* Max Increase */}
        <Card className="p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger/10 text-danger rounded-xl">
              {/* Arrow Up Right Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Mayor Aumento</span>
              {stats.mayorAumento > 0 ? (
                <>
                  <span className="text-lg font-bold text-danger">
                    +${stats.mayorAumento.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-400 line-clamp-1">
                    {stats.mayorAumentoInsumo}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-gray-400">N/A</span>
              )}
            </div>
          </div>
        </Card>

        {/* Max Decrease */}
        <Card className="p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10 text-success rounded-xl">
              {/* Arrow Down Right Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Mayor Ahorro</span>
              {stats.mayorDescuento > 0 ? (
                <>
                  <span className="text-lg font-bold text-success">
                    -${stats.mayorDescuento.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gray-400 line-clamp-1">
                    {stats.mayorDescuentoInsumo}
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-gray-400">N/A</span>
              )}
            </div>
          </div>
        </Card>

        {/* Last Updated */}
        <Card className="p-4 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-warning/10 text-warning rounded-xl">
              {/* Clock Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-medium">Último Cambio</span>
              <span className="text-sm font-bold truncate max-w-44">{stats.ultimaFecha}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {/* Search Input */}
          <Input
            placeholder="Buscar por insumo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />

          {/* Type Filters */}
          <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
            <Button
              size="sm"
              variant={tipoFilter === 'all' ? 'primary' : 'outline'}
              className={
                tipoFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-neutral-200 dark:border-neutral-800'
              }
              onPress={() => setTipoFilter('all')}
            >
              Todos
            </Button>
            {tipos.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={tipoFilter === t ? 'primary' : 'outline'}
                className={
                  tipoFilter === t
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-neutral-200 dark:border-neutral-800'
                }
                onPress={() => setTipoFilter(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          onPress={handleRefresh}
          isDisabled={isRefreshing}
          className="w-full md:w-auto border border-neutral-200 dark:border-neutral-800"
        >
          {/* Rotate/Refresh Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          {isRefreshing ? 'Actualizando...' : 'Recargar'}
        </Button>
      </div>

      {/* Data Table */}
      <Card className="border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4">Insumo</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-right">Precio Anterior</th>
                <th className="px-6 py-4 text-right">Precio Nuevo</th>
                <th className="px-6 py-4 text-center">Variación</th>
                <th className="px-6 py-4">Modificado Por</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredHistorial.length > 0 ? (
                filteredHistorial.map((entry) => {
                  const ant = Number(entry.precioAnterior);
                  const nve = Number(entry.precioNuevo);
                  const diff = nve - ant;
                  const percent = ant > 0 ? (diff / ant) * 100 : 0;

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      {/* Insumo Name */}
                      <td className="px-6 py-4 font-semibold text-surface-foreground">
                        <div className="flex items-center gap-2">
                          {/* Box/Package Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="size-4 text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                            />
                          </svg>
                          {entry.insumo?.nombre || 'Insumo Desconocido'}
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="px-6 py-4 text-gray-500">{entry.insumo?.tipo || 'N/A'}</td>

                      {/* Price Anterior */}
                      <td className="px-6 py-4 text-right font-medium text-gray-500">
                        ${ant.toFixed(2)}
                      </td>

                      {/* Price Nuevo */}
                      <td className="px-6 py-4 text-right font-semibold text-surface-foreground">
                        ${nve.toFixed(2)}
                      </td>

                      {/* Variation Chip */}
                      <td className="px-6 py-4 text-center">
                        {diff === 0 ? (
                          <Chip size="sm" variant="soft" color="default" className="rounded-full">
                            Sin cambio
                          </Chip>
                        ) : diff > 0 ? (
                          <Chip
                            size="sm"
                            variant="soft"
                            color="danger"
                            className="rounded-full text-[10px] font-bold"
                          >
                            +{percent.toFixed(1)}% (+${diff.toFixed(2)})
                          </Chip>
                        ) : (
                          <Chip
                            size="sm"
                            variant="soft"
                            color="success"
                            className="rounded-full text-[10px] font-bold"
                          >
                            {percent.toFixed(1)}% (-${Math.abs(diff).toFixed(2)})
                          </Chip>
                        )}
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                            <Person className="size-3.5 text-gray-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs">
                              {entry.usuario?.nombre || 'Sistema'}
                            </span>
                            {entry.usuario?.correo && (
                              <span className="text-[10px] text-gray-400">
                                {entry.usuario.correo}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(entry.fecha).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                    No se encontraron registros de cambios de precio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

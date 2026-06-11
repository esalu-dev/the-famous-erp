'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, Chip, Button, Input, Select, ListBox, Label } from '@heroui/react';
import { type Insumo } from '@/actions/insumos.actions';
import { type PrecioHistorialEntry } from '@/actions/precios.actions';

interface ComparadorCardProps {
  insumos: Insumo[];
  historialPrecios: PrecioHistorialEntry[];
}

export function ComparadorCard({ insumos, historialPrecios }: ComparadorCardProps) {
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedUnidad, setSelectedUnidad] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);

  // Get selected insumo details
  const selectedInsumo = useMemo(() => {
    return insumos.find((ins) => ins.id === selectedInsumoId);
  }, [insumos, selectedInsumoId]);

  // Set default unit when insumo changes
  useEffect(() => {
    if (selectedInsumo) {
      setSelectedUnidad(selectedInsumo.unidadMedida || '');
    } else {
      setSelectedUnidad('');
    }
    setShowResults(false);
  }, [selectedInsumo]);

  // Available units for selection
  const availableUnits = useMemo(() => {
    if (!selectedInsumo) return [];
    if (selectedInsumo.unidadMedida === 'Gramos') {
      return [
        { id: 'Kilogramos', label: 'Kilogramos (kg)' },
        { id: 'Gramos', label: 'Gramos (g)' },
      ];
    }
    if (selectedInsumo.unidadMedida === 'Mililitros') {
      return [
        { id: 'Litros', label: 'Litros (L)' },
        { id: 'Mililitros', label: 'Mililitros (ml)' },
      ];
    }
    return [{ id: selectedInsumo.unidadMedida, label: selectedInsumo.unidadMedida }];
  }, [selectedInsumo]);

  // Compare supplier prices
  const comparisonResults = useMemo(() => {
    if (!selectedInsumo || !showResults) return [];

    const isKgOrL = selectedUnidad === 'Kilogramos' || selectedUnidad === 'Litros';

    // Scale factor for quantity and price:
    // If selected unit is kg/L, but base is g/ml:
    // Quantity in base units = cantidad * 1000
    const qtyInBaseUnit = isKgOrL ? cantidad * 1000 : cantidad;

    const results = (selectedInsumo.proveedores || []).map((ip) => {
      const pricePerBaseUnit = Number(ip.precioUnitario);

      // Price per selected unit:
      // If selected is kg/L, price per selected unit = pricePerBaseUnit * 1000
      const pricePerSelectedUnit = isKgOrL ? pricePerBaseUnit * 1000 : pricePerBaseUnit;
      const totalCost = qtyInBaseUnit * pricePerBaseUnit;

      return {
        supplierId: ip.proveedorId,
        supplierName: ip.proveedor?.nombre || 'Proveedor Desconocido',
        pricePerUnit: pricePerSelectedUnit,
        totalCost,
        esPreferido: ip.esPreferido,
      };
    });

    // Sort by total cost ascending
    results.sort((a, b) => a.totalCost - b.totalCost);

    return results;
  }, [selectedInsumo, cantidad, selectedUnidad, showResults]);

  // Get historical updates for selected insumo
  const filteredHistory = useMemo(() => {
    if (!selectedInsumoId) return [];
    return historialPrecios.filter((h) => h.insumoId === selectedInsumoId).slice(0, 3); // Last 3 changes
  }, [historialPrecios, selectedInsumoId]);

  const handleCompare = () => {
    if (selectedInsumoId) {
      setShowResults(true);
    }
  };

  return (
    <Card className="w-full p-5 border border-neutral-200 dark:border-neutral-800 flex flex-col gap-5">
      <div>
        <h3 className="font-bold text-base text-surface-foreground">
          Comparador de Precios de Proveedores
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Compara costos entre los proveedores que surten un insumo y analiza su tendencia de
          precios históricos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Insumo Select */}
        <div className="md:col-span-2">
          <Select
            className="w-full"
            placeholder="Selecciona un insumo..."
            value={selectedInsumoId}
            onChange={(value) => setSelectedInsumoId(value as string)}
          >
            <Label>Insumo</Label>
            <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center border border-neutral-200 dark:border-neutral-800">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {insumos.map((ins) => (
                  <ListBox.Item key={ins.id} id={ins.id} textValue={ins.nombre}>
                    {ins.nombre} ({ins.tipo})
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Cantidad Input */}
        <div className="flex gap-2">
          <Input
            type="number"
            min={0.01}
            step="0.01"
            value={cantidad.toString()}
            onChange={(e) => setCantidad(Number(e.target.value) || 1)}
            placeholder="Cant."
            className="w-20"
          />

          {/* Unit Select */}
          <Select
            className="flex-1"
            placeholder="Unidad"
            value={selectedUnidad}
            onChange={(value) => setSelectedUnidad(value as string)}
            isDisabled={!selectedInsumo}
          >
            <Label>Unidad</Label>
            <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center border border-neutral-200 dark:border-neutral-800">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {availableUnits.map((u) => (
                  <ListBox.Item key={u.id} id={u.id} textValue={u.label}>
                    {u.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Compare Button */}
        <Button
          variant="primary"
          className="h-11 bg-primary text-primary-foreground font-semibold"
          onPress={handleCompare}
          isDisabled={!selectedInsumoId}
        >
          Comparar Precios
        </Button>
      </div>

      {showResults && selectedInsumo && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {/* Supplier Comparison List */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500">
              Comparativa de Costo Total
            </h4>

            {comparisonResults.length > 0 ? (
              <div className="flex flex-col gap-2">
                {comparisonResults.map((res, index) => {
                  const esElMasBarato = index === 0;

                  return (
                    <div
                      key={res.supplierId}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        esElMasBarato
                          ? 'border-success/30 bg-success/5 dark:bg-success/5 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-surface-foreground">
                            {res.supplierName}
                          </span>
                          {res.esPreferido && (
                            <Chip
                              size="sm"
                              color="accent"
                              variant="soft"
                              className="rounded-full text-[9px] font-bold"
                            >
                              Preferido
                            </Chip>
                          )}
                          {esElMasBarato && (
                            <Chip
                              size="sm"
                              color="success"
                              variant="primary"
                              className="rounded-full text-[9px] font-bold"
                            >
                              Mejor Opción
                            </Chip>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          Costo por unidad: ${res.pricePerUnit.toFixed(2)} /{' '}
                          {selectedUnidad === 'Kilogramos'
                            ? 'kg'
                            : selectedUnidad === 'Litros'
                              ? 'L'
                              : selectedUnidad === 'Gramos'
                                ? 'g'
                                : selectedUnidad === 'Mililitros'
                                  ? 'ml'
                                  : selectedUnidad}
                        </span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-base font-extrabold ${esElMasBarato ? 'text-success' : 'text-surface-foreground'}`}
                        >
                          ${res.totalCost.toFixed(2)}
                        </span>
                        <p className="text-[10px] text-gray-400">Costo total</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-gray-500 italic">
                Este insumo no tiene proveedores asignados. Ve a Insumos para asignarle proveedores
                y precios.
              </div>
            )}
          </div>

          {/* Historical Trend */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-500">
              Tendencia Histórica de Cambios
            </h4>

            {filteredHistory.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {filteredHistory.map((h) => {
                  const ant = Number(h.precioAnterior);
                  const nve = Number(h.precioNuevo);
                  const isKgOrL = selectedUnidad === 'Kilogramos' || selectedUnidad === 'Litros';

                  // Scale prices for display to match currently selected unit
                  const antScaled = isKgOrL ? ant * 1000 : ant;
                  const nveScaled = isKgOrL ? nve * 1000 : nve;
                  const diffScaled = nveScaled - antScaled;

                  return (
                    <div
                      key={h.id}
                      className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col gap-1 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-400">
                          {new Date(h.fecha).toLocaleDateString()}
                        </span>
                        {diffScaled > 0 ? (
                          <span className="text-danger font-bold">+{diffScaled.toFixed(2)}</span>
                        ) : diffScaled < 0 ? (
                          <span className="text-success font-bold">
                            -${Math.abs(diffScaled).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-bold">Sin cambio</span>
                        )}
                      </div>
                      <div className="flex justify-between text-surface-foreground">
                        <span>Precio anterior:</span>
                        <span className="font-semibold">${antScaled.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-surface-foreground">
                        <span>Precio nuevo:</span>
                        <span className="font-semibold">${nveScaled.toFixed(2)}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                        <span>Registrado por:</span>
                        <span>{h.usuario?.nombre || 'Sistema'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-center text-xs text-gray-500 italic">
                No hay historial de cambios registrado en analytics-service para este insumo.
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

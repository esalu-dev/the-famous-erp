'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  toast,
  Chip,
  Modal,
  TextField,
  DatePicker,
  Label,
  Calendar as HeroUICalendar,
  DateField,
  Card,
} from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { TriangleExclamation, FileDollar, ChartColumnStacked } from '@gravity-ui/icons';
import {
  getCierreStatusAction,
  getVentasDiaAction,
  saveVentasDiaAction,
  procesarCierreAction,
  type CierreResumen,
} from '@/actions/cierre.actions';
import { type Producto } from '@/actions/productos.actions';

interface CierreClientProps {
  productos: Producto[];
}

export function CierreClient({ productos }: CierreClientProps) {
  // Helper to get local date string YYYY-MM-DD
  const getLocalDateString = () => {
    const d = new Date();
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
  };

  const [fecha, setFecha] = useState<string>(getLocalDateString());
  const [status, setStatus] = useState<'NO_REGISTRADO' | 'PENDIENTE' | 'PROCESADO'>(
    'NO_REGISTRADO',
  );
  const [ventasMap, setVentasMap] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Handle HeroUI DatePicker date change
  const handleDateChange = (dateObj: any) => {
    if (dateObj) {
      setFecha(dateObj.toString());
    }
  };

  // Financial values
  const [resumen, setResumen] = useState<CierreResumen | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Load closure state for the selected date
  const loadCierreData = async (dateStr: string) => {
    setIsSubmitting(true);
    try {
      // 1. Get status
      const statusRes = await getCierreStatusAction(dateStr);
      setStatus(statusRes.status);

      // 2. Get registered sales
      const ventasRes = await getVentasDiaAction(dateStr);
      const newVentasMap: Record<string, number> = {};
      ventasRes.data.forEach((v) => {
        newVentasMap[v.productoId] = v.cantidad;
      });
      setVentasMap(newVentasMap);

      // 3. Clear or set summary
      if (statusRes.status === 'PROCESADO') {
        // Compute revenue and cost since it is already closed
        let revenue = 0;
        let cost = 0;
        ventasRes.data.forEach((v) => {
          const qty = v.cantidad;
          const price = Number(v.producto?.precioVenta || 0);
          revenue += price * qty;

          // Sum ingredients cost
          const product = productos.find((p) => p.id === v.productoId);
          if (product && product.receta) {
            product.receta.forEach((r) => {
              const qtyInsumo = Number(r.cantidad) * qty;
              const priceInsumo = Number(r.insumo?.precioActual || 0);
              cost += qtyInsumo * priceInsumo;
            });
          }
        });

        setResumen({
          ingresosTotales: revenue,
          costoInsumosTotales: cost,
          gananciaNeto: revenue - cost,
          margenNeto: revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0,
        });
        setWarnings([]);
      } else {
        setResumen(null);
        setWarnings([]);
      }
    } catch (e) {
      console.error(e);
      toast.danger('Error al cargar la información del cierre.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (fecha) {
      loadCierreData(fecha);
    }
  }, [fecha]);

  // Handle inputs changes
  const handleQtyChange = (productId: string, val: string) => {
    const qty = parseInt(val, 10);
    setVentasMap({
      ...ventasMap,
      [productId]: isNaN(qty) || qty < 0 ? 0 : qty,
    });
  };

  // Compute live revenue and costs for preview
  const liveRevenue = productos.reduce((acc, p) => {
    const qty = ventasMap[p.id || ''] || 0;
    return acc + Number(p.precioVenta) * qty;
  }, 0);

  const liveCost = productos.reduce((acc, p) => {
    const qty = ventasMap[p.id || ''] || 0;
    if (!p.receta) return acc;
    const pCost = p.receta.reduce((sum, r) => {
      const insumoPrice = Number(r.insumo?.precioActual || 0);
      return sum + Number(r.cantidad) * insumoPrice;
    }, 0);
    return acc + pCost * qty;
  }, 0);

  const liveProfit = liveRevenue - liveCost;
  const liveMargin = liveRevenue > 0 ? (liveProfit / liveRevenue) * 100 : 0;

  // Group active products by category
  const pizzas = productos.filter((p) => p.categoria === 'Pizza' && p.activo !== false);
  const complements = productos.filter((p) => p.categoria === 'Complemento' && p.activo !== false);
  const beverages = productos.filter((p) => p.categoria === 'Bebida' && p.activo !== false);

  const handleSaveVentas = async () => {
    setIsSubmitting(true);
    const payload = Object.keys(ventasMap)
      .map((k) => ({ productoId: k, cantidad: ventasMap[k] }))
      .filter((v) => v.cantidad > 0);

    const res = await saveVentasDiaAction(fecha, payload);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(res.message);
      loadCierreData(fecha);
    } else {
      toast.danger(res.message);
    }
  };

  const handleProcessCierre = async () => {
    setIsConfirmOpen(false);
    setIsSubmitting(true);

    const res = await procesarCierreAction(fecha);
    setIsSubmitting(false);

    if (res.success) {
      toast.success(res.message);
      if (res.resumen) setResumen(res.resumen);
      if (res.warnings) setWarnings(res.warnings);
      setStatus('PROCESADO');
    } else {
      toast.danger(res.message);
    }
  };

  const statusLabel = {
    NO_REGISTRADO: { label: 'Ventas Sin Registrar', color: 'default' as const },
    PENDIENTE: { label: 'Ventas Capturadas (Pendiente de Cierre)', color: 'warning' as const },
    PROCESADO: { label: 'Cierre Completado', color: 'success' as const },
  }[status];

  const renderProductRow = (prod: Producto) => {
    const qty = ventasMap[prod.id || ''] || 0;
    const isClosed = status === 'PROCESADO';

    return (
      <div
        key={prod.id}
        className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-neutral-200 dark:border-neutral-800 transition-all hover:bg-surface-secondary/80 duration-150"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            {prod.imagenUrl ? (
              <img src={prod.imagenUrl} alt={prod.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-accent-soft text-accent flex items-center justify-center font-bold text-lg">
                {prod.nombre.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground">{prod.nombre}</div>
            <div className="text-xs text-muted">${Number(prod.precioVenta)} MXN</div>
          </div>
        </div>

        <div className="w-28">
          <TextField
            value={qty === 0 ? '' : qty.toString()}
            onChange={(val) => handleQtyChange(prod.id || '', val)}
            isDisabled={isClosed || isSubmitting}
          >
            <Input
              type="number"
              min={0}
              placeholder="0"
              variant="secondary"
              className="text-right h-10 px-3 text-sm font-bold w-full"
            />
          </TextField>
        </div>
      </div>
    );
  };

  const displayResumen =
    status === 'PROCESADO' && resumen
      ? resumen
      : {
          ingresosTotales: liveRevenue,
          costoInsumosTotales: liveCost,
          gananciaNeto: liveProfit,
          margenNeto: liveMargin,
        };

  return (
    <div className="flex flex-col gap-6 mt-4">
      {/* Top Controls Row */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3 w-full sm:w-80 animate-fade-in">
          <DatePicker
            className="w-full"
            value={parseDate(fecha)}
            onChange={handleDateChange}
            isDisabled={isSubmitting}
          >
            <Label className="text-xs font-bold uppercase tracking-widest text-muted">
              Fecha de Cierre
            </Label>
            <DateField.Group fullWidth>
              <DateField.Input>
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateField.Suffix>
                <DatePicker.Trigger>
                  <DatePicker.TriggerIndicator />
                </DatePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <DatePicker.Popover>
              <HeroUICalendar aria-label="Fecha de cierre">
                <HeroUICalendar.Header>
                  <HeroUICalendar.YearPickerTrigger>
                    <HeroUICalendar.YearPickerTriggerHeading />
                    <HeroUICalendar.YearPickerTriggerIndicator />
                  </HeroUICalendar.YearPickerTrigger>
                  <HeroUICalendar.NavButton slot="previous" />
                  <HeroUICalendar.NavButton slot="next" />
                </HeroUICalendar.Header>
                <HeroUICalendar.Grid>
                  <HeroUICalendar.GridHeader>
                    {(day) => <HeroUICalendar.HeaderCell>{day}</HeroUICalendar.HeaderCell>}
                  </HeroUICalendar.GridHeader>
                  <HeroUICalendar.GridBody>
                    {(date) => <HeroUICalendar.Cell date={date} />}
                  </HeroUICalendar.GridBody>
                </HeroUICalendar.Grid>
                <HeroUICalendar.YearPickerGrid>
                  <HeroUICalendar.YearPickerGridBody>
                    {({ year }) => <HeroUICalendar.YearPickerCell year={year} />}
                  </HeroUICalendar.YearPickerGridBody>
                </HeroUICalendar.YearPickerGrid>
              </HeroUICalendar>
            </DatePicker.Popover>
          </DatePicker>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1">
          <span className="text-xs font-bold text-muted uppercase tracking-widest">
            Estado del Día
          </span>
          <Chip size="lg" color={statusLabel.color} className="font-bold">
            {statusLabel.label}
          </Chip>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Product Sales Capture */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card className="p-6 flex flex-col gap-6">
            <Card.Header className="flex flex-row items-center justify-between pb-2 border-b border-neutral-150 dark:border-neutral-850 p-0 gap-2">
              <Card.Title className="font-bold text-lg text-accent flex items-center gap-2 m-0">
                <ChartColumnStacked /> Venta de Productos
              </Card.Title>
              {status !== 'PROCESADO' && (
                <Card.Description className="text-xs text-muted">
                  Introduce la cantidad de platos vendidos hoy.
                </Card.Description>
              )}
            </Card.Header>

            {/* Pizzas */}
            <div>
              <h4 className="font-bold text-sm text-foreground uppercase tracking-widest mb-3 text-primary">
                Pizzas
              </h4>
              <div className="flex flex-col gap-2.5">
                {pizzas.length === 0 ? (
                  <div className="text-xs text-muted italic p-3">No hay pizzas configuradas.</div>
                ) : (
                  pizzas.map(renderProductRow)
                )}
              </div>
            </div>

            {/* Complementos */}
            <div className="mt-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-widest mb-3 text-primary">
                Complementos
              </h4>
              <div className="flex flex-col gap-2.5">
                {complements.length === 0 ? (
                  <div className="text-xs text-muted italic p-3">
                    No hay complementos configurados.
                  </div>
                ) : (
                  complements.map(renderProductRow)
                )}
              </div>
            </div>

            {/* Bebidas */}
            <div className="mt-2">
              <h4 className="font-bold text-sm text-foreground uppercase tracking-widest mb-3 text-primary">
                Bebidas
              </h4>
              <div className="flex flex-col gap-2.5">
                {beverages.length === 0 ? (
                  <div className="text-xs text-muted italic p-3">No hay bebidas configuradas.</div>
                ) : (
                  beverages.map(renderProductRow)
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Financial Summaries and Actions */}
        <div className="flex flex-col gap-6">
          {/* Summary Panel */}
          <Card className="p-6 flex flex-col gap-5">
            <Card.Header className="border-b border-neutral-150 dark:border-neutral-850 pb-2 flex flex-col items-start gap-1 p-0">
              <Card.Title className="font-bold text-lg text-accent flex items-center gap-2 m-0">
                <FileDollar /> {status === 'PROCESADO' ? 'Resumen de Cierre' : 'Cálculo Previo'}
              </Card.Title>
            </Card.Header>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted font-medium">Ventas Brutas:</span>
                <span className="font-bold text-foreground">
                  $
                  {displayResumen.ingresosTotales.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  MXN
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted font-medium">Costo de Insumos:</span>
                <span className="font-bold text-danger">
                  -$
                  {displayResumen.costoInsumosTotales.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  MXN
                </span>
              </div>
              <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 my-1"></div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-foreground">Utilidad Neta:</span>
                <span
                  className={`text-base font-bold ${displayResumen.gananciaNeto >= 0 ? 'text-success' : 'text-danger'}`}
                >
                  $
                  {displayResumen.gananciaNeto.toLocaleString('es-MX', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  MXN
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted font-medium">Margen Neto:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${displayResumen.margenNeto >= 30 ? 'bg-success-soft text-success' : displayResumen.margenNeto >= 15 ? 'bg-warning-soft text-warning' : 'bg-danger-soft text-danger'}`}
                >
                  {displayResumen.margenNeto.toFixed(1)}% margen
                </span>
              </div>
            </div>

            {/* Actions */}
            {status !== 'PROCESADO' && (
              <div className="flex flex-col gap-2.5 mt-4">
                <Button
                  onPress={handleSaveVentas}
                  isDisabled={isSubmitting || liveRevenue === 0}
                  className="w-full h-11"
                  variant="outline"
                >
                  Guardar Conteo de Ventas
                </Button>
                <Button
                  onPress={() => setIsConfirmOpen(true)}
                  isDisabled={isSubmitting || status === 'NO_REGISTRADO'}
                  variant="primary"
                  className="w-full h-11"
                >
                  Procesar Cierre del Día
                </Button>
              </div>
            )}
          </Card>

          {/* Warnings List */}
          {warnings.length > 0 && (
            <div className="bg-danger-soft/10 p-5 rounded-2xl border border-danger-soft/20 flex flex-col gap-3">
              <h4 className="font-bold text-sm text-danger flex items-center gap-2">
                <TriangleExclamation className="size-4" /> Alertas de Inventario Crítico
              </h4>
              <ul className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                {warnings.map((w, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-danger font-medium leading-relaxed list-disc ml-4"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Icon className="bg-warning-soft text-warning">
                  <TriangleExclamation className="size-5" />
                </Modal.Icon>
                <Modal.Heading>¿Ejecutar Cierre del Día?</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="p-6">
                <p className="text-sm text-muted">
                  ¿Estás seguro de que deseas procesar el cierre para la fecha{' '}
                  <strong className="text-foreground">{fecha}</strong>?
                </p>
                <p className="text-xs text-danger/80 mt-3 font-semibold bg-danger-soft/20 p-2.5 rounded border border-danger-soft/30">
                  * Esta acción es irreversible: descontará automáticamente el stock de insumos de
                  tu inventario basado en las recetas de los productos vendidos y bloqueará las
                  ventas registradas.
                </p>
              </Modal.Body>

              <Modal.Footer className="flex gap-2 justify-end w-full">
                <Button
                  variant="ghost"
                  className="text-muted"
                  onPress={() => setIsConfirmOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onPress={handleProcessCierre}
                >
                  Confirmar Cierre
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}

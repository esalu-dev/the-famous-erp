'use client';

import { useState, useEffect } from 'react';
import { Card, Chip, Table, Separator } from '@heroui/react';
import {
  ChartColumnStacked,
  FileDollar,
  ShoppingBasket,
  ShoppingCart,
  Thunderbolt,
  Calendar,
  TriangleExclamation,
  Trolley,
} from '@gravity-ui/icons';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
} from 'recharts';
import { type Insumo } from '@/actions/insumos.actions';
import { type Servicio } from '@/actions/servicios.actions';
import { type VentaHistorica } from '@/actions/cierre.actions';
import { type PrecioHistorialEntry } from '@/actions/precios.actions';

interface DashboardClientProps {
  insumos: Insumo[];
  servicios: Servicio[];
  ventas: VentaHistorica[];
  precioHistorial: PrecioHistorialEntry[];
}

export function DashboardClient({
  insumos,
  servicios,
  ventas,
  precioHistorial,
}: DashboardClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Calcular KPIs Financieros
  let totalRevenue = 0;
  let totalInsumosCost = 0;

  ventas.forEach((venta) => {
    const rev = venta.cantidad * Number(venta.producto.precioVenta);
    totalRevenue += rev;

    if (venta.producto.receta) {
      venta.producto.receta.forEach((recetaItem) => {
        const qty = recetaItem.cantidad * venta.cantidad;
        const price = Number(recetaItem.insumo.precioActual);
        totalInsumosCost += qty * price;
      });
    }
  });

  const grossProfit = totalRevenue - totalInsumosCost;
  const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Costo mensual proyectado de servicios activos
  let totalMonthlyServices = 0;
  servicios.forEach((s) => {
    if (s.activo) {
      const cost = Number(s.costo);
      switch (s.periodicidad) {
        case 'Diario':
          totalMonthlyServices += cost * 30;
          break;
        case 'Cada3Dias':
          totalMonthlyServices += cost * 10;
          break;
        case 'Semanal':
          totalMonthlyServices += cost * 4.33;
          break;
        case 'Mensual':
          totalMonthlyServices += cost;
          break;
        case 'Bimestral':
          totalMonthlyServices += cost / 2;
          break;
        case 'Anual':
          totalMonthlyServices += cost / 12;
          break;
        default:
          totalMonthlyServices += cost;
      }
    }
  });

  // 2. Agrupar Ventas por Fecha para el Gráfico (últimos 7 días con actividad)
  const salesByDate: Record<
    string,
    {
      fechaStr: string;
      fechaDisplay: string;
      ingresos: number;
      costos: number;
      ganancia: number;
    }
  > = {};

  ventas.forEach((venta) => {
    const rawDate = new Date(venta.fecha);
    const yyyy = rawDate.getFullYear();
    const mm = String(rawDate.getMonth() + 1).padStart(2, '0');
    const dd = String(rawDate.getDate()).padStart(2, '0');
    const dateKey = `${yyyy}-${mm}-${dd}`;

    if (!salesByDate[dateKey]) {
      salesByDate[dateKey] = {
        fechaStr: dateKey,
        fechaDisplay: rawDate.toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'short',
        }),
        ingresos: 0,
        costos: 0,
        ganancia: 0,
      };
    }

    const data = salesByDate[dateKey];
    const rev = venta.cantidad * Number(venta.producto.precioVenta);
    data.ingresos += rev;

    if (venta.producto.receta) {
      venta.producto.receta.forEach((recetaItem) => {
        data.costos +=
          Number(recetaItem.cantidad) * venta.cantidad * Number(recetaItem.insumo.precioActual);
      });
    }

    data.ganancia = data.ingresos - data.costos;
  });

  const chartData = Object.values(salesByDate)
    .sort((a, b) => a.fechaStr.localeCompare(b.fechaStr))
    .slice(-7);

  // 3. Productos más vendidos
  const productStatsMap: Record<
    string,
    {
      nombre: string;
      cantidad: number;
      ingresos: number;
      costo: number;
      categoria: string;
    }
  > = {};

  ventas.forEach((venta) => {
    const prod = venta.producto;
    if (!productStatsMap[prod.nombre]) {
      let recetaCostoUnitario = 0;
      if (prod.receta) {
        prod.receta.forEach((recetaItem) => {
          recetaCostoUnitario +=
            Number(recetaItem.cantidad) * Number(recetaItem.insumo.precioActual);
        });
      }

      productStatsMap[prod.nombre] = {
        nombre: prod.nombre,
        cantidad: 0,
        ingresos: 0,
        costo: recetaCostoUnitario,
        categoria: prod.categoria,
      };
    }

    const stats = productStatsMap[prod.nombre];
    stats.cantidad += venta.cantidad;
    stats.ingresos += venta.cantidad * Number(prod.precioVenta);
  });

  const topProducts = Object.values(productStatsMap)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  // 4. Insumos Críticos (Bajos de Stock) ordenados por ABC
  const criticalInsumos = insumos
    .filter((insumo) => Number(insumo.cantidadActual) < Number(insumo.cantidadMinima))
    .map((insumo) => {
      const actual = Number(insumo.cantidadActual);
      const minima = Number(insumo.cantidadMinima);
      const percentage = minima > 0 ? Math.round((actual / minima) * 100) : 0;
      return {
        ...insumo,
        actual,
        minima,
        percentage: Math.min(100, Math.max(0, percentage)),
      };
    })
    .sort((a, b) => {
      const priority = { A: 1, B: 2, C: 3 };
      const catA = a.categoria ? priority[a.categoria] : 3;
      const catB = b.categoria ? priority[b.categoria] : 3;
      if (catA !== catB) return catA - catB;
      return a.percentage - b.percentage;
    })
    .slice(0, 5);

  // 5. Servicios próximos a vencer
  const upcomingServices = servicios
    .filter((s) => s.activo)
    .map((s) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const paymentDate = new Date(s.proximoPago);
      paymentDate.setHours(0, 0, 0, 0);

      const diffTime = paymentDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        ...s,
        diasRestantes: diffDays,
        fechaDisplay: paymentDate.toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'short',
        }),
      };
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes)
    .slice(0, 4);

  // 6. Variación de precios reciente (Inflación)
  const priceVariations = precioHistorial
    .map((entry) => {
      const anterior = Number(entry.precioAnterior);
      const nuevo = Number(entry.precioNuevo);
      const diff = nuevo - anterior;
      const pct = anterior > 0 ? (diff / anterior) * 100 : 0;
      return {
        ...entry,
        diff,
        pct: Math.round(pct * 10) / 10,
        fechaDisplay: new Date(entry.fecha).toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'short',
        }),
      };
    })
    .slice(0, 4);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* 1. KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ingresos Totales */}
        <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
          <Card.Content className="flex flex-row items-center gap-4 p-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <FileDollar className="size-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">Ventas Acumuladas</span>
              <span className="text-xl font-bold text-accent">{formatCurrency(totalRevenue)}</span>
              <span className="text-[10px] text-green-500 font-semibold flex items-center gap-0.5 mt-0.5">
                Ventas procesadas
              </span>
            </div>
          </Card.Content>
        </Card>

        {/* KPI 2: Costo de Producción */}
        <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
          <Card.Content className="flex flex-row items-center gap-4 p-4">
            <div className="p-3 bg-danger/10 text-danger rounded-xl">
              <Trolley className="size-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">Costo Insumos (COGS)</span>
              <span className="text-xl font-bold text-accent">
                {formatCurrency(totalInsumosCost)}
              </span>
              <span className="text-[10px] text-muted font-semibold mt-0.5">
                {totalRevenue > 0
                  ? `${Math.round((totalInsumosCost / totalRevenue) * 100)}% del ingreso`
                  : '0% del ingreso'}
              </span>
            </div>
          </Card.Content>
        </Card>

        {/* KPI 3: Margen Bruto */}
        <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
          <Card.Content className="flex flex-row items-center gap-4 p-4">
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <ShoppingBasket className="size-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">Utilidad Bruta</span>
              <span className="text-xl font-bold text-accent">{formatCurrency(grossProfit)}</span>
              <span className="text-[10px] text-success font-semibold mt-0.5">
                {Math.round(grossMarginPercent)}% margen bruto
              </span>
            </div>
          </Card.Content>
        </Card>

        {/* KPI 4: Servicios Mensuales */}
        <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
          <Card.Content className="flex flex-row items-center gap-4 p-4">
            <div className="p-3 bg-warning/10 text-warning rounded-xl">
              <Thunderbolt className="size-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted font-medium">Gastos Operativos Proy.</span>
              <span className="text-xl font-bold text-accent">
                {formatCurrency(totalMonthlyServices)}
              </span>
              <span className="text-[10px] text-muted font-semibold mt-0.5">Servicios al mes</span>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* 2. Main Content Grid (Chart + Side panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Center Column (Chart & Top Products) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Card: Sales Chart */}
          <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
            <Card.Header className="flex flex-col items-start gap-1 p-5">
              <Card.Title className="font-bold text-lg text-accent flex items-center gap-2 m-0">
                <ChartColumnStacked className="size-5 text-primary" />
                Flujo de Ingresos y Costos de Insumos
              </Card.Title>
              <Card.Description className="text-xs text-muted">
                Comparativa de ingresos vs costos de producción de los últimos 7 días operativos
              </Card.Description>
            </Card.Header>
            <Separator />
            <Card.Content className="p-5">
              {mounted ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCostos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e7eb"
                        className="dark:stroke-neutral-800"
                      />
                      <XAxis
                        dataKey="fechaDisplay"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                          color: '#1f2937',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        name="Ingresos"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorIngresos)"
                        strokeWidth={2.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="costos"
                        name="Costo Insumos"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorCostos)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] w-full flex items-center justify-center text-sm text-muted">
                  Cargando gráfico interactivo...
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Card: Top Selling Products */}
          <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
            <Card.Header className="flex flex-col items-start gap-1 p-5">
              <Card.Title className="font-bold text-lg text-accent flex items-center gap-2 m-0">
                <ShoppingBasket className="size-5 text-success" />
                Rendimiento de Productos (Top Ventas)
              </Card.Title>
              <Card.Description className="text-xs text-muted">
                Productos más vendidos, su costo unitario estimado de receta y aportación al margen
                bruto
              </Card.Description>
            </Card.Header>
            <Separator />
            <Card.Content className="p-0">
              <Table className="w-full">
                <Table.ScrollContainer>
                  <Table.Content aria-label="Top ventas table">
                    <Table.Header>
                      <Table.Column isRowHeader>PRODUCTO</Table.Column>
                      <Table.Column>CANTIDAD</Table.Column>
                      <Table.Column>COSTO RECETA</Table.Column>
                      <Table.Column>INGRESOS</Table.Column>
                      <Table.Column>ESTADO</Table.Column>
                    </Table.Header>
                    <Table.Body emptyContent="No hay ventas registradas todavía.">
                      {topProducts.map((p) => {
                        const margin =
                          p.ingresos > 0
                            ? ((p.ingresos - p.costo * p.cantidad) / p.ingresos) * 100
                            : 0;
                        return (
                          <Table.Row
                            key={p.nombre}
                            className="border-b border-neutral-50 dark:border-neutral-900 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors duration-150"
                          >
                            <Table.Cell className="py-4 px-5">
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-accent">{p.nombre}</span>
                                <span className="text-[10px] text-muted">{p.categoria}</span>
                              </div>
                            </Table.Cell>
                            <Table.Cell className="py-4 px-5 text-center font-semibold text-sm">
                              {p.cantidad} u.
                            </Table.Cell>
                            <Table.Cell className="py-4 px-5 text-right font-medium text-sm text-danger">
                              {formatCurrency(p.costo)}
                            </Table.Cell>
                            <Table.Cell className="py-4 px-5 text-right font-bold text-sm text-accent">
                              {formatCurrency(p.ingresos)}
                            </Table.Cell>
                            <Table.Cell className="py-4 px-5 text-center">
                              <Chip
                                size="sm"
                                color={margin > 50 ? 'success' : margin > 30 ? 'warning' : 'danger'}
                                variant="flat"
                                className="rounded-full"
                              >
                                {Math.round(margin)}% margen
                              </Chip>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column (Alerts & Costs) */}
        <div className="flex flex-col gap-6">
          {/* Card: Critical Stock Alerts */}
          <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
            <Card.Header className="flex flex-col items-start gap-1 p-5">
              <Card.Title className="font-bold text-lg text-accent flex items-center gap-2 m-0">
                <ShoppingCart className="size-5 text-danger" />
                Insumos por Resurtir
              </Card.Title>
              <Card.Description className="text-xs text-muted">
                Insumos críticos por debajo de su stock mínimo, ordenados por importancia ABC
              </Card.Description>
            </Card.Header>
            <Separator />
            <Card.Content className="flex flex-col gap-4 p-5">
              {criticalInsumos.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted italic">
                  Todo en orden. No hay insumos bajos de stock.
                </div>
              ) : (
                criticalInsumos.map((i) => {
                  const isA = i.categoria === 'A';
                  return (
                    <div
                      key={i.id}
                      className="flex flex-col gap-1.5 p-3 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-surface-secondary/30"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-accent">{i.nombre}</span>
                          <Chip
                            size="sm"
                            color={isA ? 'danger' : i.categoria === 'B' ? 'warning' : 'success'}
                            variant="flat"
                            className="rounded-md font-bold text-[10px] h-5"
                          >
                            Cat. {i.categoria}
                          </Chip>
                        </div>
                        <span className="text-xs font-semibold text-danger">
                          {i.actual.toFixed(1)} / {i.minima.toFixed(0)}{' '}
                          <span className="text-[10px] text-muted font-normal">
                            {i.unidadMedida === 'Gramos'
                              ? 'g'
                              : i.unidadMedida === 'Mililitros'
                                ? 'ml'
                                : 'pz'}
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${isA ? 'bg-danger' : 'bg-warning'}`}
                          style={{ width: `${i.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </Card.Content>
          </Card>

          {/* Card: Upcoming Service Payments */}
          <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
            <Card.Header className="flex flex-col items-start gap-1 p-5">
              <Card.Title className="font-bold text-lg text-accent flex items-center gap-2 m-0">
                <Calendar className="size-5 text-warning" />
                Vencimiento de Servicios
              </Card.Title>
              <Card.Description className="text-xs text-muted">
                Servicios activos próximos a vencer y requerimiento de flujo de efectivo
              </Card.Description>
            </Card.Header>
            <Separator />
            <Card.Content className="flex flex-col gap-4 p-5">
              {upcomingServices.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted italic">
                  No hay servicios activos registrados.
                </div>
              ) : (
                upcomingServices.map((s) => {
                  const isSoon = s.diasRestantes <= 3;
                  return (
                    <div
                      key={s.id}
                      className="flex justify-between items-center p-2.5 rounded-xl border border-neutral-50 dark:border-neutral-900 bg-surface hover:bg-neutral-50/40 dark:hover:bg-neutral-900/10 transition-all duration-150"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-accent">{s.nombre}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-muted font-medium">
                            {s.fechaDisplay}
                          </span>
                          <span className="text-[10px] text-neutral-300 dark:text-neutral-700">
                            •
                          </span>
                          <span className="text-[10px] text-muted">{s.periodicidad}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-accent">
                          {formatCurrency(s.costo)}
                        </span>
                        <Chip
                          size="sm"
                          color={isSoon ? 'danger' : s.diasRestantes <= 7 ? 'warning' : 'default'}
                          className="rounded-full text-[9px] h-4.5 px-2"
                        >
                          {s.diasRestantes <= 0 ? 'Vence hoy' : `En ${s.diasRestantes} días`}
                        </Chip>
                      </div>
                    </div>
                  );
                })
              )}
            </Card.Content>
          </Card>

          {/* Card: Price Variation alerts */}
          <Card className="border border-neutral-100 dark:border-neutral-900 bg-surface shadow-sm">
            <Card.Header className="flex flex-col items-start gap-1 p-5">
              <Card.Title className="font-bold text-lg text-accent flex items-center gap-2 m-0">
                <TriangleExclamation className="size-5 text-primary" />
                Alertas de Costos (Precios)
              </Card.Title>
              <Card.Description className="text-xs text-muted">
                Variaciones recientes de precios en insumos de proveedores
              </Card.Description>
            </Card.Header>
            <Separator />
            <Card.Content className="flex flex-col gap-3 p-5">
              {priceVariations.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted italic">
                  No hay registro reciente de variación de precios.
                </div>
              ) : (
                priceVariations.map((entry) => {
                  const isIncrease = entry.diff > 0;
                  return (
                    <div
                      key={entry.id}
                      className="flex justify-between items-center py-1.5 border-b border-neutral-50 dark:border-neutral-900 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-accent">
                          {entry.insumo?.nombre || 'Insumo'}
                        </span>
                        <span className="text-[9px] text-muted">
                          {entry.fechaDisplay} • Por {entry.usuario?.nombre || 'Admin'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-accent">
                            {formatCurrency(Number(entry.precioNuevo))}
                          </span>
                          <span className="text-[9px] text-muted">
                            Antes: {formatCurrency(Number(entry.precioAnterior))}
                          </span>
                        </div>
                        <Chip
                          size="sm"
                          color={isIncrease ? 'danger' : 'success'}
                          className="rounded-md text-[9px] font-bold h-5"
                        >
                          {isIncrease ? `+${entry.pct}%` : `${entry.pct}%`}
                        </Chip>
                      </div>
                    </div>
                  );
                })
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}

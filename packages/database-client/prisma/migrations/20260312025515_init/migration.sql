-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('Admin', 'Operador');

-- CreateEnum
CREATE TYPE "InsumoTipo" AS ENUM ('Comida', 'Bebida', 'Cerveza');

-- CreateEnum
CREATE TYPE "UnidadMedida" AS ENUM ('Gramos', 'Piezas', 'Litros', 'Costos');

-- CreateEnum
CREATE TYPE "CategoriaABC" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "EstadoProveedor" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "Periodicidad" AS ENUM ('Diario', 'Cada3Dias', 'Semanal', 'Mensual', 'Bimestral');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'Operador',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insumo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "InsumoTipo" NOT NULL,
    "unidadMedida" "UnidadMedida" NOT NULL,
    "cantidadActual" DECIMAL(10,2) NOT NULL,
    "cantidadMinima" DECIMAL(10,2) NOT NULL,
    "precioActual" DECIMAL(10,2) NOT NULL,
    "categoria" "CategoriaABC" NOT NULL DEFAULT 'C',
    "imagenUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrecioHistorial" (
    "id" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "precioAnterior" DECIMAL(10,2) NOT NULL,
    "precioNuevo" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "PrecioHistorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "razonSocial" TEXT,
    "rfc" TEXT,
    "tipo" TEXT,
    "contactoNombre" TEXT,
    "telefono" TEXT,
    "correo" TEXT,
    "direccion" TEXT,
    "estado" "EstadoProveedor" NOT NULL DEFAULT 'Activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsumoProveedor" (
    "id" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "esPreferido" BOOLEAN NOT NULL DEFAULT false,
    "ultimaCompra" TIMESTAMP(3),

    CONSTRAINT "InsumoProveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "imagenUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receta" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "cantidad" DECIMAL(10,4) NOT NULL,

    CONSTRAINT "Receta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaDiaria" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "registradoPor" TEXT NOT NULL,
    "procesado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VentaDiaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merma" (
    "id" TEXT NOT NULL,
    "insumoId" TEXT NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "motivo" TEXT,
    "fecha" DATE NOT NULL,
    "registradoPor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Merma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" DECIMAL(10,2) NOT NULL,
    "periodicidad" "Periodicidad" NOT NULL,
    "proximoPago" DATE NOT NULL,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL,
    "porcentajeMantenimiento" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "umbralAbcA" DECIMAL(5,2) NOT NULL DEFAULT 80,
    "umbralAbcB" DECIMAL(5,2) NOT NULL DEFAULT 95,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "InsumoProveedor_insumoId_proveedorId_key" ON "InsumoProveedor"("insumoId", "proveedorId");

-- CreateIndex
CREATE UNIQUE INDEX "Receta_productoId_insumoId_key" ON "Receta"("productoId", "insumoId");

-- AddForeignKey
ALTER TABLE "PrecioHistorial" ADD CONSTRAINT "PrecioHistorial_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrecioHistorial" ADD CONSTRAINT "PrecioHistorial_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsumoProveedor" ADD CONSTRAINT "InsumoProveedor_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsumoProveedor" ADD CONSTRAINT "InsumoProveedor_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receta" ADD CONSTRAINT "Receta_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receta" ADD CONSTRAINT "Receta_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaDiaria" ADD CONSTRAINT "VentaDiaria_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaDiaria" ADD CONSTRAINT "VentaDiaria_registradoPor_fkey" FOREIGN KEY ("registradoPor") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma" ADD CONSTRAINT "Merma_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merma" ADD CONSTRAINT "Merma_registradoPor_fkey" FOREIGN KEY ("registradoPor") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

'use client';

import { Archive, Camera, TriangleExclamation } from '@gravity-ui/icons';
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
  InputGroup,
  Select,
  ListBox,
  toast,
} from '@heroui/react';
import { saveInsumoAction, deleteInsumoAction, type Insumo } from '@/actions/insumos.actions';
import { getProveedoresAction, type Proveedor } from '@/actions/proveedores.actions';
import { useState, useEffect, useRef } from 'react';

interface InsumoFormProps {
  insumoAEditar?: Insumo | null; // Si se pasa, el form actúa en modo edición
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const InsumoForm = ({ insumoAEditar, isOpen, onOpenChange }: InsumoFormProps) => {
  const isEditMode = !!insumoAEditar;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  let defaultUnidad = insumoAEditar?.unidadMedida || '';
  let defaultCantidadActual = insumoAEditar?.cantidadActual ? Number(insumoAEditar.cantidadActual) : undefined;
  let defaultCantidadMinima = insumoAEditar?.cantidadMinima ? Number(insumoAEditar.cantidadMinima) : undefined;
  let defaultPrecioActual = insumoAEditar?.precioActual ? Number(insumoAEditar.precioActual) : undefined;

  // Si está en Gramos y la cantidad es >= 1000, mostramos en Kilogramos para mejor UX
  if (defaultUnidad === 'Gramos' && defaultCantidadActual !== undefined && defaultCantidadActual >= 1000) {
    defaultUnidad = 'Kilogramos';
    defaultCantidadActual = defaultCantidadActual / 1000;
    if (defaultCantidadMinima !== undefined) defaultCantidadMinima = defaultCantidadMinima / 1000;
    if (defaultPrecioActual !== undefined) defaultPrecioActual = defaultPrecioActual * 1000;
  }
  // Si está en Mililitros y la cantidad es >= 1000, mostramos en Litros
  else if (defaultUnidad === 'Mililitros' && defaultCantidadActual !== undefined && defaultCantidadActual >= 1000) {
    defaultUnidad = 'Litros';
    defaultCantidadActual = defaultCantidadActual / 1000;
    if (defaultCantidadMinima !== undefined) defaultCantidadMinima = defaultCantidadMinima / 1000;
    if (defaultPrecioActual !== undefined) defaultPrecioActual = defaultPrecioActual * 1000;
  }

  useEffect(() => {
    getProveedoresAction().then((res) => {
      if (res.success) {
        setProveedores(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('foto', selectedFile?.name || '');

    setIsSubmitting(true);

    saveInsumoAction(formData)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        if (response.uploadUrl && selectedFile) {
          return fetch(response.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': selectedFile.type,
            },
            body: selectedFile,
          }).then((uploadRes) => {
            if (!uploadRes.ok) {
              toast.warning('Insumo guardado, pero hubo un error al subir la imagen');
            } else {
              toast.success('Insumo guardado e imagen subida exitosamente');
            }
            onOpenChange(false);
            return response;
          });
        } else {
          toast.success(response.message);
          onOpenChange(false);
          return response;
        }
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        toast.danger(error instanceof Error ? error.message : 'Error al procesar la solicitud');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const confirmDelete = (): Promise<{ success: boolean; message: string }> => {
    if (!insumoAEditar?.id || isSubmitting)
      return Promise.resolve({
        success: false,
        message: 'ID de insumo no válido o acción en progreso',
      });

    setIsConfirmOpen(false);
    setIsSubmitting(true);

    deleteInsumoAction(insumoAEditar.id)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        onOpenChange(false);
        return response;
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    return Promise.resolve({ success: true, message: 'Insumo eliminado correctamente' });
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-2xl">
              <Modal.CloseTrigger />

              {/* Header */}
              <Modal.Header>
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <Archive className="size-5" />
                </Modal.Icon>
                <Modal.Heading>{isEditMode ? 'Editar Insumo' : 'Dar de alta insumo'}</Modal.Heading>
              </Modal.Header>

              {/* Body */}
              <Modal.Body className="p-6">
                <Surface variant="default">
                  <form id="insumo-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* ID oculto en caso de edición */}
                    {isEditMode && <input type="hidden" name="id" value={insumoAEditar.id} />}

                    {/* Nombre */}
                    <TextField
                      className="w-full"
                      name="nombre"
                      isRequired
                      isDisabled={isSubmitting}
                      defaultValue={insumoAEditar?.nombre}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest">Nombre</Label>
                      <Input
                        name="nombre"
                        placeholder="Ej. Queso Mozzarella"
                        variant="secondary"
                        className="h-11 px-3 text-sm"
                      />
                    </TextField>

                    {/* Fila: Tipo y UnidadMedida */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        className="w-full"
                        name="tipo"
                        placeholder="Selecciona un tipo"
                        defaultSelectedKey={insumoAEditar?.tipo}
                        isDisabled={isSubmitting}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">Tipo</Label>
                        <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="Comida" textValue="Comida">
                              Comida
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Bebida" textValue="Bebida">
                              Bebida
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Cerveza" textValue="Cerveza">
                              Cerveza
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Empaque" textValue="Empaque">
                              Empaque
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Limpieza" textValue="Limpieza">
                              Limpieza
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Utensilios" textValue="Utensilios">
                              Utensilios
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Papeleria" textValue="Papelería">
                              Papelería
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>

                      <Select
                        className="w-full"
                        name="unidadMedida"
                        placeholder="Selecciona una unidad"
                        defaultSelectedKey={defaultUnidad}
                        isDisabled={isSubmitting}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Unidad
                        </Label>
                        <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="Kilogramos" textValue="Kilogramos (kg)">
                              Kilogramos (kg)
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Gramos" textValue="Gramos (g)">
                              Gramos (g)
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Miligramos" textValue="Miligramos (mg)">
                              Miligramos (mg)
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Litros" textValue="Litros (L)">
                              Litros (L)
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Mililitros" textValue="Mililitros (ml)">
                              Mililitros (ml)
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Piezas" textValue="Piezas (pz)">
                              Piezas (pz)
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Fila: Cantidad Actual y Mínima */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        className="w-full"
                        name="cantidadActual"
                        isRequired
                        isDisabled={isSubmitting}
                        defaultValue={defaultCantidadActual?.toString()}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Cantidad Actual
                        </Label>
                        <Input
                          name="cantidadActual"
                          placeholder="0"
                          type="number"
                          min={0}
                          variant="secondary"
                          className="h-11 px-3 text-sm"
                        />
                      </TextField>

                      <TextField
                        className="w-full"
                        name="cantidadMinima"
                        isRequired
                        isDisabled={isSubmitting}
                        defaultValue={defaultCantidadMinima?.toString()}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Cantidad Mínima (Alertas)
                        </Label>
                        <Input
                          name="cantidadMinima"
                          placeholder="0"
                          type="number"
                          min={0}
                          variant="secondary"
                          className="h-11 px-3 text-sm"
                        />
                      </TextField>
                    </div>

                    {/* Fila: Precio y Proveedor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        className="w-full"
                        name="precioActual"
                        isRequired
                        isDisabled={isSubmitting}
                        defaultValue={defaultPrecioActual?.toString()}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Precio Actual
                        </Label>
                        <InputGroup
                          className="h-11 flex items-center overflow-hidden w-full"
                          variant="secondary"
                        >
                          <InputGroup.Prefix className="text-muted font-semibold pl-3">
                            $
                          </InputGroup.Prefix>
                          <InputGroup.Input
                            name="precioActual"
                            className="w-full text-sm pl-2"
                            type="number"
                            step="0.01"
                            min={0}
                            placeholder="0.00"
                            required
                          />
                          <InputGroup.Suffix className="text-muted text-xs pr-3">
                            MXN
                          </InputGroup.Suffix>
                        </InputGroup>
                      </TextField>

                      <Select
                        className="w-full"
                        name="proveedorId"
                        placeholder="Selecciona un proveedor"
                        defaultSelectedKey={insumoAEditar?.proveedorId}
                        isDisabled={isSubmitting}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Proveedor
                        </Label>
                        <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {proveedores.map((p) => (
                              <ListBox.Item key={p.id} id={p.id} textValue={p.nombre}>
                                {p.nombre}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Foto (Upload) */}
                    <div className="w-full flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                        <Camera className="text-muted size-4" /> Foto del Insumo
                      </label>
                      
                      {/* Image Preview */}
                      {(selectedFile || insumoAEditar?.imagenUrl) && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-surface-secondary mb-2 group shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={selectedFile ? URL.createObjectURL(selectedFile) : (insumoAEditar?.imagenUrl || '')}
                            alt="Vista previa de foto"
                            className="w-full h-full object-cover"
                          />
                          {selectedFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              title="Eliminar imagen seleccionada"
                            >
                              <span className="text-xs font-bold text-white bg-danger px-2 py-1 rounded-md transition-colors hover:bg-danger/90">
                                Quitar
                              </span>
                            </button>
                          )}
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        name="foto"
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting}
                        className="h-11 px-3 text-sm flex items-center pt-2 bg-surface-secondary rounded-md cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        onChange={(e) => {
                          const files = e.target.files;
                          console.log('Archivo seleccionado:', files);
                          if (files && files.length > 0) {
                            setSelectedFile(files[0]);
                          }
                        }}
                      />
                    </div>
                  </form>
                </Surface>
              </Modal.Body>

              {/* Footer */}
              <Modal.Footer className="flex justify-between items-center w-full">
                <div>
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      className="text-danger hover:bg-danger-soft border border-transparent hover:border-danger-soft transition-all duration-200"
                      onPress={() => setIsConfirmOpen(true)}
                      isDisabled={isSubmitting}
                    >
                      Eliminar Insumo
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    slot="close"
                    variant="ghost"
                    className="text-muted"
                    onPress={() => onOpenChange(false)}
                    isDisabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    form="insumo-form"
                    variant="primary"
                    isPending={isSubmitting}
                    isDisabled={isSubmitting}
                  >
                    {isEditMode ? 'Guardar Cambios' : 'Guardar'}
                  </Button>
                </div>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Modal de Confirmación de Eliminación Premium */}
      <Modal isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Icon className="bg-danger-soft text-danger">
                  <TriangleExclamation className="size-5" />
                </Modal.Icon>
                <Modal.Heading>¿Eliminar Insumo?</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="p-6">
                <p className="text-sm text-muted">
                  ¿Estás seguro de que deseas eliminar permanentemente el insumo{' '}
                  <strong className="text-foreground">{insumoAEditar?.nombre}</strong>?
                </p>
                <p className="text-xs text-danger/80 mt-3 font-semibold bg-danger-soft/20 p-2.5 rounded border border-danger-soft/30">
                  * Nota: Esta acción fallará si el insumo está siendo utilizado en alguna receta,
                  merma o producto.
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
                  className="bg-danger text-danger-foreground hover:bg-danger/90"
                  onPress={confirmDelete}
                >
                  Eliminar
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};

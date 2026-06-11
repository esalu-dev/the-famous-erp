'use client';

import { Archive, Camera, TriangleExclamation, Plus } from '@gravity-ui/icons';
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
import { saveProductoAction, deleteProductoAction, type Producto, type RecetaItem } from '@/actions/productos.actions';
import { getInsumosAction, type Insumo } from '@/actions/insumos.actions';
import { useState, useEffect, useRef } from 'react';

interface ProductoFormProps {
  productoAEditar?: Producto | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ProductoForm = ({ productoAEditar, isOpen, onOpenChange }: ProductoFormProps) => {
  const isEditMode = !!productoAEditar;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lists fetched from backend
  const [insumos, setInsumos] = useState<Insumo[]>([]);

  // Form states
  const [categoria, setCategoria] = useState<string>(productoAEditar?.categoria || '');
  const [activo, setActivo] = useState<boolean>(productoAEditar?.activo ?? true);

  // Recipe states
  const [recipeItems, setRecipeItems] = useState<{
    insumoId: string;
    cantidad: number;
    nombre: string;
    unidadMedida: string;
  }[]>([]);

  // Single beverage insumo state (for Bebida category)
  const [selectedBeverageInsumoId, setSelectedBeverageInsumoId] = useState<string>('');

  // Local state for recipe builder (for Pizza/Complemento)
  const [selectedInsumoId, setSelectedInsumoId] = useState<string>('');
  const [quantityToAdd, setQuantityToAdd] = useState<string>('');

  // Fetch insumos on mount
  useEffect(() => {
    getInsumosAction().then((res) => {
      if (res.success) {
        setInsumos(res.data);
      }
    });
  }, []);

  // Sync category and active state when editing product changes
  useEffect(() => {
    if (isOpen) {
      if (productoAEditar) {
        setCategoria(productoAEditar.categoria);
        setActivo(productoAEditar.activo);
      } else {
        setCategoria('');
        setActivo(true);
        setRecipeItems([]);
        setSelectedBeverageInsumoId('');
      }
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, productoAEditar]);

  // Map product's recipe to list items when insumos and product are loaded
  useEffect(() => {
    if (isOpen && insumos.length > 0) {
      if (productoAEditar) {
        if (productoAEditar.categoria === 'Bebida') {
          const firstItem = productoAEditar.receta?.[0];
          if (firstItem) {
            setSelectedBeverageInsumoId(firstItem.insumoId);
          }
        } else {
          const mapped = (productoAEditar.receta || []).map((item) => {
            const ins = insumos.find((i) => i.id === item.insumoId);
            return {
              insumoId: item.insumoId,
              cantidad: Number(item.cantidad),
              nombre: ins ? ins.nombre : 'Insumo desconocido',
              unidadMedida: ins ? ins.unidadMedida : '',
            };
          });
          setRecipeItems(mapped);
        }
      }
    }
  }, [isOpen, productoAEditar, insumos]);

  const handleAddIngredient = () => {
    if (!selectedInsumoId || !quantityToAdd) {
      toast.warning('Por favor selecciona un insumo y especifica la cantidad.');
      return;
    }

    const qty = Number(quantityToAdd);
    if (isNaN(qty) || qty <= 0) {
      toast.warning('La cantidad debe ser un número mayor a cero.');
      return;
    }

    const ins = insumos.find((i) => i.id === selectedInsumoId);
    if (!ins) return;

    if (recipeItems.some((item) => item.insumoId === selectedInsumoId)) {
      toast.warning('Este insumo ya ha sido agregado a la receta.');
      return;
    }

    setRecipeItems([
      ...recipeItems,
      {
        insumoId: selectedInsumoId,
        cantidad: qty,
        nombre: ins.nombre,
        unidadMedida: ins.unidadMedida,
      },
    ]);

    setSelectedInsumoId('');
    setQuantityToAdd('');
  };

  const handleRemoveIngredient = (insumoId: string) => {
    setRecipeItems(recipeItems.filter((item) => item.insumoId !== insumoId));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('foto', selectedFile?.name || '');

    // Validate category
    if (!categoria) {
      toast.danger('Debes seleccionar una categoría.');
      return;
    }

    // Build and validate recipe payload
    let recipePayload: { insumoId: string; cantidad: number }[] = [];
    if (categoria === 'Bebida') {
      if (!selectedBeverageInsumoId) {
        toast.danger('Para productos de categoría Bebida, debes asociar un insumo.');
        return;
      }
      recipePayload = [{ insumoId: selectedBeverageInsumoId, cantidad: 1.0 }];
    } else {
      if (recipeItems.length === 0) {
        toast.danger('Debes agregar al menos un ingrediente a la receta.');
        return;
      }
      recipePayload = recipeItems.map((item) => ({
        insumoId: item.insumoId,
        cantidad: item.cantidad,
      }));
    }

    formData.set('receta', JSON.stringify(recipePayload));
    formData.set('activo', String(activo));
    formData.set('categoria', categoria);

    setIsSubmitting(true);

    saveProductoAction(formData)
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
              toast.warning('Producto guardado, pero hubo un error al subir la imagen');
            } else {
              toast.success('Producto guardado e imagen subida exitosamente');
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
    if (!productoAEditar?.id || isSubmitting)
      return Promise.resolve({
        success: false,
        message: 'ID de producto no válido o acción en progreso',
      });

    setIsConfirmOpen(false);
    setIsSubmitting(true);

    deleteProductoAction(productoAEditar.id)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        toast.success(response.message);
        onOpenChange(false);
        return response;
      })
      .catch((error) => {
        toast.danger(error instanceof Error ? error.message : 'Error al eliminar el producto');
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    return Promise.resolve({ success: true, message: 'Producto eliminado correctamente' });
  };

  const selectedInsumo = insumos.find((i) => i.id === selectedInsumoId);

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
                <Modal.Heading>{isEditMode ? 'Editar Producto' : 'Dar de alta producto'}</Modal.Heading>
              </Modal.Header>

              {/* Body */}
              <Modal.Body className="p-6 max-h-[75vh] overflow-y-auto">
                <Surface variant="default">
                  <form id="producto-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* ID oculto en caso de edición */}
                    {isEditMode && <input type="hidden" name="id" value={productoAEditar.id} />}

                    {/* Nombre */}
                    <TextField
                      className="w-full"
                      name="nombre"
                      isRequired
                      isDisabled={isSubmitting}
                      defaultValue={productoAEditar?.nombre}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest">Nombre</Label>
                      <Input
                        name="nombre"
                        placeholder="Ej. Pizza Pepperoni Familiar"
                        variant="secondary"
                        className="h-11 px-3 text-sm"
                      />
                    </TextField>

                    {/* Categoría y Precio */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        className="w-full"
                        name="categoria"
                        placeholder="Selecciona una categoría"
                        selectedKey={categoria}
                        onSelectionChange={(key) => {
                          setCategoria(key as string);
                          // Reset recipe if category changes
                          setRecipeItems([]);
                          setSelectedBeverageInsumoId('');
                        }}
                        isDisabled={isSubmitting}
                        isRequired
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">Categoría</Label>
                        <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="Pizza" textValue="Pizza">
                              Pizza
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Bebida" textValue="Bebida">
                              Bebida
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Complemento" textValue="Complemento">
                              Complemento
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>

                      <TextField
                        className="w-full"
                        name="precioVenta"
                        isRequired
                        isDisabled={isSubmitting}
                        defaultValue={productoAEditar?.precioVenta?.toString()}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Precio de Venta
                        </Label>
                        <InputGroup
                          className="h-11 flex items-center overflow-hidden w-full"
                          variant="secondary"
                        >
                          <InputGroup.Prefix className="text-muted font-semibold pl-3">
                            $
                          </InputGroup.Prefix>
                          <InputGroup.Input
                            name="precioVenta"
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
                    </div>

                    {/* Activo / Desactivado (en modo edición) */}
                    {isEditMode && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="activo-checkbox"
                          checked={activo}
                          onChange={(e) => setActivo(e.target.checked)}
                          className="rounded border-neutral-300 text-primary focus:ring-primary w-4 h-4"
                        />
                        <label htmlFor="activo-checkbox" className="text-sm font-semibold text-foreground">
                          Producto Activo (Visible en ventas)
                        </label>
                      </div>
                    )}

                    {/* RECETA BUILDER */}
                    {categoria && (
                      <div className="flex flex-col gap-3 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                        <h5 className="font-bold text-sm text-accent uppercase tracking-widest">
                          Receta / Ingredientes
                        </h5>

                        {categoria === 'Bebida' ? (
                          // Beverage Mode: Single select associated Insumo
                          <Select
                            className="w-full"
                            placeholder="Selecciona el insumo de bebida"
                            selectedKey={selectedBeverageInsumoId}
                            onSelectionChange={(key) => setSelectedBeverageInsumoId(key as string)}
                            isDisabled={isSubmitting}
                          >
                            <Label className="text-xs text-muted">Insumo asociado en inventario</Label>
                            <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                              <Select.Value />
                              <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                              <ListBox>
                                {insumos
                                  .filter((i) => i.tipo === 'Bebida' || i.tipo === 'Cerveza')
                                  .map((i) => (
                                    <ListBox.Item key={i.id} id={i.id} textValue={i.nombre}>
                                      {i.nombre} ({i.unidadMedida})
                                      <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                  ))}
                              </ListBox>
                            </Select.Popover>
                          </Select>
                        ) : (
                          // Pizza/Complemento Mode: Dynamic recipe builder
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-2 items-end">
                              <div className="flex-1 w-full">
                                <Select
                                  className="w-full"
                                  placeholder="Selecciona un ingrediente"
                                  selectedKey={selectedInsumoId}
                                  onSelectionChange={(key) => setSelectedInsumoId(key as string)}
                                  isDisabled={isSubmitting}
                                >
                                  <Label className="text-xs text-muted">Ingrediente</Label>
                                  <Select.Trigger className="h-11 px-3 text-xs w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                                    <Select.Value />
                                    <Select.Indicator />
                                  </Select.Trigger>
                                  <Select.Popover>
                                    <ListBox>
                                      {insumos.map((i) => (
                                        <ListBox.Item key={i.id} id={i.id} textValue={i.nombre}>
                                          {i.nombre} ({i.unidadMedida})
                                          <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                      ))}
                                    </ListBox>
                                  </Select.Popover>
                                </Select>
                              </div>

                              <div className="w-full sm:w-36">
                                <TextField
                                  className="w-full"
                                  isDisabled={isSubmitting}
                                  value={quantityToAdd}
                                  onChange={setQuantityToAdd}
                                >
                                  <Label className="text-xs text-muted">
                                    Cant. {selectedInsumo ? `(${selectedInsumo.unidadMedida})` : ''}
                                  </Label>
                                  <Input
                                    placeholder="0"
                                    type="number"
                                    min={0}
                                    step="any"
                                    variant="secondary"
                                    className="h-11 px-3 text-sm"
                                  />
                                </TextField>
                              </div>

                              <Button
                                type="button"
                                onPress={handleAddIngredient}
                                isDisabled={isSubmitting || !selectedInsumoId || !quantityToAdd}
                                className="h-11 bg-primary text-primary-foreground font-semibold px-4 w-full sm:w-auto"
                              >
                                <Plus /> Agregar
                              </Button>
                            </div>

                            {/* Added ingredients list */}
                            <div className="flex flex-col gap-2 border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-surface-secondary">
                              <span className="text-xs font-bold uppercase tracking-widest text-muted">
                                Ingredientes en la receta
                              </span>
                              {recipeItems.length === 0 ? (
                                <span className="text-xs text-muted italic text-center py-4">
                                  No hay ingredientes agregados. Crea la receta seleccionando insumos arriba.
                                </span>
                              ) : (
                                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                                  {recipeItems.map((item) => (
                                    <div
                                      key={item.insumoId}
                                      className="flex justify-between items-center bg-surface-primary p-2 rounded border border-neutral-200 dark:border-neutral-800 text-sm shadow-sm"
                                    >
                                      <div>
                                        <span className="font-semibold text-foreground">{item.nombre}</span>
                                        <span className="text-xs text-muted ml-2">
                                          ({item.cantidad} {item.unidadMedida})
                                        </span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-danger hover:bg-danger-soft border-none min-w-0 p-2 h-8"
                                        onPress={() => handleRemoveIngredient(item.insumoId)}
                                      >
                                        Quitar
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Foto (Upload) */}
                    <div className="w-full flex flex-col gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                      <label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-foreground">
                        <Camera className="text-muted size-4" /> Foto del Producto
                      </label>

                      {/* Image Preview */}
                      {(selectedFile || productoAEditar?.imagenUrl) && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-surface-secondary mb-2 group shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              selectedFile
                                ? URL.createObjectURL(selectedFile)
                                : productoAEditar?.imagenUrl || ''
                            }
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
                      Eliminar Producto
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
                    form="producto-form"
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
                <Modal.Heading>¿Eliminar Producto?</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="p-6">
                <p className="text-sm text-muted">
                  ¿Estás seguro de que deseas desactivar permanentemente el producto{' '}
                  <strong className="text-foreground">{productoAEditar?.nombre}</strong>?
                </p>
                <p className="text-xs text-danger/80 mt-3 font-semibold bg-danger-soft/20 p-2.5 rounded border border-danger-soft/30">
                  * Nota: El producto ya no estará activo para registrar ventas.
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

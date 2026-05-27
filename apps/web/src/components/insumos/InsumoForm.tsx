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
  toast,
  Select,
  ListBox,
} from '@heroui/react';
import { saveInsumoAction, deleteInsumoAction, type Insumo } from '@/actions/insumos.actions';
import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';

interface InsumoFormProps {
  insumoAEditar?: Insumo | null; // Si se pasa, el form actúa en modo edición
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const InsumoForm = ({ insumoAEditar, isOpen, onOpenChange }: InsumoFormProps) => {
  const isEditMode = !!insumoAEditar;
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);

    const savePromise = saveInsumoAction(formData)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response;
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    toast.promise(savePromise, {
      loading: isEditMode ? 'Actualizando insumo...' : 'Guardando insumo...',
      success: (response) => {
        onOpenChange(false);
        form.reset();
        startTransition(() => {
          router.refresh();
        });
        return response.message;
      },
      error: (err) => err.message || 'Ocurrió un error inesperado',
    });
  };

  const confirmDelete = () => {
    if (!insumoAEditar?.id || isSubmitting) return;

    setIsConfirmOpen(false);
    setIsSubmitting(true);

    const deletePromise = deleteInsumoAction(insumoAEditar.id)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return response;
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    toast.promise(deletePromise, {
      loading: 'Eliminando insumo...',
      success: (response) => {
        onOpenChange(false);
        startTransition(() => {
          router.refresh();
        });
        return response.message;
      },
      error: (err) => err.message || 'Ocurrió un error inesperado al eliminar',
    });
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
                    <TextField className="w-full" name="nombre" isRequired isDisabled={isSubmitting}>
                      <Label className="text-xs font-bold uppercase tracking-widest">Nombre</Label>
                      <Input
                        name="nombre"
                        placeholder="Ej. Queso Mozzarella"
                        variant="secondary"
                        className="h-11 px-3 text-sm"
                        defaultValue={insumoAEditar?.nombre}
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
                          </ListBox>
                        </Select.Popover>
                      </Select>

                      <Select
                        className="w-full"
                        name="unidadMedida"
                        placeholder="Selecciona una unidad"
                        defaultSelectedKey={insumoAEditar?.unidadMedida}
                        isDisabled={isSubmitting}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">Unidad</Label>
                        <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="Gramos" textValue="Gramos (g)">
                              Gramos (g)
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Litros" textValue="Mililitros (ml)">
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
                      <TextField className="w-full" name="cantidadActual" isRequired isDisabled={isSubmitting}>
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
                          defaultValue={insumoAEditar?.cantidadActual?.toString()}
                        />
                      </TextField>

                      <TextField className="w-full" name="cantidadMinima" isRequired isDisabled={isSubmitting}>
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
                          defaultValue={insumoAEditar?.cantidadMinima?.toString()}
                        />
                      </TextField>
                    </div>

                    {/* Fila: Precio y Proveedor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField className="w-full" name="precioActual" isRequired isDisabled={isSubmitting}>
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
                            defaultValue={insumoAEditar?.precioActual?.toString()}
                            required
                          />
                          <InputGroup.Suffix className="text-muted text-xs pr-3">
                            MXN
                          </InputGroup.Suffix>
                        </InputGroup>
                      </TextField>

                      <Select
                        className="w-full"
                        name="proveedor"
                        placeholder="Selecciona un proveedor"
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
                            <ListBox.Item id="lacteos_express" textValue="Lácteos Express">
                              Lácteos Express
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="distribuidora_norte" textValue="Distribuidora Norte">
                              Distribuidora Norte
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Foto (Upload) */}
                    <TextField className="w-full" name="foto" isDisabled={isSubmitting}>
                      <Label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Camera className="text-muted size-4" /> Foto del Insumo
                      </Label>
                      <Input
                        name="foto"
                        type="file"
                        accept="image/*"
                        className="h-11 px-3 text-sm flex items-center pt-2 bg-surface-secondary rounded-md cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                    </TextField>
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
                  * Nota: Esta acción fallará si el insumo está siendo utilizado en alguna receta, merma o producto.
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

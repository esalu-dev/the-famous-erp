'use client';

import { useState } from 'react';
import { Person, Envelope, LocationArrow, Handset, TriangleExclamation } from '@gravity-ui/icons';
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
  toast,
  Select,
  ListBox,
  InputGroup,
} from '@heroui/react';
import {
  saveProveedorAction,
  deleteProveedorAction,
  type Proveedor,
} from '@/actions/proveedores.actions';

interface ProveedorFormProps {
  proveedorAEditar?: Proveedor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ProveedorForm = ({ proveedorAEditar, isOpen, onOpenChange }: ProveedorFormProps) => {
  const isEditMode = !!proveedorAEditar;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    setIsSubmitting(true);

    try {
      const response = await saveProveedorAction(formData);
      if (response.success) {
        toast.success(response.message);
        onOpenChange(false);
      } else {
        toast.danger(response.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.danger(message || 'Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!proveedorAEditar?.id || isSubmitting) return;

    setIsConfirmOpen(false);
    setIsSubmitting(true);

    try {
      const response = await deleteProveedorAction(proveedorAEditar.id);
      if (response.success) {
        toast.success(response.message);
        onOpenChange(false);
      } else {
        toast.danger(response.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.danger(message || 'Error al intentar inactivar el proveedor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReactivate = async () => {
    if (!proveedorAEditar?.id || isSubmitting) return;

    const formData = new FormData();
    formData.set('id', proveedorAEditar.id);
    formData.set('nombre', proveedorAEditar.nombre);
    formData.set('estado', 'Activo');

    setIsSubmitting(true);

    try {
      const response = await saveProveedorAction(formData);
      if (response.success) {
        toast.success('Proveedor reactivado exitosamente.');
        onOpenChange(false);
      } else {
        toast.danger(response.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.danger(message || 'Error al intentar reactivar el proveedor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Backdrop>
          <Modal.Container placement="auto">
            <Modal.Dialog className="sm:max-w-3xl">
              {' '}
              <Modal.CloseTrigger />
              {/* Header */}
              <Modal.Header>
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <Person className="size-5" />
                </Modal.Icon>
                <Modal.Heading>{isEditMode ? 'Editar Proveedor' : 'Nuevo Proveedor'}</Modal.Heading>
              </Modal.Header>
              {/* Body */}
              <Modal.Body className="p-6">
                <Surface variant="default">
                  <form id="proveedor-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* ID oculto en caso de edición */}
                    {isEditMode && <input type="hidden" name="id" value={proveedorAEditar.id} />}

                    {/* Fila 1: Nombre  y Razón Social */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        className="w-full"
                        name="nombre"
                        isRequired
                        isDisabled={isSubmitting}
                        defaultValue={proveedorAEditar?.nombre}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Nombre Comercial
                        </Label>
                        <Input
                          name="nombre"
                          placeholder="Ej. Distribuidora El Sol"
                          variant="secondary"
                          className="h-11 px-3 text-sm"
                        />
                      </TextField>

                      <TextField
                        className="w-full"
                        name="razonSocial"
                        isDisabled={isSubmitting}
                        defaultValue={proveedorAEditar?.razonSocial || ''}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Razón Social
                        </Label>
                        <Input
                          name="razonSocial"
                          placeholder="Ej. El Sol S.A. de C.V."
                          variant="secondary"
                          className="h-11 px-3 text-sm"
                        />
                      </TextField>
                    </div>

                    {/* Fila 2: RFC y Tipo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        className="w-full"
                        name="rfc"
                        isDisabled={isSubmitting}
                        defaultValue={proveedorAEditar?.rfc || ''}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          RFC
                        </Label>
                        <Input
                          name="rfc"
                          placeholder="Ej. SOL010101XYZ"
                          variant="secondary"
                          className="h-11 px-3 text-sm uppercase"
                        />
                      </TextField>

                      <Select
                        className="w-full"
                        name="tipo"
                        placeholder="Selecciona un tipo"
                        defaultSelectedKey={proveedorAEditar?.tipo || undefined}
                        isDisabled={isSubmitting}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Tipo de Proveedor
                        </Label>
                        <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="alimentos" textValue="Alimentos">
                              Ingredientes y Alimentos
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="bebidas" textValue="Bebidas">
                              Bebidas
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="servicios" textValue="Servicios">
                              Servicios
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="limpieza" textValue="Limpieza">
                              Limpieza e Insumos
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    <hr className="border-border my-2" />

                    {/* Sección: Datos de Contacto */}
                    <h3 className="text-sm font-semibold text-accent flex items-center gap-2">
                      <Person width={16} /> Datos de Contacto
                    </h3>

                    {/* Fila 3: Contacto y Teléfono */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextField
                        className="w-full"
                        name="contactoNombre"
                        isDisabled={isSubmitting}
                        defaultValue={proveedorAEditar?.contactoNombre || ''}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Nombre del Contacto
                        </Label>
                        <Input
                          name="contactoNombre"
                          placeholder="Ej. Juan Pérez"
                          variant="secondary"
                          className="h-11 px-3 text-sm"
                        />
                      </TextField>

                      <TextField
                        className="w-full"
                        name="telefono"
                        isDisabled={isSubmitting}
                        defaultValue={proveedorAEditar?.telefono || ''}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Teléfono
                        </Label>
                        <InputGroup
                          className="h-11 flex items-center overflow-hidden w-full"
                          variant="secondary"
                        >
                          <InputGroup.Prefix className="text-muted font-semibold pl-3">
                            <Handset width={16} />
                          </InputGroup.Prefix>
                          <InputGroup.Input
                            name="telefono"
                            className="w-full text-sm pl-2"
                            type="tel"
                            placeholder="555-123-4567"
                          />
                        </InputGroup>
                      </TextField>
                    </div>

                    {/* Fila 4: Correo y Dirección */}
                    <div className="grid grid-cols-1 gap-4">
                      <TextField
                        className="w-full"
                        name="correo"
                        isDisabled={isSubmitting}
                        defaultValue={proveedorAEditar?.correo || ''}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Correo Electrónico
                        </Label>
                        <InputGroup
                          className="h-11 flex items-center overflow-hidden w-full"
                          variant="secondary"
                        >
                          <InputGroup.Prefix className="text-muted font-semibold pl-3">
                            <Envelope width={16} />
                          </InputGroup.Prefix>
                          <InputGroup.Input
                            name="correo"
                            className="w-full text-sm pl-2"
                            type="email"
                            placeholder="contacto@empresa.com"
                          />
                        </InputGroup>
                      </TextField>

                      <TextField
                        className="w-full"
                        name="direccion"
                        isDisabled={isSubmitting}
                        defaultValue={proveedorAEditar?.direccion || ''}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Dirección
                        </Label>
                        <InputGroup
                          className="h-11 flex items-center overflow-hidden w-full"
                          variant="secondary"
                        >
                          <InputGroup.Prefix className="text-muted font-semibold pl-3">
                            <LocationArrow width={16} />
                          </InputGroup.Prefix>
                          <InputGroup.Input
                            name="direccion"
                            className="w-full text-sm pl-2"
                            type="text"
                            placeholder="Calle, Número, Colonia, Ciudad"
                          />
                        </InputGroup>
                      </TextField>
                    </div>
                  </form>
                </Surface>
              </Modal.Body>
              {/* Footer */}
              <Modal.Footer className="flex justify-between items-center w-full">
                <div>
                  {isEditMode &&
                    (proveedorAEditar?.estado === 'Inactivo' ? (
                      <Button
                        variant="ghost"
                        className="text-accent hover:bg-accent-soft border border-transparent hover:border-accent-soft transition-all duration-200"
                        onPress={handleReactivate}
                        isDisabled={isSubmitting}
                      >
                        Reactivar Proveedor
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="text-danger hover:bg-danger-soft border border-transparent hover:border-danger-soft transition-all duration-200"
                        onPress={() => setIsConfirmOpen(true)}
                        isDisabled={isSubmitting}
                      >
                        Eliminar Proveedor
                      </Button>
                    ))}
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
                    form="proveedor-form"
                    variant="primary"
                    isPending={isSubmitting}
                    isDisabled={isSubmitting}
                  >
                    {isEditMode ? 'Guardar Cambios' : 'Registrar Proveedor'}
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
                <Modal.Heading>¿Inactivar Proveedor?</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="p-6">
                <p className="text-sm text-muted">
                  ¿Estás seguro de que deseas cambiar el estado a{' '}
                  <strong className="text-danger">Inactivo</strong> del proveedor{' '}
                  <strong className="text-foreground">{proveedorAEditar?.nombre}</strong>?
                </p>
                <p className="text-xs text-muted-foreground mt-3 bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded">
                  * Nota: El proveedor ya no se sugerirá para nuevas órdenes o insumos, pero sus
                  compras históricas se mantendrán intactas.
                </p>
              </Modal.Body>

              <Modal.Footer className="flex gap-2 justify-end w-full">
                <Button
                  variant="ghost"
                  className="text-muted"
                  onPress={() => setIsConfirmOpen(false)}
                  isDisabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="bg-danger text-danger-foreground hover:bg-danger/90"
                  onPress={confirmDelete}
                  isPending={isSubmitting}
                  isDisabled={isSubmitting}
                >
                  Inactivar
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};

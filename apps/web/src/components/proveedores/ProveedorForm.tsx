'use client';

import { Person, Envelope, LocationArrow, Handset } from '@gravity-ui/icons';
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
import { saveProveedorAction, type Proveedor } from '@/actions/proveedores.actions';

interface ProveedorFormProps {
  proveedorAEditar?: Proveedor | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ProveedorForm = ({ proveedorAEditar, isOpen, onOpenChange }: ProveedorFormProps) => {
  const isEditMode = !!proveedorAEditar;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    toast.promise(saveProveedorAction(formData), {
      loading: isEditMode ? 'Actualizando proveedor...' : 'Registrando proveedor...',
      success: (response) => {
        onOpenChange(false); // se cierra el modal al completar la acción
        return response.message;
      },
      error: (err) => err.message || 'Ocurrió un error inesperado',
    });
  };

  return (
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
                  {/* Fila 1: Nombre  y Razón Social */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField className="w-full" name="nombre" isRequired>
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Nombre Comercial
                      </Label>
                      <Input
                        placeholder="Ej. Distribuidora El Sol"
                        variant="secondary"
                        className="h-11 px-3 text-sm"
                        defaultValue={proveedorAEditar?.nombre}
                      />
                    </TextField>

                    <TextField className="w-full" name="razonSocial">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Razón Social
                      </Label>
                      <Input
                        placeholder="Ej. El Sol S.A. de C.V."
                        variant="secondary"
                        className="h-11 px-3 text-sm"
                        defaultValue={proveedorAEditar?.razonSocial || ''}
                      />
                    </TextField>
                  </div>

                  {/* Fila 2: RFC y Tipo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField className="w-full" name="rfc">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        RFC
                      </Label>
                      <Input
                        placeholder="Ej. SOL010101XYZ"
                        variant="secondary"
                        className="h-11 px-3 text-sm uppercase"
                        defaultValue={proveedorAEditar?.rfc || ''}
                      />
                    </TextField>

                    <Select
                      className="w-full"
                      name="tipo"
                      placeholder="Selecciona un tipo"
                      defaultSelectedKey={proveedorAEditar?.tipo || undefined}
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
                    <TextField className="w-full" name="contactoNombre">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Nombre del Contacto
                      </Label>
                      <Input
                        placeholder="Ej. Juan Pérez"
                        variant="secondary"
                        className="h-11 px-3 text-sm"
                        defaultValue={proveedorAEditar?.contactoNombre || ''}
                      />
                    </TextField>

                    <TextField className="w-full" name="telefono">
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
                          className="w-full text-sm pl-2"
                          type="tel"
                          placeholder="555-123-4567"
                          defaultValue={proveedorAEditar?.telefono || ''}
                        />
                      </InputGroup>
                    </TextField>
                  </div>

                  {/* Fila 4: Correo y Dirección */}
                  <div className="grid grid-cols-1 gap-4">
                    <TextField className="w-full" name="correo">
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
                          className="w-full text-sm pl-2"
                          type="email"
                          placeholder="contacto@empresa.com"
                          defaultValue={proveedorAEditar?.correo || ''}
                        />
                      </InputGroup>
                    </TextField>

                    <TextField className="w-full" name="direccion">
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
                          className="w-full text-sm pl-2"
                          type="text"
                          placeholder="Calle, Número, Colonia, Ciudad"
                          defaultValue={proveedorAEditar?.direccion || ''}
                        />
                      </InputGroup>
                    </TextField>
                  </div>
                </form>
              </Surface>
            </Modal.Body>
            {/* Footer */}
            <Modal.Footer>
              <Button
                slot="close"
                variant="ghost"
                className="text-muted"
                onPress={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" form="proveedor-form" variant="primary">
                {isEditMode ? 'Guardar Cambios' : 'Registrar Proveedor'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

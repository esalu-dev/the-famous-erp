'use client';

import { Person, Envelope, Lock, Shield } from '@gravity-ui/icons';
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
  Select,
  ListBox,
  InputGroup,
  Checkbox,
} from '@heroui/react';
import { saveEmpleadoAction, type Empleado } from '@/actions/empleados.actions';
import { useState } from 'react';

interface EmpleadoFormProps {
  empleadoAEditar?: Empleado | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const EmpleadoForm = ({ empleadoAEditar, isOpen, onOpenChange }: EmpleadoFormProps) => {
  const isEditMode = !!empleadoAEditar;

  const [isActive, setIsActive] = useState(isEditMode ? !!empleadoAEditar?.activo : true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.set('activo', isActive.toString());

    setIsPending(true);
    setError(null);

    try {
      const response = await saveEmpleadoAction(formData);
      if (response.success) {
        onOpenChange(false); // se cierra el modal al completar la acción
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsPending(false);
    }
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
              <Modal.Heading>{isEditMode ? 'Editar Empleado' : 'Nuevo Empleado'}</Modal.Heading>
            </Modal.Header>
            {/* Body */}
            <Modal.Body className="p-6">
              <Surface variant="default">
                <form id="empleado-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {error && (
                    <div className="bg-danger-soft text-danger text-xs p-3 rounded-md border border-danger/10">
                      {error}
                    </div>
                  )}
                  {isEditMode && empleadoAEditar?.id && (
                    <input type="hidden" name="id" value={empleadoAEditar.id} />
                  )}
                  {/* Fila 1: Nombre */}
                  <div className="grid grid-cols-1 gap-4">
                    <TextField
                      className="w-full"
                      name="nombre"
                      isRequired
                      defaultValue={empleadoAEditar?.nombre}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest">
                        Nombre de usuario
                      </Label>
                      <Input
                        name="nombre"
                        placeholder="Ej. Axell Romo"
                        variant="secondary"
                        className="h-11 px-3 text-sm"
                      />
                    </TextField>
                  </div>

                  {/* Fila 2: Correo y Contraseña */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      className="w-full"
                      name="correo"
                      isRequired
                      defaultValue={empleadoAEditar?.correo || ''}
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
                          placeholder="axell@thefamous.com"
                        />
                      </InputGroup>
                    </TextField>

                    <TextField className="w-full" name="password" isRequired={!isEditMode}>
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Contraseña
                      </Label>
                      <InputGroup
                        className="h-11 flex items-center overflow-hidden w-full"
                        variant="secondary"
                      >
                        <InputGroup.Prefix className="text-muted font-semibold pl-3">
                          <Lock width={16} />
                        </InputGroup.Prefix>
                        <InputGroup.Input
                          name="password"
                          className="w-full text-sm pl-2"
                          type="password"
                          placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : '******'}
                        />
                      </InputGroup>
                    </TextField>
                  </div>

                  <hr className="border-border my-2" />

                  {/* Sección: Rol y Estado */}
                  <h3 className="text-sm font-semibold text-accent flex items-center gap-2">
                    <Shield width={16} /> Permisos y Estado
                  </h3>

                  {/* Fila 3: Rol y Activo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <Select
                      className="w-full"
                      name="rol"
                      isRequired
                      placeholder="Selecciona un rol"
                      defaultSelectedKey={empleadoAEditar?.rol || undefined}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Rol del Empleado
                      </Label>
                      <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md flex justify-between items-center">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="admin" textValue="Administrador">
                            Administrador
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="operador" textValue="Operador">
                            Operador
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>

                    <div className="flex flex-col gap-2 pt-5">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="activo"
                          name="activo"
                          value="true"
                          isSelected={isActive}
                          onChange={setIsActive}
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <Label
                              htmlFor="activo"
                              className="text-sm font-medium text-foreground cursor-pointer"
                            >
                              Acceso al sistema
                            </Label>
                          </Checkbox.Content>
                        </Checkbox>
                      </div>
                      <p className="text-xs text-muted-foreground pl-7">
                        Estado:{' '}
                        <span
                          className={
                            isActive ? 'font-medium text-primary' : 'font-medium text-default-400'
                          }
                        >
                          {isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                    </div>
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
                isDisabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="empleado-form"
                variant="primary"
                isPending={isPending}
                isDisabled={isPending}
              >
                {isEditMode ? 'Guardar Cambios' : 'Registrar Empleado'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

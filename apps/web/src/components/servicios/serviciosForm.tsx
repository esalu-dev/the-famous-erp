'use client';

import { useState } from 'react';
import { Briefcase, CreditCard, Calendar, Pencil, Shield } from '@gravity-ui/icons';
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
  Checkbox,
  TextArea,
} from '@heroui/react';
import { saveServicioAction, deleteServicioAction, type Servicio } from '@/actions/servicios.actions';

interface ServiciosFormProps {
  servicioAEditar?: Servicio | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ServiciosForm = ({ servicioAEditar, isOpen, onOpenChange }: ServiciosFormProps) => {
  const isEditMode = !!servicioAEditar;

  const [isActive, setIsActive] = useState(isEditMode ? !!servicioAEditar?.activo : true);
  const [isAutorenovable, setIsAutorenovable] = useState(isEditMode ? !!servicioAEditar?.autorenovable : true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.set('activo', isActive.toString());
    formData.set('autorenovable', isAutorenovable.toString());

    setIsSubmitting(true);
    try {
      const response = await saveServicioAction(formData);
      if (response.success) {
        toast.success(response.message);
        onOpenChange(false);
      } else {
        toast.danger(response.message);
      }
    } catch (err: any) {
      toast.danger(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!servicioAEditar?.id) return;

    setIsSubmitting(true);
    try {
      const response = await deleteServicioAction(servicioAEditar.id);
      if (response.success) {
        toast.success(response.message);
        onOpenChange(false);
      } else {
        toast.danger(response.message);
      }
    } catch (err: any) {
      toast.danger(err.message || 'Ocurrió un error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-3xl">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <Briefcase className="size-5" />
              </Modal.Icon>
              <Modal.Heading>{isEditMode ? 'Editar Servicio' : 'Nuevo Servicio'}</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Surface variant="default">
                <form id="servicio-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {isEditMode && (
                    <input type="hidden" name="id" value={servicioAEditar?.id} />
                  )}                  <TextField
                    className="w-full"
                    name="nombre"
                    isRequired
                    defaultValue={servicioAEditar?.nombre}
                    isDisabled={isSubmitting}
                  >
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Nombre del Servicio
                    </Label>
                    <Input
                      name="nombre"
                      placeholder="Ej. Internet, Licencia de Software, Agua..."
                      variant="secondary"
                      className="h-11 px-3 text-sm"
                    />
                  </TextField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      className="w-full"
                      name="costo"
                      isRequired
                      defaultValue={servicioAEditar?.costo?.toString()}
                      isDisabled={isSubmitting}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Costo
                      </Label>
                      <InputGroup
                        className="h-11 flex items-center overflow-hidden w-full"
                        variant="secondary"
                      >
                        <InputGroup.Prefix className="text-muted font-semibold pl-3">
                          <CreditCard width={16} />
                        </InputGroup.Prefix>
                        <InputGroup.Input
                          name="costo"
                          className="w-full text-sm pl-2"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                        />
                      </InputGroup>
                    </TextField>

                    <Select
                      className="w-full"
                      name="periodicidad"
                      isRequired
                      variant="secondary"
                      placeholder="Selecciona la periodicidad"
                      defaultSelectedKey={servicioAEditar?.periodicidad || undefined}
                      isDisabled={isSubmitting}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Periodicidad
                      </Label>
                      <Select.Trigger className="h-11 px-3 text-sm w-full text-left text-muted-foreground bg-default-100 hover:bg-default-200 transition-colors rounded-md flex justify-between items-center">
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="Diario" textValue="Diario">
                            Diario <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="Cada3Dias" textValue="Cada 3 Días">
                            Cada 3 Días <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="Semanal" textValue="Semanal">
                            Semanal <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="Mensual" textValue="Mensual">
                            Mensual <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="Bimestral" textValue="Bimestral">
                            Bimestral <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="Anual" textValue="Anual">
                            Anual <ListBox.ItemIndicator />
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      className="w-full"
                      name="notas"
                      defaultValue={servicioAEditar?.notas || ''}
                      isDisabled={isSubmitting}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Notas Adicionales
                      </Label>
                      <TextArea
                        name="notas"
                        aria-label="Notas Adicionales"
                        placeholder="Referencia, número de cuenta, etc."
                        rows={3}
                        variant="secondary"
                        className="w-full text-sm"
                      />
                    </TextField>

                    <TextField
                      className="w-full"
                      name="proximoPago"
                      isRequired
                      defaultValue={
                        servicioAEditar?.proximoPago
                          ? new Date(servicioAEditar.proximoPago).toISOString().split('T')[0]
                          : ''
                      }
                      isDisabled={isSubmitting}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Fecha de Próximo Pago
                      </Label>
                      <InputGroup
                        className="h-11 flex items-center overflow-hidden w-full"
                        variant="secondary"
                      >
                        <input
                          name="proximoPago"
                          className="w-full text-sm pl-2 pr-3 bg-transparent border-none outline-none h-full invalid:[&::-webkit-datetime-edit]:text-default-400 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-all"
                          type="date"
                          required
                          defaultValue={
                            servicioAEditar?.proximoPago
                              ? new Date(servicioAEditar.proximoPago).toISOString().split('T')[0]
                              : ''
                          }
                          disabled={isSubmitting}
                        />
                      </InputGroup>
                    </TextField>
                  </div>

                  <hr className="border-border my-2" />

                  <h3 className="text-sm font-semibold text-accent flex items-center gap-2">
                    <Shield width={16} /> Configuración del Servicio
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="activo"
                          name="activo"
                          value="true"
                          isSelected={isActive}
                          onChange={setIsActive}
                          isDisabled={isSubmitting}
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <Label
                              htmlFor="activo"
                              className="text-sm font-medium text-foreground cursor-pointer"
                            >
                              Servicio Activo
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

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="autorenovable"
                          name="autorenovable"
                          value="true"
                          isSelected={isAutorenovable}
                          onChange={setIsAutorenovable}
                          isDisabled={isSubmitting}
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <Label
                              htmlFor="autorenovable"
                              className="text-sm font-medium text-foreground cursor-pointer"
                            >
                              Autorenovable (Débito Automático)
                            </Label>
                          </Checkbox.Content>
                        </Checkbox>
                      </div>
                      <p className="text-xs text-muted-foreground pl-7">
                        Método:{' '}
                        <span
                          className={
                            isAutorenovable ? 'font-medium text-primary' : 'font-medium text-warning'
                          }
                        >
                          {isAutorenovable ? 'Automático (Sin acción)' : 'Manual (Requiere registro)'}
                        </span>
                      </p>
                    </div>
                  </div>
                </form>
              </Surface>
            </Modal.Body>

            <Modal.Footer>
              {isEditMode && (
                <Button
                  variant="ghost"
                  className="mr-auto text-danger hover:bg-danger/10 hover:text-danger border-danger/20"
                  onPress={handleDelete}
                  isDisabled={isSubmitting}
                >
                  Eliminar Servicio
                </Button>
              )}
              <Button
                slot="close"
                variant="ghost"
                className="text-muted"
                onPress={() => onOpenChange(false)}
                isDisabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" form="servicio-form" variant="primary" isDisabled={isSubmitting}>
                {isEditMode ? 'Guardar Cambios' : 'Registrar Servicio'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

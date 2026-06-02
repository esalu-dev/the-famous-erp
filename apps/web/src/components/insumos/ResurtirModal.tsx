'use client';

import { Plus } from '@gravity-ui/icons';
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
import { resurtirInsumoAction, type Insumo } from '@/actions/insumos.actions';
import { getProveedoresAction, type Proveedor } from '@/actions/proveedores.actions';
import { useState, useEffect } from 'react';

interface ResurtirModalProps {
  insumo: Insumo;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ResurtirModal = ({ insumo, isOpen, onOpenChange }: ResurtirModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  useEffect(() => {
    getProveedoresAction().then((res) => {
      if (res.success) {
        setProveedores(res.data);
      }
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !insumo.id) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);

    resurtirInsumoAction(insumo.id, formData)
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message);
        }
        toast.success(response.message);
        onOpenChange(false);
      })
      .catch((error) => {
        console.error('Error replenishing supply:', error);
        toast.danger(error instanceof Error ? error.message : 'Error al procesar la solicitud');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />

            {/* Header */}
            <Modal.Header>
              <Modal.Icon className="bg-primary-soft text-primary">
                <Plus className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Resurtir Insumo</Modal.Heading>
            </Modal.Header>

            {/* Body */}
            <Modal.Body className="p-6">
              <Surface variant="default">
                <form id="resurtir-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="text-sm text-muted mb-2">
                    Estás reabasteciendo el insumo <strong className="text-foreground">{insumo.nombre}</strong>.
                  </div>

                  {/* Cantidad y Unidad */}
                  <div className="grid grid-cols-3 gap-3 items-end">
                    <div className="col-span-2">
                      <TextField
                        className="w-full"
                        name="cantidad"
                        isRequired
                        isDisabled={isSubmitting}
                      >
                        <Label className="text-xs font-bold uppercase tracking-widest">
                          Cantidad a ingresar
                        </Label>
                        <Input
                          name="cantidad"
                          placeholder="0"
                          type="number"
                          min={0.01}
                          step="0.01"
                          variant="secondary"
                          className="h-11 px-3 text-sm"
                          required
                        />
                      </TextField>
                    </div>
                    <div>
                      <Select
                        className="w-full"
                        name="unidadMedida"
                        placeholder="Unidad"
                        defaultSelectedKey={insumo.unidadMedida}
                        isDisabled={isSubmitting}
                        isRequired
                      >
                        <Select.Trigger className="h-11 px-2.5 text-xs bg-surface-secondary rounded-md flex justify-between items-center w-full text-left">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {insumo.unidadMedida === 'Gramos' ? (
                              <>
                                <ListBox.Item id="Kilogramos" textValue="kg">
                                  Kilogramos (kg)
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item id="Gramos" textValue="g">
                                  Gramos (g)
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              </>
                            ) : insumo.unidadMedida === 'Mililitros' ? (
                              <>
                                <ListBox.Item id="Litros" textValue="L">
                                  Litros (L)
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                                <ListBox.Item id="Mililitros" textValue="ml">
                                  Mililitros (ml)
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              </>
                            ) : (
                              <ListBox.Item id={insumo.unidadMedida || ''} textValue={insumo.unidadMedida}>
                                {insumo.unidadMedida}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            )}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  </div>

                  {/* Precio Unitario */}
                  <TextField
                    className="w-full"
                    name="precioUnitario"
                    isDisabled={isSubmitting}
                    defaultValue={insumo.precioActual?.toString()}
                  >
                    <Label className="text-xs font-bold uppercase tracking-widest">
                      Costo Unitario de Compra (Opcional)
                    </Label>
                    <InputGroup
                      className="h-11 flex items-center overflow-hidden w-full"
                      variant="secondary"
                    >
                      <InputGroup.Prefix className="text-muted font-semibold pl-3">
                        $
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        name="precioUnitario"
                        className="w-full text-sm pl-2"
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder={insumo.precioActual?.toString() || '0.00'}
                      />
                      <InputGroup.Suffix className="text-muted text-xs pr-3">
                        MXN
                      </InputGroup.Suffix>
                    </InputGroup>
                  </TextField>

                  {/* Proveedor */}
                  <Select
                    className="w-full"
                    name="proveedorId"
                    placeholder="Selecciona un proveedor"
                    defaultSelectedKey={insumo.proveedorId}
                    isDisabled={isSubmitting}
                    isRequired
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
                </form>
              </Surface>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="flex justify-end gap-2 w-full">
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
                form="resurtir-form"
                variant="primary"
                isPending={isSubmitting}
                isDisabled={isSubmitting}
              >
                Confirmar Ingreso
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

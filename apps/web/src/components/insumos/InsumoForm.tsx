"use client";

import { Archive, Camera } from "@gravity-ui/icons";
import { Button, Input, Label, Modal, Surface, TextField, InputGroup, toast, Select, ListBox } from "@heroui/react";
import { saveInsumoAction, type Insumo } from "@/actions/insumos.actions";

interface InsumoFormProps {
  insumoAEditar?: Insumo | null; // Si se pasa, el form actúa en modo edición
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const InsumoForm = ({ insumoAEditar, isOpen, onOpenChange }: InsumoFormProps) => {
  const isEditMode = !!insumoAEditar;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    toast.promise(saveInsumoAction(formData), {
      loading: isEditMode ? "Actualizando insumo..." : "Guardando insumo...",
      success: (response) => response.message,
      error: (err) => err.message || "Ocurrió un error inesperado",
    });
  };

  return (
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
              <Modal.Heading>{isEditMode ? "Editar Insumo" : "Dar de alta insumo"}</Modal.Heading>
            </Modal.Header>

            {/* Body */}
            <Modal.Body className="p-6">
              <Surface variant="default">
                <form id="insumo-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Nombre */}
                  <TextField className="w-full" name="nombre" isRequired>
                    <Label className="text-xs font-bold uppercase tracking-widest">Nombre</Label>
                    <Input 
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
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest">Tipo</Label>
                      <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md" />
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="comida" textValue="Comida">Comida</ListBox.Item>
                          <ListBox.Item id="bebida" textValue="Bebida">Bebida</ListBox.Item>
                          <ListBox.Item id="limpieza" textValue="Limpieza">Limpieza</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>

                    <Select 
                      className="w-full" 
                      name="unidadMedida" 
                      placeholder="Selecciona una unidad"
                      defaultSelectedKey={insumoAEditar?.unidadMedida}
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest">Unidad</Label>
                      <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md" />
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="gramos" textValue="Gramos (g)">Gramos (g)</ListBox.Item>
                          <ListBox.Item id="mililitros" textValue="Mililitros (ml)">Mililitros (ml)</ListBox.Item>
                          <ListBox.Item id="piezas" textValue="Piezas (pz)">Piezas (pz)</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Fila: Cantidad Actual y Mínima */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField className="w-full" name="cantidadActual" isRequired>
                      <Label className="text-xs font-bold uppercase tracking-widest">Cantidad Actual</Label>
                      <Input 
                        placeholder="0" type="number" min={0} variant="secondary" className="h-11 px-3 text-sm" 
                        defaultValue={insumoAEditar?.cantidadActual?.toString()}
                      />
                    </TextField>

                    <TextField className="w-full" name="cantidadMinima" isRequired>
                      <Label className="text-xs font-bold uppercase tracking-widest">Cantidad Mínima (Alertas)</Label>
                      <Input 
                        placeholder="0" type="number" min={0} variant="secondary" className="h-11 px-3 text-sm" 
                        defaultValue={insumoAEditar?.cantidadMinima?.toString()}
                      />
                    </TextField>
                  </div>

                  {/* Fila: Precio y Proveedor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField className="w-full" name="precioActual" isRequired>
                      <Label className="text-xs font-bold uppercase tracking-widest">Precio Actual</Label>
                      <InputGroup className="h-11 flex items-center overflow-hidden w-full" variant="secondary">
                        <InputGroup.Prefix className="text-muted font-semibold pl-3">$</InputGroup.Prefix>
                        <InputGroup.Input 
                          className="w-full text-sm pl-2" type="number" step="0.01" min={0} placeholder="0.00" 
                          defaultValue={insumoAEditar?.precioActual?.toString()}
                          required 
                        />
                        <InputGroup.Suffix className="text-muted text-xs pr-3">MXN</InputGroup.Suffix>
                      </InputGroup>
                    </TextField>

                    <Select 
                      className="w-full" 
                      name="proveedor" 
                      placeholder="Selecciona un proveedor"
                    >
                      <Label className="text-xs font-bold uppercase tracking-widest">Proveedor</Label>
                      <Select.Trigger className="h-11 px-3 text-sm w-full text-left bg-surface-secondary rounded-md" />
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="lacteos_express" textValue="Lácteos Express">Lácteos Express</ListBox.Item>
                          <ListBox.Item id="distribuidora_norte" textValue="Distribuidora Norte">Distribuidora Norte</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* Foto (Upload) */}
                  <TextField className="w-full" name="foto">
                    <Label className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <Camera className="text-muted size-4" /> Foto del Insumo
                    </Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      className="h-11 px-3 text-sm flex items-center pt-2 bg-surface-secondary rounded-md cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
                    />
                  </TextField>
                </form>
              </Surface>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer>
              <Button slot="close" variant="ghost" className="text-muted" onPress={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="insumo-form" variant="primary">
                {isEditMode ? "Guardar Cambios" : "Guardar"}
              </Button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
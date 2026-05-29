import { Button, Card, ComboBox, Input, Label, ListBox } from '@heroui/react';

export function ComparadorCard() {
  return (
    <Card className="w-full h-40 items-stretch md:flex-row">
      <div className="flex flex-1 flex-col gap-3">
        <Card.Header className="gap-1">
          <Card.Title className="pr-8 font-semibold text-base">Comparador de Precios</Card.Title>
        </Card.Header>
        <Card.Footer className="mt-auto flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-end justify-between w-full">
            <div className="flex flex-col">
              <ComboBox>
                <Label className="mb-1">Producto</Label>
                <ComboBox.InputGroup>
                  <Input placeholder="Buscar productos..." />
                  <ComboBox.Trigger />
                </ComboBox.InputGroup>
                <ComboBox.Popover>
                  <ListBox>
                    <ListBox.Item>Producto 1</ListBox.Item>
                  </ListBox>
                </ComboBox.Popover>
              </ComboBox>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex flex-col">
                <Label className="mb-2">Cantidad</Label>
                <Input className="w-16" />
              </div>
              <ComboBox>
                <ComboBox.InputGroup>
                  <Input placeholder="Kilogramos" />
                  <ComboBox.Trigger />
                </ComboBox.InputGroup>
                <ComboBox.Popover>
                  <ListBox>
                    <ListBox.Item>Litros</ListBox.Item>
                  </ListBox>
                </ComboBox.Popover>
              </ComboBox>
              <Button className="w-full sm:w-auto">Comparar</Button>
            </div>
          </div>
        </Card.Footer>
      </div>
    </Card>
  );
}

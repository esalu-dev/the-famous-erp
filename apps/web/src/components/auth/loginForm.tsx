'use client';
import { PizzaIcon } from '@/components/icons/PizzaIcon';
import { BeerIcon } from '@/components/icons/BeerIcon';
import { ChevronDown, CircleFill, Eye, EyeSlash, Globe } from '@gravity-ui/icons';
import { Button, Card, Form, Input, Label, Link, TextField, InputGroup, Chip } from '@heroui/react';
import { useState } from 'react';

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-md">
      <Card>
        {/* Header: logo y texto */}
        <Card.Header className="flex flex-col gap-4 pt-8 pb-4 px-8 items-center">
          <div className="flex justify-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center shadow-sm bg-accent rounded-sm">
              <PizzaIcon className="w-7 h-7" />
            </div>
            <div className="w-12 h-12 flex items-center justify-center shadow-sm bg-accent rounded-sm">
              <BeerIcon className="w-7 h-7" />
            </div>
          </div>

          <div className="text-center mt-2">
            <h1 className="text-2xl font-bold">
              The Famous <span className="text-warning">Pizza & Beer</span>
            </h1>
            <p className="text-sm mt-1.5 text-muted">Gestión Inteligente de Operaciones</p>
          </div>
        </Card.Header>

        {/* Content y footer */}
        <Form onSubmit={handleSubmit}>
          {/* Inputs */}
          <Card.Content className="flex flex-col gap-5 px-8 w-full">
            {/* Correo */}
            <TextField name="email" type="email" className="flex flex-col gap-1.5 w-full">
              <Label className="text-xs font-bold uppercase tracking-widest">
                Correo Electrónico
              </Label>
              <Input
                placeholder="usuario@restaurante.com"
                variant="secondary"
                required
                className="h-11 px-3 text-sm w-full"
              />
            </TextField>

            {/* Contraseña */}
            <TextField name="password" type="password" className="flex flex-col gap-1.5 w-full">
              <div className="flex justify-between items-center w-full">
                <Label className="text-xs font-bold uppercase tracking-widest">Contraseña</Label>
                <Link
                  href="#"
                  className="text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer text-warning"
                >
                  Olvidé mi contraseña
                </Link>
              </div>

              <InputGroup
                className="h-11 flex items-center overflow-hidden w-full"
                variant="secondary"
              >
                <InputGroup.Input
                  placeholder="••••••••"
                  required
                  type={isVisible ? 'text' : 'password'}
                />
                <InputGroup.Suffix>
                  <button
                    className="focus:outline-none flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {isVisible ? (
                      <Eye width={20} height={20} />
                    ) : (
                      <EyeSlash width={20} height={20} />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>
          </Card.Content>

          {/* Boton */}
          <Card.Footer className="px-8 pb-8 pt-8 w-full">
            <Button type="submit" className="w-full h-12">
              Iniciar sesión
            </Button>
          </Card.Footer>
        </Form>
      </Card>

      {/* estatus */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
          <Globe width={14} height={14} style={{ color: 'var(--muted)' }} />
          Todos los derechos reservados
        </p>
        <div className="flex items-center gap-2">
          <Chip className="bg-success-soft" size="lg">
            <CircleFill className="size-2 text-success" />
            <Chip.Label>STATUS: STABLE</Chip.Label>
          </Chip>
          <Chip size="lg">
            <ChevronDown className="size-2" />
            <Chip.Label>ES-MX</Chip.Label>
          </Chip>
        </div>
      </div>
    </div>
  );
};

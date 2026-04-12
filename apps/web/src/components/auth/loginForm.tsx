"use client";

import Image from "next/image";
import { PizzaIcon } from "@/components/icons/PizzaIcon";
import { BeerIcon } from "@/components/icons/BeerIcon";
import { Eye, EyeSlash, Globe } from "@gravity-ui/icons";
import { Button, Card, Form, Input, Label, Link, TextField, InputGroup} from "@heroui/react";
import {useState} from "react";

export const LoginForm = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="w-full max-w-md">
            <Card
                className="border shadow-sm overflow-hidden"
                style={{
                    backgroundColor: "var(--surface-tertiary)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                }}
            >
                {/* Header: logo y texto */}
                <Card.Header className="flex flex-col gap-4 pt-8 pb-4 px-8 items-center">
                    <div className="flex justify-center gap-3">
                        <div
                            className="w-12 h-12 flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: "var(--accent)", borderRadius: "var(--radius)" }}
                        >
                            <PizzaIcon className="w-7 h-7" />
                        </div>
                        <div
                            className="w-12 h-12 flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: "var(--accent)", borderRadius: "var(--radius)" }}
                        >
                            <BeerIcon className="w-7 h-7" />
                        </div>
                    </div>

                    <div className="text-center mt-2">
                        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
                            The Famous{" "}
                            <span style={{ color: "var(--warning)" }}>Pizza & Beer</span>
                        </h1>
                        <p className="text-sm mt-1.5" style={{ color: "var(--muted)" }}>
                            Gestión Inteligente de Operaciones
                        </p>
                    </div>
                </Card.Header>

                {/* Content y footer */}
                <Form onSubmit={handleSubmit}>
                    
                    {/* Inputs */}
                    <Card.Content className="flex flex-col gap-5 px-8 w-full">
                        
                        {/* Correo */}
                        <TextField name="email" type="email" className="flex flex-col gap-1.5 w-full">
                            <Label 
                                className="text-xs font-bold uppercase tracking-widest"
                                style={{ color: "var(--foreground)" }}
                            >
                                Correo Electrónico
                            </Label>
                            <Input 
                                placeholder="usuario@restaurante.com" 
                                variant="secondary"
                                required
                                className="h-11 px-3 shadow-none border border-[var(--border)] bg-[var(--field-background)] !rounded-[var(--field-radius)] focus:border-[var(--focus)] focus:outline-none text-sm text-[var(--field-foreground)] placeholder:text-[var(--field-placeholder)] w-full"
                            />
                        </TextField>

                        {/* Contraseña */}
                        <TextField name="password" type="password" className="flex flex-col gap-1.5 w-full">
                            <div className="flex justify-between items-center w-full">
                                <Label 
                                    className="text-xs font-bold uppercase tracking-widest"
                                    style={{ color: "var(--foreground)" }}
                                >
                                    Contraseña
                                </Label>
                                <Link 
                                    href="#" 
                                    className="text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                                    style={{ color: "var(--warning)" }}
                                >
                                    Olvidé mi contraseña
                                </Link>
                            </div>
                            
                            <InputGroup 
                                className="h-11 shadow-none border border-[var(--border)] bg-[var(--field-background)] !rounded-[var(--field-radius)] focus-within:border-[var(--focus)] flex items-center overflow-hidden w-full transition-colors"
                            >
                                <InputGroup.Input 
                                    placeholder="••••••••" 
                                    required
                                    type={isVisible ? "text" : "password"}
                                    className="h-full pl-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-[var(--field-foreground)] placeholder:text-[var(--field-placeholder)] w-full"
                                />
                                <InputGroup.Suffix className="pr-3 flex items-center h-full bg-transparent">
                                    <button 
                                        className="focus:outline-none flex items-center justify-center hover:opacity-70 transition-opacity" 
                                        type="button" 
                                        onClick={toggleVisibility}
                                        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {isVisible ? (
                                            <Eye width={20} height={20} style={{ color: "var(--muted)" }} />
                                        ) : (
                                            <EyeSlash width={20} height={20} style={{ color: "var(--muted)" }} />
                                        )}
                                    </button>
                                </InputGroup.Suffix>
                            </InputGroup>
                        </TextField>

                    </Card.Content>

                    {/* Boton */}
                    <Card.Footer className="px-8 pb-8 pt-4 w-full">
                        <Button 
                            type="submit" 
                            className="w-full font-bold text-sm tracking-wide h-12 hover:opacity-90 transition-opacity"
                            style={{
                                backgroundColor: "var(--accent)",
                                color: "var(--accent-foreground)",
                                borderRadius: "var(--radius)",
                            }}
                        >
                            Iniciar sesión
                        </Button>
                    </Card.Footer>
                </Form>
            </Card>

            {/* estatus */}
            <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
                    <Globe width={14} height={14} style={{ color: "var(--muted)" }} />
                    Operational Excellence • Cloud Enterprise Edition
                </p>
                <div className="flex items-center gap-2">
                    <span
                        className="text-xs px-2.5 py-1 flex items-center gap-1.5 border"
                        style={{
                            color: "var(--muted)",
                            backgroundColor: "color-mix(in oklch, var(--success) 15%, transparent)",
                            borderColor: "color-mix(in oklch, var(--success) 30%, transparent)",
                            borderRadius: "var(--radius)",
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "var(--success)" }} />
                        SYSTEM: STABLE
                    </span>
                    <span
                        className="text-xs px-2.5 py-1 flex items-center gap-1.5 border"
                        style={{
                            color: "var(--muted)",
                            backgroundColor: "var(--surface-secondary)",
                            borderColor: "var(--border)",
                            borderRadius: "var(--radius)",
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path d="M5 8l7 8 7-8" stroke="currentColor" strokeWidth="2.5" />
                        </svg>
                        ES-MX
                    </span>
                </div>
            </div>
        </div>
    );
};
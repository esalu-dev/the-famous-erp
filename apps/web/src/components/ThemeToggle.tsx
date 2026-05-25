"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Moon, Sun } from "@gravity-ui/icons";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
        isIconOnly
        variant="ghost" 
        aria-label="Alternar modo oscuro"
        className="rounded-full text-[var(--foreground)] hover:bg-[var(--surface-secondary)] border-none"
        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
        {theme === "dark" ? (
            <Moon className="w-5 h-5" />
        ) : (
            <Sun className="w-5 h-5" />
        )}
    </Button>
    );
}
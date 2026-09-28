import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders correctly with children', () => {
    render(<Button>Haz clic aquí</Button>);
    const buttonElement = screen.getByRole('button', { name: /haz clic aquí/i });
    expect(buttonElement).toBeDefined();
    // En Vitest con JS DOM usualmente usamos getByRole para confirmar que renderiza un tag botón
  });

  it('applies the destructive variant classes correctly', () => {
    render(<Button variant="destructive">Eliminar</Button>);
    const buttonElement = screen.getByRole('button', { name: /eliminar/i });
    // Verificamos que tenga la clase específica de la variante destructiva configurada en Tailwind
    expect(buttonElement.className).toContain('bg-destructive');
  });

  it('respects the disabled HTML attribute', () => {
    render(<Button disabled>Inactivo</Button>);
    const buttonElement = screen.getByRole('button', { name: /inactivo/i }) as HTMLButtonElement;
    expect(buttonElement.disabled).toBe(true);
  });
});

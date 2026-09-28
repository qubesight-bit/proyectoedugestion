import { describe, it, expect } from 'vitest';
import * as SonnerModule from '@/components/ui/sonner';

describe('Sonner component', () => {
  it('se exporta correctamente', () => {
    expect(SonnerModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SonnerModule.Default />)
  });
});

import { describe, it, expect } from 'vitest';
import * as PopoverModule from '@/components/ui/popover';

describe('Popover component', () => {
  it('se exporta correctamente', () => {
    expect(PopoverModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<PopoverModule.Default />)
  });
});

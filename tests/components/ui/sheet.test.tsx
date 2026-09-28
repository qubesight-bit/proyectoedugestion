import { describe, it, expect } from 'vitest';
import * as SheetModule from '@/components/ui/sheet';

describe('Sheet component', () => {
  it('se exporta correctamente', () => {
    expect(SheetModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SheetModule.Default />)
  });
});

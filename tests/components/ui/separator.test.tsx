import { describe, it, expect } from 'vitest';
import * as SeparatorModule from '@/components/ui/separator';

describe('Separator component', () => {
  it('se exporta correctamente', () => {
    expect(SeparatorModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SeparatorModule.Default />)
  });
});

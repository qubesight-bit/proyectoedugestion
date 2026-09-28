import { describe, it, expect } from 'vitest';
import * as SwitchModule from '@/components/ui/switch';

describe('Switch component', () => {
  it('se exporta correctamente', () => {
    expect(SwitchModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SwitchModule.Default />)
  });
});

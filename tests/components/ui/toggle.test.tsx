import { describe, it, expect } from 'vitest';
import * as ToggleModule from '@/components/ui/toggle';

describe('Toggle component', () => {
  it('se exporta correctamente', () => {
    expect(ToggleModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<ToggleModule.Default />)
  });
});

import { describe, it, expect } from 'vitest';
import * as Toggle-groupModule from '@/components/ui/toggle-group';

describe('Toggle-group component', () => {
  it('se exporta correctamente', () => {
    expect(Toggle-groupModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Toggle-groupModule.Default />)
  });
});

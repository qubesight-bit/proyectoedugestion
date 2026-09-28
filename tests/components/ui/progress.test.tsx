import { describe, it, expect } from 'vitest';
import * as ProgressModule from '@/components/ui/progress';

describe('Progress component', () => {
  it('se exporta correctamente', () => {
    expect(ProgressModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<ProgressModule.Default />)
  });
});

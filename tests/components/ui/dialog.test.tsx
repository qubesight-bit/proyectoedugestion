import { describe, it, expect } from 'vitest';
import * as DialogModule from '@/components/ui/dialog';

describe('Dialog component', () => {
  it('se exporta correctamente', () => {
    expect(DialogModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<DialogModule.Default />)
  });
});

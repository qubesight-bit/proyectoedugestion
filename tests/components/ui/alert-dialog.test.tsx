import { describe, it, expect } from 'vitest';
import * as Alert-dialogModule from '@/components/ui/alert-dialog';

describe('Alert-dialog component', () => {
  it('se exporta correctamente', () => {
    expect(Alert-dialogModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Alert-dialogModule.Default />)
  });
});

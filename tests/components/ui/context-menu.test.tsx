import { describe, it, expect } from 'vitest';
import * as Context-menuModule from '@/components/ui/context-menu';

describe('Context-menu component', () => {
  it('se exporta correctamente', () => {
    expect(Context-menuModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Context-menuModule.Default />)
  });
});

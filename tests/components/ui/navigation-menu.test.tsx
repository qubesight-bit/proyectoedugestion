import { describe, it, expect } from 'vitest';
import * as Navigation-menuModule from '@/components/ui/navigation-menu';

describe('Navigation-menu component', () => {
  it('se exporta correctamente', () => {
    expect(Navigation-menuModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Navigation-menuModule.Default />)
  });
});

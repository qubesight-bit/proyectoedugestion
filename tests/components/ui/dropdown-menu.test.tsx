import { describe, it, expect } from 'vitest';
import * as Dropdown-menuModule from '@/components/ui/dropdown-menu';

describe('Dropdown-menu component', () => {
  it('se exporta correctamente', () => {
    expect(Dropdown-menuModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Dropdown-menuModule.Default />)
  });
});

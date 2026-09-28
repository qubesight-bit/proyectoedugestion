import { describe, it, expect } from 'vitest';
import * as MenubarModule from '@/components/ui/menubar';

describe('Menubar component', () => {
  it('se exporta correctamente', () => {
    expect(MenubarModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<MenubarModule.Default />)
  });
});

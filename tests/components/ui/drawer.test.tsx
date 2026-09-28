import { describe, it, expect } from 'vitest';
import * as DrawerModule from '@/components/ui/drawer';

describe('Drawer component', () => {
  it('se exporta correctamente', () => {
    expect(DrawerModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<DrawerModule.Default />)
  });
});

import { describe, it, expect } from 'vitest';
import * as SidebarModule from '@/components/ui/sidebar';

describe('Sidebar component', () => {
  it('se exporta correctamente', () => {
    expect(SidebarModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SidebarModule.Default />)
  });
});

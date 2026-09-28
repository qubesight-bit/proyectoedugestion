import { describe, it, expect } from 'vitest';
import * as TabsModule from '@/components/ui/tabs';

describe('Tabs component', () => {
  it('se exporta correctamente', () => {
    expect(TabsModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<TabsModule.Default />)
  });
});

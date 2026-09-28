import { describe, it, expect } from 'vitest';
import * as BadgeModule from '@/components/ui/badge';

describe('Badge component', () => {
  it('se exporta correctamente', () => {
    expect(BadgeModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<BadgeModule.Default />)
  });
});

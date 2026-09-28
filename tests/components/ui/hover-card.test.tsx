import { describe, it, expect } from 'vitest';
import * as Hover-cardModule from '@/components/ui/hover-card';

describe('Hover-card component', () => {
  it('se exporta correctamente', () => {
    expect(Hover-cardModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Hover-cardModule.Default />)
  });
});

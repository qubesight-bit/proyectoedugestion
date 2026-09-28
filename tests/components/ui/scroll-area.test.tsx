import { describe, it, expect } from 'vitest';
import * as Scroll-areaModule from '@/components/ui/scroll-area';

describe('Scroll-area component', () => {
  it('se exporta correctamente', () => {
    expect(Scroll-areaModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Scroll-areaModule.Default />)
  });
});

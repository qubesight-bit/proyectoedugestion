import { describe, it, expect } from 'vitest';
import * as CarouselModule from '@/components/ui/carousel';

describe('Carousel component', () => {
  it('se exporta correctamente', () => {
    expect(CarouselModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<CarouselModule.Default />)
  });
});

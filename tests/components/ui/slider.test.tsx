import { describe, it, expect } from 'vitest';
import * as SliderModule from '@/components/ui/slider';

describe('Slider component', () => {
  it('se exporta correctamente', () => {
    expect(SliderModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SliderModule.Default />)
  });
});

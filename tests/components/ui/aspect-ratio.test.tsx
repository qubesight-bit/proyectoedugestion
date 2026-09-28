import { describe, it, expect } from 'vitest';
import * as Aspect-ratioModule from '@/components/ui/aspect-ratio';

describe('Aspect-ratio component', () => {
  it('se exporta correctamente', () => {
    expect(Aspect-ratioModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Aspect-ratioModule.Default />)
  });
});

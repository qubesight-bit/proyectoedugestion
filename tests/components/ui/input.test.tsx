import { describe, it, expect } from 'vitest';
import * as InputModule from '@/components/ui/input';

describe('Input component', () => {
  it('se exporta correctamente', () => {
    expect(InputModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<InputModule.Default />)
  });
});

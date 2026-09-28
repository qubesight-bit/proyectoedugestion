import { describe, it, expect } from 'vitest';
import * as CardModule from '@/components/ui/card';

describe('Card component', () => {
  it('se exporta correctamente', () => {
    expect(CardModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<CardModule.Default />)
  });
});

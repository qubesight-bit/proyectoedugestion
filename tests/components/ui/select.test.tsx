import { describe, it, expect } from 'vitest';
import * as SelectModule from '@/components/ui/select';

describe('Select component', () => {
  it('se exporta correctamente', () => {
    expect(SelectModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SelectModule.Default />)
  });
});

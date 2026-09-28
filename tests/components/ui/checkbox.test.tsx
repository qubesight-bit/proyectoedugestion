import { describe, it, expect } from 'vitest';
import * as CheckboxModule from '@/components/ui/checkbox';

describe('Checkbox component', () => {
  it('se exporta correctamente', () => {
    expect(CheckboxModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<CheckboxModule.Default />)
  });
});

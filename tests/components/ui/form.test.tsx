import { describe, it, expect } from 'vitest';
import * as FormModule from '@/components/ui/form';

describe('Form component', () => {
  it('se exporta correctamente', () => {
    expect(FormModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<FormModule.Default />)
  });
});

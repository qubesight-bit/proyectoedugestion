import { describe, it, expect } from 'vitest';
import * as LabelModule from '@/components/ui/label';

describe('Label component', () => {
  it('se exporta correctamente', () => {
    expect(LabelModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<LabelModule.Default />)
  });
});

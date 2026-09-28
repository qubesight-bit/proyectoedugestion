import { describe, it, expect } from 'vitest';
import * as TooltipModule from '@/components/ui/tooltip';

describe('Tooltip component', () => {
  it('se exporta correctamente', () => {
    expect(TooltipModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<TooltipModule.Default />)
  });
});

import { describe, it, expect } from 'vitest';
import * as CollapsibleModule from '@/components/ui/collapsible';

describe('Collapsible component', () => {
  it('se exporta correctamente', () => {
    expect(CollapsibleModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<CollapsibleModule.Default />)
  });
});

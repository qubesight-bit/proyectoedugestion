import { describe, it, expect } from 'vitest';
import * as AccordionModule from '@/components/ui/accordion';

describe('Accordion component', () => {
  it('se exporta correctamente', () => {
    expect(AccordionModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<AccordionModule.Default />)
  });
});

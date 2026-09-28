import { describe, it, expect } from 'vitest';
import * as ChartModule from '@/components/ui/chart';

describe('Chart component', () => {
  it('se exporta correctamente', () => {
    expect(ChartModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<ChartModule.Default />)
  });
});

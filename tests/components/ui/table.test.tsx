import { describe, it, expect } from 'vitest';
import * as TableModule from '@/components/ui/table';

describe('Table component', () => {
  it('se exporta correctamente', () => {
    expect(TableModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<TableModule.Default />)
  });
});

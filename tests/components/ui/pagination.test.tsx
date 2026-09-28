import { describe, it, expect } from 'vitest';
import * as PaginationModule from '@/components/ui/pagination';

describe('Pagination component', () => {
  it('se exporta correctamente', () => {
    expect(PaginationModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<PaginationModule.Default />)
  });
});

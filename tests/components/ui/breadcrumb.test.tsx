import { describe, it, expect } from 'vitest';
import * as BreadcrumbModule from '@/components/ui/breadcrumb';

describe('Breadcrumb component', () => {
  it('se exporta correctamente', () => {
    expect(BreadcrumbModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<BreadcrumbModule.Default />)
  });
});

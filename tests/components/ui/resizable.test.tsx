import { describe, it, expect } from 'vitest';
import * as ResizableModule from '@/components/ui/resizable';

describe('Resizable component', () => {
  it('se exporta correctamente', () => {
    expect(ResizableModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<ResizableModule.Default />)
  });
});

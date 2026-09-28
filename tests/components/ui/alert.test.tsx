import { describe, it, expect } from 'vitest';
import * as AlertModule from '@/components/ui/alert';

describe('Alert component', () => {
  it('se exporta correctamente', () => {
    expect(AlertModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<AlertModule.Default />)
  });
});

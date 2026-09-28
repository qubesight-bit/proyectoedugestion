import { describe, it, expect } from 'vitest';
import * as AvatarModule from '@/components/ui/avatar';

describe('Avatar component', () => {
  it('se exporta correctamente', () => {
    expect(AvatarModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<AvatarModule.Default />)
  });
});

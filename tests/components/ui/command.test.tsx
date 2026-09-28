import { describe, it, expect } from 'vitest';
import * as CommandModule from '@/components/ui/command';

describe('Command component', () => {
  it('se exporta correctamente', () => {
    expect(CommandModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<CommandModule.Default />)
  });
});

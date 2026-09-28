import { describe, it, expect } from 'vitest';
import * as TextareaModule from '@/components/ui/textarea';

describe('Textarea component', () => {
  it('se exporta correctamente', () => {
    expect(TextareaModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<TextareaModule.Default />)
  });
});

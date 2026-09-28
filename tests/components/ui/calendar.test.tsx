import { describe, it, expect } from 'vitest';
import * as CalendarModule from '@/components/ui/calendar';

describe('Calendar component', () => {
  it('se exporta correctamente', () => {
    expect(CalendarModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<CalendarModule.Default />)
  });
});

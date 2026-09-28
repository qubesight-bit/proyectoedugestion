import { describe, it, expect } from 'vitest';
import * as Input-otpModule from '@/components/ui/input-otp';

describe('Input-otp component', () => {
  it('se exporta correctamente', () => {
    expect(Input-otpModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<Input-otpModule.Default />)
  });
});

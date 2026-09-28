import { describe, it, expect } from 'vitest';
import * as SkeletonModule from '@/components/ui/skeleton';

describe('Skeleton component', () => {
  it('se exporta correctamente', () => {
    expect(SkeletonModule).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<SkeletonModule.Default />)
  });
});

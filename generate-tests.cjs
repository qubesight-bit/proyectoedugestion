const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src', 'components', 'ui');

// Read all files in the UI directory
const files = fs.readdirSync(uiDir);

files.forEach(file => {
  // Only process .tsx files that are not already test files
  if (file.endsWith('.tsx') && !file.endsWith('.test.tsx')) {
    const componentName = file.replace('.tsx', '');
    const testFileName = `${componentName}.test.tsx`;
    const testFilePath = path.join(uiDir, testFileName);

    // Capitalize component name for the test description
    const Name = componentName.charAt(0).toUpperCase() + componentName.slice(1);

    const testContent = `import { describe, it, expect } from 'vitest';
import * as ${Name}Module from './${componentName}';

describe('${Name} component', () => {
  it('se exporta correctamente', () => {
    expect(${Name}Module).toBeDefined();
    // Aquí puedes agregar pruebas específicas renderizando los componentes
    // Ej: render(<${Name}Module.Default />)
  });
});
`;

    // Write the test file if it doesn't exist
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, testContent, 'utf8');
      console.log(`Created test file for ${componentName}`);
    }
  }
});

console.log("Todas las pruebas base han sido generadas.");

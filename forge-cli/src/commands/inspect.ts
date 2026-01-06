/**
 * Inspector CLI v0.1
 */

import * as fs from 'fs';
import * as path from 'path';

export function inspect(target?: string): void {
  if (target === 'ui') {
    inspectUI();
  } else if (target === 'semantic') {
    inspectSemantic();
  } else {
    console.error('[forge] Unknown inspect target:', target || '(none)');
    console.error('[forge] Available targets: ui, semantic');
    process.exit(1);
  }
}

/**
 * Inspect UI tree
 */
function inspectUI(): void {
  const bundle = readSemanticBundle();
  
  console.log('UI Tree:\n');
  printUITree(bundle.ui.components, 0);
}

/**
 * Inspect full semantic bundle
 */
function inspectSemantic(): void {
  const bundle = readSemanticBundle();
  
  console.log('Semantic Bundle:\n');
  console.log(JSON.stringify(bundle, null, 2));
}

/**
 * Read semantic bundle from disk
 */
function readSemanticBundle(): any {
  const semanticPath = path.join(process.cwd(), '.forge', 'semantic', 'semantic.json');
  
  if (!fs.existsSync(semanticPath)) {
    console.error('[forge] error: semantic bundle not found.');
    process.exit(1);
  }
  
  const content = fs.readFileSync(semanticPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Print UI tree with indentation
 */
function printUITree(components: any[], indent: number): void {
  const indentStr = '  '.repeat(indent);
  
  for (const component of components) {
    const props = Object.keys(component.props).length > 0
      ? ` ${JSON.stringify(component.props)}`
      : '';
    
    console.log(`${indentStr}${component.type}${props}`);
    
    if (component.children && component.children.length > 0) {
      printUITree(component.children, indent + 1);
    }
  }
}

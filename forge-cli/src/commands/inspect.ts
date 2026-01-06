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
    console.error(`[forge] unknown inspect target: ${target || '(none)'}`);
    console.error('[forge] available targets: ui, semantic');
    process.exit(1);
  }
}

/**
 * Inspect UI tree
 */
function inspectUI(): void {
  const bundle = readSemanticBundle();
  
  console.log('[forge] UI tree:\n');
  printUITree(bundle.ui.components, 0);
}

/**
 * Inspect full semantic bundle
 */
function inspectSemantic(): void {
  const bundle = readSemanticBundle();
  
  console.log('[forge] semantic bundle:\n');
  console.log(JSON.stringify(bundle, null, 2));
}

/**
 * Read semantic bundle from disk
 */
function readSemanticBundle(): any {
  const semanticPath = path.join(process.cwd(), '.forge', 'semantic', 'semantic.json');
  
  if (!fs.existsSync(semanticPath)) {
    console.error('[forge] semantic bundle not found');
    console.error('[forge] run "forge build web" first');
    process.exit(1);
  }
  
  try {
    const content = fs.readFileSync(semanticPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('[forge] failed to read semantic bundle:', (error as Error).message);
    process.exit(1);
  }
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

import * as fs from 'fs-extra';
import * as path from 'path';

interface SemanticNode {
  type: string;
  props: Record<string, any>;
  children?: SemanticNode[];
}

interface SemanticBundle {
  ui: {
    components: SemanticNode[];
  };
}

/**
 * Generate Apple macOS Project
 */
export async function generateAppleProject(cwd: string): Promise<void> {
  const semanticPath = path.join(cwd, '.forge', 'semantic', 'semantic.json');
  const outputDir = path.join(cwd, '.forge', 'native', 'apple', 'macos');

  if (!fs.existsSync(semanticPath)) {
    throw new Error('Semantic bundle not found. Run "forge build web" first.');
  }

  const bundle: SemanticBundle = await fs.readJson(semanticPath);
  
  // Ensure output directory exists
  await fs.ensureDir(outputDir);
  await fs.ensureDir(path.join(outputDir, 'ForgeApp'));

  // Generate source files
  await generateSourceFiles(outputDir, bundle);
  
  // create a basic project file structure (simplified for v0.1)
  // In a real app we'd generate a .xcodeproj directory, but for v0.1
  // we'll just generate the swift source files that can be opened
  
  console.log('[forge] apple macos project generated');
}

async function generateSourceFiles(outputDir: string, bundle: SemanticBundle): Promise<void> {
  const templatesDir = path.join(__dirname, '../../templates');
  const srcDir = path.join(outputDir, 'ForgeApp');
  
  await fs.ensureDir(srcDir);

  // 1. Generate Content View (The UI)
  const contentSwift = generateSwiftUI(bundle.ui.components[0]); // Root component
  const contentTpl = await fs.readFile(path.join(templatesDir, 'ContentView.swift.tpl'), 'utf-8');
  await fs.writeFile(
    path.join(srcDir, 'ContentView.swift'),
    contentTpl.replace('{{CONTENT}}', contentSwift)
  );

  // 2. copy static templates
  await fs.copy(
    path.join(templatesDir, 'App.swift.tpl'),
    path.join(srcDir, 'App.swift')
  );
  
  await fs.copy(
    path.join(templatesDir, 'Theme.swift.tpl'),
    path.join(srcDir, 'Theme.swift')
  );
}

function generateSwiftUI(node: SemanticNode): string {
  switch (node.type) {
    case 'text':
      return `Text("${node.props.content}")`;
    
    case 'button':
      // v0.1: Action is just a log, as we don't have bridging yet
      const label = node.props.label || 'Button';
      const action = node.props.action || 'unknown';
      return `Button(action: { print("Action: ${action}") }) {
    Text("${label}")
}`;

    case 'column':
      const colChildren = node.children?.map(generateSwiftUI).join('\n    ') || '';
      return `VStack {\n    ${colChildren}\n}`;

    case 'row':
      const rowChildren = node.children?.map(generateSwiftUI).join('\n    ') || '';
      return `HStack {\n    ${rowChildren}\n}`;

    default:
      return `Text("Unknown component: ${node.type}")`;
  }
}

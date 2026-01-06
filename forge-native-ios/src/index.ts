import fs from 'fs-extra';
import path from 'path';
import { iOSGenerator, SemanticNode } from './generator/ios-generator';


export async function generateiOSProject(cwd: string = process.cwd()) {
    const SEMANTIC_PATH = path.resolve(cwd, '.forge/semantic/semantic.json');
    const OUTPUT_DIR = path.resolve(cwd, '.forge/native/ios');

    console.log(`[forge-native-ios] Starting compilation...`);
    
    if (!fs.existsSync(SEMANTIC_PATH)) {
        console.error(`[forge-native-ios] Error: Semantic bundle not found at ${SEMANTIC_PATH}`);
        process.exit(1);
    }

    const semantic: SemanticNode = await fs.readJson(SEMANTIC_PATH);
    const generator = new iOSGenerator();
    const swiftCode = generator.generate(semantic);

    // Read templates
    const templatesDir = path.join(__dirname, 'templates');
    const appTemplate = await fs.readFile(path.join(templatesDir, 'ForgeApp.swift.tpl'), 'utf-8');
    const viewTemplate = await fs.readFile(path.join(templatesDir, 'ContentView.swift.tpl'), 'utf-8');

    // Replace placeholders
    const finalViewCode = viewTemplate.replace('{{CONTENT}}', swiftCode);

    // Write output
    await fs.ensureDir(OUTPUT_DIR);
    await fs.writeFile(path.join(OUTPUT_DIR, 'ForgeApp.swift'), appTemplate);
    await fs.writeFile(path.join(OUTPUT_DIR, 'ContentView.swift'), finalViewCode);

    // Create a minimal Info.plist to look like a project structure
    const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
	<string>ForgeApp</string>
	<key>CFBundleIdentifier</key>
	<string>com.forge.app</string>
</dict>
</plist>`;
    await fs.writeFile(path.join(OUTPUT_DIR, 'Info.plist'), infoPlist);

    console.log(`[forge-native-ios] iOS project generated at ${OUTPUT_DIR}`);
}

// Standalone execution
if (require.main === module) {
    generateiOSProject().catch(err => {
        console.error(err);
        process.exit(1);
    });
}


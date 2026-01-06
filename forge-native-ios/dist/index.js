"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateiOSProject = generateiOSProject;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ios_generator_1 = require("./generator/ios-generator");
async function generateiOSProject(cwd = process.cwd()) {
    const SEMANTIC_PATH = path_1.default.resolve(cwd, '.forge/semantic/semantic.json');
    const OUTPUT_DIR = path_1.default.resolve(cwd, '.forge/native/ios');
    console.log(`[forge-native-ios] Starting compilation...`);
    if (!fs_extra_1.default.existsSync(SEMANTIC_PATH)) {
        console.error(`[forge-native-ios] Error: Semantic bundle not found at ${SEMANTIC_PATH}`);
        process.exit(1);
    }
    const semantic = await fs_extra_1.default.readJson(SEMANTIC_PATH);
    const generator = new ios_generator_1.iOSGenerator();
    const swiftCode = generator.generate(semantic);
    // Read templates
    const templatesDir = path_1.default.join(__dirname, 'templates');
    const appTemplate = await fs_extra_1.default.readFile(path_1.default.join(templatesDir, 'ForgeApp.swift.tpl'), 'utf-8');
    const viewTemplate = await fs_extra_1.default.readFile(path_1.default.join(templatesDir, 'ContentView.swift.tpl'), 'utf-8');
    // Replace placeholders
    const finalViewCode = viewTemplate.replace('{{CONTENT}}', swiftCode);
    // Write output
    await fs_extra_1.default.ensureDir(OUTPUT_DIR);
    await fs_extra_1.default.writeFile(path_1.default.join(OUTPUT_DIR, 'ForgeApp.swift'), appTemplate);
    await fs_extra_1.default.writeFile(path_1.default.join(OUTPUT_DIR, 'ContentView.swift'), finalViewCode);
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
    await fs_extra_1.default.writeFile(path_1.default.join(OUTPUT_DIR, 'Info.plist'), infoPlist);
    console.log(`[forge-native-ios] iOS project generated at ${OUTPUT_DIR}`);
}
// Standalone execution
if (require.main === module) {
    generateiOSProject().catch(err => {
        console.error(err);
        process.exit(1);
    });
}

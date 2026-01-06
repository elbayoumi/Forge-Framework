"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAppleProject = generateAppleProject;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
/**
 * Generate Apple macOS Project
 */
async function generateAppleProject(cwd) {
    const semanticPath = path.join(cwd, '.forge', 'semantic', 'semantic.json');
    const outputDir = path.join(cwd, '.forge', 'native', 'apple', 'macos');
    if (!fs.existsSync(semanticPath)) {
        throw new Error('Semantic bundle not found. Run "forge build web" first.');
    }
    const bundle = await fs.readJson(semanticPath);
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
async function generateSourceFiles(outputDir, bundle) {
    const templatesDir = path.join(__dirname, '../../templates');
    const srcDir = path.join(outputDir, 'ForgeApp');
    await fs.ensureDir(srcDir);
    // 1. Generate Content View (The UI)
    const contentSwift = generateSwiftUI(bundle.ui.components[0]); // Root component
    const contentTpl = await fs.readFile(path.join(templatesDir, 'ContentView.swift.tpl'), 'utf-8');
    await fs.writeFile(path.join(srcDir, 'ContentView.swift'), contentTpl.replace('{{CONTENT}}', contentSwift));
    // 2. copy static templates
    await fs.copy(path.join(templatesDir, 'App.swift.tpl'), path.join(srcDir, 'App.swift'));
    await fs.copy(path.join(templatesDir, 'Theme.swift.tpl'), path.join(srcDir, 'Theme.swift'));
}
function generateSwiftUI(node) {
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

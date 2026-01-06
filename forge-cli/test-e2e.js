/**
 * End-to-end test for Forge CLI
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Testing Forge CLI v0.1...\n');

// Setup: Create test project
const testDir = path.join(__dirname, 'test-e2e-cli');
const srcDir = path.join(testDir, 'src');
fs.mkdirSync(srcDir, { recursive: true });

// Create src/ui.js
const uiSource = `ui(
  column(
    text("Forge CLI Test"),
    row(
      button("Build", onBuild),
      button("Deploy", onDeploy)
    )
  )
)`;

fs.writeFileSync(path.join(srcDir, 'ui.js'), uiSource);
console.log('✓ Created test project with src/ui.js\n');

const forgeCli = path.join(__dirname, 'dist', 'index.js');

// Test 1: forge build web
console.log('Test 1: forge build web');
try {
    const output = execSync(`node "${forgeCli}" build web`, {
        cwd: testDir,
        encoding: 'utf-8'
    });

    if (output.includes('[forge] web semantic build completed')) {
        console.log('✓ Web build completed successfully');
        console.log(`  Output: ${output.trim()}`);
    } else {
        console.error('✗ Unexpected output:', output);
        process.exit(1);
    }
} catch (error) {
    console.error('✗ Web build failed:', error.message);
    process.exit(1);
}

console.log('\n---\n');

// Test 2: Verify semantic.json was created
console.log('Test 2: Verify semantic.json');
const semanticPath = path.join(testDir, '.forge', 'semantic', 'semantic.json');
if (fs.existsSync(semanticPath)) {
    console.log('✓ .forge/semantic/semantic.json created');
    const bundle = JSON.parse(fs.readFileSync(semanticPath, 'utf-8'));
    console.log(`  Components: ${bundle.ui.components.length}`);
} else {
    console.error('✗ semantic.json not found');
    process.exit(1);
}

console.log('\n---\n');

// Test 3: forge build android
console.log('Test 3: forge build android');
try {
    const output = execSync(`node "${forgeCli}" build android`, {
        cwd: testDir,
        encoding: 'utf-8'
    });

    if (output.includes('[forge] android build completed')) {
        console.log('✓ Android build completed successfully');
        console.log(`  Output: ${output.trim()}`);
    } else {
        console.error('✗ Unexpected output:', output);
        process.exit(1);
    }
} catch (error) {
    console.error('✗ Android build failed:', error.message);
    process.exit(1);
}

console.log('\n---\n');

// Test 4: Verify Android project was created
console.log('Test 4: Verify Android project');
const androidDir = path.join(testDir, '.forge', 'native', 'android');
const mainActivityPath = path.join(androidDir, 'app', 'src', 'main', 'java', 'com', 'forge', 'app', 'MainActivity.kt');

if (fs.existsSync(mainActivityPath)) {
    console.log('✓ Android project created');
    const mainActivity = fs.readFileSync(mainActivityPath, 'utf-8');

    if (mainActivity.includes('Text(text = "Forge CLI Test")')) {
        console.log('✓ UI components rendered correctly');
    } else {
        console.error('✗ UI components not found in MainActivity');
        process.exit(1);
    }
} else {
    console.error('✗ MainActivity.kt not found');
    process.exit(1);
}

console.log('\n---\n');

// Test 5: Error handling - android without web build
console.log('Test 5: Error handling - android without web build');
const testDir2 = path.join(__dirname, 'test-e2e-cli-2');
fs.mkdirSync(testDir2, { recursive: true });

try {
    execSync(`node "${forgeCli}" build android`, {
        cwd: testDir2,
        encoding: 'utf-8'
    });
    console.error('✗ Should have failed without semantic.json');
    process.exit(1);
} catch (error) {
    const errorOutput = error.stderr || error.stdout || error.message;
    if (errorOutput.includes('semantic bundle not found')) {
        console.log('✓ Error handling works correctly');
        console.log('  Error message displayed properly');
    } else {
        console.error('✗ Wrong error message:', errorOutput);
        process.exit(1);
    }
}

console.log('\n---\n');

// Test 6: Deterministic behavior
console.log('Test 6: Deterministic behavior');
const testDir3 = path.join(__dirname, 'test-e2e-cli-3');
const srcDir3 = path.join(testDir3, 'src');
fs.mkdirSync(srcDir3, { recursive: true });
fs.writeFileSync(path.join(srcDir3, 'ui.js'), uiSource);

// Build twice
execSync(`node "${forgeCli}" build web`, { cwd: testDir3 });
const semantic1 = fs.readFileSync(path.join(testDir3, '.forge', 'semantic', 'semantic.json'), 'utf-8');

execSync(`node "${forgeCli}" build web`, { cwd: testDir3 });
const semantic2 = fs.readFileSync(path.join(testDir3, '.forge', 'semantic', 'semantic.json'), 'utf-8');

if (semantic1 === semantic2) {
    console.log('✓ Deterministic behavior verified');
} else {
    console.error('✗ Non-deterministic output detected');
    process.exit(1);
}

console.log('\nAll tests completed!');

// Cleanup
console.log('\nCleaning up test directories...');
fs.rmSync(testDir, { recursive: true, force: true });
fs.rmSync(testDir2, { recursive: true, force: true });
fs.rmSync(testDir3, { recursive: true, force: true });
console.log('✓ Cleanup complete');

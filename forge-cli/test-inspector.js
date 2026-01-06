/**
 * Test Forge Inspector CLI
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Testing Forge Inspector CLI v0.1...\n');

// Setup: Create test project with semantic.json
const testDir = path.join(__dirname, 'test-inspector');
const semanticDir = path.join(testDir, '.forge', 'semantic');
fs.mkdirSync(semanticDir, { recursive: true });

const testBundle = {
    ui: {
        components: [
            {
                id: 'component_0',
                type: 'column',
                props: {},
                children: [
                    {
                        id: 'component_1',
                        type: 'text',
                        props: { content: 'Hello Inspector' }
                    },
                    {
                        id: 'component_2',
                        type: 'button',
                        props: { label: 'Click', action: 'onClick' }
                    }
                ]
            }
        ],
        layout: {
            type: 'flex',
            direction: 'column'
        }
    },
    state: {
        entities: [],
        relationships: []
    },
    action: {
        actions: [],
        flows: []
    },
    design: {
        theme: {
            name: '',
            colors: {},
            typography: {
                fontFamily: '',
                fontSize: {},
                fontWeight: {},
                lineHeight: {}
            },
            spacing: {}
        },
        tokens: {
            colors: {},
            spacing: {},
            borderRadius: {},
            shadows: {}
        }
    }
};

fs.writeFileSync(
    path.join(semanticDir, 'semantic.json'),
    JSON.stringify(testBundle, null, 2)
);

console.log('✓ Created test semantic.json\n');

const forgeCli = path.join(__dirname, 'dist', 'index.js');

// Test 1: forge inspect ui
console.log('Test 1: forge inspect ui');
try {
    const output = execSync(`node "${forgeCli}" inspect ui`, {
        cwd: testDir,
        encoding: 'utf-8'
    });

    if (output.includes('UI Tree:') && output.includes('column') && output.includes('text')) {
        console.log('✓ UI tree displayed correctly');
        console.log('Output:');
        console.log(output);
    } else {
        console.error('✗ Unexpected output:', output);
        process.exit(1);
    }
} catch (error) {
    console.error('✗ inspect ui failed:', error.message);
    process.exit(1);
}

console.log('---\n');

// Test 2: forge inspect semantic
console.log('Test 2: forge inspect semantic');
try {
    const output = execSync(`node "${forgeCli}" inspect semantic`, {
        cwd: testDir,
        encoding: 'utf-8'
    });

    if (output.includes('Semantic Bundle:') && output.includes('"ui"') && output.includes('"state"')) {
        console.log('✓ Semantic bundle displayed correctly');
        console.log('Output (first 500 chars):');
        console.log(output.substring(0, 500) + '...');
    } else {
        console.error('✗ Unexpected output:', output);
        process.exit(1);
    }
} catch (error) {
    console.error('✗ inspect semantic failed:', error.message);
    process.exit(1);
}

console.log('\n---\n');

// Test 3: Error handling - missing semantic.json
console.log('Test 3: Error handling - missing semantic.json');
const testDir2 = path.join(__dirname, 'test-inspector-2');
fs.mkdirSync(testDir2, { recursive: true });

try {
    execSync(`node "${forgeCli}" inspect ui`, {
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

// Test 4: Error handling - invalid target
console.log('Test 4: Error handling - invalid target');
try {
    execSync(`node "${forgeCli}" inspect invalid`, {
        cwd: testDir,
        encoding: 'utf-8'
    });
    console.error('✗ Should have failed with invalid target');
    process.exit(1);
} catch (error) {
    const errorOutput = error.stderr || error.stdout || error.message;
    if (errorOutput.includes('Unknown inspect target')) {
        console.log('✓ Invalid target error handling works');
    } else {
        console.error('✗ Wrong error message:', errorOutput);
        process.exit(1);
    }
}

console.log('\n---\n');

// Test 5: Verify read-only behavior
console.log('Test 5: Verify read-only behavior');
const semanticPath = path.join(semanticDir, 'semantic.json');
const beforeContent = fs.readFileSync(semanticPath, 'utf-8');

execSync(`node "${forgeCli}" inspect ui`, { cwd: testDir });
execSync(`node "${forgeCli}" inspect semantic`, { cwd: testDir });

const afterContent = fs.readFileSync(semanticPath, 'utf-8');

if (beforeContent === afterContent) {
    console.log('✓ Read-only behavior verified - file unchanged');
} else {
    console.error('✗ File was modified!');
    process.exit(1);
}

console.log('\nAll tests completed!');

// Cleanup
console.log('\nCleaning up test directories...');
fs.rmSync(testDir, { recursive: true, force: true });
fs.rmSync(testDir2, { recursive: true, force: true });
console.log('✓ Cleanup complete');

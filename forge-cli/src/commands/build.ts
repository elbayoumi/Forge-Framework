/**
 * Build command orchestration v0.1
 */

import * as fs from 'fs';
import * as path from 'path';

export async function build(target?: string): Promise<void> {
  if (!target) {
    // Unified build: web first, then android
    await buildWeb();
    await buildAndroid();
  } else if (target === 'web') {
    await buildWeb();
  } else if (target === 'android') {
    await buildAndroid();
  } else {
    console.error(`[forge] Unknown build target: ${target}`);
    console.error('[forge] Available targets: web, android');
    process.exit(1);
  }
}

/**
 * Build web semantic bundle
 */
async function buildWeb(): Promise<void> {
  try {
    // Dynamic import to avoid bundling issues
    const { runWebSemanticBuild } = await import('forge-web-builder');
    
    await runWebSemanticBuild();
    console.log('[forge] web semantic build completed');
  } catch (error) {
    console.error('[forge] web build failed:', (error as Error).message);
    process.exit(1);
  }
}

/**
 * Build Android native project
 */
async function buildAndroid(): Promise<void> {
  const semanticPath = path.join(process.cwd(), '.forge', 'semantic', 'semantic.json');
  
  // Check if semantic.json exists
  if (!fs.existsSync(semanticPath)) {
    console.error('[forge] error: semantic bundle not found. Run \'forge build web\' first.');
    process.exit(1);
  }
  
  try {
    // Dynamic import to avoid bundling issues
    const { generateAndroidProject } = await import('forge-native-android');
    
    generateAndroidProject(process.cwd());
    console.log('[forge] android build completed');
  } catch (error) {
    console.error('[forge] android build failed:', (error as Error).message);
    process.exit(1);
  }
}

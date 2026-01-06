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
    await buildiOS();
  } else if (target === 'web') {
    await buildWeb();
  } else if (target === 'android') {
    await buildAndroid();
  } else if (target === 'ios') {
    await buildiOS();
  } else {
    console.error(`[forge] unknown build target: ${target}`);
    console.error('[forge] available targets: web, android, ios');
    process.exit(1);
  }
}

/**
 * Build web semantic bundle
 */
async function buildWeb(): Promise<void> {
  console.log('[forge] starting web semantic build');
  
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
    console.error('[forge] semantic bundle not found');
    console.error('[forge] run "forge build web" first');
    process.exit(1);
  }
  
  console.log('[forge] starting android native build');
  
  try {
    // Dynamic import to avoid bundling issues
    const { generateAndroidProject } = await import('forge-native-android');
    
    generateAndroidProject(process.cwd());
    console.log('[forge] android native build completed');
  } catch (error) {
    console.error('[forge] android build failed:', (error as Error).message);
    process.exit(1);
  }
}

/**
 * Build iOS native project
 */
async function buildiOS(): Promise<void> {
  const semanticPath = path.join(process.cwd(), '.forge', 'semantic', 'semantic.json');
  
  // Check if semantic.json exists
  if (!fs.existsSync(semanticPath)) {
    console.error('[forge] semantic bundle not found');
    console.error('[forge] run "forge build web" first');
    process.exit(1);
  }
  
  console.log('[forge] starting ios native build');
  
  try {
    // Dynamic import to avoid bundling issues
    const { generateiOSProject } = await import('forge-native-ios');
    
    await generateiOSProject(process.cwd());
    console.log('[forge] ios native build completed');
  } catch (error) {
    console.error('[forge] ios build failed:', (error as Error).message);
    process.exit(1);
  }
}

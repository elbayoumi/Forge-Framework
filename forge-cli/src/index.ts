#!/usr/bin/env node

/**
 * Forge CLI Entry Point
 */

import { init } from './commands/init';
import { build } from './commands/build';
import { inspect } from './commands/inspect';

const args = process.argv.slice(2);
const command = args[0];

function showHelp(): void {
  console.log('[forge] Usage: forge <command> [options]');
  console.log('');
  console.log('Commands:');
  console.log('  init                    Create forge.config.json');
  console.log('  build [target]          Build project (web, android, ios, or all)');
  console.log('  inspect <target>        Inspect semantic bundle (ui, semantic)');
  console.log('');
  console.log('Examples:');
  console.log('  forge build             Build web, android, and ios');
  console.log('  forge build web         Build web semantic bundle');
  console.log('  forge build android     Build android native project');
  console.log('  forge build ios         Build ios native project');
  console.log('  forge inspect ui        Inspect UI tree');
  console.log('  forge inspect semantic  Inspect full semantic bundle');
}

switch (command) {
  case 'init':
    init();
    break;
  
  case 'build':
    const target = args[1];
    build(target).catch((error) => {
      console.error('[forge] fatal error:', error.message);
      process.exit(1);
    });
    break;
  
  case 'inspect':
    const inspectTarget = args[1];
    inspect(inspectTarget);
    break;
  
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  
  default:
    if (command) {
      console.error(`[forge] unknown command: ${command}`);
    } else {
      console.error('[forge] no command specified');
    }
    console.error('[forge] run "forge help" for usage information');
    process.exit(1);
}

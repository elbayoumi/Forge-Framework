#!/usr/bin/env node

/**
 * Forge CLI Entry Point
 */

import { init } from './commands/init';
import { build } from './commands/build';
import { inspect } from './commands/inspect';

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    init();
    break;
  
  case 'build':
    const target = args[1]; // undefined if no target specified
    build(target).catch((error) => {
      console.error('[forge] Fatal error:', error.message);
      process.exit(1);
    });
    break;
  
  case 'inspect':
    const inspectTarget = args[1];
    inspect(inspectTarget);
    break;
  
  default:
    console.log('Usage: forge <command>');
    console.log('Commands:');
    console.log('  init       Create forge.config.json');
    console.log('  build      Build project');
    console.log('  inspect    Inspect project');
    process.exit(1);
}

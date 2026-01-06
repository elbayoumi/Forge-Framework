/**
 * Init command - creates forge.config.json
 */

import * as fs from 'fs';
import * as path from 'path';

export function init(): void {
  const configPath = path.join(process.cwd(), 'forge.config.json');
  
  const minimalConfig = {
    version: "0.1.0",
    project: {
      name: "forge-project"
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(minimalConfig, null, 2));
  console.log('[forge] Created forge.config.json');
}

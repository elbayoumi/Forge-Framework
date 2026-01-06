/**
 * Config loader - loads forge.config.json
 */

import * as fs from 'fs';
import * as path from 'path';

export function loadConfig(): any {
  const configPath = path.join(process.cwd(), 'forge.config.json');
  
  if (!fs.existsSync(configPath)) {
    return null;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configContent);
}

import path from 'path';
import { readFileSync } from 'fs';
import { findUpSync } from 'find-up';
import type { IConfig } from './types/config';

/**
 * Loads the llm-i18n-translate configuration from the nearest config file.
 *
 * This function searches for a `llm-i18n-translate.config.json` file upwards from the current directory,
 * reads it, and returns the configuration object along with the root directory containing the config.
 *
 * @returns An object containing the loaded config and the root directory path.
 * @throws If the configuration file cannot be found or if the JSON is invalid.
 */
export function loadConfig(): {
  config: IConfig;
  rootDir: string;
} {
  const configPath = findUpSync('llm-i18n-translate.config.json');
  if (!configPath) throw new Error('⚠️ Config file not found.');

  const configContent = readFileSync(configPath, 'utf-8');
  const config = JSON.parse(configContent) as IConfig;

  return {
    config,
    rootDir: path.dirname(configPath),
  };
}

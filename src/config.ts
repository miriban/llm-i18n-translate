import path from 'path';
import { pathToFileURL } from 'url';
import { findUpSync } from 'find-up';
import type { IConfig } from './types/config';

/**
 * Loads the llm-i18n-translate configuration from the nearest config file.
 *
 * This function searches for a `llm-i18n-translate.config.ts` file upwards from the current directory,
 * imports it, and returns the configuration object along with the root directory containing the config.
 *
 * @returns An object containing the loaded config and the root directory path.
 * @throws If the configuration file cannot be found.
 */
export async function loadConfig(): Promise<{
  config: IConfig;
  rootDir: string;
}> {
  const configPath = findUpSync('llm-i18n-translate.config.ts');
  if (!configPath) throw new Error('⚠️ Config file not found.');

  const configModule = await import(pathToFileURL(configPath).href);
  return {
    config: configModule.default as IConfig,
    rootDir: path.dirname(configPath),
  };
}

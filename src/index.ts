import fs from 'fs';
import dotenv from 'dotenv';
import { loadConfig } from './config';
import { getLocalePath, ensureFile, mergeFlatToNested, compareTranslations } from './utils';
import { GeminiTranslationProvider } from './providers';
import type { ITranslationProvider } from './types/provider';
import type { IConfig } from './types/config';

dotenv.config();

/**
 * Main entry point: loads config from files, detects missing translations, and translates in batches,
 * updating the target file after each batch to avoid data loss.
 */
export async function translateWithConfig() {
  const { config, rootDir } = loadConfig();
  return translate(config, rootDir);
}

/**
 * Main entry point with explicit config: detects missing translations and translates in batches,
 * updating the target file after each batch to avoid data loss.
 */
export async function translate(config: IConfig, rootDir: string) {
  const { sourceLocale, targetLocales, translationsDir, provider, model } = config;

  // Load source translations
  const sourcePath = getLocalePath(rootDir, translationsDir, sourceLocale);
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

  // For each target locale, detect missing keys and translate in batches
  for (const locale of targetLocales) {
    const targetPath = getLocalePath(rootDir, translationsDir, locale);
    ensureFile(targetPath);
    const target = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    const { missingKeys } = compareTranslations(source, target);

    if (Object.keys(missingKeys).length === 0) {
      console.log(`✅ ${locale} is already complete.`);
      continue;
    }

    console.log(
      `🌐 Translating ${Object.keys(missingKeys).length} keys to ${locale} using ${provider}...`,
    );

    // Flatten missing keys for batching
    const missingKeyList = Object.keys(missingKeys);
    const batchSize = 10;
    let updatedTarget = { ...target };

    // Provider selection
    let translationProvider: ITranslationProvider;
    switch (provider) {
      case 'gemini':
        translationProvider = new GeminiTranslationProvider();
        break;
      default:
        throw new Error(`❌ Provider ${provider} not supported.`);
    }

    // Batch translation and immediate file update
    for (let i = 0; i < missingKeyList.length; i += batchSize) {
      const batchKeys = missingKeyList.slice(i, i + batchSize);
      const batchMap: Record<string, string> = {};
      for (const key of batchKeys) {
        batchMap[key] = missingKeys[key];
      }

      try {
        const translations = await translationProvider.translate(
          batchMap,
          model,
          sourceLocale,
          locale,
        );
        // Deep merge the translations with the current target
        updatedTarget = mergeFlatToNested(updatedTarget, translations);
        fs.writeFileSync(targetPath, JSON.stringify(updatedTarget, null, 2));
        console.log(
          `✅ Translated and updated ${batchKeys.length} keys for ${locale} (${
            i + batchKeys.length
          }/${missingKeyList.length})`,
        );
      } catch (err) {
        console.error(
          `❌ Error translating batch for ${locale} (keys: ${batchKeys.join(', ')}):`,
          err,
        );
        // Stop further processing for this locale on error
        break;
      }
    }
  }
}

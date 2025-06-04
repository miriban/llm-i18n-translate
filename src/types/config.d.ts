import type { TranslationProviderName } from './provider';

/**
 * Configuration interface for llm-i18n-translate.
 *
 * This interface defines the required structure for the configuration object
 * used by the translation tool. It should be exported as the default object
 * from your `llm-i18n-translate.config.ts` file.
 */
export interface IConfig {
  /**
   * The source locale code (e.g., "en").
   * This is the language from which translations will be generated.
   */
  sourceLocale: string;

  /**
   * An array of target locale codes (e.g., ["fr", "de"]).
   * These are the languages into which the source texts will be translated.
   */
  targetLocales: string[];

  /**
   * The directory (relative to the project root) where translation files are stored.
   * Example: "locales"
   */
  translationsDir: string;

  /**
   * The translation provider to use.
   * Currently, only "gemini" is supported.
   */
  provider: TranslationProviderName;

  /**
   * The model name or version to use with the provider.
   * For Gemini, this might be "gemini-pro" or another supported model.
   */
  model: string;
}

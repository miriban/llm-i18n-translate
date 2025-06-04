/**
 * Interface for translation providers used by llm-i18n-translate.
 *
 * Implement this interface to add support for a new translation provider.
 * The provider should handle authentication (e.g., API key) internally,
 * typically by reading from environment variables.
 */
export interface ITranslationProvider {
  /**
   * Translate a set of key-value pairs from a source language to a target language.
   *
   * @param textMap    An object mapping translation keys to their source text.
   * @param model      The model name or version to use for translation (e.g., "gemini-pro").
   * @param sourceLang The source language code (e.g., "en").
   * @param targetLang The target language code (e.g., "fr").
   * @returns          A Promise resolving to an object mapping keys to their translated values.
   */
  translate(
    textMap: Record<string, string>,
    model: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<Record<string, string>>;
}

/**
 * Union type of supported translation provider names.
 * Add new provider names here when implementing new providers.
 */
export type TranslationProviderName = 'gemini';

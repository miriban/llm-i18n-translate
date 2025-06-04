/**
 * Builds a prompt instructing an LLM to translate a batch of texts from a source language to a target language.
 *
 * The prompt requests the model to return a valid JSON object mapping the original keys to their translations,
 * with no extra text or characters outside the JSON. This is important for reliable parsing of the model's output.
 *
 * @param sourceLang - The source language code (e.g., "en").
 * @param targetLang - The target language code (e.g., "fr").
 * @param batchMap - An object where keys are translation keys and values are the source texts to translate.
 * @returns A string prompt to be sent to the LLM.
 */
export function buildTranslationPrompt(
  sourceLang: string,
  targetLang: string,
  batchMap: Record<string, string>,
): string {
  return (
    `Translate the following texts from ${sourceLang} to ${targetLang}.\n` +
    `Return the translations as a JSON object where keys are the original keys and values are the translations.\n` +
    `Only return the JSON object, no other text.\n` +
    `Make sure there is no non-whitespace character after JSON.\n` +
    `Make sure the JSON is valid.\n\n` +
    `Input texts:\n` +
    `${JSON.stringify(batchMap, null, 2)}`
  );
}

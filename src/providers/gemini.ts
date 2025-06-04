import { GoogleGenAI } from '@google/genai';
import type { ITranslationProvider } from '../types/provider';
import { buildTranslationPrompt } from '../prompts/basePrompt';

/**
 * GeminiTranslationProvider implements the TranslationProvider interface
 * for Google Gemini models via the @google/genai SDK.
 *
 * This provider batches translation requests for efficiency and
 * parses the model's JSON output for key-value translations.
 *
 * Note: The API key is read from the environment variable GEMINI_API_KEY.
 */
export class GeminiTranslationProvider implements ITranslationProvider {
  private genAI: GoogleGenAI;

  /**
   * Constructs a new GeminiTranslationProvider.
   * Reads the API key from the environment variable GEMINI_API_KEY.
   */
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is required (set GEMINI_API_KEY env variable).');
    }
    this.genAI = new GoogleGenAI({ apiKey });
  }

  /**
   * Translates a set of key-value pairs from the source language to the target language.
   * Batches requests in groups of 10 for efficiency.
   *
   * @param textMap - An object where keys are translation keys and values are the source texts.
   * @param model - The Gemini model name or version to use for translation.
   * @param sourceLang - The source language code (e.g., 'en').
   * @param targetLang - The target language code (e.g., 'fr').
   * @returns A Promise resolving to an object mapping keys to their translated values.
   */
  async translate(
    textMap: Record<string, string>,
    model: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    const keys = Object.keys(textMap);

    // Process in batches of 10 keys for efficiency and to avoid prompt length issues
    for (let i = 0; i < keys.length; i += 10) {
      const batchKeys = keys.slice(i, i + 10);
      const batchMap: Record<string, string> = {};
      for (const key of batchKeys) {
        batchMap[key] = textMap[key];
      }

      // Use the prompt builder from prompts/basePrompt
      const prompt = buildTranslationPrompt(sourceLang, targetLang, batchMap);

      const config = {
        responseMimeType: 'application/json',
      };

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      // Send the request to Gemini and parse the response
      const response = await this.genAI.models.generateContent({
        model,
        config,
        contents,
      });

      try {
        // Flatten and join all candidate parts to get the JSON string
        const result = response.candidates
          ?.map((c) => c.content?.parts?.map((p) => p.text))
          .flatMap((p) => p)
          .join('');
        if (!result) {
          throw new Error('No result from Gemini');
        }
        const translations = JSON.parse(result);
        Object.assign(results, translations);
      } catch (error) {
        console.error(`Failed to parse batch response:`, response);
        throw error;
      }
    }

    return results;
  }
}

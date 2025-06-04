#!/usr/bin/env node
/**
 * llm-i18n-translate CLI
 *
 * Open source CLI for batch translation of i18n files using LLMs.
 * See: https://github.com/miriban/llm-i18n-translate
 */

import { runWithConfig } from '../src';

runWithConfig().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});

# 🌍 llm-i18n-translate

> Automatically detect and translate missing i18n keys in your JSON translation files using LLMs like OpenAI and Gemini — with a powerful CLI, flexible config, and full TypeScript support.

---

## 🚀 Features

* 🧐 Translate missing keys using LLMs (OpenAI, Gemini)
* 📂 Compare JSON translation files and fill gaps automatically
* 🔧 Configure with a single JSON file
* 🤖 CLI and programmatic API support
* 🔌 Pluggable provider system
* ✅ TypeScript support
* 🧪 Includes examples for testing and demos

---

## 📆 Installation

```bash
npm install --save-dev llm-i18n-translate
```

---

## 📁 Project Structure

```
.
├── translations/               # Your i18n JSON files
│   ├── en.json
│   ├── fr.json
│   └── de.json
├── llm-i18n-translate.config.json
├── .env
└── ...
```

---

## 🔧 Configuration

Create a `llm-i18n-translate.config.json` file in your project root:

```json
{
  "sourceLocale": "en",
  "targetLocales": ["de", "fr"],
  "translationsDir": "./translations",
  "provider": "gemini",
  "model": "gemini-2.5-flash-preview-04-17"
}
```

> This tells the tool to compare `en.json` to `fr.json` and `de.json`, and use Gemini to fill in missing keys.

### Supported Providers

| Provider | Environment Variable | Notes                    |
| -------- | -------------------- | ------------------------ |
| Gemini   | `GEMINI_API_KEY`     | Uses Google's Gemini API |

---

## 🔐 Environment Variables

Create a `.env` file in your root directory:

```
GEMINI_API_KEY=your-gemini-key-here
```

These are loaded automatically when the tool runs.

---

## 🚀 Usage

### 🔸 CLI

```bash
llm-i18n-translate
```

This will:

1. Read your `llm-i18n-translate.config.json`
2. Load your `.env`
3. Compare and fill in missing keys using your selected LLM

You can run it from your project root.

---

## ⚙️ Scripts

* `npm run build` – Build TypeScript source
* `npm run lint` – Lint with ESLint
* `npm run format` – Format with Prettier
* `npm run test` – Run unit tests with Vitest

---

## 🤝 Contributing

### 📀 Code Style

We use:

* ESLint (`.eslintrc.json`)
* Prettier (`.prettierrc`)
* TypeScript strict mode

Before committing:

```bash
npm run lint
npm run format
```

### 🧪 Tests

```bash
npm run test
```

---

## 📬 Need Help?

Open an issue or start a discussion:
👉 [GitHub Issues](https://github.com/miriban/llm-i18n-translate/issues)

# AI Code Editor

A browser-based practice playground for data-structures-and-algorithms problems, built with React 19, Vite 7 and Tailwind CSS 4. It ships a small catalogue of problems, lets you filter them by category and difficulty, gives you a plain-text editor pre-filled with per-language starter code, and wires three Google Gemini actions to whatever you have written: a structured complexity analysis with a beginner-oriented hint, a long-form explanation, and translation into another supported language. It is aimed at learners who want feedback on their *approach* rather than a pass/fail verdict — the app never runs your code, it only reasons about it.

## Features

**Problem catalogue**

- Questions are fetched at runtime from `public/questions.json`; nothing is hard-coded in the components.
- Each question carries an id, title, prompt, difficulty, one or more categories, and a `starterCode` map keyed by language.
- The category filter list is derived from the data, so adding a question with a new category makes that category appear automatically.

**Filtering and selection**

- Multi-select category filter using AND logic — a question is shown only if it carries *every* selected category.
- Single-choice difficulty filter: `All`, `Easy`, `Medium`, `Hard`.
- The first matching question is auto-selected; the current selection survives a filter change as long as it still matches, otherwise it falls back to the first result.
- An empty result set shows a "No problems match your filters" message and disables the editor and AI actions.

**Editor**

- Full-height controlled `<textarea>` with a monospace face and spellcheck disabled.
- Selecting a question, or changing the language dropdown, loads that question's starter code for the active language.
- Missing starter code for the chosen language falls back to the JavaScript starter, then to a `// No starter code for <language>` placeholder.

**AI actions**

- **Analyze** — structured complexity review rendered into the "AI Tutor Analysis" panel, with the hint gated behind a "Show Hint" button.
- **Explain** — long-form walkthrough rendered in a modal dialog.
- **Translate to \<language\>** — rewrites the editor contents into the selected target language.
- Each action has its own in-progress state and spinner and is disabled while no question is selected; Translate is additionally disabled when source and target languages match.

**Theming and layout**

- Three themes — `dark`, `light`, `sunset` — cycled by a single header button that names the theme it will switch to.
- Themes are applied by writing CSS custom properties (`--color-background`, `--color-primary`, `--color-editor-bg`, …) onto the document root; components consume them through Tailwind arbitrary values such as `bg-[var(--color-surface)]`.
- The chosen theme is persisted to `localStorage` under the key `ai-editor-theme`.
- Two-panel layout — filters, problem list and prompt on the left; language controls, action bar, editor and analysis panel on the right — stacking vertically below the `lg` breakpoint.

## How it works

### The question catalogue

On mount the app issues `fetch("./questions.json")` against the Vite public directory. A non-2xx response becomes a full-screen error state; while the request is in flight a "Loading Questions..." screen is shown. The response must be a flat JSON array of objects in this shape:

```json
{
  "id": "arr001",
  "title": "Find Maximum Value",
  "prompt": "Write a function that finds the maximum value in an array of numbers.",
  "difficulty": "Easy",
  "categories": ["Arrays"],
  "starterCode": {
    "javascript": "function findMax(arr) {\n  // Your code here\n}",
    "python": "def find_max(arr):\n  # Your code here\n  pass",
    "java": "class Solution { /* ... */ }",
    "go": "package main\n\nfunc FindMax(arr []int) int {\n\t// Your code here\n}",
    "cpp": "#include <vector>\n\nint findMax(const std::vector<int>& arr) {\n    // Your code here\n}"
  }
}
```

Unique categories are computed by flattening every question's `categories` array, and the first one is pre-selected on load. Adding a problem is a data edit — append an object in this shape, no code change required. The catalogue in the repository contains seven problems across the `Arrays` and `Strings` categories.

### Filtering

Filtering runs in an effect over the full list whenever the selected categories, the selected difficulty or the loaded catalogue change. Categories are matched with `Array.prototype.every`, so selecting two categories narrows to questions tagged with *both* rather than widening to their union. Deselecting all categories disables the category filter. Difficulty is an exact string match unless `All` is selected.

### The editor

The editor is a controlled `<textarea>` — no syntax highlighting, no autocomplete, no bracket matching, no language server. Its contents live in React state and are replaced wholesale when the selected question or the active language changes, and when a translation returns. Unsaved edits are discarded at that point.

### AI actions

All three actions post to the Google Gemini `generateContent` REST endpoint (`generativelanguage.googleapis.com`, `v1beta`) using the `gemini-2.5-flash-preview-05-20` model, directly from the browser via a shared `callGeminiAPI` helper. Failures are caught, logged to the console, and surfaced inline where the feature has somewhere to show a message.

**Analyze.** Sends the problem title plus your code and language under a system prompt casting the model as a coding tutor for beginners. The request pins `responseMimeType: "application/json"` with a response schema of `userTimeComplexity`, `userSpaceComplexity`, `isOptimal`, `hint` and `explanation` (all required except `hint`). The parsed result renders as two complexity cards, a prose explanation, and either a green "Optimal Solution!" confirmation or an amber "room to improve" panel whose hint stays hidden until you press **Show Hint**. The system prompt explicitly forbids handing back solution code.

**Explain.** Sends the problem title and your code under a system prompt asking for a beginner-friendly explanation of the overall logic followed by separate, clearly marked time and space complexity sections. The markdown response is rendered into a scrollable modal; fenced blocks and inline backticks are converted to `<pre><code>` and `<code>` before injection.

**Translate.** Sends your code with the source and target languages and a system prompt demanding raw code with no fences, language identifiers or commentary. On success the editor contents are replaced with the trimmed response and the language selector switches to the target.

**Supported languages.** The same five populate both the editor language selector and the translation target selector: JavaScript, Python, Java, Go and C++.

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19 (`react`, `react-dom`), function components with hooks |
| Build tooling | Vite 7 with `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, plus CSS custom properties for theming |
| AI | Google Gemini `generateContent` v1beta REST API, model `gemini-2.5-flash-preview-05-20` |
| Linting | ESLint 9 flat config with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` |
| Persistence | `localStorage` (theme only) |

There is no backend, router, state-management library, component library or test framework in the dependency set.

## Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+ (Vite 7's supported range)
- npm
- A Google Gemini API key — see [Configuration](#configuration)

### Install

```bash
git clone https://github.com/itsadityakr/ai-code-editor.git
cd ai-code-editor
npm install
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Produce a production build in `dist/` |
| `npm run preview` | Serve the built `dist/` output locally |
| `npm run lint` | Run ESLint across the project |

### Dev URL

`vite.config.js` pins the dev server port, so after `npm run dev` the app is available at `http://localhost:2711`. The build `base` is `/`, which assumes deployment at a domain root rather than a subpath.

## Configuration

The Gemini API key is read from a local variable inside `callGeminiAPI` in `src/App.jsx`, and **in the committed source that variable is an empty string**:

```js
const apiKey = "";
```

The code was written for a host environment that injected the key into the outbound request automatically. Outside that environment all three AI actions fail with an HTTP error until you supply a key of your own. Nothing else in the repository needs configuring.

The minimal change is to assign the key directly:

```js
const apiKey = "YOUR_API_KEY_HERE";
```

The better option is to keep it out of source control by reading a Vite environment variable. Create a `.env` file in the project root (`.env` is already in `.gitignore`):

```
VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
```

and read it in `src/App.jsx`:

```js
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

Two caveats worth stating plainly:

- Any `VITE_`-prefixed variable is inlined into the client bundle at build time. This keeps the key out of your git history but **not** out of the shipped JavaScript — anyone loading the page can read it. For anything public-facing, proxy the Gemini call through a server you control and keep the key there.
- The `index.js` at the repository root calls `dotenv.config()`, but it is not imported by the app, is not an entry point in `index.html` or `vite.config.js`, and `dotenv` is not in `package.json` — so it does not run. Server-side `dotenv` would not help a browser-side `fetch` in any case.

Never commit a real key. If one has already been committed, rotate it.

## Project structure

```
ai-code-editor/
├── public/
│   └── questions.json      Problem catalogue fetched at runtime
├── src/
│   ├── App.jsx             Entire application: themes, icons, modal, state, Gemini calls, UI
│   ├── main.jsx            React root, StrictMode
│   └── index.css           Tailwind import
├── index.html              Vite HTML entry
├── vite.config.js          React + Tailwind plugins, dev port 2711, base "/"
├── eslint.config.js        ESLint 9 flat config
├── index.js                Unused dotenv stub (see Configuration)
├── package.json
└── LICENSE
```

The application is a single component: `src/App.jsx` holds the theme palettes, inline SVG icons, the explanation modal, all React state, the Gemini request helpers and the full layout. There is no `src/components/` directory.

## Limitations

- **No code execution.** There is no runtime, sandbox, interpreter or WASM toolchain. Your code is only ever sent to a language model as text.
- **No test runner and no test cases.** Questions carry a prompt and starter code but no expected inputs or outputs, so nothing verifies correctness — "is this right?" is answered by the model's opinion, not by execution.
- **No persistence of your work.** Only the theme is stored. Editor contents are lost on reload, on switching questions and on switching languages, with no warning.
- **Not a real editor.** A bare `<textarea>`: no syntax highlighting, line numbers, indentation handling or autocomplete.
- **Requires an API key, and the key is client-side.** Without a key nothing AI-powered works; with one, the key ships in the browser bundle unless you add your own proxy.
- **No accounts, progress tracking or submission history.**
- **Small catalogue.** Seven problems in two categories.
- **Model output is rendered as HTML.** The explanation modal injects converted markdown with `dangerouslySetInnerHTML` without sanitisation — acceptable for a local single-user tool, but it should be sanitised before public deployment.
- **Model responses are not guaranteed.** Complexity verdicts, hints and translations are generated text; translated code has never been compiled or run.
- **Known data defects.** Four C++ starter snippets in `public/questions.json` have a search-engine URL substituted for `std::string`, and one declares a malformed `std::vectorstd::string` return type. Fix these before relying on the C++ starters.
- **Missing favicon.** `index.html` references `/vite.svg`, which is not present in `public/`, so the icon request 404s.
- **Translation failures are quiet.** A failed translation logs to the console and leaves the editor unchanged; unlike Analyze and Explain it shows nothing in the UI.

## License

MIT. Copyright (c) 2025 Aditya Kumar. See [LICENSE](LICENSE) for the full text.

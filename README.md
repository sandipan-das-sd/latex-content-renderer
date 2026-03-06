# latex-content-renderer

<p align="center">
  <img src="https://img.shields.io/npm/v/latex-content-renderer?color=%2338bdf8&style=for-the-badge" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/latex-content-renderer?color=%2322c55e&style=for-the-badge" alt="downloads" />
  <img src="https://img.shields.io/npm/l/latex-content-renderer?color=%23f59e0b&style=for-the-badge" alt="license" />
  <img src="https://img.shields.io/badge/platforms-React%20%7C%20RN%20%7C%20Flutter%20%7C%20Android%20%7C%20iOS-blueviolet?style=for-the-badge" alt="platforms" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

> **The all-in-one LaTeX rendering engine for JavaScript.** Render math equations, chemical formulas (mhchem), SMILES molecular structures, tables, figures, lists, and formatted text — in React, React Native, Flutter, Android, iOS, or plain HTML. Built-in AI/LLM streaming support, accessibility (WCAG/ARIA), and SVG export.

---

## Description

**latex-content-renderer** is a universal, cross-platform npm package that converts LaTeX strings into beautifully rendered HTML. It is designed for developers building **ed-tech platforms**, **AI chatbots** (ChatGPT clones, tutoring bots), **science quiz apps**, **online exam portals**, **research paper viewers**, **chemistry education tools**, and any application that needs to display mathematical or scientific content.

### Why this package exists

Rendering LaTeX in JavaScript has always been fragmented:

- **MathJax** renders math beautifully, but doesn't handle SMILES molecules, LaTeX tables, images, or lists. It requires manual configuration for chemistry (mhchem).
- **KaTeX** is fast, but doesn't support chemistry at all and can't render tables or images from LaTeX syntax.
- **React Native** has no native LaTeX solution — you have to build a WebView bridge from scratch.
- **Flutter / Android / iOS** developers need to generate self-contained HTML and load it into a WebView manually.
- **AI streaming** (from OpenAI, Anthropic, Google Gemini, Groq) sends LaTeX character by character — rendering partial equations like `$\frac{1` crashes other renderers.
- **SMILES molecular structures** need an entirely separate library (SmilesDrawer or RDKit) wired up manually.

**latex-content-renderer** solves all of these problems in a single `npm install`.

### What it does

You pass a string containing LaTeX, math, chemistry, or formatted text — it returns clean, rendered HTML:

```
Input:  "The quadratic formula: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$"
Output: Beautiful rendered math equation in the browser
```

```
Input:  "Water is $\ce{H2O}$ and ethanol is \smiles{CCO}"
Output: Rendered chemical formula + 2D molecular structure diagram
```

**No setup hassle.** No MathJax configuration. No boilerplate. Just import and use.

### Key Features

| Feature | Description |
|---------|-------------|
| **Math Rendering** | Inline (`$...$`) and display (`$$...$$`) math equations via MathJax 3 |
| **Chemistry (mhchem)** | Chemical formulas, reactions, equilibria, isotopes — `$\ce{H2O}$`, `$\ce{CH4 + 2O2 -> CO2 + 2H2O}$` |
| **SMILES Molecules** | 2D molecular structure diagrams from SMILES strings — `\smiles{CCO}`, `<smiles>c1ccccc1</smiles>`, and 6 more formats |
| **LaTeX Tables** | `\begin{tabular}...\end{tabular}` rendered as HTML tables |
| **Images & Figures** | `\includegraphics{url}`, `![alt](url)`, `\begin{figure}...\caption{text}` |
| **Lists** | `\begin{enumerate}` (numbered) and `\begin{itemize}` (bulleted) |
| **Text Formatting** | `\textbf{}`, `\textit{}`, `\underline{}`, `\texttt{}`, `\textcolor{}`, `\colorbox{}` |
| **Spacing** | `\quad`, `\qquad`, `\hspace{}`, `\vspace{}`, `\par` |
| **AI/LLM Streaming** | Buffers incomplete math from ChatGPT/Claude/Gemini streaming APIs — never shows broken equations |
| **Accessibility (WCAG)** | Adds `role="math"`, `aria-label` with human-readable descriptions for screen readers |
| **SVG Export** | Convert any equation to SVG string or base64 data URL for PDFs, presentations, downloads |
| **CDN Build** | One `<script>` tag — auto-injects MathJax and SmilesDrawer. Zero config. 27KB gzipped. |

### Supported Platforms

| Platform | How |
|----------|-----|
| **React** (Next.js, Vite, CRA) | `<SciContent>` component |
| **React Native / Expo** | `<SciContentNative>` component (WebView-based) |
| **Flutter** | `getHtml()` → load in WebView |
| **Android** | `getHtml()` → load in Android WebView |
| **iOS** | `getHtml()` → load in WKWebView |
| **Vue / Angular / Svelte** | `processContent()` function → set innerHTML |
| **Plain HTML / CDN** | One `<script>` tag, global `LatexRenderer` object |
| **Node.js / SSR** | `processContent()` for server-side pre-processing |

### Who is this for?

- **Ed-tech developers** — Build math quiz apps, online classrooms, homework platforms
- **AI/LLM app developers** — Render streaming LaTeX from GPT-4, Claude, Gemini in chat UIs
- **Science educators** — Display chemistry equations, molecular structures, physics formulas
- **Exam platforms** — Render questions with math, chemistry, tables, and images
- **Research tools** — Display papers, formulas, and scientific notation
- **Accessibility teams** — Meet WCAG requirements with built-in ARIA math labels

Powered by [MathJax 3](https://www.mathjax.org/) + [SmilesDrawer](https://github.com/reymond-group/smilesDrawer). TypeScript-first. MIT licensed. Zero runtime dependencies.

---

## Install

```bash
npm install latex-content-renderer
```

---

## Quick Start (React)

**Step 1:** Add MathJax CDN to your HTML `<head>`:

```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
```

**Step 2:** Use the component:

```tsx
import { SciContent } from 'latex-content-renderer';

function App() {
  return (
    <SciContent content="The quadratic formula: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$" />
  );
}
```

That's it. The math renders beautifully.

---

## What can it render?

| Feature | Input example | What it does |
|---------|---------------|-------------|
| **Inline math** | `$E = mc^2$` | Renders math inline with text |
| **Display math** | `$$\int_0^\infty e^{-x^2} dx$$` | Renders math as a centered block |
| **Chemistry formulas** | `$\ce{H2O}$`, `$\ce{2H2 + O2 -> 2H2O}$` | Chemical equations via mhchem |
| **SMILES structures** | `<smiles>CCO</smiles>` | 2D molecular structure diagrams |
| **Tables** | `\begin{tabular}{\|c\|c\|}...\end{tabular}` | HTML tables with borders |
| **Images** | `\includegraphics{url}` or `![alt](url)` | Embedded images |
| **Figures** | `\begin{figure}...\caption{...}\end{figure}` | Figures with captions |
| **Lists** | `\begin{enumerate}\item ...\end{enumerate}` | Numbered & bullet lists |
| **Bold/Italic** | `\textbf{bold}`, `\textit{italic}` | Text formatting |
| **Colors** | `\textcolor{red}{text}`, `\colorbox{yellow}{text}` | Colored text & highlights |
| **Monospace** | `\texttt{code}` | Monospaced text |

---

## Usage by Platform

### React (Next.js / Vite / CRA)

```tsx
import { SciContent } from 'latex-content-renderer';

function MathPage() {
  return (
    <div>
      <SciContent content="Solve: $x^2 - 5x + 6 = 0$" />
      <SciContent content="Water: $\ce{H2O}$" />
    </div>
  );
}
```

### React Native / Expo

```bash
npm install react-native-webview  # peer dependency
```

```tsx
import { SciContentNative } from 'latex-content-renderer/native';

function MathScreen() {
  return (
    <SciContentNative
      content="Ethanol structure: <smiles>CCO</smiles>"
      theme="dark"
      fontSize={16}
    />
  );
}
```

### Flutter / Android / iOS (any WebView)

Use `getHtml()` to get a self-contained HTML string you can load in any WebView:

```ts
import { getHtml } from 'latex-content-renderer';

const html = getHtml('Evaluate: $$\\int_0^1 x^2 \\, dx$$', {
  theme: 'light',
  fontSize: 18,
});

// Flutter:  WebView(html: html)
// Android:  webView.loadDataWithBaseURL(null, html, "text/html", "utf-8", null)
// iOS:      webView.loadHTMLString(html, baseURL: nil)
```

### Core function only (no React)

```ts
import { processContent } from 'latex-content-renderer';

const html = processContent('Derivative: $\\frac{d}{dx} x^n = nx^{n-1}$');
// Returns HTML string — still needs MathJax loaded in the browser to render math
```

### Plain HTML (CDN — no npm, no build tools)

If you're NOT using React/npm/build tools and just have a plain HTML file, add **one script tag** and it works. MathJax and SmilesDrawer are auto-loaded for you:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/latex-content-renderer/dist/latex-content-renderer.min.global.js"></script>
</head>
<body>
  <div id="output"></div>

  <script>
    // One line — renders math, chemistry, tables, everything
    LatexRenderer.render('#output', 'The quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$');
  </script>
</body>
</html>
```

**That's it. One script tag. MathJax is auto-injected.** No configuration needed.

You can also use the lower-level API if you want more control:

```html
<script>
  // Just get the HTML (you handle MathJax yourself)
  var html = LatexRenderer.processContent('$E = mc^2$');
  document.getElementById('output').innerHTML = html;
</script>
```

**What's available via CDN (`LatexRenderer.*`):**

| Function | What it does |
|----------|-------------|
| `LatexRenderer.render(selector, text)` | **Easiest** — process + render + typeset in one call |
| `LatexRenderer.processContent(text)` | Convert LaTeX string → HTML |
| `LatexRenderer.getHtml(text, opts)` | Get complete HTML page for WebViews |
| `LatexRenderer.addAccessibility(html)` | Add ARIA labels for screen readers |
| `LatexRenderer.createStreamingState()` | Create buffer for AI streaming |
| `LatexRenderer.feedChunk(state, chunk)` | Feed a chunk from AI stream |
| `LatexRenderer.flushStream(state)` | Flush remaining buffered text |
| `LatexRenderer.latexToSvg(tex)` | LaTeX → SVG (needs tex-svg.js) |
| `LatexRenderer.latexToDataUrl(tex)` | LaTeX → base64 data URL |

> **Note:** The CDN build does NOT include the React components (`SciContent`, `SciContentStreaming`). Those require `npm install` and a bundler. The CDN gives you all the core functions.

---

## AI/LLM Streaming Support

### What is this and why do you need it?

> **Important: This package does NOT include any AI or LLM. It does NOT call ChatGPT or any API.**

This feature is for **developers who are already building apps that call AI APIs** (ChatGPT, Claude, Gemini, DeepSeek, etc.).

**The problem it solves:**

When your AI API sends back a response with math, it arrives **character by character** (streaming). For example, the AI might be trying to send `$$x = \frac{1}{2}$$`, but you receive it in chunks:

```
Chunk 1: "The answer is $$x = \frac{"    ← incomplete math!
Chunk 2: "1}{2}"                          ← still incomplete!
Chunk 3: "$$"                             ← now it's complete
```

If you try to render chunk 1 right away, `$$x = \frac{` is broken LaTeX — it shows as ugly text or throws errors.

**What this feature does:** It **buffers incomplete math** and only renders complete equations. Your users see clean text while math is being typed, then the full beautiful equation appears once it's complete.

### React component (easiest way)

```tsx
import { SciContentStreaming } from 'latex-content-renderer';

// In your AI chat app:
function AIChatBubble({ text, isStreaming }) {
  return (
    <SciContentStreaming
      content={text}           // The text received so far from the AI
      isStreaming={isStreaming} // true while AI is still sending
      showCursor={true}        // Show blinking cursor while streaming
      debounceMs={100}         // Re-render at most every 100ms
    />
  );
}
```

### Lower-level API (for custom setups)

```ts
import { createStreamingState, feedChunk, flushStream, processContent } from 'latex-content-renderer';

const state = createStreamingState();

// As each chunk arrives from your AI API:
for await (const chunk of myAiStream) {
  const safeText = feedChunk(state, chunk);  // Buffers incomplete math
  const html = processContent(safeText);     // Only complete math is rendered
  myElement.innerHTML = html;
}

// When the AI finishes sending:
const finalText = flushStream(state);        // Release any remaining buffered text
const html = processContent(finalText);
myElement.innerHTML = html;
```

### What gets buffered?

| Delimiter | Waits until it sees |
|-----------|-------------------|
| `$...$` | Closing `$` |
| `$$...$$` | Closing `$$` |
| `\(...\)` | Closing `\)` |
| `\[...\]` | Closing `\]` |
| `\begin{equation}` | Matching `\end{equation}` |

Everything else (plain text, HTML) passes through immediately.

---

## LaTeX to SVG Export

Convert any LaTeX equation to an SVG image you can save, share, or embed.

**Use cases:**
- Save equations as SVG files for presentations or PDFs
- Embed math in emails or static HTML pages (as `<img>` tags)
- Generate shareable math images

### Setup

This feature requires MathJax **SVG output**. Use `tex-svg.js` instead of `tex-mml-chtml.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" async></script>
```

> If you don't need SVG export and only need rendering, `tex-mml-chtml.js` is fine.

### Usage

```ts
import { latexToSvg, latexToDataUrl, latexToHtmlString } from 'latex-content-renderer';

// Get raw SVG string
const svg = await latexToSvg('E = mc^2');
document.getElementById('output').innerHTML = svg;

// Get data URL for <img> tags
const dataUrl = await latexToDataUrl('\\frac{a}{b}');
const img = document.createElement('img');
img.src = dataUrl;  // "data:image/svg+xml;base64,..."

// Get rendered HTML string (needs tex-mml-chtml.js instead)
const html = await latexToHtmlString('x^2 + y^2 = r^2');
```

---

## Accessibility (Screen Reader Support)

Add ARIA labels to rendered math so screen readers can read equations aloud.

**Use cases:**
- Make your education app WCAG compliant
- Help visually impaired students understand math
- Required for government and accessibility-audited projects

### Usage

```ts
import { processContent, addAccessibility } from 'latex-content-renderer';

// Step 1: Process the content normally
const html = processContent('The circle equation: $x^2 + y^2 = r^2$');

// Step 2: Add accessibility attributes
const accessibleHtml = addAccessibility(html);
```

**What it does:**
- Wraps math in `<span role="math" aria-label="x squared plus y squared equals r squared">`
- Converts Greek letters: `$\alpha$` → label says "alpha"
- Converts fractions: `$\frac{a}{b}$` → label says "a over b"
- Adds `role="table"` and `aria-label` to tables
- Adds `role="img"` to chemistry structure diagrams
- Adds alt text to images that don't have one

---

## SMILES Chemistry Formats

8 ways to input chemical structures — all render as 2D molecular diagrams:

| Format | Example | Style |
|--------|---------|-------|
| `<smiles>CCO</smiles>` | XML-style tag | HTML |
| `[smiles]CCO[/smiles]` | BBCode-style tag | Forum |
| `<mol>CCO</mol>` | Molecule tag | HTML |
| `<molecule>CCO</molecule>` | Full molecule tag | HTML |
| `<chem>CCO</chem>` | Chemistry tag | HTML |
| `<reaction>CCO</reaction>` | Reaction tag | HTML |
| `\smiles{CCO}` | LaTeX command | LaTeX |
| `SMILES: CCO` | Labeled (on its own line) | Plain text |

To enable SMILES rendering, add SmilesDrawer to your HTML:

```html
<script src="https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js"></script>
```

---

## Full API Reference

### Components

| Component | Platform | Import |
|-----------|----------|--------|
| `SciContent` | React web | `import { SciContent } from 'latex-content-renderer'` |
| `SciContentNative` | React Native | `import { SciContentNative } from 'latex-content-renderer/native'` |
| `SciContentStreaming` | React web (AI) | `import { SciContentStreaming } from 'latex-content-renderer'` |

### Functions

| Function | What it does |
|----------|-------------|
| `processContent(text, opts?)` | Convert LaTeX string → HTML string |
| `getHtml(text, opts?)` | Get complete HTML page for WebViews |
| `addAccessibility(html, opts?)` | Add ARIA labels to processed HTML |
| `createStreamingState()` | Create streaming buffer for AI responses |
| `feedChunk(state, chunk)` | Feed a chunk, get safe-to-render text back |
| `flushStream(state)` | Get all remaining buffered text |
| `latexToSvg(tex, opts?)` | LaTeX → SVG string (needs tex-svg.js) |
| `latexToHtmlString(tex, opts?)` | LaTeX → rendered HTML string |
| `latexToDataUrl(tex, opts?)` | LaTeX → base64 data URL |

---

## Changelog

### v1.1.3

- **`\smiles{...}` format** — Added LaTeX-style `\smiles{CCO}` as Format 8 for SMILES molecular input
- **CDN `render()` now auto-renders SMILES** — No manual call to `renderSmilesInContainer()` needed
- **MathJax skip fix** — MathJax no longer tries to process code blocks and input fields
- **Line break support** — `\par` now correctly renders as paragraph breaks

### v1.1.0

- **AI Streaming support** — Buffer incomplete math during LLM streaming. New `SciContentStreaming` component + `createStreamingState`/`feedChunk`/`flushStream` API
- **SVG export** — `latexToSvg()`, `latexToHtmlString()`, `latexToDataUrl()` to convert equations to images
- **Accessibility** — `addAccessibility()` adds ARIA labels and screen-reader descriptions

### v1.0.1

- Fixed MathJax equations inheriting wrong color
- Improved SMILES rendering reliability
- Added `skipProcessing` option

### v1.0.0

- Initial release: LaTeX math, chemistry (SMILES + mhchem), tables, figures, lists, text formatting
- React web + React Native + universal `getHtml()`

---

## Contributing

1. Fork: [github.com/sandipan-das-sd/latex-content-renderer](https://github.com/sandipan-das-sd/latex-content-renderer)
2. Branch: `git checkout -b feature/my-feature`
3. Commit and open a Pull Request

Questions? Email: [dsandipan3002@gmail.com](mailto:dsandipan3002@gmail.com)

---

## Support the Project

| Method | Details |
|--------|---------|
| **UPI (India)** | `dsandipan3002@gmail.com` via GPay / PhonePe / Paytm |
| **PayPal** | [paypal.me/sandipandas3002](https://paypal.me/sandipandas3002) |
| **GitHub** | Star the repo ⭐ |

---

## Author

**Sandipan Das** — [@sandipan-das-sd](https://github.com/sandipan-das-sd) · [dsandipan3002@gmail.com](mailto:dsandipan3002@gmail.com)

## License

MIT — free for personal and commercial use.

![equation](https://latex.codecogs.com/png.image?\dpi{120}x=\frac{-b\pm\sqrt{b^2-4ac}}{2a})

# latex-content-renderer

<p align="center">
  <img src="https://img.shields.io/npm/v/latex-content-renderer?color=%2338bdf8&style=for-the-badge" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/latex-content-renderer?color=%2322c55e&style=for-the-badge" alt="downloads" />
  <img src="https://img.shields.io/npm/l/latex-content-renderer?color=%23f59e0b&style=for-the-badge" alt="license" />
  <img src="https://img.shields.io/badge/platforms-React%20%7C%20RN%20%7C%20Flutter%20%7C%20Android%20%7C%20iOS-blueviolet?style=for-the-badge" alt="platforms" />
</p>

> **One package to render LaTeX math, chemistry (SMILES / mhchem), tables, figures, and formatted text — on every platform.**

Works with **React**, **React Native (Expo)**, **Flutter**, **Android WebView**, **iOS WKWebView**, and anything that can render HTML.

Powered by [MathJax 3](https://www.mathjax.org/) + [SmilesDrawer](https://github.com/reymond-group/smilesDrawer).

---

## What does this package do?

You give it a string containing LaTeX, math, chemistry, or formatted text — it converts it to beautiful rendered HTML.

```
Input:  "The quadratic formula: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$"
Output: Beautiful rendered math equation in the browser
```

**No setup hassle.** No MathJax configuration. No boilerplate. Just import and use.

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

7 ways to input chemical structures — all render as 2D molecular diagrams:

| Format | Example |
|--------|---------|
| `<smiles>CCO</smiles>` | XML-style tag |
| `[smiles]CCO[/smiles]` | BBCode-style tag |
| `<mol>CCO</mol>` | Molecule tag |
| `<molecule>CCO</molecule>` | Full molecule tag |
| `<chem>CCO</chem>` | Chemistry tag |
| `\smiles{CCO}` | LaTeX command |
| `SMILES: CCO` | Labeled (on its own line) |

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

1. Fork: [github.com/sandipan-das-sd/scirender](https://github.com/sandipan-das-sd/scirender)
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

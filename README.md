# latex-content-renderer

<p align="center">
  <img src="https://img.shields.io/npm/v/latex-content-renderer?color=%2338bdf8&style=for-the-badge" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/latex-content-renderer?color=%2322c55e&style=for-the-badge" alt="downloads" />
  <img src="https://img.shields.io/npm/l/latex-content-renderer?color=%23f59e0b&style=for-the-badge" alt="license" />
  <img src="https://img.shields.io/badge/platforms-React%20%7C%20RN%20%7C%20Flutter%20%7C%20Android%20%7C%20iOS-blueviolet?style=for-the-badge" alt="platforms" />
</p>

<p align="center">
  <b>Universal LaTeX, math, and chemistry (SMILES / mhchem) content renderer for any platform.</b><br/>
  One package. Every platform. Beautiful scientific content — everywhere.
</p>

<p align="center">
  Works with <b>React</b>, <b>React Native (Expo)</b>, <b>Flutter</b>, <b>Android WebView</b>, <b>iOS WKWebView</b>, and any environment that can render HTML.
</p>

<p align="center">
  Powered by <a href="https://www.mathjax.org/">MathJax 3</a> and <a href="https://github.com/reymond-group/smilesDrawer">SmilesDrawer</a>.
</p>

---

## Why latex-content-renderer?

| Problem | Solution |
|---------|----------|
| MathJax setup is painful across platforms | **One import** — works everywhere |
| Chemistry SMILES rendering requires boilerplate | **7 input formats**, auto-rendered as 2D structures |
| React Native can't render LaTeX natively | **WebView component** with auto-height sizing |
| Flutter/Android/iOS need custom WebView HTML | **`getHtml()`** gives you a complete, self-contained page |
| mhchem, tables, figures, lists — all need separate handling | **All built-in** — just pass your content string |

---

## Features

- **LaTeX math** — inline (`$...$`, `\(...\)`) and display (`$$...$$`, `\[...\]`)
- **Chemistry** — SMILES molecular structures (7 input formats), `\ce{}` (mhchem), `\chemfig{}`, `\lewis{}{}`, `\bond{}`, `\ch{}`
- **Tables** — `\begin{tabular}` → HTML tables with border support
- **Figures** — `\includegraphics`, `\begin{figure}` with captions
- **Lists** — `\begin{enumerate}`, `\begin{itemize}`
- **Text formatting** — `\textbf`, `\textit`, `\underline`, `\textcolor`, `\colorbox`, `\textsc`, etc.
- **Spacing** — `\quad`, `\hspace`, `\vspace`, `\newline`, `\par`
- **Markdown images** — `![alt](url)` syntax
- **Currency protection** — `$100` won't be treated as math
- **Self-sizing** — Native WebView auto-resizes to content height
- **Theme support** — Light & dark modes with full color control
- **Skip processing** — Pass pre-processed HTML with `skipProcessing: true`

---

## Quick Start

```bash
npm install latex-content-renderer
```

```tsx
import { SciContent } from 'latex-content-renderer';

<SciContent content="The quadratic formula: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$" />
```

That's it. Math renders beautifully.

---

## Usage

### 1. React (Next.js / Vite / CRA)

Add MathJax CDN to your HTML head (or Next.js `_document` / `layout.tsx`):

```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
<!-- Optional: for chemistry SMILES structures -->
<script src="https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js"></script>
```

Then use the component:

```tsx
import { SciContent } from 'latex-content-renderer';

function MyPage() {
  return (
    <SciContent
      content="Find the roots of $x^2 - 5x + 6 = 0$"
      className="my-content"
    />
  );
}
```

### 2. React Native (Expo / bare RN)

Install the peer dependency:

```bash
npm install react-native-webview
```

```tsx
import { SciContentNative } from 'latex-content-renderer/native';

function MyScreen() {
  return (
    <SciContentNative
      content="The structure of ethanol: <smiles>CCO</smiles>"
      theme="dark"
      fontSize={16}
    />
  );
}
```

### 3. Flutter / Android / iOS / iframe

Use `getHtml()` to generate a self-contained HTML string:

```ts
import { getHtml } from 'latex-content-renderer';

const html = getHtml('Evaluate $$\\int_0^1 x^2 \\, dx$$', {
  theme: 'light',
  fontSize: 18,
});

// Load this HTML string in any WebView:
// Flutter: WebView(html: html)
// Android: webView.loadDataWithBaseURL(null, html, "text/html", "utf-8", null)
// iOS: webView.loadHTMLString(html, baseURL: nil)
```

### 4. Core processor only (no React)

```ts
import { processContent } from 'latex-content-renderer';

const html = processContent('Solve $\\frac{d}{dx} x^n = nx^{n-1}$');
// Returns processed HTML string (still needs MathJax to typeset in browser)
```

---

## Supported SMILES Formats

All 7 formats are supported for chemical structure input:

| Format | Example |
|--------|---------|
| `<smiles>CCO</smiles>` | XML-style |
| `[smiles]CCO[/smiles]` | BBCode-style |
| `<mol>CCO</mol>` | Molecule tag |
| `<molecule>CCO</molecule>` | Full molecule tag |
| `<chem>CCO</chem>` | Chemistry tag |
| `<reaction>CC>>CO</reaction>` | Reaction tag |
| `SMILES: CCO` | Labeled (own line) |

---

## Supported Chemistry Commands

| Command | Output |
|---------|--------|
| `\ce{H2O}` | Chemical formula (mhchem) |
| `\ch{H2SO4}` | chemformula → mhchem |
| `\chemfig{...}` | Structure placeholder |
| `\lewis{dots}{atom}` | Lewis dot notation |
| `\bond{single\|double\|triple}` | Bond symbols |
| `\arrow` | Reaction arrow → |
| `\begin{reaction}...\end{reaction}` | Reaction environment |
| `\begin{scheme}...\end{scheme}` | Scheme environment |

---

## API Reference

### `SciContent` (React web component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | required | Content with LaTeX/SMILES/etc |
| `className` | `string` | `''` | CSS class names |
| `style` | `CSSProperties` | — | Inline styles |
| `enableSmiles` | `boolean` | `true` | Enable SMILES rendering |
| `enableImages` | `boolean` | `true` | Enable image conversion |
| `enableTables` | `boolean` | `true` | Enable table conversion |

### `SciContentNative` (React Native component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | required | Content with LaTeX/SMILES/etc |
| `theme` | `'light' \| 'dark'` | `'dark'` | Color theme |
| `fontSize` | `number` | `16` | Base font size |
| `minHeight` | `number` | `100` | Minimum WebView height |
| `scrollEnabled` | `boolean` | `false` | Enable scroll inside WebView |
| `customCss` | `string` | — | Extra CSS to inject |

### `getHtml(content, options?)` → `string`

Returns a complete HTML document string. Options same as `SciContentNative` plus:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Page title |
| `mathjaxUrl` | `string` | CDN | Custom MathJax URL |
| `smilesDrawerUrl` | `string` | unpkg | Custom SmilesDrawer URL |
| `skipProcessing` | `boolean` | `false` | Skip `processContent` call (use when content is already processed HTML) |

### `processContent(text, options?)` → `string`

Pure function. Converts LaTeX markup to HTML. Does NOT typeset math — you still need MathJax in the browser.

---

## Changelog

### v1.0.1
- Fixed MathJax equation rendering — equations now inherit parent color instead of hardcoded white
- Improved SMILES rendering with full 3-method cascade (SmiDrawer.apply → instance draw → v1 canvas fallback)
- Added `skipProcessing` option to `getHtml()` for pre-processed content
- Fixed double-processing bug when using `getHtml()` with already-processed content

### v1.0.0
- Initial release with full LaTeX, math, chemistry, SMILES, tables, lists, and formatting support
- React web component (`SciContent`), React Native component (`SciContentNative`), and universal `getHtml()` generator

---

## Contributing

We welcome contributions of all kinds — bug fixes, new features, documentation improvements, translations, and more.

**How to contribute:**

1. Fork the repository: [github.com/sandipan-das-sd/scirender](https://github.com/sandipan-das-sd/scirender)
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push and open a Pull Request

For questions, ideas, or collaboration proposals — reach out directly:

> **Email:** [dsandipan3002@gmail.com](mailto:dsandipan3002@gmail.com)

---

## Support the Project

If **latex-content-renderer** saves you time or helps your product, consider supporting its development. Your contribution — however small — helps keep the project maintained, documented, and growing.

### How to Support

| Method | Details |
|--------|---------|
| **UPI (India)** | Send to **dsandipan3002@gmail.com** via any UPI app (GPay, PhonePe, Paytm) |
| **PayPal** | [paypal.me/sandipandas3002](https://paypal.me/sandipandas3002) |
| **GitHub Sponsors** | Star the repo ⭐ and consider sponsoring on GitHub |
| **Hire / Collaborate** | Need custom scientific rendering, EdTech integration, or a dedicated feature? **Let's talk.** |

> For **any type of contribution, payment, or collaboration** — email me at:
>
> 📧 **[dsandipan3002@gmail.com](mailto:dsandipan3002@gmail.com)**

### Other ways to help

- ⭐ **Star the repo** — it helps others discover the package
- 🐛 **Report bugs** — [open an issue](https://github.com/sandipan-das-sd/scirender/issues)
- 📖 **Improve docs** — PRs for better examples are always welcome
- 📣 **Spread the word** — share with your team, blog about it, tweet about it

---

## Author

**Sandipan Das**
- GitHub: [@sandipan-das-sd](https://github.com/sandipan-das-sd)
- npm: [dev_sandipan](https://www.npmjs.com/~dev_sandipan)
- Email: [dsandipan3002@gmail.com](mailto:dsandipan3002@gmail.com)

---

## License

MIT — free for personal and commercial use.

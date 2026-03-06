/**
 * latex-content-renderer — CDN / Browser global entry point
 *
 * This build creates window.LatexRenderer with all core functions.
 * No React dependency — works in any HTML page with a <script> tag.
 *
 * Auto-injects MathJax 3 + SmilesDrawer if not already loaded.
 */

// Auto-inject MathJax if not present
if (typeof window !== 'undefined') {
  if (!(window as any).MathJax) {
    // Configure MathJax before loading
    (window as any).MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        packages: { '[+]': ['ams', 'boldsymbol', 'html', 'mhchem'] },
      },
      loader: { load: ['[tex]/ams', '[tex]/boldsymbol', '[tex]/html', '[tex]/mhchem'] },
      options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'] },
    };
    const mjScript = document.createElement('script');
    mjScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    mjScript.async = true;
    mjScript.id = 'MathJax-script';
    document.head.appendChild(mjScript);
  }

  // Auto-inject SmilesDrawer if not present
  if (!(window as any).SmiDrawer && !(window as any).SmilesDrawer) {
    const sdScript = document.createElement('script');
    sdScript.src = 'https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js';
    sdScript.async = true;
    document.head.appendChild(sdScript);
  }
}

export { processContent } from './processContent';
export type { ProcessOptions } from './processContent';

export { getHtml } from './getHtml';
export type { GetHtmlOptions } from './getHtml';

export { webStyles, nativeStyles } from './styles';

export { renderSmilesInContainer } from './smiles';

export {
  createStreamingState,
  feedChunk,
  flushStream,
} from './streaming';
export type { StreamingState } from './streaming';

export { addAccessibility } from './accessibility';
export type { A11yOptions } from './accessibility';

export { latexToSvg, latexToHtmlString, latexToDataUrl } from './export';
export type { ExportOptions } from './export';

import { processContent as _processContent } from './processContent';
import type { ProcessOptions } from './processContent';
import { renderSmilesInContainer as _renderSmiles } from './smiles';

/**
 * Convenience: process content AND auto-typeset MathJax on an element.
 * One call does everything — no need to manually call MathJax.
 *
 * ```js
 * LatexRenderer.render('#output', 'The formula: $E = mc^2$');
 * ```
 */
export function render(
  selectorOrElement: string | HTMLElement,
  content: string,
  options?: ProcessOptions
): void {
  const el =
    typeof selectorOrElement === 'string'
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;
  if (!el) return;

  (el as HTMLElement).innerHTML = _processContent(content, options);

  // Auto-render SMILES structures
  _renderSmiles(el as HTMLElement).catch(() => {});

  // Auto-typeset with MathJax when ready
  const mj = (window as any).MathJax;
  if (mj?.typesetPromise) {
    mj.typesetPromise([el]).catch(() => {});
  } else {
    // MathJax still loading — wait and retry
    const check = setInterval(() => {
      const m = (window as any).MathJax;
      if (m?.typesetPromise) {
        clearInterval(check);
        m.typesetPromise([el]).catch(() => {});
      }
    }, 100);
    setTimeout(() => clearInterval(check), 15000);
  }
}

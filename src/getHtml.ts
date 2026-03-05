/**
 * latex-content-renderer — Standalone HTML generator
 *
 * Generates a complete, self-contained HTML document that renders LaTeX (via MathJax CDN),
 * SMILES chemistry (via SmilesDrawer CDN), tables, figures, and all supported formats.
 *
 * Use this for: Flutter WebView, Android WebView, iOS WKWebView, Electron, iframe —
 * any platform that can render an HTML string.
 */

import { processContent, ProcessOptions } from './processContent';
import { nativeStyles } from './styles';

export interface GetHtmlOptions extends ProcessOptions {
  /** Page title (default: '') */
  title?: string;
  /** Text color (default: '#ffffff') */
  textColor?: string;
  /** Background color (default: 'transparent') */
  backgroundColor?: string;
  /** Font size in px (default: 16) */
  fontSize?: number;
  /** Custom CSS to inject */
  customCss?: string;
  /** MathJax CDN URL (default: official CDN) */
  mathjaxUrl?: string;
  /** SmilesDrawer CDN URL (default: unpkg v2.0.1) */
  smilesDrawerUrl?: string;
  /**
   * Theme: 'light' | 'dark' (default: 'dark')
   * - light: black text on white/transparent background
   * - dark: white text on transparent background
   */
  theme?: 'light' | 'dark';
  /** Skip processContent call — use when content is already processed HTML (default: false) */
  skipProcessing?: boolean;
}

export function getHtml(content: string, options: GetHtmlOptions = {}): string {
  const {
    title = '',
    textColor,
    backgroundColor = 'transparent',
    fontSize = 16,
    customCss = '',
    mathjaxUrl = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
    smilesDrawerUrl = 'https://unpkg.com/smiles-drawer@2.0.1/dist/smiles-drawer.min.js',
    theme = 'dark',
    skipProcessing = false,
    ...processOptions
  } = options;

  const resolvedTextColor = textColor || (theme === 'dark' ? '#ffffff' : '#1a1a1a');
  const processed = skipProcessing ? content : processContent(content, processOptions);

  // Sanitize LaTeX to prevent MathJax stack overflow
  const sanitizedContent = sanitizeLatex(processed);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  ${title ? `<title>${escapeHtml(title)}</title>` : ''}
  <script>
    window.MathJax = {
      loader: {
        load: ['[tex]/ams', '[tex]/boldsymbol', '[tex]/html', '[tex]/mhchem']
      },
      tex: {
        packages: {'[+]': ['ams', 'boldsymbol', 'html', 'mhchem']},
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true,
        processEnvironments: true,
        macros: {
          boldsymbol: ['\\\\boldsymbol{#1}', 1]
        }
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
      },
      startup: {
        pageReady: () => {
          return MathJax.startup.defaultPageReady().then(() => {
            const images = document.querySelectorAll('img');
            const imagePromises = Array.from(images).map(img => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 3000);
              });
            });
            Promise.all(imagePromises).then(() => {
              setTimeout(() => {
                const height = document.body.scrollHeight;
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
                }
                // For Flutter & other WebView bridges
                if (window.FlutterChannel) {
                  window.FlutterChannel.postMessage(JSON.stringify({ height }));
                }
              }, 300);
            });
          }).catch((err) => {
            console.error('MathJax error:', err);
            setTimeout(() => {
              const height = document.body.scrollHeight;
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ height }));
              }
            }, 300);
          });
        }
      }
    };

    // Catch MathJax stack overflow errors
    window.addEventListener('error', function(event) {
      if (event.message && (
        event.message.includes('Maximum call stack') ||
        event.message.includes('tex-svg') ||
        event.message.includes('MathJax')
      )) {
        event.preventDefault();
        return false;
      }
    });
  </script>
  <script src="${escapeHtml(mathjaxUrl)}" id="MathJax-script" async></script>
  <script src="${escapeHtml(smilesDrawerUrl)}"></script>
  <script>
    // Full 3-method SMILES rendering cascade (matches MathContent.tsx)
    window.addEventListener('load', function() {
      setTimeout(function() {
        var elements = document.querySelectorAll('img[data-smiles], svg[data-smiles]');
        if (elements.length === 0) return;

        var SD = (typeof SmiDrawer !== 'undefined') ? SmiDrawer : null;

        function showFallback(el, smiles) {
          var parent = el.parentElement;
          if (parent) {
            parent.innerHTML = '<code style="font-size:0.9em;padding:4px 8px;border:1px dashed currentColor;border-radius:4px;display:inline-block">' + smiles + '</code>';
          }
        }

        // Method 1: SmiDrawer.apply() (v2 recommended)
        if (SD) {
          try {
            SD.apply();
            setTimeout(function() {
              var allOk = true;
              elements.forEach(function(el) {
                if (el.tagName === 'IMG') {
                  if (!el.src || el.src === window.location.href || el.naturalWidth === 0) allOk = false;
                } else if (el.tagName === 'SVG' || el.tagName === 'svg') {
                  if (!el.innerHTML || el.innerHTML.trim() === '') allOk = false;
                }
              });
              if (allOk) return;
              tryMethod2();
            }, 400);
            return;
          } catch(e) {}
        }
        tryMethod2();

        // Method 2: new SmiDrawer instance + draw() per element
        function tryMethod2() {
          if (!SD) { tryMethod3(); return; }
          try {
            var sd = new SD({
              bondThickness: 1.0, bondLength: 15, shortBondLength: 0.85,
              fontSizeLarge: 6, fontSizeSmall: 4, padding: 20,
              explicitHydrogens: false, terminalCarbons: false, compactDrawing: true
            }, {});
            elements.forEach(function(el) {
              var smiles = el.getAttribute('data-smiles');
              if (!smiles) return;
              try { sd.draw(smiles, '#' + el.id, 'light'); }
              catch(e) { showFallback(el, smiles); }
            });
            return;
          } catch(e) {}
          tryMethod3();
        }

        // Method 3: v1 fallback (canvas-based)
        function tryMethod3() {
          var SDv1 = (typeof SmilesDrawer !== 'undefined') ? SmilesDrawer : null;
          if (SDv1 && SDv1.parse) {
            elements.forEach(function(el) {
              var smiles = el.getAttribute('data-smiles');
              if (!smiles || !el.parentElement) return;
              var canvas = document.createElement('canvas');
              canvas.width = 280; canvas.height = 200;
              canvas.style.cssText = 'max-width:100%;border-radius:6px;background:#fff';
              el.parentElement.replaceChild(canvas, el);
              SDv1.parse(smiles, function(tree) {
                new SDv1.Drawer({ width: 280, height: 200, bondThickness: 1 })
                  .draw(tree, canvas, '${theme}', false);
              }, function() { showFallback(canvas, smiles); });
            });
          } else {
            elements.forEach(function(el) {
              showFallback(el, el.getAttribute('data-smiles') || '');
            });
          }
        }
      }, 800);
    });
  </script>
  <style>
    ${nativeStyles}
    body {
      color: ${resolvedTextColor};
      background: ${backgroundColor};
      font-size: ${fontSize}px;
    }
    ${theme === 'light' ? `strong { color: #1a1a1a; }` : ''}
    ${customCss}
  </style>
</head>
<body>
  <div class="scirender-content">${sanitizedContent}</div>
</body>
</html>`;
}

// ─── Helpers ───

function sanitizeLatex(text: string): string {
  let sanitized = text;
  sanitized = sanitized.replace(/\$\\und$/g, '$');
  sanitized = sanitized.replace(/\$\\underl$/g, '$');
  sanitized = sanitized.replace(/\$\\underli$/g, '$');
  sanitized = sanitized.replace(/\$\\underlin$/g, '$');
  sanitized = sanitized.replace(/\\$/g, '');
  return sanitized;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

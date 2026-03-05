/**
 * scirender — CSS styles
 *
 * Provides CSS strings for web and native (WebView) rendering.
 * Web component injects these automatically. For standalone HTML (getHtml),
 * they are embedded in the <style> tag.
 */

/** CSS for web (injected into DOM by SciContent component) */
export const webStyles = `
/* ─── MathJax accessibility / screen-reader elements ─── */
.MathJax_Accessibility,
[id^="MJX-"][id$="-Ax"] {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  left: -9999px !important;
}

/* ─── Inline math ─── */
mjx-container[jax="SVG"][display="false"] {
  display: inline !important;
  margin: 0 0.15em !important;
  vertical-align: middle !important;
}

/* ─── Display math (block) ─── */
mjx-container[jax="SVG"][display="true"] {
  display: block !important;
  text-align: center !important;
  margin: 1em 0 !important;
}

/* ─── Images ─── */
.scirender-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
@media (min-width: 768px) {
  .scirender-image {
    max-width: 80%;
  }
}

/* ─── LaTeX tabular → HTML table ─── */
table {
  font-size: 0.95em;
  line-height: 1.5;
  color: inherit;
}
table td {
  vertical-align: middle;
  white-space: nowrap;
}
@media (max-width: 640px) {
  table {
    font-size: 0.85em;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  table td {
    padding: 4px 8px !important;
  }
}

/* ─── SMILES chemical structures ─── */
.scirender-smiles {
  display: inline-block;
  margin: 0.3em 0;
  background: #ffffff;
  border-radius: 10px;
  padding: 8px 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.scirender-smiles img,
.scirender-smiles svg,
.scirender-smiles canvas {
  border-radius: 6px;
  max-width: 280px;
  height: auto;
  display: block;
}
.scirender-smiles-reaction {
  max-width: 100%;
}
.scirender-smiles-reaction svg {
  max-width: 500px;
  width: 100%;
  height: auto;
  min-height: 150px;
}

/* ─── Chemistry structure fallback ─── */
.scirender-chem-struct {
  font-family: monospace;
  word-break: break-all;
}
`;

/** CSS for React Native WebView (dark theme, mobile-optimized) */
export const nativeStyles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: transparent;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  padding: 4px;
  overflow: visible;
}
.scirender-content {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}
mjx-container {
  color: inherit !important;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 193, 7, 0.5) rgba(255, 255, 255, 0.1);
}
mjx-container::-webkit-scrollbar { height: 6px; }
mjx-container::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 3px; }
mjx-container::-webkit-scrollbar-thumb { background: rgba(255,193,7,0.5); border-radius: 3px; }
mjx-container::-webkit-scrollbar-thumb:hover { background: rgba(255,193,7,0.8); }
mjx-container * { color: inherit !important; }
mjx-container[display="block"] {
  margin: 6px 0;
  max-width: 100%;
  overflow-x: auto;
}
img {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  display: block !important;
  border-radius: 8px;
  margin: 12px 0;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  min-height: 100px;
}
img[src] { opacity: 1; }
img:not([src]) { display: none !important; }
strong {
  font-weight: bold;
  font-size: 14px;
  color: #FFC107;
  display: block;
  margin: 4px 0;
}
.scirender-smiles {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 12px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px;
}
.scirender-smiles canvas {
  max-width: 300px;
  height: 200px;
  border-radius: 4px;
}
`;

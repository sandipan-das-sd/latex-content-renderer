/**
 * scirender — Core content processor
 *
 * Pure-function text processing engine. Converts LaTeX markup, SMILES chemistry
 * notation, tables, figures, lists, and formatting commands into renderable HTML.
 * No framework dependency — works anywhere.
 */

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

export interface ProcessOptions {
  /** Prefix for generated SMILES element IDs (default: 'smiles') */
  smilesIdPrefix?: string;
  /** Enable SMILES chemistry rendering (default: true) */
  enableSmiles?: boolean;
  /** Enable LaTeX figure/image conversion (default: true) */
  enableImages?: boolean;
  /** Enable LaTeX table conversion (default: true) */
  enableTables?: boolean;
  /** Enable markdown image conversion (default: true) */
  enableMarkdownImages?: boolean;
}

// ─────────────────────────────────────────────────────
// Main processor
// ─────────────────────────────────────────────────────

let globalSmilesCounter = 0;

export function processContent(text: string, options: ProcessOptions = {}): string {
  if (!text) return '';

  const {
    smilesIdPrefix = 'smiles',
    enableSmiles = true,
    enableImages = true,
    enableTables = true,
    enableMarkdownImages = true,
  } = options;

  let processed = text;

  // ─── 0. Protect math-mode blocks so we don't mangle them ───
  const mathBlocks: string[] = [];
  const saveMath = (m: string) => {
    const idx = mathBlocks.length;
    mathBlocks.push(m);
    return `__MATH_${idx}__`;
  };

  // display math $$...$$ and \[...\]
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (m) => saveMath(m));
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (m) => saveMath(m));
  // inline math $...$ and \(...\)
  processed = processed.replace(/\$([^$]+?)\$/g, (m) => saveMath(m));
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (m) => saveMath(m));

  // ─── 0b. Chemistry: SMILES / chemical notation ───
  if (enableSmiles) {
    processed = processSmiles(processed, smilesIdPrefix);
  }
  processed = processChemistryCommands(processed);

  // ─── 1. LaTeX figure / includegraphics → <img> ───
  if (enableImages) {
    processed = processImages(processed);
  }

  // ─── 2. LaTeX tabular / array → HTML table ───
  if (enableTables) {
    processed = convertLatexTablesToHtml(processed);
  }
  // \begin{array}...\end{array}
  processed = processed.replace(
    /\\begin\{array\}\{([^}]*)\}([\s\S]*?)\\end\{array\}/g,
    (_m: string, colSpec: string, body: string) => {
      return `$$\\begin{array}{${colSpec}}${body}\\end{array}$$`;
    }
  );

  // ─── 3. LaTeX list environments → HTML lists ───
  processed = processLists(processed);

  // ─── 4. Remove stray LaTeX commands that produce nothing visual ───
  processed = cleanStrayCommands(processed);

  // ─── 5. Text formatting commands ───
  processed = processTextFormatting(processed);

  // ─── 6. Spacing & line break commands ───
  processed = processSpacing(processed);

  // ─── 7. Size commands (strip, MathJax handles math-mode sizes) ───
  processed = processed.replace(
    /\\(tiny|scriptsize|footnotesize|small|normalsize|large|Large|LARGE|huge|Huge)\b/g,
    ''
  );

  // ─── 8. Remove leftover \begin{...} / \end{...} for unknown environments ───
  processed = processed.replace(/\\begin\{[^}]*\}/g, '');
  processed = processed.replace(/\\end\{[^}]*\}/g, '');

  // ─── 9. Misc LaTeX commands ───
  processed = cleanMiscCommands(processed);

  // ─── 10. Currency protection ───
  const currencyPlaceholders: string[] = [];
  processed = processed.replace(/\$(\d+(?:\.\d+)?)/g, (match) => {
    const index = currencyPlaceholders.length;
    currencyPlaceholders.push(match);
    return `__CURRENCY_${index}__`;
  });

  // Convert markdown images to HTML
  if (enableMarkdownImages) {
    processed = processed.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="scirender-image" loading="lazy" />'
    );
  }

  // ─── 11. Newline handling (preserve inside HTML blocks) ───
  processed = processed.replace(
    /(<(?:table|figure|ol|ul|div)[\s\S]*?<\/(?:table|figure|ol|ul|div)>)/g,
    (block) => block.replace(/\n/g, '__HTML_NL__')
  );
  processed = processed.replace(/\n/g, ' ');
  processed = processed.replace(/__HTML_NL__/g, '\n');

  // Clean up multiple spaces (but not inside HTML blocks)
  processed = processed.replace(
    /(<(?:table|figure|ol|ul|div)[\s\S]*?<\/(?:table|figure|ol|ul|div)>)|(\s{2,})/g,
    (match, htmlBlock) => (htmlBlock ? htmlBlock : ' ')
  );

  // ─── 12. Restore placeholders ───
  currencyPlaceholders.forEach((currency, index) => {
    processed = processed.replace(`__CURRENCY_${index}__`, currency);
  });
  mathBlocks.forEach((block, index) => {
    processed = processed.replace(`__MATH_${index}__`, block);
  });

  return processed.trim();
}

// ─────────────────────────────────────────────────────
// SMILES processing (all 7 formats)
// ─────────────────────────────────────────────────────

function buildSmilesElement(rawSmiles: string, idPrefix: string): string {
  const id = `${idPrefix}-${Date.now()}-${globalSmilesCounter++}`;
  const smilesClean = rawSmiles.trim().replace(/"/g, '&quot;');
  if (!smilesClean) return '';

  const isReaction = /(?:^|\.)([^>]*>[^>]*>[^>]*)/.test(
    smilesClean.replace(/__\{.*?\}__/g, '')
  );

  if (isReaction) {
    return (
      `<div class="scirender-smiles scirender-smiles-reaction">` +
      `<svg id="${id}" data-smiles="${smilesClean}" ` +
      `data-smiles-theme="light" ` +
      `data-smiles-options="{ &quot;width&quot;: 500, &quot;height&quot;: 200 }" ` +
      `style="max-width:100%"></svg></div>`
    );
  } else {
    return (
      `<div class="scirender-smiles">` +
      `<img id="${id}" data-smiles="${smilesClean}" ` +
      `data-smiles-theme="light" ` +
      `data-smiles-options="{ &quot;width&quot;: 280, &quot;height&quot;: 200 }" ` +
      `alt="Chemical structure: ${smilesClean}" /></div>`
    );
  }
}

function processSmiles(text: string, idPrefix: string): string {
  let processed = text;

  // Format 1: <smiles>CC1CCCCC1</smiles>
  processed = processed.replace(/<smiles>([\s\S]*?)<\/smiles>/gi, (_m, s: string) =>
    buildSmilesElement(s, idPrefix)
  );
  // Format 2: [smiles]CC1CCCCC1[/smiles]
  processed = processed.replace(/\[smiles\]([\s\S]*?)\[\/smiles\]/gi, (_m, s: string) =>
    buildSmilesElement(s, idPrefix)
  );
  // Format 3: <mol>CC1CCCCC1</mol>
  processed = processed.replace(/<mol>([\s\S]*?)<\/mol>/gi, (_m, s: string) =>
    buildSmilesElement(s, idPrefix)
  );
  // Format 4: <molecule>CC1CCCCC1</molecule>
  processed = processed.replace(/<molecule>([\s\S]*?)<\/molecule>/gi, (_m, s: string) =>
    buildSmilesElement(s, idPrefix)
  );
  // Format 5: <chem>CC1CCCCC1</chem>
  processed = processed.replace(/<chem>([\s\S]*?)<\/chem>/gi, (_m, s: string) =>
    buildSmilesElement(s, idPrefix)
  );
  // Format 6: <reaction>reactants>reagents>products</reaction>
  processed = processed.replace(/<reaction>([\s\S]*?)<\/reaction>/gi, (_m, s: string) =>
    buildSmilesElement(s, idPrefix)
  );
  // Format 7: SMILES: CC1CCCCC1  (labeled, on its own line)
  processed = processed.replace(/(?:^|\n)\s*SMILES\s*:\s*([^\n]+)/gi, (_m, s: string) =>
    '\n' + buildSmilesElement(s, idPrefix)
  );
  // Format 8: \smiles{CC1CCCCC1}  (LaTeX-style command)
  processed = processed.replace(/\\smiles\{([^}]+)\}/g, (_m, s: string) =>
    buildSmilesElement(s, idPrefix)
  );

  return processed;
}

// ─────────────────────────────────────────────────────
// Chemistry LaTeX commands
// ─────────────────────────────────────────────────────

function processChemistryCommands(text: string): string {
  let processed = text;

  // \chemfig{...}
  processed = processed.replace(
    /\\chemfig\{([^}]*)\}/g,
    (_m, formula: string) =>
      `<span class="scirender-chem-struct" style="display:inline-block;padding:4px 8px;border:1px dashed currentColor;border-radius:4px;font-family:monospace;font-size:0.9em" title="Chemical structure">${formula.trim()}</span>`
  );

  // \lewis{dots}{atom}
  processed = processed.replace(
    /\\lewis\{([^}]*)\}\{([^}]*)\}/g,
    (_m, _dots: string, atom: string) =>
      `<span style="font-weight:bold;letter-spacing:2px" title="Lewis structure">:${atom.trim()}:</span>`
  );

  // \ch{...} (chemformula package) → \ce{} for mhchem
  processed = processed.replace(
    /\\ch\{([^}]*)\}/g,
    (_m, formula: string) => `$\\ce{${formula.trim()}}$`
  );

  // \ce{...} outside of math mode → inline math for MathJax mhchem
  processed = processed.replace(
    /\\ce\{([^}]*)\}/g,
    (_m, formula: string) => `$\\ce{${formula.trim()}}$`
  );

  // \reaction / \Reaction → treat like \ce
  processed = processed.replace(
    /\\[Rr]eaction\{([^}]*)\}/g,
    (_m, formula: string) => `$\\ce{${formula.trim()}}$`
  );

  // \arrow
  processed = processed.replace(/\\arrow\s*\{([^}]*)\}/g, ' → ');
  processed = processed.replace(/\\arrow/g, ' → ');

  // \bond{...}
  processed = processed.replace(/\\bond\{single\}/gi, '–');
  processed = processed.replace(/\\bond\{double\}/gi, '=');
  processed = processed.replace(/\\bond\{triple\}/gi, '≡');
  processed = processed.replace(/\\bond\{([^}]*)\}/g, '–');

  // \begin{reaction}...\end{reaction}
  processed = processed.replace(
    /\\begin\{reaction\}([\s\S]*?)\\end\{reaction\}/g,
    (_m, body: string) => `$$\\ce{${body.trim()}}$$`
  );
  // \begin{scheme}...\end{scheme}
  processed = processed.replace(
    /\\begin\{scheme\}([\s\S]*?)\\end\{scheme\}/g,
    (_m, body: string) => `<div style="text-align:center;margin:0.5em 0">${body.trim()}</div>`
  );

  return processed;
}

// ─────────────────────────────────────────────────────
// Image processing
// ─────────────────────────────────────────────────────

function processImages(text: string): string {
  let processed = text;

  // \begin{figure}...\end{figure}
  processed = processed.replace(
    /\\begin\{figure\}[\s\S]*?\\end\{figure\}/g,
    (block) => {
      let imgUrl = '';
      let alt = '';
      let caption = '';
      const imgMatch = block.match(
        /\\includegraphics\s*(?:\[([^\]]*)\])?\s*\{([^}]+)\}/
      );
      if (imgMatch) {
        const opts = imgMatch[1] || '';
        imgUrl = imgMatch[2];
        const altMatch = opts.match(/alt\s*=\s*\{([^}]*)\}/);
        if (altMatch) alt = altMatch[1];
      }
      const capMatch = block.match(/\\caption\{([^}]*)\}/);
      if (capMatch) caption = capMatch[1];
      if (imgUrl) {
        return `<figure style="text-align:center;margin:1em 0"><img src="${imgUrl}" alt="${alt || caption}" class="scirender-image" loading="lazy" />${caption ? `<figcaption style="margin-top:0.5em;font-size:0.9em;color:inherit;opacity:0.8">${caption}</figcaption>` : ''}</figure>`;
      }
      return '';
    }
  );

  // Standalone \includegraphics
  processed = processed.replace(
    /\\includegraphics\s*(?:\[([^\]]*)\])?\s*\{([^}]+)\}/g,
    (_m, opts = '', url) => {
      let alt = '';
      const altMatch = (opts as string).match(/alt\s*=\s*\{([^}]*)\}/);
      if (altMatch) alt = altMatch[1];
      return `<img src="${url}" alt="${alt}" class="scirender-image" loading="lazy" />`;
    }
  );

  return processed;
}

// ─────────────────────────────────────────────────────
// Table conversion
// ─────────────────────────────────────────────────────

function convertLatexTablesToHtml(text: string): string {
  return text.replace(
    /\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/g,
    (_match: string, colSpec: string, body: string) => {
      const hasBorders = colSpec.includes('|');
      const rawRows = body.split(/\\\\\s*/);
      const borderStyle = hasBorders ? 'border: 1px solid currentColor;' : '';

      let html = `<table style="border-collapse: collapse; margin: 0.5em 0; width: auto; ${borderStyle}">`;

      for (let row of rawRows) {
        row = row.trim();
        if (!row) continue;
        const hasHline = row.includes('\\hline');
        row = row.replace(/\\hline\s*/g, '').trim();
        if (!row) continue;

        const cells = row.split('&').map((c: string) => c.trim());
        html += '<tr>';
        for (const cell of cells) {
          const styles: string[] = ['padding: 6px 12px', 'text-align: left'];
          if (hasBorders) {
            styles.push('border: 1px solid currentColor');
          } else if (hasHline) {
            styles.push(
              'border-top: 1px solid currentColor',
              'border-bottom: 1px solid currentColor'
            );
          }
          html += `<td style="${styles.join('; ')}">${cell}</td>`;
        }
        html += '</tr>';
      }

      html += '</table>';
      return html;
    }
  );
}

// ─────────────────────────────────────────────────────
// List processing
// ─────────────────────────────────────────────────────

function processLists(text: string): string {
  let processed = text;

  processed = processed.replace(
    /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
    (_m, body) => {
      const items = (body as string).split(/\\item\s*/).filter((s: string) => s.trim());
      return (
        '<ol style="margin:0.5em 0;padding-left:1.5em">' +
        items.map((it: string) => `<li>${it.trim()}</li>`).join('') +
        '</ol>'
      );
    }
  );

  processed = processed.replace(
    /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
    (_m, body) => {
      const items = (body as string).split(/\\item\s*/).filter((s: string) => s.trim());
      return (
        '<ul style="margin:0.5em 0;padding-left:1.5em">' +
        items.map((it: string) => `<li>${it.trim()}</li>`).join('') +
        '</ul>'
      );
    }
  );

  processed = processed.replace(/\\item\s*/g, '<br/>• ');

  return processed;
}

// ─────────────────────────────────────────────────────
// Stray command cleanup
// ─────────────────────────────────────────────────────

function cleanStrayCommands(text: string): string {
  let processed = text;
  processed = processed.replace(/\\captionsetup\{[^}]*\}/g, '');
  processed = processed.replace(/\\centering/g, '');
  processed = processed.replace(/\\label\{[^}]*\}/g, '');
  processed = processed.replace(/\\caption\{([^}]*)\}/g, '<em>$1</em>');
  processed = processed.replace(
    /\\begin\{center\}([\s\S]*?)\\end\{center\}/g,
    '<div style="text-align:center">$1</div>'
  );
  return processed;
}

// ─────────────────────────────────────────────────────
// Text formatting
// ─────────────────────────────────────────────────────

function processTextFormatting(text: string): string {
  let processed = text;
  processed = processed.replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>');
  processed = processed.replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>');
  processed = processed.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');
  processed = processed.replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>');
  processed = processed.replace(/\\texttt\{([^}]*)\}/g, '<code>$1</code>');
  processed = processed.replace(/\\text\{([^}]*)\}/g, '$1');
  processed = processed.replace(/\\textrm\{([^}]*)\}/g, '$1');
  processed = processed.replace(/\\textsf\{([^}]*)\}/g, '$1');
  processed = processed.replace(
    /\\textsc\{([^}]*)\}/g,
    '<span style="font-variant:small-caps">$1</span>'
  );
  processed = processed.replace(
    /\\textcolor\{([^}]*)\}\{([^}]*)\}/g,
    '<span style="color:$1">$2</span>'
  );
  processed = processed.replace(
    /\\colorbox\{([^}]*)\}\{([^}]*)\}/g,
    '<span style="background:$1;padding:2px 4px;border-radius:2px">$2</span>'
  );
  return processed;
}

// ─────────────────────────────────────────────────────
// Spacing & line break commands
// ─────────────────────────────────────────────────────

function processSpacing(text: string): string {
  let processed = text;
  processed = processed.replace(/\\hspace\*?\{[^}]*\}/g, '&nbsp;&nbsp;');
  processed = processed.replace(/\\vspace\*?\{[^}]*\}/g, '<br/>');
  processed = processed.replace(/\\newline/g, '<br/>');
  processed = processed.replace(/\\linebreak/g, '<br/>');
  processed = processed.replace(/\\par\b/g, '<br/><br/>');
  processed = processed.replace(/\\noindent\b/g, '');
  processed = processed.replace(/\\quad/g, '&emsp;');
  processed = processed.replace(/\\qquad/g, '&emsp;&emsp;');
  processed = processed.replace(/\\,/g, '&thinsp;');
  processed = processed.replace(/\\;/g, '&ensp;');
  processed = processed.replace(/\\!/g, '');
  processed = processed.replace(/~(?!_)/g, '&nbsp;');
  return processed;
}

// ─────────────────────────────────────────────────────
// Misc commands cleanup
// ─────────────────────────────────────────────────────

function cleanMiscCommands(text: string): string {
  let processed = text;
  processed = processed.replace(/\\textwidth/g, '100%');
  processed = processed.replace(/\\linewidth/g, '100%');
  processed = processed.replace(/\\columnwidth/g, '100%');
  processed = processed.replace(/\\pagebreak/g, '');
  processed = processed.replace(/\\clearpage/g, '');
  processed = processed.replace(/\\newpage/g, '');
  processed = processed.replace(/\\maketitle/g, '');
  processed = processed.replace(/\\tableofcontents/g, '');
  processed = processed.replace(/\\setlength\{[^}]*\}\{[^}]*\}/g, '');
  processed = processed.replace(/\\renewcommand\{[^}]*\}(\[[^\]]*\])?\{[^}]*\}/g, '');
  processed = processed.replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '');
  processed = processed.replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, '');
  processed = processed.replace(/\\begin\{document\}/g, '');
  processed = processed.replace(/\\end\{document\}/g, '');
  return processed;
}

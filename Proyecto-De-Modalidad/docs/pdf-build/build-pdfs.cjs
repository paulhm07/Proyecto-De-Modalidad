// build-pdfs.js — Converts the two EducaPlay guides (Markdown) to styled HTML
// Usage: node build-pdfs.js

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const DOCS_DIR = '/home/z/my-project/Proyecto-De-Modalidad/docs';
const OUT_DIR = path.join(DOCS_DIR, 'pdf-build');

const md = new MarkdownIt({
  html: false,
  breaks: false,
  linkify: false,
  typographer: false,
});

// Convert markdown body to HTML, then post-process to add classes for styling
function mdToHtml(markdown) {
  let html = md.render(markdown);

  // Add classes to elements for styling
  html = html
    // Headings
    .replace(/<h1>/g, '<h1 class="doc-h1">')
    .replace(/<h2>/g, '<h2 class="doc-h2">')
    .replace(/<h3>/g, '<h3 class="doc-h3">')
    .replace(/<h4>/g, '<h4 class="doc-h4">')
    // First H1 inside main content is the doc title — we move it to cover, so remove from body
    // Tables
    .replace(/<table>/g, '<div class="table-wrap"><table class="doc-table">')
    .replace(/<\/table>/g, '</table></div>')
    // Blockquotes
    .replace(/<blockquote>/g, '<blockquote class="doc-quote">')
    // Lists
    .replace(/<ul>/g, '<ul class="doc-ul">')
    .replace(/<ol>/g, '<ol class="doc-ol">')
    // Paragraphs
    .replace(/<p>/g, '<p class="doc-p">')
    // Horizontal rules -> section divider
    .replace(/<hr>/g, '<div class="doc-divider"></div>')
    // Code spans
    .replace(/<code>/g, '<code class="doc-code">');

  // Remove the first H1 (it's used as the cover title)
  html = html.replace(/<h1 class="doc-h1">[\s\S]*?<\/h1>/, '');

  return html;
}

// Extract title and subtitle from markdown
function extractMeta(markdown) {
  const lines = markdown.split('\n');
  // First H1 is the title
  let title = 'Documento';
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)$/);
    if (m) { title = m[1].trim(); break; }
  }
  // First blockquote line is the subtitle
  let subtitle = '';
  for (const line of lines) {
    const m = line.match(/^>\s+(.+)$/);
    if (m) { subtitle = m[1].trim().replace(/\*/g, '').replace(/_/g, ''); break; }
  }
  return { title, subtitle };
}

// Build full HTML document with cover + body
function buildHtml(markdown, meta, accentColor, accentColor2, docType) {
  const bodyHtml = mdToHtml(markdown);
  const tagLabel = docType === 'user' ? 'GUÍA DE USUARIO' : 'GUÍA DE ADMINISTRADOR';
  const tagSub = docType === 'user' ? 'Para usuarios finales' : 'Para maestros/as y soporte técnico';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${meta.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
@page {
  size: 210mm 297mm;
  margin: 0;
}
:root {
  --c-bg: #ffffff;
  --c-text: #1e293b;
  --c-text-soft: #475569;
  --c-text-muted: #94a3b8;
  --c-border: #e2e8f0;
  --c-accent: ${accentColor};
  --c-accent-2: ${accentColor2};
  --c-cover-bg: #0b0a1f;
  --c-cover-bg-2: #1a1145;
}
html, body {
  margin: 0;
  padding: 0;
  width: 210mm;
  background: var(--c-bg);
  color: var(--c-text);
  font-family: 'Inter', 'Noto Color Emoji', sans-serif;
  font-size: 10.5pt;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
@media screen {
  html {
    height: auto;
    display: flex;
    justify-content: center;
    background: #475569;
  }
  body {
    margin: 20px auto;
    box-shadow: 0 4px 30px rgba(0,0,0,0.3);
  }
}

/* ============ COVER PAGE ============ */
.cover {
  width: 210mm;
  height: 297mm;
  box-sizing: border-box;
  break-after: page;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(ellipse at 20% 15%, rgba(139,92,246,0.35) 0px, transparent 50%),
    radial-gradient(ellipse at 85% 25%, rgba(34,211,238,0.22) 0px, transparent 45%),
    radial-gradient(ellipse at 75% 85%, rgba(251,113,133,0.20) 0px, transparent 50%),
    radial-gradient(ellipse at 15% 80%, rgba(251,191,36,0.16) 0px, transparent 45%),
    linear-gradient(160deg, #07061f 0%, #0d0830 45%, #160a3a 100%);
  color: #eaf2ff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28mm 24mm;
}
.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(251,191,36,0.6) 1px, transparent 1.6px);
  background-size: 60px 60px;
  opacity: 0.35;
  pointer-events: none;
}
.cover-top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
}
.cover-logo {
  width: 46px; height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${accentColor}, ${accentColor2});
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 22px; color: #04121a;
  box-shadow: 0 0 24px rgba(34,211,238,0.5);
}
.cover-brand {
  font-size: 15pt; font-weight: 700; letter-spacing: -0.01em;
  color: #eaf2ff;
}
.cover-brand span { color: ${accentColor}; }
.cover-center {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; justify-content: center; flex: 1;
  padding: 20mm 0;
}
.cover-tag {
  display: inline-block;
  align-self: flex-start;
  font-size: 9pt; font-weight: 700; letter-spacing: 0.18em;
  color: ${accentColor};
  background: rgba(34,211,238,0.10);
  border: 1px solid rgba(34,211,238,0.35);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 48px;
}
.cover-tag-sub {
  font-size: 9pt; color: #94a3b8; margin-top: 10px; letter-spacing: 0.04em;
}
.cover-title {
  font-size: 42pt; font-weight: 900; line-height: 1.05;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 44px 0;
  text-shadow: 0 0 40px rgba(139,92,246,0.4);
}
.cover-title em {
  font-style: normal;
  background: linear-gradient(120deg, ${accentColor}, ${accentColor2});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cover-subtitle {
  font-size: 13pt; font-weight: 400; line-height: 1.5;
  color: #cbd5e1;
  max-width: 130mm;
  margin: 0;
}
.cover-runes {
  margin-top: 48px;
  display: flex; gap: 18px; flex-wrap: wrap;
  font-size: 20pt; opacity: 0.5;
}
.cover-bottom {
  position: relative; z-index: 2;
  display: flex; justify-content: space-between; align-items: flex-end;
  font-size: 9pt; color: #94a3b8; letter-spacing: 0.04em;
}
.cover-bottom .left { max-width: 100mm; }
.cover-bottom .left strong { color: #eaf2ff; font-weight: 700; display:block; margin-bottom: 4px; font-size: 10pt; }
.cover-bottom .right { text-align: right; }
.cover-bottom .right strong { color: ${accentColor}; font-weight: 700; display:block; font-size: 11pt; margin-bottom: 4px; }

/* ============ BODY CONTENT ============ */
.main-content {
  padding: 16mm 18mm 14mm 18mm;
}
.doc-h1 { display: none; }
.doc-h2 {
  font-size: 19pt; font-weight: 800; color: var(--c-text);
  letter-spacing: -0.015em;
  margin: 26px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 2.5px solid var(--c-accent);
  break-after: avoid;
  break-inside: avoid;
}
.doc-h2:first-child { margin-top: 0; }
.doc-h3 {
  font-size: 13.5pt; font-weight: 700; color: var(--c-accent-2);
  margin: 20px 0 8px 0;
  break-after: avoid;
  break-inside: avoid;
}
.doc-h4 {
  font-size: 11.5pt; font-weight: 700; color: var(--c-text);
  margin: 14px 0 6px 0;
  break-after: avoid;
}
.doc-p {
  margin: 0 0 9px 0;
  color: var(--c-text);
  orphans: 2; widows: 2;
}
.doc-p strong { color: var(--c-text); font-weight: 700; }
.doc-ul, .doc-ol {
  margin: 6px 0 12px 0;
  padding-left: 22px;
}
.doc-ul li, .doc-ol li {
  margin-bottom: 5px;
  color: var(--c-text);
  orphans: 2; widows: 2;
}
.doc-ul li::marker { color: var(--c-accent); }
.doc-ol li::marker { color: var(--c-accent-2); font-weight: 700; }
.doc-ul ul, .doc-ol ol, .doc-ul ol, .doc-ol ul {
  margin: 4px 0 4px 0;
}
.doc-code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9pt;
  background: #f1f5f9;
  color: ${accentColor2};
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid var(--c-border);
  font-weight: 600;
}
.doc-quote {
  margin: 12px 0;
  padding: 10px 16px;
  background: linear-gradient(120deg, rgba(34,211,238,0.06), rgba(139,92,246,0.06));
  border-left: 4px solid var(--c-accent);
  border-radius: 0 8px 8px 0;
  color: var(--c-text-soft);
  font-size: 10pt;
  break-inside: avoid;
}
.doc-quote p { margin: 0; }
.doc-quote p strong { color: var(--c-accent-2); }
.doc-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--c-border) 20%, var(--c-border) 80%, transparent);
  margin: 44px 0;
  break-inside: avoid;
}
.table-wrap {
  margin: 12px 0 16px 0;
  break-inside: avoid;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid var(--c-border);
}
.doc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9.5pt;
}
.doc-table thead {
  background: linear-gradient(120deg, var(--c-accent-2), var(--c-accent));
}
.doc-table th {
  padding: 8px 10px;
  text-align: left;
  font-weight: 700;
  color: #ffffff;
  font-size: 9.5pt;
  letter-spacing: 0.01em;
}
.doc-table td {
  padding: 7px 10px;
  border-top: 1px solid var(--c-border);
  color: var(--c-text);
  vertical-align: top;
}
.doc-table tbody tr:nth-child(even) { background: #f8fafc; }
.doc-table tbody tr:nth-child(odd) { background: #ffffff; }
.doc-table code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5pt;
  background: #f1f5f9;
  color: ${accentColor2};
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;
}

/* ============ ENDING PAGE ============ */
.ending {
  width: 210mm;
  height: 297mm;
  box-sizing: border-box;
  break-before: page;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.30) 0px, transparent 55%),
    radial-gradient(ellipse at 30% 80%, rgba(34,211,238,0.18) 0px, transparent 50%),
    linear-gradient(160deg, #07061f 0%, #0d0830 50%, #160a3a 100%);
  color: #eaf2ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40mm;
}
.ending::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(251,191,36,0.5) 1px, transparent 1.4px);
  background-size: 80px 80px;
  opacity: 0.3;
  pointer-events: none;
}
.ending-logo {
  position: relative; z-index: 2;
  width: 70px; height: 70px;
  border-radius: 18px;
  background: linear-gradient(135deg, ${accentColor}, ${accentColor2});
  display: flex; align-items: center; justify-content: center;
  font-weight: 900; font-size: 32px; color: #04121a;
  box-shadow: 0 0 40px rgba(34,211,238,0.6);
  margin-bottom: 44px;
}
.ending-title {
  position: relative; z-index: 2;
  font-size: 26pt; font-weight: 800; color: #ffffff;
  margin: 0 0 14px 0;
  letter-spacing: -0.01em;
}
.ending-sub {
  position: relative; z-index: 2;
  font-size: 12pt; color: #cbd5e1; line-height: 1.6;
  max-width: 130mm;
  margin: 0 0 36px 0;
}
.ending-line {
  position: relative; z-index: 2;
  width: 60px; height: 3px;
  background: linear-gradient(90deg, ${accentColor}, ${accentColor2});
  border-radius: 2px;
  margin-bottom: 44px;
}
.ending-foot {
  position: relative; z-index: 2;
  font-size: 9pt; color: #94a3b8; letter-spacing: 0.06em;
}
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div class="cover-top">
    <div class="cover-logo">E</div>
    <div class="cover-brand">Educa<span>Play</span></div>
  </div>
  <div class="cover-center">
    <div>
      <div class="cover-tag">${tagLabel}</div>
      <div class="cover-tag-sub">${tagSub}</div>
    </div>
    <h1 class="cover-title">${meta.title.replace(/—/g, '<br><em>—')}</em></h1>
    <p class="cover-subtitle">${meta.subtitle}</p>
    <div class="cover-runes">π &nbsp; ∑ &nbsp; √ &nbsp; A &nbsp; Ñ &nbsp; 🎯 &nbsp; 🚌 &nbsp; ✨</div>
  </div>
  <div class="cover-bottom">
    <div class="left">
      <strong>EducaPlay · Cristal del Saber</strong>
      Plataforma educativa gamificada para 3.<sup>er</sup> grado de primaria<br>
      Alineada al currículo del MINED de Nicaragua
    </div>
    <div class="right">
      <strong>Documentación</strong>
      Versión 1.0 · 2026
    </div>
  </div>
</div>

<!-- BODY -->
<div class="main-content">
${bodyHtml}
</div>

<!-- ENDING -->
<div class="ending">
  <div class="ending-logo">E</div>
  <div class="ending-line"></div>
  <h2 class="ending-title">EducaPlay</h2>
  <p class="ending-sub">Aprende jugando entre las estrellas ✨<br>Hecho con cariño para estudiantes de 3.<sup>er</sup> grado.</p>
  <div class="ending-foot">CRISTAL DEL SABER · DOCUMENTACIÓN OFICIAL</div>
</div>

</body>
</html>`;
}

// Process both guides
const guides = [
  {
    mdFile: path.join(DOCS_DIR, 'Guia-Usuario-EducaPlay.md'),
    outHtml: path.join(OUT_DIR, 'Guia-Usuario-EducaPlay.html'),
    outPdf: path.join(DOCS_DIR, 'Guia-Usuario-EducaPlay.pdf'),
    accent: '#22d3ee',      // cyan (app primary)
    accent2: '#8b5cf6',     // violet (app secondary)
    docType: 'user',
  },
  {
    mdFile: path.join(DOCS_DIR, 'Guia-Administrador-EducaPlay.md'),
    outHtml: path.join(OUT_DIR, 'Guia-Administrador-EducaPlay.html'),
    outPdf: path.join(DOCS_DIR, 'Guia-Administrador-EducaPlay.pdf'),
    accent: '#fb7185',      // coral (language/creativity)
    accent2: '#8b5cf6',     // violet
    docType: 'admin',
  },
];

for (const g of guides) {
  const markdown = fs.readFileSync(g.mdFile, 'utf8');
  const meta = extractMeta(markdown);
  const html = buildHtml(markdown, meta, g.accent, g.accent2, g.docType);
  fs.writeFileSync(g.outHtml, html, 'utf8');
  console.log(`✓ Built HTML: ${g.outHtml} (${(html.length/1024).toFixed(1)} KB)`);
  console.log(`  Title: ${meta.title}`);
  console.log(`  Subtitle: ${meta.subtitle}`);
}
console.log('\nDone. Run validator + html2pdf-next.js next.');

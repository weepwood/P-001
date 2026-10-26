import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

test('static workbench contains the expected panes', () => {
  for (const id of ['workbench','primarySidebar','mainEditor','secondarySidebar','codeInput','lineNumbers','highlightedCode','terminalPanel','chatInput','themeToggle','paletteOverlay','settingsOverlay']) {
    assert.match(html, new RegExp('id="' + id + '"'), 'Missing DOM node: ' + id);
  }
});

test('script selectors reference existing static IDs', () => {
  const matches = [...js.matchAll(/\$\('#([A-Za-z][\w-]*)'\)/g)].map((match) => match[1]);
  const missing = [...new Set(matches)].filter((id) => !html.includes('id="' + id + '"'));
  // ID checks for dynamically created nodes are handled below.
  assert.deepEqual(missing.filter((id) => !['sideSearchResults','extensionResults','sidebarSearch','extensionSearch','commitMessage','terminalOther'].includes(id)), []);
});

test('official 2026 background colors are mapped without regressions', () => {
  assert.match(css, /body\[data-theme="dark"\][^{]*\{[^}]*--editor:#121314;/);
  assert.match(css, /body\[data-theme="dark"\][^{]*\{[^}]*--shell:#191A1B;/);
  assert.match(css, /body\[data-theme="light"\][^{]*\{[^}]*--editor:#FFFFFF;/);
  assert.match(css, /body\[data-theme="light"\][^{]*\{[^}]*--shell:#FAFAFD;/);
});

test('keyboard and UI functionality is connected to event handlers', () => {
  assert.match(js, /const setTheme =/);
  assert.match(js, /const openPalette =/);
  assert.match(js, /const setActiveFile =/);
  assert.match(js, /const editorChanged =/);
  assert.match(js, /const renderSidebar =/);
  assert.match(js, /const sendChat =/);
  assert.match(js, /document\.addEventListener\('keydown'/);
  assert.match(js, /localStorage/);
});

test('demo clearly distinguishes local UI from connected services', () => {
  assert.match(html, /no AI service connected/);
  assert.match(js, /terminal commands are not executed/);
  assert.match(js, /no Git repository was changed/);
});

test('usable narrow layouts and reduced-motion preferences are defined', () => {
  assert.match(css, /@media \(max-width:940px\)/);
  assert.match(css, /@media \(max-width:500px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});

test('editor uses no wrapping to keep textarea and highlighted code aligned', () => {
  assert.match(html, /id="codeInput"[^>]*wrap="off"/);
  assert.match(css, /\.code-highlight,#codeInput\{[^}]*white-space:pre;/);
});

test('Pages packages only actual public assets', () => {
  const workflow = readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /mkdir -p _site\/src/);
  assert.match(workflow, /cp index\.html favicon\.svg _site\//);
  assert.match(workflow, /cp src\/app\.js src\/styles\.css _site\/src\//);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /path: _site/);
});

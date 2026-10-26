(() => {
  'use strict';

  const ICON = (name) => '<svg aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const save = (key, value) => { try { localStorage.setItem('p001-' + key, JSON.stringify(value)); } catch (_) {} };
  const load = (key, fallback) => { try { const v = localStorage.getItem('p001-' + key); return v === null ? fallback : JSON.parse(v); } catch (_) { return fallback; } };

  const files = {
    'src/App.tsx': {
      language: 'TypeScript React',
      text: [
        "import { useState } from 'react';",
        "import { ThemeSwitcher } from './components/ThemeSwitcher';",
        "import { CodePreview } from './components/CodePreview';",
        "import './styles/tokens.css';",
        '',
        "type ColorTheme = 'dark' | 'light';",
        '',
        'interface WorkspaceProps {',
        '  title: string;',
        '  theme: ColorTheme;',
        '  onThemeChange: (theme: ColorTheme) => void;',
        '}',
        '',
        'const features = [',
        "  { name: 'A quieter canvas', enabled: true },",
        "  { name: 'Purposeful contrast', enabled: true },",
        "  { name: 'Crafted for focus', enabled: true },",
        '];',
        '',
        'export default function App() {',
        "  const [theme, setTheme] = useState<ColorTheme>('dark');",
        '  const [active, setActive] = useState(0);',
        '',
        '  return (',
        '    <main className="workspace">',
        '      <header className="workspace-header">',
        '        <div className="brand">',
        '          <span className="brand-mark" />',
        '          <span>Visual Studio Code</span>',
        '        </div>',
        '        <ThemeSwitcher theme={theme} onChange={setTheme} />',
        '      </header>',
        '',
        '      <section className="editor-layout">',
        '        <aside className="explorer">',
        '          <h2>EXPLORER</h2>',
        '          <nav aria-label="Project files">',
        '            {features.map((feature, index) => (',
        '              <button',
        '                key={feature.name}',
        '                onClick={() => setActive(index)}',
        '                className={active === index ? "active" : ""}',
        '              >',
        '                {feature.name}',
        '              </button>',
        '            ))}',
        '          </nav>',
        '        </aside>',
        '',
        '        <CodePreview theme={theme} />',
        '      </section>',
        '    </main>',
        '  );',
        '}',
        '',
        '// A new perspective on a familiar editor.',
        '// Dark 2026 and Light 2026 — built for focus.'
      ].join('\n')
    },
    'src/components/ThemeSwitcher.tsx': {
      language: 'TypeScript React',
      text: [
        "import { Moon, Sun } from 'lucide-react';",
        '',
        "type Theme = 'dark' | 'light';",
        '',
        'interface ThemeSwitcherProps {',
        '  theme: Theme;',
        '  onChange: (theme: Theme) => void;',
        '}',
        '',
        'export function ThemeSwitcher({',
        '  theme,',
        '  onChange,',
        '}: ThemeSwitcherProps) {',
        "  const isDark = theme === 'dark';",
        '',
        '  return (',
        '    <button',
        '      type="button"',
        '      className="theme-switcher"',
        '      aria-label="Toggle color theme"',
        "      onClick={() => onChange(isDark ? 'light' : 'dark')}",
        '    >',
        '      {isDark ? <Moon size={16} /> : <Sun size={16} />}',
        '      <span>{isDark ? "Dark 2026" : "Light 2026"}</span>',
        '    </button>',
        '  );',
        '}'
      ].join('\n')
    },
    'src/components/CodePreview.tsx': {
      language: 'TypeScript React',
      text: [
        "import type { ReactNode } from 'react';",
        '',
        'interface CodePreviewProps {',
        "  theme: 'light' | 'dark';",
        '  children?: ReactNode;',
        '}',
        '',
        'export function CodePreview({ theme, children }: CodePreviewProps) {',
        '  return (',
        '    <div className="code-preview" data-theme={theme}>',
        '      <div className="code-preview__toolbar">',
        '        <span className="filename">App.tsx</span>',
        '        <span className="separator" />',
        '        <span>TypeScript React</span>',
        '      </div>',
        '      <div className="code-preview__content">{children}</div>',
        '    </div>',
        '  );',
        '}'
      ].join('\n')
    },
    'src/styles/tokens.css': {
      language: 'CSS',
      text: [
        '/* Visual Studio Code — 2026 color themes */',
        '/* Source: microsoft/vscode / theme-defaults */',
        '',
        ':root {',
        '  --font-sans: "Segoe UI", Inter, sans-serif;',
        '  --font-mono: "SFMono-Regular", Consolas, monospace;',
        '  --transition-fast: 140ms ease;',
        '}',
        '',
        '[data-theme="dark"] {',
        '  --editor-background: #121314;',
        '  --editor-foreground: #bbbebf;',
        '  --sidebar-background: #191a1b;',
        '  --sidebar-border: #2a2b2c;',
        '  --focus-border: #3994bcb3;',
        '  --selection-background: #276782dd;',
        '  --accent: #3994bc;',
        '}',
        '',
        '[data-theme="light"] {',
        '  --editor-background: #ffffff;',
        '  --editor-foreground: #202020;',
        '  --sidebar-background: #fafafd;',
        '  --sidebar-border: #f0f1f2;',
        '  --focus-border: #0069cc;',
        '  --selection-background: #add6ff;',
        '  --accent: #0069cc;',
        '}',
        '',
        '.workspace {',
        '  display: grid;',
        '  grid-template-columns: 48px 244px minmax(0, 1fr);',
        '  background: var(--editor-background);',
        '  color: var(--editor-foreground);',
        '}',
        '',
        '.theme-switcher {',
        '  display: inline-flex;',
        '  align-items: center;',
        '  gap: 8px;',
        '  border: 1px solid var(--sidebar-border);',
        '  transition: border-color var(--transition-fast);',
        '}'
      ].join('\n')
    },
    'package.json': {
      language: 'JSON',
      text: [
        '{',
        '  "name": "vscode-theme-lab",',
        '  "version": "1.0.0",',
        '  "private": true,',
        '  "type": "module",',
        '  "scripts": {',
        '    "dev": "vite --host 0.0.0.0",',
        '    "build": "vite build",',
        '    "preview": "vite preview"',
        '  },',
        '  "dependencies": {',
        '    "lucide-react": "^0.468.0",',
        '    "react": "^19.0.0",',
        '    "react-dom": "^19.0.0"',
        '  },',
        '  "devDependencies": {',
        '    "@vitejs/plugin-react": "^4.5.0",',
        '    "typescript": "~5.8.0",',
        '    "vite": "^6.0.0"',
        '  }',
        '}'
      ].join('\n')
    },
    'README.md': {
      language: 'Markdown',
      text: [
        '# VS Code 2026 Theme Lab',
        '',
        'A focused reproduction of the Visual Studio Code',
        'workbench, inspired by the new Dark 2026 and Light 2026 themes.',
        '',
        '## Explore',
        '',
        '- Switch instantly between dark and light.',
        '- Open files and edit the code preview.',
        '- Try Command Palette with Cmd/Ctrl + Shift + P.',
        '- Use Cmd/Ctrl + J to toggle the integrated terminal.',
        '- Customize density, font size, and editor minimap.',
        '',
        '## Source of truth',
        '',
        'microsoft/vscode',
        'extensions/theme-defaults/themes/2026-dark.json',
        'extensions/theme-defaults/themes/2026-light.json',
        '',
        '> This is a front-end interaction demo, not the VS Code IDE.',
        '',
        'Made for the details.'
      ].join('\n')
    },
    '.gitignore': {
      language: 'Plain Text',
      text: ['node_modules', 'dist', '.DS_Store', '*.log'].join('\n')
    },
    'vite.config.ts': {
      language: 'TypeScript',
      text: [
        "import { defineConfig } from 'vite';",
        "import react from '@vitejs/plugin-react';",
        '',
        'export default defineConfig({',
        '  plugins: [react()],',
        "  base: '/P-001/',",
        '});'
      ].join('\n')
    }
  };

  const filePaths = Object.keys(files);
  const state = {
    theme: load('theme', 'dark') === 'light' ? 'light' : 'dark',
    activeFile: 'src/App.tsx',
    tabs: ['src/App.tsx', 'src/styles/tokens.css', 'README.md'],
    view: 'explorer',
    panelOpen: load('panel', true),
    chatOpen: load('chat', true),
    primaryVisible: true,
    minimap: load('minimap', true),
    density: load('density', 'comfortable'),
    fontSize: load('font-size', 13),
    expanded: new Set(['src', 'src/components', 'src/styles']),
    edited: {},
    dirty: new Set(),
    history: ['src/App.tsx'],
    historyIndex: 0,
    paletteItems: [],
    paletteIndex: 0,
    terminalTab: 'terminal',
    installed: new Set(['Prettier', 'ESLint']),
    commits: 2,
    chatMessages: []
  };

  let toastTimer;
  const showToast = (message) => {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('shown'), 3100);
  };

  const pathIcon = (path) => {
    const ext = path.split('.').pop();
    return ['tsx', 'ts', 'css', 'json', 'md', 'js'].includes(ext)
      ? '<span class="file-symbol ' + ext + '">' + ({tsx:'TS', ts:'TS', css:'#', json:'{}', md:'↓', js:'JS'})[ext] + '</span>'
      : '<span class="file-symbol default">' + ICON('file') + '</span>';
  };

  const fileName = (path) => path.split('/').pop();
  const codeText = (path) => Object.prototype.hasOwnProperty.call(state.edited, path) ? state.edited[path] : files[path].text;

  const setTheme = (theme) => {
    state.theme = theme === 'light' ? 'light' : 'dark';
    document.body.dataset.theme = state.theme;
    $('#themeLabel').textContent = state.theme === 'dark' ? 'Dark 2026' : 'Light 2026';
    document.querySelector('meta[name="theme-color"]').content = state.theme === 'dark' ? '#191A1B' : '#FAFAFD';
    $$('.theme-option').forEach((b) => b.classList.toggle('active', b.dataset.themeOption === state.theme));
    save('theme', state.theme);
    showToast((state.theme === 'dark' ? 'Dark 2026' : 'Light 2026') + ' · Theme applied');
  };

  const togglePanel = (force) => {
    state.panelOpen = typeof force === 'boolean' ? force : !state.panelOpen;
    $('#terminalPanel').classList.toggle('is-hidden', !state.panelOpen);
    save('panel', state.panelOpen);
  };
  const toggleChat = (force) => {
    state.chatOpen = typeof force === 'boolean' ? force : !state.chatOpen;
    $('#secondarySidebar').classList.toggle('is-hidden', !state.chatOpen);
    save('chat', state.chatOpen);
  };
  const togglePrimary = (force) => {
    state.primaryVisible = typeof force === 'boolean' ? force : !state.primaryVisible;
    $('#primarySidebar').classList.toggle('is-hidden', !state.primaryVisible);
  };

  const getTree = () => ({
    name: 'P-001',
    type: 'folder',
    path: '',
    children: [
      {name:'src',type:'folder',path:'src',children:[
        {name:'components',type:'folder',path:'src/components',children:[
          {name:'CodePreview.tsx',type:'file',path:'src/components/CodePreview.tsx'},
          {name:'ThemeSwitcher.tsx',type:'file',path:'src/components/ThemeSwitcher.tsx'}
        ]},
        {name:'styles',type:'folder',path:'src/styles',children:[
          {name:'tokens.css',type:'file',path:'src/styles/tokens.css'}
        ]},
        {name:'App.tsx',type:'file',path:'src/App.tsx'}
      ]},
      {name:'.gitignore',type:'file',path:'.gitignore'},
      {name:'package.json',type:'file',path:'package.json'},
      {name:'README.md',type:'file',path:'README.md'},
      {name:'vite.config.ts',type:'file',path:'vite.config.ts'}
    ]
  });

  const folderHtml = (node, depth) => {
    if (node.type === 'file') return '<button class="tree-row ' + (state.activeFile === node.path ? 'active' : '') + '" data-file="' + esc(node.path) + '" style="padding-left:' + (9 + depth * 14) + 'px">' + pathIcon(node.path) + '<span class="tree-file-name">' + esc(node.name) + '</span>' + (state.dirty.has(node.path) ? '<span class="file-modified">M</span>' : '') + '</button>';
    const isRoot = !node.path;
    const expanded = isRoot || state.expanded.has(node.path);
    let html = '<button class="tree-row" data-folder="' + esc(node.path) + '" style="padding-left:' + (9 + depth * 14) + 'px">' + '<span class="chevron ' + (expanded ? 'expanded' : '') + '">' + ICON('chevron') + '</span><span class="folder-symbol">' + ICON('folder') + '</span><span class="tree-file-name">' + esc(node.name) + '</span></button>';
    if (expanded) html += node.children.map((child) => folderHtml(child, depth + (isRoot ? 0 : 1))).join('');
    return html;
  };

  const searchFiles = (query) => filePaths.filter((path) => (path + ' ' + codeText(path)).toLowerCase().includes(query.toLowerCase()));
  const extensions = [
    {name:'Prettier',description:'Opinionated code formatter',author:'Prettier'},
    {name:'ESLint',description:'Integrates ESLint JavaScript into VS Code',author:'Microsoft'},
    {name:'Material Icon Theme',description:'File icons inspired by Material Design',author:'Philipp Kief'},
    {name:'GitLens',description:'Supercharge Git in VS Code',author:'GitKraken'},
    {name:'Error Lens',description:'Improve highlighting of errors and warnings',author:'Alexander'},
  ];

  const renderSidebar = () => {
    const title = {explorer:'EXPLORER',search:'SEARCH',source:'SOURCE CONTROL',run:'RUN AND DEBUG',extensions:'EXTENSIONS'}[state.view];
    $('#sideTitle').textContent = title;
    $('#sideNew').title = state.view === 'explorer' ? 'New file (preview)' : 'Refresh';
    let html = '';
    if (state.view === 'explorer') {
      html = '<div class="section-heading">' + ICON('chevron') + ' OPEN EDITORS <span class="suffix">' + state.tabs.length + '</span></div><div class="file-tree">' +
        state.tabs.map((path) => '<button class="tree-row ' + (state.activeFile === path ? 'active':'') + '" data-file="' + esc(path) + '" style="padding-left:11px">' + pathIcon(path) + '<span class="tree-file-name">' + esc(fileName(path)) + '</span></button>').join('') +
        '</div><div class="section-heading">' + ICON('chevron') + ' P-001</div><div class="file-tree">' + getTree().children.map((node) => folderHtml(node, 0)).join('') + '</div>';
    } else if (state.view === 'search') {
      html = '<input class="sidebar-input" id="sidebarSearch" placeholder="Search files and source…" aria-label="Search workspace"><div id="sideSearchResults"><div class="sidebar-section-info">Search across the demo project. Try “theme”, “color”, or “App”.</div></div>';
    } else if (state.view === 'source') {
      html = '<div class="sidebar-section-info">Changes to the sample workspace are kept in your browser for this session.</div><input class="source-message" placeholder="Message (⌘ Enter to commit)" aria-label="Commit message" id="commitMessage"><button class="sidebar-action" id="commitChanges">Commit (demo)</button><div class="section-heading">' + ICON('chevron') + ' CHANGES <span class="suffix">' + state.dirty.size + '</span></div><div class="file-tree">' +
        (state.dirty.size ? Array.from(state.dirty).map((path) => '<button class="tree-row" data-file="' + esc(path) + '" style="padding-left:10px">' + pathIcon(path) + '<span class="tree-file-name">' + esc(fileName(path)) + '</span><span class="file-modified">M</span></button>').join('') : '<div class="sidebar-section-info">No changes detected.</div>') + '</div>';
    } else if (state.view === 'extensions') {
      html = '<input class="sidebar-input" id="extensionSearch" placeholder="Search extensions…" aria-label="Search extensions"><div class="section-heading">' + ICON('chevron') + ' RECOMMENDED</div><div id="extensionResults"></div>';
    } else {
      html = '<div class="run-hero">' + ICON('debug') + '<h3>Run and Debug</h3><p>Run controls in this theme preview are illustrative. Use the terminal to try local demo commands.</p><button class="sidebar-action" id="runDemo" style="width:100%;margin:12px 0">Open Terminal</button></div>';
    }
    $('#sideContent').innerHTML = html;
    if (state.view === 'extensions') renderExtensions('');
  };

  const renderExtensions = (filter) => {
    const root = $('#extensionResults');
    if (!root) return;
    root.innerHTML = extensions.filter((ext) => (ext.name + ext.description).toLowerCase().includes(filter.toLowerCase())).map((ext) => '<div class="side-card">' + ICON('grid') + '<div><strong>' + esc(ext.name) + '</strong><small>' + esc(ext.description) + '</small></div><button data-extension="' + esc(ext.name) + '">' + (state.installed.has(ext.name) ? 'Installed' : 'Install') + '</button></div>').join('') || '<div class="sidebar-section-info">No extensions found.</div>';
  };

  const setView = (view) => {
    state.view = view;
    togglePrimary(true);
    $$('.activity-btn[data-view]').forEach((button) => button.classList.toggle('selected', button.dataset.view === view));
    renderSidebar();
  };

  const renderTabs = () => {
    $('#tabs').innerHTML = state.tabs.map((path) =>
      '<button class="editor-tab ' + (state.activeFile === path ? 'active' : '') + '" data-tab="' + esc(path) + '" title="' + esc(path) + '">' +
      pathIcon(path) + '<span class="tab-name">' + esc(fileName(path)) + '</span><span class="close-tab" data-close="' + esc(path) + '" title="Close tab">' +
      (state.dirty.has(path) ? '<span class="dirty-indicator"></span>' : ICON('x')) + '</span></button>'
    ).join('');
  };

  const highlight = (text) => {
    if (state.activeFile === 'README.md' || state.activeFile === '.gitignore') return esc(text);
    const tokens = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[a-fA-F0-9]{3,8}\b|\b(?:import|from|export|default|function|return|const|let|var|interface|type|extends|true|false|null|undefined|new|as|if|else|void|boolean|string|number)\b|\b\d+(?:\.\d+)?\b|\b[A-Z][A-Za-z0-9_]*\b|\b[a-zA-Z_$][\w$]*(?=\s*\())/g;
    let result = '', last = 0, match;
    while ((match = tokens.exec(text)) !== null) {
      result += esc(text.slice(last, match.index));
      const token = match[0];
      let cssClass = 'tok-punc';
      if (token.startsWith('//') || token.startsWith('/*')) cssClass = 'tok-comment';
      else if (token.startsWith('"') || token.startsWith("'")) cssClass = 'tok-string';
      else if (/^#[\da-fA-F]{3,8}$/.test(token) || /^\d/.test(token)) cssClass = 'tok-number';
      else if (/^(import|from|export|default|function|return|const|let|var|interface|type|extends|true|false|null|undefined|new|as|if|else|void|boolean|string|number)$/.test(token)) cssClass = 'tok-keyword';
      else if (/^[A-Z]/.test(token)) cssClass = 'tok-type';
      else cssClass = 'tok-function';
      result += '<span class="' + cssClass + '">' + esc(token) + '</span>';
      last = match.index + token.length;
    }
    return result + esc(text.slice(last));
  };

  const renderMinimap = (text) => {
    $('#minimap').innerHTML = text.split('\n').slice(0,110).map((line, index) => '<div class="minimap-line ' + (index % 7 === 0 ? 'accent' : '') + '" style="width:' + Math.max(7,Math.min(54,line.trim().length*.64)) + 'px"></div>').join('');
  };

  const updatePosition = () => {
    const editor = $('#codeInput');
    const before = editor.value.slice(0, editor.selectionStart);
    const line = before.split('\n');
    $('#cursorPosition').textContent = 'Ln ' + line.length + ', Col ' + (line[line.length - 1].length + 1);
  };
  const updateCodeVisuals = () => {
    const editor = $('#codeInput');
    const text = editor.value;
    $('#highlightedCode').innerHTML = highlight(text) + '\n';
    $('#lineNumbers').textContent = text.split('\n').map((_, i) => i + 1).join('\n');
    renderMinimap(text);
    updatePosition();
  };

  const setActiveFile = (path, pushHistory = true) => {
    if (!files[path]) return;
    if (!state.tabs.includes(path)) state.tabs.push(path);
    state.activeFile = path;
    const editor = $('#codeInput');
    editor.value = codeText(path);
    $('#languageStatus').textContent = files[path].language;
    const parts = path.split('/');
    $('#breadcrumbs').innerHTML = '<span>P-001</span>' + parts.map((part,i) => ICON('chevron') + '<span class="' + (i === parts.length - 1 ? 'breadcrumb-current' : '') + '">' + esc(part) + '</span>').join('');
    updateCodeVisuals();
    editor.scrollTop = 0;
    editor.scrollLeft = 0;
    $('#highlightedCode').scrollTop = 0;
    $('#lineNumbers').scrollTop = 0;
    renderTabs();
    if (state.view === 'explorer' || state.view === 'source') renderSidebar();
    if (pushHistory && state.history[state.historyIndex] !== path) {
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(path);
      state.historyIndex = state.history.length - 1;
    }
  };

  const closeTab = (path) => {
    const index = state.tabs.indexOf(path);
    if (index < 0) return;
    state.tabs.splice(index,1);
    if (!state.tabs.length) state.tabs.push('src/App.tsx');
    if (state.activeFile === path) setActiveFile(state.tabs[Math.min(index, state.tabs.length - 1)]);
    else renderTabs();
    if (state.view === 'explorer') renderSidebar();
  };

  const editorChanged = () => {
    state.edited[state.activeFile] = $('#codeInput').value;
    const original = files[state.activeFile].text;
    if (state.edited[state.activeFile] === original) state.dirty.delete(state.activeFile);
    else state.dirty.add(state.activeFile);
    updateCodeVisuals();
    renderTabs();
    if (state.view === 'explorer' || state.view === 'source') renderSidebar();
  };

  const paletteCommands = [
    {name:'Preferences: Color Theme',detail:'Customize Appearance',run:() => openSettings()},
    {name:'Theme: Dark 2026',detail:'Apply dark color theme',run:() => setTheme('dark')},
    {name:'Theme: Light 2026',detail:'Apply light color theme',run:() => setTheme('light')},
    {name:'View: Toggle Terminal',detail:'View',run:() => togglePanel()},
    {name:'View: Toggle Secondary Side Bar',detail:'View',run:() => toggleChat()},
    {name:'View: Toggle Primary Side Bar',detail:'View',run:() => togglePrimary()},
    {name:'View: Show Explorer',detail:'View',run:() => setView('explorer')},
    {name:'View: Search Workspace',detail:'View',run:() => setView('search')},
    {name:'View: Show Source Control',detail:'View',run:() => setView('source')},
    {name:'View: Show Extensions',detail:'View',run:() => setView('extensions')},
    {name:'Editor: Toggle Minimap',detail:'Editor',run:() => toggleMinimap()},
    {name:'View: Toggle Compact Layout',detail:'Appearance',run:() => toggleDensity()},
    {name:'File: Open README',detail:'P-001',run:() => setActiveFile('README.md')},
    {name:'Terminal: Clear',detail:'Terminal',run:() => { $('#terminalHistory').innerHTML = ''; togglePanel(true); }}
  ];
  let paletteSearch = '';

  const closePalette = () => { $('#paletteOverlay').classList.add('hidden'); };
  const openPalette = (commandMode = false) => {
    $('#settingsOverlay').classList.add('hidden');
    $('#paletteOverlay').classList.remove('hidden');
    $('#paletteInput').value = commandMode ? '>' : '';
    paletteSearch = $('#paletteInput').value;
    state.paletteIndex = 0;
    renderPalette();
    $('#paletteInput').focus();
    $('#paletteInput').setSelectionRange($('#paletteInput').value.length, $('#paletteInput').value.length);
  };
  const renderPalette = () => {
    const query = $('#paletteInput').value;
    const commandMode = query.startsWith('>');
    const text = (commandMode ? query.slice(1) : query).toLowerCase().trim();
    state.paletteItems = (commandMode
      ? paletteCommands.map((cmd) => ({kind:'cmd',name:cmd.name,detail:cmd.detail,run:cmd.run}))
      : filePaths.map((path) => ({kind:'file',name:fileName(path),detail:path,run:() => setActiveFile(path)})).concat(paletteCommands.slice(0,3).map((cmd) => ({kind:'cmd',name:cmd.name,detail:cmd.detail,run:cmd.run})))
    ).filter((item) => (item.name + ' ' + item.detail).toLowerCase().includes(text)).slice(0,20);
    state.paletteIndex = Math.min(state.paletteIndex, Math.max(0,state.paletteItems.length-1));
    $('#paletteResults').innerHTML = state.paletteItems.length ? state.paletteItems.map((item,i) =>
      '<button class="quick-result ' + (i === state.paletteIndex ? 'active' : '') + '" data-result="' + i + '">' +
      (item.kind === 'cmd' ? ICON('command') : pathIcon(item.detail)) + '<span>' + esc(item.name) + '</span><small>' + esc(item.detail) + '</small></button>'
    ).join('') : '<div class="sidebar-section-info">No matching results</div>';
  };
  const choosePalette = (index = state.paletteIndex) => {
    const item = state.paletteItems[index];
    if (!item) return;
    closePalette();
    item.run();
  };

  const openSettings = () => {
    closePalette();
    $('#settingsOverlay').classList.remove('hidden');
    $('#fontSizeRange').value = state.fontSize;
    $('#fontSizeValue').textContent = state.fontSize + ' px';
    $$('.theme-option').forEach((button) => button.classList.toggle('active', button.dataset.themeOption === state.theme));
  };
  const toggleDensity = () => {
    state.density = state.density === 'compact' ? 'comfortable' : 'compact';
    document.body.dataset.density = state.density;
    $('#densityToggle').classList.toggle('checked',state.density === 'compact');
    $('#densityToggle').setAttribute('aria-checked',String(state.density === 'compact'));
    save('density',state.density);
  };
  const toggleMinimap = () => {
    state.minimap = !state.minimap;
    document.body.classList.toggle('hide-minimap', !state.minimap);
    $('#minimapToggle').classList.toggle('checked', state.minimap);
    $('#minimapToggle').setAttribute('aria-checked',String(state.minimap));
    save('minimap',state.minimap);
  };

  const appendTerminal = (text, type='') => {
    const row = document.createElement('div');
    row.className = 'terminal-row ' + type;
    row.textContent = text;
    $('#terminalHistory').appendChild(row);
    $('#terminalContent').scrollTop = $('#terminalContent').scrollHeight;
  };
  const runTerminal = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    appendTerminal('~/P-001 ❯ ' + cmd);
    const parts = cmd.split(/\s+/);
    if (cmd === 'clear') $('#terminalHistory').innerHTML = '';
    else if (cmd === 'help') appendTerminal('Available demo commands: help, ls, pwd, clear, whoami, theme dark, theme light, echo <text>, cat <filename>');
    else if (cmd === 'ls') appendTerminal('src/    README.md    package.json    vite.config.ts    .gitignore');
    else if (cmd === 'pwd') appendTerminal('/workspace/P-001');
    else if (cmd === 'whoami') appendTerminal('theme-lab');
    else if (parts[0] === 'theme' && ['dark','light'].includes(parts[1])) { setTheme(parts[1]); appendTerminal('Applied ' + parts[1] + ' theme', 'success'); }
    else if (parts[0] === 'echo') appendTerminal(cmd.slice(5));
    else if (parts[0] === 'cat' && files[parts.slice(1).join(' ')]) appendTerminal(codeText(parts.slice(1).join(' ')));
    else if (cmd.startsWith('npm ') || cmd.startsWith('git ')) appendTerminal('Preview only — terminal commands are not executed on your computer.', 'dim');
    else appendTerminal('Command not available in this demo. Type help.', 'dim');
  };
  const switchTerminalTab = (tab) => {
    state.terminalTab = tab;
    $$('.terminal-tab').forEach((button) => button.classList.toggle('active',button.dataset.terminalTab === tab));
    const terminalPrompt = $('.terminal-prompt');
    terminalPrompt.style.display = tab === 'terminal' ? '' : 'none';
    $('#terminalHistory').style.display = tab === 'terminal' ? '' : 'none';
    let previous = $('#terminalOther');
    if (previous) previous.remove();
    if (tab !== 'terminal') {
      previous = document.createElement('div');
      previous.id = 'terminalOther';
      previous.className = 'terminal-row dim';
      previous.textContent = ({problems:'No problems have been detected in the preview.',output:'Output will appear here when a task runs.',debug:'Debug console is not connected in the theme demo.'})[tab];
      $('#terminalContent').appendChild(previous);
    }
  };

  const answerChat = (prompt) => {
    const q = prompt.toLowerCase();
    if (q.includes('theme') || q.includes('color')) return 'This demo uses workbench color tokens from microsoft/vscode: Dark 2026 sets editor.background to #121314 and sideBar.background to #191A1B. Light 2026 uses #FFFFFF for the editor and #FAFAFD for the sidebar.\n\nUse the theme switch in the title bar or open Customize appearance.';
    if (q.includes('token')) return 'Theme tokens are semantic variables for surfaces, borders, typography, focus, and selection. This replica maps official VS Code 2026 colors onto CSS custom properties and shares components across both palettes.';
    if (q.includes('custom') || q.includes('workspace') || q.includes('layout')) return 'Open Customize appearance from the top-right layout icon. You can switch color schemes, edit the editor font size, use compact density, and show or hide the minimap. Keyboard shortcuts: Cmd/Ctrl+P for files, Cmd/Ctrl+Shift+P for commands, and Cmd/Ctrl+J for terminal.';
    return 'This is a local UI demonstration rather than a connected Copilot service. You can inspect the 2026 themes, edit preview source files, open the Command Palette, or change layout settings.';
  };
  const renderChats = () => {
    $('#chatMessages').innerHTML = state.chatMessages.map((message) => '<div class="chat-bubble ' + message.role + '"><span class="chat-speaker">' + (message.role === 'user' ? 'You' : 'Demo assistant') + '</span>' + esc(message.text) + '</div>').join('');
    $('#chatSuggestions').style.display = state.chatMessages.length ? 'none' : '';
    $('.chat-intro').style.display = state.chatMessages.length ? 'none' : '';
    $('#chatBody').scrollTop = $('#chatBody').scrollHeight;
  };
  const sendChat = (prompt) => {
    const content = prompt.trim();
    if (!content) return;
    toggleChat(true);
    state.chatMessages.push({role:'user',text:content},{role:'assistant',text:answerChat(content)});
    $('#chatInput').value = '';
    renderChats();
  };

  // Initialize visible state.
  document.body.dataset.theme = state.theme;
  document.body.dataset.density = state.density;
  document.documentElement.style.setProperty('--editor-font',state.fontSize + 'px');
  $('#themeLabel').textContent = state.theme === 'dark' ? 'Dark 2026' : 'Light 2026';
  $('.theme-option[data-theme-option="' + state.theme + '"]').classList.add('active');
  document.body.classList.toggle('hide-minimap', !state.minimap);
  $('#densityToggle').classList.toggle('checked',state.density === 'compact');
  $('#densityToggle').setAttribute('aria-checked',String(state.density === 'compact'));
  $('#minimapToggle').classList.toggle('checked',state.minimap);
  $('#minimapToggle').setAttribute('aria-checked',String(state.minimap));
  $('#fontSizeRange').value = state.fontSize;
  $('#fontSizeValue').textContent = state.fontSize + ' px';
  togglePanel(state.panelOpen);
  toggleChat(state.chatOpen);
  setActiveFile(state.activeFile,false);
  appendTerminal('P-001 · VS Code 2026 Theme Lab', 'dim');
  appendTerminal('Interactive preview terminal. Type help for available commands.', 'dim');
  appendTerminal('');

  // Primary workbench interactions.
  $$('.activity-btn[data-view]').forEach((button) => button.addEventListener('click',() => {
    if (state.view === button.dataset.view && state.primaryVisible) togglePrimary(false);
    else setView(button.dataset.view);
  }));
  $('#sideContent').addEventListener('click',(event) => {
    const file = event.target.closest('[data-file]');
    const folder = event.target.closest('[data-folder]');
    const extension = event.target.closest('[data-extension]');
    if (file) setActiveFile(file.dataset.file);
    else if (folder) {
      const path = folder.dataset.folder;
      if (!path) return;
      if (state.expanded.has(path)) state.expanded.delete(path);
      else state.expanded.add(path);
      renderSidebar();
    } else if (extension) {
      if (state.installed.has(extension.dataset.extension)) state.installed.delete(extension.dataset.extension);
      else state.installed.add(extension.dataset.extension);
      renderExtensions($('#extensionSearch')?.value || '');
      showToast('Extension changes are local to this demo.');
    } else if (event.target.closest('#commitChanges')) {
      const message = $('#commitMessage')?.value.trim();
      if (!message) showToast('Enter a commit message first.');
      else if (!state.dirty.size) showToast('There are no changes to commit.');
      else { state.dirty.clear(); state.commits++; renderSidebar(); renderTabs(); showToast('Demo commit recorded locally · no Git repository was changed.'); }
    } else if (event.target.closest('#runDemo')) { togglePanel(true); $('#terminalInput').focus(); }
  });
  $('#sideContent').addEventListener('input',(event) => {
    if (event.target.id === 'sidebarSearch') {
      const query = event.target.value.trim();
      const results = $('#sideSearchResults');
      if (!query) results.innerHTML = '<div class="sidebar-section-info">Search across the demo project.</div>';
      else {
        const matches = searchFiles(query);
        results.innerHTML = '<div class="section-heading">' + matches.length + ' RESULTS</div>' +
          matches.map((path) => '<button class="search-result" data-file="' + esc(path) + '">' + pathIcon(path) + '<span>' + esc(fileName(path)) + '</span><small>' + esc(path.split('/').slice(0,-1).join('/')) + '</small></button>').join('') +
          (!matches.length ? '<div class="sidebar-section-info">No results.</div>' : '');
      }
    }
    if (event.target.id === 'extensionSearch') renderExtensions(event.target.value);
  });
  $('#tabs').addEventListener('click',(event) => {
    const close = event.target.closest('[data-close]');
    const tab = event.target.closest('[data-tab]');
    if (close) closeTab(close.dataset.close);
    else if (tab) setActiveFile(tab.dataset.tab);
  });
  $('#codeInput').addEventListener('input',editorChanged);
  $('#codeInput').addEventListener('scroll',() => {
    $('#highlightedCode').scrollTop = $('#codeInput').scrollTop;
    $('#highlightedCode').scrollLeft = $('#codeInput').scrollLeft;
    $('#lineNumbers').scrollTop = $('#codeInput').scrollTop;
  });
  $('#codeInput').addEventListener('click',updatePosition);
  $('#codeInput').addEventListener('keyup',updatePosition);
  $('#codeInput').addEventListener('keydown',(event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const field = event.target, start = field.selectionStart, end = field.selectionEnd;
      field.setRangeText('  ',start,end,'end');
      editorChanged();
    }
  });

  // Header, status, and settings.
  $('#themeToggle').addEventListener('click',() => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  $('#openQuick').addEventListener('click',() => openPalette(false));
  $('#openSettingsTop').addEventListener('click',openSettings);
  $('#activitySettings').addEventListener('click',openSettings);
  $('#activityAccount').addEventListener('click',() => showToast('Local preview · no GitHub account is connected.'));
  $('#activityCopilot').addEventListener('click',() => toggleChat());
  $('#togglePanelTop').addEventListener('click',() => togglePanel());
  $('#toggleChatTop').addEventListener('click',() => toggleChat());
  $('#closeTerminal').addEventListener('click',() => togglePanel(false));
  $('#closeChat').addEventListener('click',() => toggleChat(false));
  $('#clearChat').addEventListener('click',() => { state.chatMessages = []; renderChats(); });
  $('#navBack').addEventListener('click',() => { if (state.historyIndex > 0) setActiveFile(state.history[--state.historyIndex],false); });
  $('#navForward').addEventListener('click',() => { if (state.historyIndex < state.history.length-1) setActiveFile(state.history[++state.historyIndex],false); });
  $('#sideNew').addEventListener('click',() => showToast('To add files, edit the files map in src/app.js.'));
  $('#sideMore').addEventListener('click',openSettings);
  $('#splitEditor').addEventListener('click',() => showToast('Split editor is not implemented in this theme preview.'));
  $('#editorMore').addEventListener('click',openSettings);
  $('#statusTheme').addEventListener('click',openSettings);
  $('#statusBranch').addEventListener('click',() => setView('source'));
  $('#statusSync').addEventListener('click',() => showToast('Git sync is not available in this local preview.'));
  $('#statusProblems').addEventListener('click',() => {togglePanel(true);switchTerminalTab('problems');});
  $('#statusRemote').addEventListener('click',() => showToast('Remote development is not connected in this preview.'));
  $('#statusBell').addEventListener('click',() => showToast('No new notifications.'));
  $$('.terminal-tab').forEach((button) => button.addEventListener('click',() => switchTerminalTab(button.dataset.terminalTab)));
  $('#newTerminal').addEventListener('click',() => {switchTerminalTab('terminal');$('#terminalHistory').innerHTML = '';appendTerminal('New preview terminal session.','dim');$('#terminalInput').focus();});
  $('#terminalInput').addEventListener('keydown',(event) => {if(event.key === 'Enter'){event.preventDefault();const cmd=event.target.value;event.target.value='';runTerminal(cmd);}});
  $('#paletteInput').addEventListener('input',() => {state.paletteIndex=0;renderPalette();});
  $('#paletteInput').addEventListener('keydown',(event) => {
    if (event.key === 'ArrowDown') {event.preventDefault();state.paletteIndex=Math.min(state.paletteIndex+1,state.paletteItems.length-1);renderPalette();}
    if (event.key === 'ArrowUp') {event.preventDefault();state.paletteIndex=Math.max(state.paletteIndex-1,0);renderPalette();}
    if (event.key === 'Enter') {event.preventDefault();choosePalette();}
  });
  $('#paletteResults').addEventListener('click',(event) => {const result=event.target.closest('[data-result]');if(result) choosePalette(Number(result.dataset.result));});
  $('#paletteOverlay').addEventListener('click',(event) => {if(event.target.id==='paletteOverlay')closePalette();});
  $('#settingsOverlay').addEventListener('click',(event) => {if(event.target.id==='settingsOverlay')$('#settingsOverlay').classList.add('hidden');});
  $('#closeSettings').addEventListener('click',() => $('#settingsOverlay').classList.add('hidden'));
  $('#doneSettings').addEventListener('click',() => $('#settingsOverlay').classList.add('hidden'));
  $$('.theme-option').forEach((button) => button.addEventListener('click',() => setTheme(button.dataset.themeOption)));
  $('#fontSizeRange').addEventListener('input',(event) => {
    state.fontSize = Number(event.target.value);
    document.documentElement.style.setProperty('--editor-font',state.fontSize+'px');
    $('#fontSizeValue').textContent = state.fontSize + ' px';
    save('font-size',state.fontSize);
  });
  $('#densityToggle').addEventListener('click',toggleDensity);
  $('#minimapToggle').addEventListener('click',toggleMinimap);
  $('#chatForm').addEventListener('submit',(event) => {event.preventDefault();sendChat($('#chatInput').value);});
  $('#chatInput').addEventListener('keydown',(event) => {
    if (event.key === 'Enter' && !event.shiftKey) {event.preventDefault();sendChat(event.target.value);}
  });
  $('#chatSuggestions').addEventListener('click',(event) => {
    const suggestion = event.target.closest('[data-prompt]');
    if (suggestion) sendChat(suggestion.dataset.prompt);
  });
  document.addEventListener('keydown',(event) => {
    const modifier = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();
    if (event.key === 'Escape') {
      closePalette();
      $('#settingsOverlay').classList.add('hidden');
      return;
    }
    if (modifier && key === 'p') {event.preventDefault();openPalette(event.shiftKey);return;}
    if (event.key === 'F1') {event.preventDefault();openPalette(true);return;}
    if (modifier && key === 'j') {event.preventDefault();togglePanel();return;}
    if (modifier && key === 'b') {event.preventDefault();togglePrimary();return;}
    if (modifier && key === 'k' && !event.shiftKey) {event.preventDefault();showToast('Press T to switch themes · or use the appearance settings.');return;}
    if (modifier && event.shiftKey && key === 'e') {event.preventDefault();setView('explorer');return;}
    if (modifier && event.shiftKey && key === 'f') {event.preventDefault();setView('search');return;}
    if (modifier && event.shiftKey && key === 'x') {event.preventDefault();setView('extensions');return;}
    if (modifier && key === 's') {
      const isEditor = document.activeElement === $('#codeInput');
      if (isEditor) {
        event.preventDefault();
        state.dirty.delete(state.activeFile);
        files[state.activeFile].text = codeText(state.activeFile);
        renderTabs();
        if (state.view === 'explorer' || state.view === 'source') renderSidebar();
        showToast('Preview file saved in memory · changes are not written to disk.');
      }
    }
  });
  // Make the resizable terminal panel work with pointer input.
  let resizing = null;
  $('#terminalPanel').addEventListener('pointerdown',(event) => {
    const bounds = $('#terminalPanel').getBoundingClientRect();
    if (event.clientY > bounds.top + 5 || event.clientY < bounds.top - 5) return;
    resizing = {y:event.clientY,h:bounds.height};
    $('#terminalPanel').setPointerCapture(event.pointerId);
  });
  $('#terminalPanel').addEventListener('pointermove',(event) => {
    if (!resizing) return;
    const newHeight = Math.max(92,Math.min(window.innerHeight*.68,resizing.h+resizing.y-event.clientY));
    $('#terminalPanel').style.height = newHeight + 'px';
  });
  $('#terminalPanel').addEventListener('pointerup',() => {resizing=null;});
  $('#terminalPanel').addEventListener('pointercancel',() => {resizing=null;});
})();
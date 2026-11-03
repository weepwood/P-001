# P-001 · VS Code 2026 Theme Lab

An interactive Visual Studio Code-inspired workbench built using the official **Dark 2026** and **Light 2026** palette values and the October 2026 modern UI preview.

> This is an independent front-end UI demo, **not** the full VS Code application, a Monaco editor, a Microsoft product, or a connected Copilot client. Sample files, terminal, changes, extensions, and chat are local simulations.

## Official design references

- [2026-dark.json](https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/2026-dark.json)
- [2026-light.json](https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/2026-light.json)
- [Modernizing the VS Code UI — October 15, 2026](https://code.visualstudio.com/blogs/2026/10/15/modern-ui)
- [VS Code Color Theme documentation](https://code.visualstudio.com/docs/configure/themes)

## Theme mapping

| Element | Dark 2026 | Light 2026 |
| --- | --- | --- |
| Editor background | #121314 | #FFFFFF |
| Editor foreground | #BBBEBF | #202020 |
| Explorer background | #191A1B | #FAFAFD |
| Border | #2A2B2C | #F0F1F2 |
| Status bar background | #191A1B | #FAFAFD |
| Active tab | #121314 | #FFFFFF |

## Features

- Switch between official 2026 light/dark workbench palettes; persist preferences locally.
- Modern editor chrome: title/command center, activity bar, explorer, tabs, breadcrumbs, source editor, line numbers, minimap, terminal, chat sidebar, and status bar.
- Edit the simulated source files with syntax highlighting, indentation, cursor tracking, and dirty-state indicators; changes are in memory only.
- Quick Open files and the command palette, including filtered results and keyboard navigation.
- Local workspace search, simulated extensions and source control, working panel visibility toggles.
- Appearance modal: color scheme, editor font size, compact layout, minimap controls.
- Simulated terminal commands (help, ls, pwd, clear, whoami, theme dark/light, echo, cat) and static chat demo responses. Nothing connects to an actual terminal, model, or remote repository.
- Responsive workbench and reduced-motion styles.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl/Cmd + P | Quick Open |
| Ctrl/Cmd + Shift + P or F1 | Command Palette |
| Ctrl/Cmd + B | Toggle Explorer |
| Ctrl/Cmd + J | Toggle Terminal panel |
| Ctrl/Cmd + Shift + E/F/X | Explorer / Search / Extensions |
| Ctrl/Cmd + S inside editor | Mark a preview file saved in memory |
| Esc | Dismiss dialog |

## Run locally

No dependencies, build step, external fonts, or API keys required. Open index.html in a browser or serve the repository with Python's built-in HTTP server:

    python3 -m http.server 4173

Visit http://localhost:4173/.

## GitHub Pages

GitHub Actions validates pull requests and publishes to GitHub Pages after changes merge into main. Enable **Settings → Pages → Build and deployment → Source → GitHub Actions**. Once the workflow finishes successfully the intended public URL is https://weepwood.github.io/P-001/ . This URL is not guaranteed to work until repository Pages settings and the deployment are completed.

## Source layout

- index.html — semantic shell and inline vector icon set
- src/styles.css — theme variables, panels, responsive layouts
- src/app.js — client-side state and interaction demo
- tests/workbench.test.mjs — Node built-in static verification
- .github/workflows/pages.yml — CI and Pages publish workflow
- favicon.svg — local vector icon

## Attribution

Theme values and design direction are based on the [MIT-licensed Microsoft VS Code source](https://github.com/microsoft/vscode/blob/main/LICENSE.txt), credited to Microsoft. This project implements its own markup, styles, and demo logic, and does not bundle proprietary services. Illustrative React project code shown within the demo is fictional and does not represent the files of this static demo.
## Frosted Glass UI · modular overlay system (2026)

A lightweight, reusable **real backdrop-filter material** for Command Palette, Quick Open, popovers, menus, hover cards, dialogs and toasts. The editor canvas and persistent sidebars remain solid. The demo exposes a palette button in the title bar and live **blur / background opacity / enable** controls inside **Customize appearance**. Preferences persist via localStorage. The original workbench search, editing, navigation and shortcuts remain intact.

**Accuracy note:** VS Code's current `frostedGlass.css` applies `blur(12px)` to isolated `::before` layers, guarded by `color-mix` support and accessibility preferences. Its Electron contribution also checks native GPU compositing and the official opacity default is **92%**. This project's configurable demonstration deliberately **starts at 80%**, as requested; it is *inspired by*, not a vendored copy of, the VS Code implementation.

- [Official frostedGlass.css](https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/modernUI/browser/media/frostedGlass.css)
- [Official frostedGlass.contribution.ts](https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/modernUI/electron-browser/frostedGlass.contribution.ts)

### Files

| Path | Responsibility |
| --- | --- |
| `src/glass/glass-tokens.css` | VS Code 2026 theme colors, shared blur/opacity/shape variables |
| `src/glass/glass.css` | Isolated pseudo-element backdrop filter, progressive enhancement and accessibility fallbacks |
| `src/glass/glass-motion.css` | Short transform-only entry animation, reduced-motion support |
| `src/glass/glass-presets.css` | Command/menu/popover/dialog/tooltip/notification presets, demo styles |
| `src/glass/components.js` | Dependency-free `GlassSurface`, `GlassPopover`, `GlassCommandPalette` classes |
| `src/glass/controller.js` | P-001-specific localStorage, live control sliders and demo menu |
| `adapters/` | Optional Vue 3 and React wrappers (requires the host project's framework) |
| `tests/glass.test.mjs` | Material contract, DOM bindings, settings and class API tests |

### HTML / vanilla JS

Copy `src/glass/glass-*.css` and `src/glass/components.js` into any project, include the files in the order listed above, and set `data-glass="enabled"` on an ancestor. **Load `components.js` before the code using its classes.** `controller.js` is only for this demo.

```html
<div data-glass="enabled" data-theme="dark">
  <button id="menu-trigger">Open menu</button>
  <div id="menu-panel" hidden role="menu">
    <button role="menuitem">Example action</button>
  </div>
</div>
<script>
  const { GlassSurface, GlassPopover, GlassCommandPalette } = window.FrostedGlassUI;
  const surface = new GlassSurface(document.querySelector('#menu-panel'),
    { theme: 'auto', variant: 'menu', blur: 12, opacity: 80, radius: 10 });
  const popover = new GlassPopover({
    trigger: document.querySelector('#menu-trigger'),
    panel: document.querySelector('#menu-panel')
  });
  // Later: popover.destroy(); surface.destroy();
</script>
```

For a command interface use an overlay with `class="hidden"`, a nested `role="dialog"` and input, then call `new GlassCommandPalette(overlay, {input}).show()` / `.hide()`. Existing command search behavior is provided by the host app; this class manages display, focus restoration and Tab containment.

### API / parameters

| Parameter | Default | Limits / behavior |
| --- | --- | --- |
| `theme` | `auto` | `light / dark / auto`; inherits outer `data-theme` or color-scheme |
| `blur` | `12` | 0–40 CSS px per surface, demo slider 0–24 |
| `opacity` | `80` | 50–100% tint, not the whole element's opacity |
| `radius` | `10` | 0–32 CSS px; default overridden by semantic presets |
| `variant` | `popover` | `command / menu / popover / dialog / tooltip / notification` |
| `disabled` | `false` | Solid background for one surface, even when its ancestor allows blur |
| `data-glass` | `disabled` unless enabled | Ancestor-level enable / disable; no backdrop blur on unsupported engines |

`GlassSurface.update({blur, opacity, radius, theme, variant, disabled})` changes per-instance CSS variables; `destroy()` removes instance tokens. Global settings can be updated with `FrostedGlassUI.setOptions({enabled, blur, opacity})` in P-001. Other projects should implement their own preference manager and set `--glass-blur`, `--glass-opacity`, `data-glass` on an ancestor.

### Vue 3, React, Electron, Tauri

The same CSS variables and material rules work in all Chromium/WebView hosts. Optional wrappers are provided in `adapters/vue` and `adapters/react`. The framework applications supply focus, outside-click and dialog state as usual or instantiate the dependency-free JS primitives in mount/effect hooks. Native app Electron integrations should call `FrostedGlassUI.setGpuCompositingAvailable(true|false)` using their own trusted native bridge; **do not infer GPU support from user-agent strings**. This demo defaults to CSS capability detection because ordinary browsers cannot reliably query GPU compositing state. Tauri follows the browser's rendering engine and does not require a native shader.

### Accessibility, support, and performance

No transparency of interactive content: blur applies only to the `::before` paint layer. `@supports` checks both `backdrop-filter` (including WebKit spelling) and `color-mix()`; absent support leaves a solid, functional surface. `prefers-reduced-transparency: reduce` and `forced-colors: active` force opaque color fallback; `prefers-reduced-motion: reduce` suppresses animations. Popovers preserve keyboard Escape/Arrow navigation and return focus; the command dialog contains Tab and restores focus. Blur is limited to small, temporary floating surfaces, never the full workbench. There is no persistent `will-change`, shader dependency, remote font or third-party runtime dependency.

**Verification:** `node --check src/app.js && node --check src/glass/components.js && node --check src/glass/controller.js && node --test tests/*.test.mjs`. In Chromium, test light/dark, F1, Ctrl/Cmd+P, keyboard arrows/Enter/Escape, the sliders, accessibility media emulation, and GPU-disabled opaque fallback. Browser-side visual assertions require a browser run; Node tests cover the static contract and the JS surface API. 

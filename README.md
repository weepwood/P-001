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
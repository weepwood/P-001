import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const material = read('src/glass/glass.css');
const tokens = read('src/glass/glass-tokens.css');
const presets = read('src/glass/glass-presets.css');
const motion = read('src/glass/glass-motion.css');
const controller = read('src/glass/controller.js');
const components = read('src/glass/components.js');
const workflow = read('.github/workflows/pages.yml');

test('glass is restricted to semantic floating surfaces with accessible fallbacks', () => {
  assert.match(material, /::before/);
  assert.match(material, /isolation: isolate/);
  assert.match(material, /pointer-events: none/);
  assert.match(material, /backdrop-filter: blur\(var\(--glass-blur/);
  assert.match(material, /color-mix\(in srgb/);
  assert.match(material, /prefers-reduced-transparency: reduce/);
  assert.match(material, /forced-colors: active/);
  assert.match(material, /-webkit-backdrop-filter/);
  assert.doesNotMatch(material, /\bwill-change\s*:/);
  for (const variant of ['command','menu','popover','dialog','tooltip','notification']) {
    assert.ok(presets.includes('data-glass-variant="' + variant + '"'), variant);
  }
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(tokens, /--glass-blur: 12px/);
  assert.match(tokens, /--glass-opacity: 80%/);
});

test('real UI connects sliders, toggle, command palette, popover and theme surfaces', () => {
  for (const id of ['glassToggle','glassBlur','glassOpacity','glassBlurValue','glassOpacityValue','glassCapability','glassDemoTrigger','glassDemoMenu']) {
    assert.match(html, new RegExp('id="' + id + '"'));
    assert.ok(controller.includes("'" + '#' + id + "'") || controller.includes(id), id);
  }
  assert.match(html, /class="quick-pick glass-surface glass-enter"/);
  assert.match(html, /class="settings-modal glass-surface glass-enter"/);
  assert.match(html, /data-glass-variant="notification"/);
  assert.match(html, /src\/glass\/controller\.js/);
  assert.match(controller, /localStorage/);
  assert.match(controller, /setGpuCompositingAvailable/);
  assert.match(read('src/app.js'), /new window\.FrostedGlassUI\.GlassCommandPalette/);
  assert.match(workflow, /cp -R src\/glass _site\/src\/glass/);
  assert.match(workflow, /node --test tests\/\*\.test\.mjs/);
});

test('GlassSurface class clamps values, changes theme and supports solid fallback', () => {
  class MockEl {
    constructor() {
      this.dataset = {};
      const attrs = {};
      this.attrs = attrs;
      this.style = {
        setProperty(name, value) { attrs[name] = value; },
        removeProperty(name) { delete attrs[name]; }
      };
      const names = new Set();
      this.classList = { add: x => names.add(x), remove: x => names.delete(x), contains: x => names.has(x) };
    }
  }
  const context = { window: {}, Element: MockEl };
  runInNewContext(components, context);
  const { GlassSurface, GlassPopover, GlassCommandPalette, clamp } = context.window.FrostedGlassUI;
  assert.equal(clamp(200, 50, 100, 80), 100);
  assert.equal(clamp(NaN, 50, 100, 80), 80);
  assert.equal(typeof GlassPopover, 'function');
  assert.equal(typeof GlassCommandPalette, 'function');
  const element = new MockEl();
  const glass = new GlassSurface(element, { theme: 'light', variant: 'menu', blur: 100, opacity: 20, radius: -1, disabled: true });
  assert.equal(element.attrs['--glass-blur'], '40px');
  assert.equal(element.attrs['--glass-opacity'], '50%');
  assert.equal(element.attrs['--glass-radius'], '0px');
  assert.equal(element.dataset.glassTheme, 'light');
  assert.equal(element.dataset.glassVariant, 'menu');
  assert.equal(element.dataset.glassDisabled, 'true');
  glass.update({theme: 'auto', disabled: false, blur: 8, opacity: 93});
  assert.equal(element.dataset.glassTheme, undefined);
  assert.equal(element.dataset.glassDisabled, undefined);
  assert.equal(element.attrs['--glass-blur'], '8px');
  assert.equal(element.attrs['--glass-opacity'], '93%');
  glass.destroy();
  assert.equal(element.classList.contains('glass-surface'), false);
  assert.equal(Object.keys(element.attrs).length, 0);
});

test('framework adapters use the same material CSS', () => {
  assert.match(read('adapters/vue/GlassSurface.vue'), /glass\.css/);
  assert.match(read('adapters/react/GlassSurface.jsx'), /glass\.css/);
  assert.match(read('adapters/vue/GlassSurface.vue'), /data-glass-disabled/);
  assert.match(read('adapters/react/GlassSurface.jsx'), /data-glass-disabled/);
});

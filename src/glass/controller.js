/* P-001 integration: preferences, fallbacks, settings controls and a live menu.
   Core primitives remain reusable independently of this file. */
(function (global) {
  'use strict';
  const api = global.FrostedGlassUI;
  const STORAGE = 'p001-glass-preferences';
  const $ = (selector) => document.querySelector(selector);
  const clamp = api.clamp;
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}') || {}; } catch { return {}; } })();
  const state = { enabled: saved.enabled !== false, blur: clamp(saved.blur, 0, 24, 12), opacity: clamp(saved.opacity, 50, 100, 80), gpuAvailable: true };
  const supportsBlur = !!(global.CSS && (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)')));
  const supportsMix = !!(global.CSS && CSS.supports('background-color', 'color-mix(in srgb, black 80%, transparent)'));
  const reducedTransparency = global.matchMedia('(prefers-reduced-transparency: reduce)');
  const forcedColors = global.matchMedia('(forced-colors: active)');
  const persist = () => { try { localStorage.setItem(STORAGE, JSON.stringify({ enabled: state.enabled, blur: state.blur, opacity: state.opacity })); } catch { /* private mode */ } };
  const capabilityReason = () => {
    if (!state.enabled) return 'Glass disabled · solid color fallback';
    if (!state.gpuAvailable) return 'GPU compositing disabled · solid color fallback';
    if (!supportsBlur || !supportsMix) return 'Browser lacks backdrop-filter or color-mix · solid color fallback';
    if (reducedTransparency.matches) return 'Reduced transparency preference · solid color fallback';
    if (forcedColors.matches) return 'High contrast enabled · solid color fallback';
    return 'Backdrop-filter supported · live blur enabled for overlays';
  };
  function apply() {
    document.body.dataset.glass = state.enabled && state.gpuAvailable ? 'enabled' : 'disabled';
    document.documentElement.style.setProperty('--glass-blur', state.blur + 'px');
    document.documentElement.style.setProperty('--glass-opacity', state.opacity + '%');
    const toggle = $('#glassToggle');
    if (toggle) {
      toggle.classList.toggle('checked', state.enabled);
      toggle.setAttribute('aria-checked', String(state.enabled));
    }
    if ($('#glassBlur')) $('#glassBlur').value = String(state.blur);
    if ($('#glassOpacity')) $('#glassOpacity').value = String(state.opacity);
    if ($('#glassBlurValue')) $('#glassBlurValue').textContent = state.blur + ' px';
    if ($('#glassOpacityValue')) $('#glassOpacityValue').textContent = state.opacity + '%';
    if ($('#glassCapability')) $('#glassCapability').textContent = capabilityReason();
  }
  function setOptions(options = {}) {
    if ('enabled' in options) state.enabled = !!options.enabled;
    if ('blur' in options) state.blur = clamp(options.blur, 0, 24, 12);
    if ('opacity' in options) state.opacity = clamp(options.opacity, 50, 100, 80);
    persist(); apply();
    return { ...state };
  }
  function setGpuCompositingAvailable(available) { state.gpuAvailable = available === true; apply(); }
  api.preferences = state;
  api.setOptions = setOptions;
  // Electron integrations should call this with nativeHost GPU capability.
  api.setGpuCompositingAvailable = setGpuCompositingAvailable;
  function init() {
    apply();
    $('#glassToggle')?.addEventListener('click', () => setOptions({ enabled: !state.enabled }));
    $('#glassBlur')?.addEventListener('input', e => setOptions({ blur: Number(e.target.value) }));
    $('#glassOpacity')?.addEventListener('input', e => setOptions({ opacity: Number(e.target.value) }));
    const trigger = $('#glassDemoTrigger'), panel = $('#glassDemoMenu');
    if (trigger && panel) {
      const actions = {
        command: () => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F1', bubbles: true })); },
        files: () => { $('#openQuick')?.click(); },
        appearance: () => { $('#openSettingsTop')?.click(); },
        toggle: () => setOptions({ enabled: !state.enabled })
      };
      api.demoPopover = new api.GlassPopover({ trigger, panel, onAction: key => actions[key]?.() });
    }
    reducedTransparency.addEventListener?.('change', apply);
    forcedColors.addEventListener?.('change', apply);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(window);

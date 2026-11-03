/* Dependency-free primitives for browser/Electron/Tauri; optional framework adapters
   can wrap these classes without copying the CSS material implementation. */
(function (global) {
  'use strict';
  const variants = new Set(['command', 'menu', 'popover', 'dialog', 'tooltip', 'notification']);
  const themes = new Set(['auto', 'light', 'dark']);
  const clamp = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Number(value))) : fallback;
  function GlassSurface(element, options = {}) {
    if (!(element instanceof Element)) throw new TypeError('GlassSurface expects an Element');
    this.element = element;
    element.classList.add('glass-surface');
    this.update(options);
  }
  GlassSurface.prototype.update = function (options = {}) {
    const el = this.element;
    if (options.variant !== undefined) el.dataset.glassVariant = variants.has(options.variant) ? options.variant : 'popover';
    if (options.theme !== undefined) {
      if (themes.has(options.theme) && options.theme !== 'auto') el.dataset.glassTheme = options.theme;
      else delete el.dataset.glassTheme;
    }
    if (options.blur !== undefined) el.style.setProperty('--glass-blur', clamp(options.blur, 0, 40, 12) + 'px');
    if (options.opacity !== undefined) el.style.setProperty('--glass-opacity', clamp(options.opacity, 50, 100, 80) + '%');
    if (options.radius !== undefined) el.style.setProperty('--glass-radius', clamp(options.radius, 0, 32, 10) + 'px');
    if (options.disabled !== undefined) {
      if (options.disabled) el.dataset.glassDisabled = 'true';
      else delete el.dataset.glassDisabled;
    }
    return this;
  };
  GlassSurface.prototype.destroy = function () {
    const el = this.element;
    el.classList.remove('glass-surface');
    delete el.dataset.glassTheme;
    delete el.dataset.glassVariant;
    delete el.dataset.glassDisabled;
    for (const key of ['--glass-blur', '--glass-opacity', '--glass-radius']) el.style.removeProperty(key);
  };
  function GlassPopover({ trigger, panel, onAction } = {}) {
    if (!(trigger instanceof Element) || !(panel instanceof Element)) throw new TypeError('GlassPopover requires trigger and panel');
    this.trigger = trigger;
    this.panel = panel;
    this.onAction = onAction;
    this.surface = new GlassSurface(panel, { variant: 'menu' });
    panel.hidden = true;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    this.onTrigger = () => this.toggle();
    this.onDocumentPointer = (event) => { if (!this.panel.hidden && !panel.contains(event.target) && !trigger.contains(event.target)) this.hide(false); };
    this.onKey = (event) => {
      if (this.panel.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); this.hide(true); }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const items = Array.from(panel.querySelectorAll('[role="menuitem"]:not([disabled])'));
        if (!items.length) return;
        event.preventDefault();
        const next = (items.indexOf(document.activeElement) + (event.key === 'ArrowDown' ? 1 : items.length - 1) + items.length) % items.length;
        items[next].focus();
      }
    };
    this.onPanelClick = (event) => {
      const action = event.target.closest('[data-glass-action]');
      if (!action || !panel.contains(action)) return;
      if (typeof this.onAction === 'function') this.onAction(action.dataset.glassAction);
      this.hide(true);
    };
    this.onResize = () => { if (!panel.hidden) this.position(); };
    trigger.addEventListener('click', this.onTrigger);
    panel.addEventListener('keydown', this.onKey);
    panel.addEventListener('click', this.onPanelClick);
    document.addEventListener('pointerdown', this.onDocumentPointer);
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('scroll', this.onResize, true);
  }
  GlassPopover.prototype.position = function () {
    const rect = this.trigger.getBoundingClientRect();
    const width = this.panel.offsetWidth || 265;
    const height = this.panel.offsetHeight || 160;
    this.panel.style.left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.right - width)) + 'px';
    this.panel.style.top = (rect.bottom + 7 + height < window.innerHeight ? rect.bottom + 7 : Math.max(12, rect.top - height - 7)) + 'px';
  };
  GlassPopover.prototype.show = function () {
    this.panel.hidden = false;
    this.panel.classList.add('glass-enter');
    this.position();
    this.trigger.setAttribute('aria-expanded', 'true');
    const first = this.panel.querySelector('[role="menuitem"]');
    if (first) first.focus();
  };
  GlassPopover.prototype.hide = function (restoreFocus = true) {
    if (this.panel.hidden) return;
    this.panel.hidden = true;
    this.trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) this.trigger.focus();
  };
  GlassPopover.prototype.toggle = function () { this.panel.hidden ? this.show() : this.hide(true); };
  GlassPopover.prototype.destroy = function () {
    this.trigger.removeEventListener('click', this.onTrigger);
    this.panel.removeEventListener('keydown', this.onKey);
    this.panel.removeEventListener('click', this.onPanelClick);
    document.removeEventListener('pointerdown', this.onDocumentPointer);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onResize, true);
    this.surface.destroy();
  };
  function GlassCommandPalette(overlay, { input } = {}) {
    if (!(overlay instanceof Element)) throw new TypeError('GlassCommandPalette expects overlay Element');
    this.overlay = overlay;
    this.input = input || overlay.querySelector('input');
    this.previousFocus = null;
    this.surface = new GlassSurface(overlay.querySelector('[role="dialog"]') || overlay, { variant: 'command' });
    this.onTab = (event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...overlay.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    overlay.addEventListener('keydown', this.onTab);
  }
  GlassCommandPalette.prototype.show = function () {
    if (this.overlay.classList.contains('hidden')) this.previousFocus = document.activeElement;
    this.overlay.classList.remove('hidden');
    if (this.input) this.input.focus();
  };
  GlassCommandPalette.prototype.hide = function () {
    if (this.overlay.classList.contains('hidden')) return;
    this.overlay.classList.add('hidden');
    if (this.previousFocus && this.previousFocus.isConnected) this.previousFocus.focus();
  };
  GlassCommandPalette.prototype.destroy = function () { this.overlay.removeEventListener('keydown', this.onTab); this.surface.destroy(); };
  global.FrostedGlassUI = Object.assign(global.FrostedGlassUI || {}, { GlassSurface, GlassPopover, GlassCommandPalette, clamp });
})(window);

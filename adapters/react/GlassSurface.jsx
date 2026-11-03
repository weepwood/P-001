import React from 'react';
import '../../src/glass/glass-tokens.css';
import '../../src/glass/glass.css';
import '../../src/glass/glass-motion.css';
import '../../src/glass/glass-presets.css';

// Wrap inside an ancestor with data-glass="enabled". The host controls open state.
export function GlassSurface({
  as: Element = 'div', theme = 'auto', variant = 'popover',
  blur = 12, opacity = 80, radius = 10, disabled = false,
  style, className = '', children, ...rest
}) {
  return (
    <Element {...rest}
      className={['glass-surface', className].filter(Boolean).join(' ')}
      data-glass-variant={variant}
      data-glass-theme={theme === 'auto' ? undefined : theme}
      data-glass-disabled={disabled ? 'true' : undefined}
      style={{
        '--glass-blur': `${Math.min(40, Math.max(0, blur))}px`,
        '--glass-opacity': `${Math.min(100, Math.max(50, opacity))}%`,
        '--glass-radius': `${Math.min(32, Math.max(0, radius))}px`,
        ...style
      }}>
      {children}
    </Element>
  );
}

<script setup>
import { computed } from 'vue';
import '../../src/glass/glass-tokens.css';
import '../../src/glass/glass.css';
import '../../src/glass/glass-motion.css';
import '../../src/glass/glass-presets.css';
const props = defineProps({
  as: { type: String, default: 'div' },
  theme: { type: String, default: 'auto' },
  variant: { type: String, default: 'popover' },
  blur: { type: Number, default: 12 },
  opacity: { type: Number, default: 80 },
  radius: { type: Number, default: 10 },
  disabled: { type: Boolean, default: false }
});
const vars = computed(() => ({
  '--glass-blur': Math.max(0, Math.min(40, props.blur)) + 'px',
  '--glass-opacity': Math.max(50, Math.min(100, props.opacity)) + '%',
  '--glass-radius': Math.max(0, Math.min(32, props.radius)) + 'px'
}));
</script>
<template>
  <component :is="as" class="glass-surface" :style="vars"
    :data-glass-variant="variant"
    :data-glass-theme="theme === 'auto' ? undefined : theme"
    :data-glass-disabled="disabled ? 'true' : undefined">
    <slot />
  </component>
</template>

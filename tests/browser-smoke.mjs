/* Browser integration smoke test using only Node 22 + system Chromium/Chrome.
   Execute: node tests/browser-smoke.mjs. CI has Google Chrome preinstalled. */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, join, resolve, sep, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const freePort = async () => new Promise((resolve, reject) => {
  const server = createNetServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    server.close(() => resolve(port));
  });
});
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.next = 0;
    this.pending = new Map();
    ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      if (!msg.id || !this.pending.has(msg.id)) return;
      const {resolve, reject, timeout} = this.pending.get(msg.id);
      clearTimeout(timeout);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    };
  }
  send(method, params = {}) {
    const id = ++this.next;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { this.pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, 12000);
      this.pending.set(id, {resolve, reject, timeout});
      this.ws.send(JSON.stringify({id, method, params}));
    });
  }
  async eval(expression) {
    const response = await this.send('Runtime.evaluate', {expression, awaitPromise: true, returnByValue: true});
    if (response.exceptionDetails) throw new Error('Browser script error: ' + response.exceptionDetails.text);
    return response.result.value;
  }
}
const chrome = [process.env.CHROME_BIN, 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].filter(Boolean)
  .find(binary => spawnSync('which', [binary], {encoding:'utf8'}).status === 0);
if (!chrome) throw new Error('Chromium/Chrome not installed (set CHROME_BIN)');
const httpPort = await freePort(), debugPort = await freePort();
const contentType = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml' };
const server = createHttpServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep)) { res.writeHead(403); return res.end(); }
    const body = readFileSync(file);
    res.writeHead(200, {'Content-Type': (contentType[extname(file)] || 'application/octet-stream') + '; charset=utf-8'});
    res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(httpPort, '127.0.0.1', resolve));
const profile = mkdtempSync(join(tmpdir(), 'p001-glass-chrome-'));
const processChrome = spawn(chrome, [
  '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
  '--remote-allow-origins=*', '--remote-debugging-port=' + debugPort,
  '--user-data-dir=' + profile, 'about:blank'
], {stdio: 'ignore'});
let client;
try {
  let endpoint = null;
  for (let attempt=0; attempt<100; attempt++) {
    if (processChrome.exitCode !== null) throw new Error('Chrome exited before DevTools became ready');
    try {
      const tabs = await (await fetch('http://127.0.0.1:' + debugPort + '/json/list')).json();
      endpoint = tabs.find(tab => tab.type === 'page')?.webSocketDebuggerUrl;
      if (endpoint) break;
    } catch { /* not ready */ }
    await sleep(100);
  }
  if (!endpoint) throw new Error('Chrome DevTools connection did not start');
  const ws = new WebSocket(endpoint);
  await new Promise((resolve,reject) => { ws.onopen = resolve; ws.onerror = reject; });
  client = new CDP(ws);
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Page.navigate', {url:'http://127.0.0.1:' + httpPort + '/'});
  let loaded = false;
  for (let attempt=0; attempt<100; attempt++) {
    loaded = await client.eval("document.readyState === 'complete' && !!window.FrostedGlassUI && !!document.querySelector('#glassDemoTrigger')");
    if (loaded) break;
    await sleep(100);
  }
  assert.ok(loaded, 'workbench and frost glass controller loaded');
  const errors = await client.eval("Array.from(document.querySelectorAll('script[src]')).map(s => ({src:s.src,loaded:!!s.src}))");
  assert.equal(errors.length, 3);
  assert.deepEqual(await client.eval("({theme:document.body.dataset.theme,glass:document.body.dataset.glass,opacity:document.documentElement.style.getPropertyValue('--glass-opacity')})"), {theme:'dark',glass:'enabled',opacity:'80%'});

  assert.deepEqual(await client.eval(`(() => {document.querySelector('#openQuick').click();return {open:!document.querySelector('#paletteOverlay').classList.contains('hidden'),focus:document.activeElement.id,count:document.querySelectorAll('.quick-result').length};})()`),
    {open:true,focus:'paletteInput',count:14});
  const pseudo = await client.eval("({blur:getComputedStyle(document.querySelector('.quick-pick'),'::before').backdropFilter || getComputedStyle(document.querySelector('.quick-pick'),'::before').webkitBackdropFilter, editor:getComputedStyle(document.querySelector('.main-editor')).backdropFilter})");
  assert.match(pseudo.blur, /blur\(12px\)/, 'true backdrop blur should be active');
  assert.ok(!pseudo.editor || pseudo.editor === 'none', 'editor should not blur');
  await client.eval("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
  assert.equal(await client.eval("document.querySelector('#paletteOverlay').classList.contains('hidden')"), true);

  const settings = await client.eval(`(() => {
    document.querySelector('#openSettingsTop').click();
    document.querySelector('[data-theme-option="light"]').click();
    const blur = document.querySelector('#glassBlur');
    blur.value = '7'; blur.dispatchEvent(new Event('input',{bubbles:true}));
    const opacity = document.querySelector('#glassOpacity');
    opacity.value = '65'; opacity.dispatchEvent(new Event('input',{bubbles:true}));
    return {theme:document.body.dataset.theme,blur:document.documentElement.style.getPropertyValue('--glass-blur'),opacity:document.documentElement.style.getPropertyValue('--glass-opacity'),focus:document.activeElement.id};
  })()`);
  assert.deepEqual(settings,{theme:'light',blur:'7px',opacity:'65%',focus:'closeSettings'});
  assert.equal(await client.eval(`(() => {document.querySelector('#glassToggle').click();return document.body.dataset.glass;})()`),'disabled');
  assert.equal(await client.eval("getComputedStyle(document.querySelector('.settings-modal')).backgroundColor === 'rgba(0, 0, 0, 0)'"),false);
  await client.eval("document.querySelector('#glassToggle').click();document.querySelector('#doneSettings').click();");

  const popup = await client.eval(`(() => {
    document.querySelector('#glassDemoTrigger').click();
    const open = !document.querySelector('#glassDemoMenu').hidden;
    const focus = document.activeElement.getAttribute('role');
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    return {open,focus,closed:document.querySelector('#glassDemoMenu').hidden,restored:document.activeElement.id};
  })()`);
  assert.deepEqual(popup,{open:true,focus:'menuitem',closed:true,restored:'glassDemoTrigger'});
  const popupCommand = await client.eval(`(() => {
    document.querySelector('#glassDemoTrigger').click();
    document.querySelector('[data-glass-action="command"]').click();
    return {menuClosed:document.querySelector('#glassDemoMenu').hidden,paletteOpen:!document.querySelector('#paletteOverlay').classList.contains('hidden'),focused:document.activeElement.id};
  })()`);
  assert.deepEqual(popupCommand,{menuClosed:true,paletteOpen:true,focused:'paletteInput'});
  await client.eval("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))");
  assert.equal(await client.eval(`(() => {window.FrostedGlassUI.setGpuCompositingAvailable(false);const value=document.body.dataset.glass;window.FrostedGlassUI.setGpuCompositingAvailable(true);return value;})()`),'disabled');

  await client.send('Emulation.setEmulatedMedia',{features:[{name:'forced-colors',value:'active'}]});
  const forced = await client.eval("({active:matchMedia('(forced-colors: active)').matches, content:getComputedStyle(document.querySelector('.quick-pick'),'::before').content})");
  assert.equal(forced.active,true);
  assert.equal(forced.content,'none');
  await client.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  assert.equal(await client.eval("getComputedStyle(document.querySelector('.glass-enter')).animationName"),'none');
  console.log('Chromium smoke passed: palettes, focus, CSS blur, theme, sliders, opaque fallbacks, reduced motion');
} finally {
  client?.ws?.close();
  processChrome.kill('SIGTERM');
  server.close();
  await sleep(200);
  rmSync(profile,{recursive:true,force:true});
}

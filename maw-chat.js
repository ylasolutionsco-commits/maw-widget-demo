/* Manchester AI Workforce — A01 web chat widget. No dependencies.
 * Embed on the client's site:
 *   <script src="maw-chat.js" data-widget-id="ancoats-widget"
 *           data-endpoint="https://<project>.supabase.co/functions/v1/chat" defer></script>
 * The widget id only selects the clinic; the server checks the page origin and rate limits.
 */
(() => {
  const me = document.currentScript;
  const WIDGET = me?.dataset.widgetId;
  const ENDPOINT = me?.dataset.endpoint;
  if (!WIDGET || !ENDPOINT) return console.warn('maw-chat: data-widget-id and data-endpoint are required');
  const KEY = `maw-chat:${WIDGET}`;
  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; } },
    set(v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode: session lasts this page only */ } },
  };

  const host = document.createElement('div');
  host.id = 'maw-chat-host';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
<style>
  :host { all: initial; }
  * { box-sizing: border-box; }
  .w { --ink:#16302b; --paper:#ffffff; --mist:#eef4f1; --line:#cfdcd6; --accent:#1f6b57; --accent-ink:#ffffff; --warn:#8a3b12; --warn-bg:#fdf1e8;
       font: 15px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: var(--ink); }
  @media (prefers-color-scheme: dark) {
    .w { --ink:#e3eeea; --paper:#14201d; --mist:#1c2b27; --line:#2e4540; --accent:#5fbf9f; --accent-ink:#0d1a17; --warn:#f2b48e; --warn-bg:#3a2216; }
  }
  .launch { position: fixed; right: calc(20px + env(safe-area-inset-right, 0px)); bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    z-index: 2147483000; border: 0; border-radius: 999px; padding: 12px 18px; background: var(--accent); color: var(--accent-ink);
    font: 600 15px/1 inherit; font-family: inherit; box-shadow: 0 6px 20px rgb(0 0 0 / .18); cursor: pointer; display: flex; gap: 8px; align-items: center; }
  .launch:focus-visible, button:focus-visible, textarea:focus-visible, a:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
  .panel { position: fixed; right: calc(20px + env(safe-area-inset-right, 0px)); bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    z-index: 2147483001; width: min(380px, calc(100vw - 40px)); height: min(600px, calc(100vh - 40px));
    background: var(--paper); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 12px 40px rgb(0 0 0 / .22);
    display: flex; flex-direction: column; overflow: hidden; }
  @media (max-width: 480px) { .panel { inset: 0; width: 100%; height: 100%; border-radius: 0; border: 0;
    padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px); } }
  [hidden] { display: none !important; }
  header { padding: 12px 14px; border-bottom: 1px solid var(--line); display: flex; gap: 10px; align-items: flex-start; }
  header .t { flex: 1; min-width: 0; }
  header b { display: block; font-size: 15px; }
  header small { display: block; color: color-mix(in srgb, var(--ink) 70%, transparent); font-size: 12.5px; }
  header small a { color: inherit; }
  .x { border: 0; background: transparent; color: var(--ink); font-size: 22px; line-height: 1; padding: 4px 8px; cursor: pointer; border-radius: 6px; }
  .log { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; background: var(--mist); }
  .m { max-width: 85%; padding: 9px 12px; border-radius: 12px; white-space: pre-wrap; overflow-wrap: anywhere; }
  .m.bot { background: var(--paper); border: 1px solid var(--line); align-self: flex-start; border-bottom-left-radius: 4px; }
  .m.me { background: var(--accent); color: var(--accent-ink); align-self: flex-end; border-bottom-right-radius: 4px; }
  .m.note { align-self: center; max-width: 100%; font-size: 12.5px; background: transparent; color: color-mix(in srgb, var(--ink) 70%, transparent); text-align: center; }
  .m.err { background: var(--warn-bg); color: var(--warn); align-self: stretch; max-width: 100%; display: flex; gap: 8px; align-items: center; justify-content: space-between; }
  .m.err button { border: 1px solid currentColor; background: transparent; color: inherit; border-radius: 6px; padding: 4px 10px; cursor: pointer; font: inherit; }
  .dots { display: inline-flex; gap: 4px; } .dots i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: .4; animation: b 1.2s infinite; }
  .dots i:nth-child(2) { animation-delay: .2s } .dots i:nth-child(3) { animation-delay: .4s }
  @keyframes b { 0%,80%,100% { opacity: .25 } 40% { opacity: .9 } }
  @media (prefers-reduced-motion: reduce) { .dots i { animation: none; opacity: .6 } }
  form { border-top: 1px solid var(--line); padding: 10px; display: flex; gap: 8px; align-items: flex-end; background: var(--paper); }
  textarea { flex: 1; min-width: 0; resize: none; max-height: 120px; border: 1px solid var(--line); border-radius: 10px; padding: 9px 10px;
    font: inherit; color: var(--ink); background: var(--paper); }
  .send { border: 0; background: var(--accent); color: var(--accent-ink); border-radius: 10px; padding: 10px 14px; font: 600 14px/1 inherit; font-family: inherit; cursor: pointer; }
  .send:disabled { opacity: .5; cursor: default; }
  .human { border: 0; background: transparent; color: var(--accent); text-decoration: underline; cursor: pointer; font: inherit; font-size: 13px; padding: 0 14px 10px; text-align: left; background: var(--paper); }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
<div class="w">
  <button class="launch" type="button" aria-haspopup="dialog" aria-controls="maw-panel"><span aria-hidden="true">💬</span> Chat or book</button>
  <section class="panel" id="maw-panel" role="dialog" aria-modal="false" aria-labelledby="maw-title" hidden>
    <header>
      <div class="t"><b id="maw-title">Booking assistant</b>
        <small>Automated assistant, not a person or clinician. <a class="privacy" target="_blank" rel="noopener">Privacy</a></small></div>
      <button class="x" type="button" aria-label="Close chat">×</button>
    </header>
    <div class="log" role="log" aria-live="polite" aria-relevant="additions"></div>
    <button class="human" type="button">Talk to a person instead</button>
    <form>
      <label class="sr" for="maw-input">Your message</label>
      <textarea id="maw-input" rows="1" maxlength="1000" placeholder="Ask a question or book…"></textarea>
      <button class="send" type="submit">Send</button>
    </form>
  </section>
</div>`;
  document.body.appendChild(host);

  const $ = (s) => root.querySelector(s);
  const panel = $('.panel'), launch = $('.launch'), log = $('.log'), input = $('textarea'), send = $('.send'), form = $('form');
  let state = store.get() || { session: null, messages: [] };
  let busy = false, started = false;

  const add = (cls, text, persist = true) => {
    const el = document.createElement('div');
    el.className = `m ${cls}`;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    if (persist) { state.messages.push([cls, text]); state.messages = state.messages.slice(-60); store.set(state); }
    return el;
  };
  const typing = () => {
    const el = document.createElement('div');
    el.className = 'm bot'; el.setAttribute('aria-label', 'Assistant is typing');
    el.innerHTML = '<span class="dots"><i></i><i></i><i></i></span>';
    log.appendChild(el); log.scrollTop = log.scrollHeight;
    return el;
  };

  async function call(body) {
    // ?w= lets the server answer the browser's CORS preflight for this widget's allowed origins
    const r = await fetch(`${ENDPOINT}?w=${encodeURIComponent(WIDGET)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widget_id: WIDGET, session: state.session, ...body }) });
    const j = await r.json().catch(() => ({}));
    if (j.session) { state.session = j.session; store.set(state); }
    return { ok: r.ok, status: r.status, ...j };
  }

  function setBusy(b) { busy = b; send.disabled = b; input.setAttribute('aria-busy', String(b)); }

  async function start() {
    if (started) return;
    started = true;
    for (const [cls, text] of state.messages) add(cls, text, false);
    try {
      const r = await call({ action: 'start' });
      if (r.privacy_url) $('.privacy').href = r.privacy_url; else $('.privacy').hidden = true;
      if (r.business) $('#maw-title').textContent = r.business;
      if (!state.messages.length && r.greeting) add('bot', r.greeting);
      if (!r.ok) add('err', "The assistant isn't available right now. Please contact the clinic directly.", false);
    } catch { add('err', "Can't reach the assistant. Check your connection, or contact the clinic directly.", false); }
  }

  async function deliver(body, userText) {
    if (busy) return;
    setBusy(true);
    if (userText) add('me', userText);
    const t = typing();
    try {
      const hadSession = !!state.session;
      const r = await call(body);
      t.remove();
      if (r.new_session && hadSession) add('note', 'Your earlier chat expired, so this is a new conversation.');
      if (r.reply) add(r.ok ? 'bot' : 'err', r.reply, r.ok);
      else if (!r.ok) failed(body, userText);
    } catch {
      t.remove();
      failed(body, userText);
    } finally { setBusy(false); input.focus(); }
  }

  function failed(body) {
    const el = add('err', 'Message not sent. ', false);
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = 'Try again';
    b.onclick = () => { el.remove(); deliver(body, null); };
    el.appendChild(b);
  }

  function open() { panel.hidden = false; launch.hidden = true; start(); input.focus(); }
  function close() { panel.hidden = true; launch.hidden = false; launch.focus(); }
  launch.onclick = open;
  $('.x').onclick = close;
  root.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) close(); });
  $('.human').onclick = () => deliver({ action: 'handover' }, 'I’d like to talk to a person.');
  form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = ''; input.style.height = '';
    deliver({ message: text }, text);
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });
})();

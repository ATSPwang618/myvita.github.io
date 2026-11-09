'use strict';
(() => {
  const audio = document.querySelector('#background-music');
  const button = document.querySelector('.music-toggle');
  const label = button.querySelector('.music-label');
  const status = document.querySelector('#music-status');
  const t = key => window.siteI18n.t(key);
  let pending = false;
  let error = false;
  let awaitingGesture = true;
  audio.volume = 0.35;
  function render() {
    const playing = !audio.paused;
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', String(playing));
    const text = error ? '重试音乐' : pending ? '音乐加载中' : playing ? '暂停音乐' : '播放音乐';
    label.textContent = t(text);
    button.setAttribute('aria-label', `${t(text)} · M01s`);
    status.textContent = error ? t('音乐暂时无法播放，请点击重试。') : '';
  }
  async function startMusic() {
    if (pending) return;
    pending = true;
    if (error) audio.load();
    error = false;
    render();
    try { await audio.play(); }
    catch (reason) {
      // A browser autoplay restriction is not an audio-file failure.
      error = reason.name !== 'NotAllowedError';
    }
    finally { pending = false; render(); }
  }
  button.addEventListener('click', () => {
    awaitingGesture = false;
    if (!audio.paused) { audio.pause(); return; }
    void startMusic();
  });
  function resumeOnGesture(event) {
    if (!awaitingGesture || event.target.closest?.('.music-toggle')) return;
    if (event.type === 'keydown' && (event.repeat || event.ctrlKey || event.metaKey || event.altKey || ['Shift', 'Control', 'Alt', 'Meta', 'Escape'].includes(event.key))) return;
    void startMusic();
  }
  document.addEventListener('click', resumeOnGesture);
  document.addEventListener('keydown', resumeOnGesture);
  audio.addEventListener('play', () => { awaitingGesture = false; render(); });
  audio.addEventListener('pause', render);
  audio.addEventListener('error', () => { error = true; pending = false; render(); });
  document.addEventListener('languagechange', render);
  // A single audio element loops across all in-page navigation and language changes.
  // Try audible autoplay immediately. If blocked, retry on the first page gesture.
  // Once playback starts (or the user operates the button), never auto-resume a pause.
  render();
  void startMusic();
})();

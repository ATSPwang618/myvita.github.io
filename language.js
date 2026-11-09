'use strict';
// Keep the DOM (and the playing audio element) intact when changing language.
(() => {
  const catalog = window.siteTranslations || {};
  const texts = [];
  const attributes = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script, style')) continue;
    const key = node.textContent.trim();
    if (Object.hasOwn(catalog, key)) texts.push({ node, key, original: node.textContent });
  }
  document.querySelectorAll('[alt], [aria-label], meta[content]').forEach(node => {
    for (const name of ['alt', 'aria-label', 'content']) {
      const key = node.getAttribute(name);
      if (Object.hasOwn(catalog, key)) attributes.push({ node, name, key });
    }
  });
  let language = 'zh-CN';
  try { if (localStorage.getItem('vita-language') === 'en') language = 'en'; } catch {}
  window.siteI18n = {
    t: key => language === 'en' ? (catalog[key] || key) : key,
    get language() { return language; },
  };
  function apply() {
    document.documentElement.lang = language;
    for (const { node, key, original } of texts) {
      node.textContent = language === 'en' ? original.replace(key, catalog[key]) : original;
    }
    for (const { node, name, key } of attributes) node.setAttribute(name, window.siteI18n.t(key));
    const locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.content = language === 'en' ? 'en_US' : 'zh_CN';
    document.querySelectorAll('.language-toggle').forEach(button => {
      button.textContent = language === 'en' ? '中文' : 'English';
      button.lang = language === 'en' ? 'zh-CN' : 'en';
      button.setAttribute('aria-label', language === 'en' ? '切换为中文' : 'Switch to English');
    });
    document.dispatchEvent(new Event('languagechange'));
  }
  document.querySelectorAll('.language-toggle').forEach(button => button.addEventListener('click', () => {
    language = language === 'en' ? 'zh-CN' : 'en';
    try { localStorage.setItem('vita-language', language); } catch {}
    apply();
  }));
  apply();
})();

(() => {
  const root = document.documentElement;
  const languageSelect = document.querySelector('#languageSelect');
  const themeToggle = document.querySelector('#themeToggle');
  const themeIcon = document.querySelector('#themeIcon');
  const menuToggle = document.querySelector('#mobileMenuToggle');
  const mobileNav = document.querySelector('#mobileNav');
  const currentYear = document.querySelector('#currentYear');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('[data-category]')];
  const defaultLanguage = ['id', 'en', 'mix'].includes(root.lang) ? root.lang : 'id';

  currentYear.textContent = new Date().getFullYear();
  languageSelect.value = defaultLanguage;

  function applyLanguage(language) {
    const translations = window.portfolioLanguages?.[language] || window.portfolioLanguages?.id;
    if (!translations) return;
    root.lang = language === 'en' ? 'en' : 'id';
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      if (!Object.prototype.hasOwnProperty.call(translations, key)) return;
      const translated = translations[key];
      // Preserve decorative child spans (for example the accent-colored full stop in headings).
      if (node.children.length) {
        const directText = [...node.childNodes].find((child) => child.nodeType === Node.TEXT_NODE && child.nodeValue.trim());
        if (directText) directText.nodeValue = ` ${translated} `;
        else node.insertBefore(document.createTextNode(translated), node.firstChild);
      } else {
        node.textContent = translated;
      }
    });
    document.querySelector('[data-i18n="language_label"]')?.setAttribute('title', translations.language_tooltip || 'Choose language');
    languageSelect.title = translations.language_tooltip || 'Choose language';
    languageSelect.setAttribute('aria-label', translations.language_label || 'Choose language');
    themeToggle.setAttribute('aria-label', root.dataset.theme === 'dark' ? translations.theme_light : translations.theme_dark);
    menuToggle.setAttribute('aria-label', mobileNav.classList.contains('hidden') ? translations.menu_open : translations.menu_close);
    try { localStorage.setItem('giyan-language', language); } catch (error) { /* Storage may be unavailable. */ }
  }

  function applyTheme(theme, save = true) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    themeIcon.innerHTML = nextTheme === 'dark'
      ? '<path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"/>'
      : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
    const translations = window.portfolioLanguages?.[languageSelect.value] || window.portfolioLanguages?.id;
    themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? (translations?.theme_light || 'Switch to light mode') : (translations?.theme_dark || 'Switch to dark mode'));
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = nextTheme === 'dark' ? '#101114' : '#f5f5f0';
    if (save) {
      try { localStorage.setItem('giyan-theme', nextTheme); } catch (error) { /* Storage may be unavailable. */ }
    }
  }

  languageSelect.addEventListener('change', (event) => applyLanguage(event.target.value));
  themeToggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  menuToggle.addEventListener('click', () => {
    const isOpen = !mobileNav.classList.contains('hidden');
    mobileNav.classList.toggle('hidden', isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    const translations = window.portfolioLanguages?.[languageSelect.value] || window.portfolioLanguages?.id;
    menuToggle.setAttribute('aria-label', isOpen ? translations.menu_open : translations.menu_close);
  });
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.setAttribute('aria-pressed', String(active));
      item.classList.toggle('filter_active', active);
    });
    projectCards.forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  }));

  const revealTargets = document.querySelectorAll('#work > div, #skills article, #journey article, #organization article, #education article, #certifications article, #about > div');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is_visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach((target) => {
      target.classList.add('reveal');
      revealObserver.observe(target);
    });
  }

  applyTheme(root.dataset.theme || 'light', false);
  applyLanguage(defaultLanguage);
})();

(() => {
  const root = document.documentElement;
  // Keep the language key descriptive in the UI/runtime while migrating older saved values.
  if (window.portfolioLanguages?.hy && !window.portfolioLanguages.hybrid) {
    window.portfolioLanguages.hybrid = window.portfolioLanguages.hy;
  }

  const articleTranslations = {
    id: {
      nav_articles: 'Artikel',
      articles_kicker: 'Registry Magazine · Editorial',
      articles_title: 'Artikel & liputan',
      articles_description: 'Pengalaman saya di Registry Magazine mencakup peliputan dan wawancara narasumber, serta kurasi dan publikasi berita di website dan media sosial. Bagian ini disiapkan untuk menampilkan artikel asli beserta tautan publikasinya.',
      articles_focus_label: 'Fokus editorial',
      articles_card1_title: 'Peliputan Event',
      articles_card1_description: 'Meliput dan mendokumentasikan kegiatan untuk mendukung produksi konten majalah serta materi publikasi digital.',
      articles_card2_title: 'Wawancara Narasumber',
      articles_card2_description: 'Menggali informasi dari narasumber saat event sebagai bahan untuk menyusun konten yang relevan dan informatif.',
      articles_card3_title: 'Berita & Publikasi Digital',
      articles_card3_description: 'Mengkurasi, menyunting, dan mengelola berita untuk publikasi melalui website dan media sosial.',
      articles_section_note: 'Kerangka awal section editorial. Judul artikel dan tautan publikasi asli akan ditambahkan setelah artikel pilihan ditentukan.'
    },
    en: {
      nav_articles: 'Articles',
      articles_kicker: 'Registry Magazine · Editorial',
      articles_title: 'Articles & Coverage',
      articles_description: 'My work at Registry Magazine included event coverage and interviews, along with curating and publishing news for the website and social media. This section is prepared to showcase published articles with their original links.',
      articles_focus_label: 'Editorial focus',
      articles_card1_title: 'Event Coverage',
      articles_card1_description: 'Covering and documenting events to support magazine content production and digital publication.',
      articles_card2_title: 'Interviews & Profiles',
      articles_card2_description: 'Gathering information from event speakers as a basis for relevant, informative editorial content.',
      articles_card3_title: 'News & Digital Publishing',
      articles_card3_description: 'Curating, editing, and managing news content for publication on websites and social media.',
      articles_section_note: 'Initial editorial section layout. Original article titles and publication links will be added once the selected pieces are confirmed.'
    },
    hybrid: {
      nav_articles: 'Articles',
      articles_kicker: 'Registry Magazine · Editorial',
      articles_title: 'Articles & Liputan',
      articles_description: 'Pengalaman saya di Registry Magazine includes event coverage and interviews, plus kurasi dan publikasi berita di website dan social media. Section ini disiapkan untuk menampilkan artikel asli beserta publication links.',
      articles_focus_label: 'Editorial focus',
      articles_card1_title: 'Event Coverage',
      articles_card1_description: 'Meliput dan mendokumentasikan event untuk kebutuhan magazine content dan digital publication.',
      articles_card2_title: 'Interviews & Profiles',
      articles_card2_description: 'Menggali informasi dari narasumber saat event sebagai bahan untuk menyusun konten yang relevant dan informative.',
      articles_card3_title: 'Digital News & Publishing',
      articles_card3_description: 'Kurasi, editing, dan pengelolaan berita untuk publication di website dan social media.',
      articles_section_note: 'Initial layout untuk editorial section. Judul artikel dan original publication links akan ditambahkan setelah artikel pilihan ditentukan.'
    }
  };

  for (const [language, additions] of Object.entries(articleTranslations)) {
    if (window.portfolioLanguages?.[language]) Object.assign(window.portfolioLanguages[language], additions);
  }
  const languageSelect = document.querySelector('#languageSelect');
  const themeToggle = document.querySelector('#themeToggle');
  const themeIcon = document.querySelector('#themeIcon');
  const menuToggle = document.querySelector('#mobileMenuToggle');
  const mobileNav = document.querySelector('#mobileNav');
  const desktopMoreMenu = document.querySelector('#desktopMoreMenu');
  const currentYear = document.querySelector('#currentYear');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('[data-category]')];
  const defaultLanguage = ['id', 'en', 'hybrid'].includes(root.dataset.language) ? root.dataset.language : 'hybrid';

  currentYear.textContent = new Date().getFullYear();
  languageSelect.value = defaultLanguage;

  function applyLanguage(language) {
    const translations = window.portfolioLanguages?.[language] || window.portfolioLanguages?.id;
    if (!translations) return;
    root.dataset.language = language;
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
    try { localStorage.setItem('giyan-language-v2', language); } catch (error) { /* Storage may be unavailable. */ }
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

  // Close the More dropdown after navigation, outside clicks, or Escape.
  desktopMoreMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    desktopMoreMenu.open = false;
  }));
  document.addEventListener('click', (event) => {
    if (desktopMoreMenu?.open && !desktopMoreMenu.contains(event.target)) desktopMoreMenu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (desktopMoreMenu?.open) {
      desktopMoreMenu.open = false;
      desktopMoreMenu.querySelector('summary')?.focus();
    }
    if (!mobileNav.classList.contains('hidden')) {
      mobileNav.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  });

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

  const revealTargets = document.querySelectorAll('#work > div, #skills article, #journey article, #articles article, #organization article, #education article, #certifications article, #about > div');
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

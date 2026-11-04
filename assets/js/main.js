(() => {
  'use strict';

  const root = document.documentElement;
  const languageSelect = document.querySelector('#languageSelect');
  const themeToggle = document.querySelector('#themeToggle');
  const themeIcon = document.querySelector('#themeIcon');
  const menuToggle = document.querySelector('#mobileMenuToggle');
  const mobileNav = document.querySelector('#mobileNav');
  const desktopMoreMenu = document.querySelector('#desktopMoreMenu');
  const currentYear = document.querySelector('#currentYear');

  const hybridUiTranslations = {
    language_label: 'Pilih bahasa',
    language_tooltip: 'English headings, Indonesian descriptions',
    theme_light: 'Switch to light mode',
    theme_dark: 'Switch to dark mode',
    menu_open: 'Open navigation menu',
    menu_close: 'Close navigation menu'
  };

  // The hybrid mode follows index.html exactly so new copy written there is not overwritten.
  const hybridContentSnapshot = new Map();
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const directTextNode = [...node.childNodes].find((child) =>
      child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()
    );

    hybridContentSnapshot.set(node, {
      directTextNode,
      directTextValue: directTextNode?.nodeValue ?? null,
      originalChildren: directTextNode ? null : [...node.childNodes].map((child) => child.cloneNode(true))
    });
  });

  const articleTranslations = {
    id: {
      nav_articles: 'Artikel',
      articles_kicker: 'Registry Magazine · Editorial',
      articles_title: 'Artikel & liputan',
      articles_description: 'Pengalaman saya di Registry Magazine mencakup peliputan dan wawancara narasumber, serta kurasi dan publikasi berita di website dan media sosial.',
      articles_focus_label: 'Fokus editorial',
      articles_card1_title: 'Peliputan Event',
      articles_card1_description: 'Meliput dan mendokumentasikan kegiatan untuk mendukung produksi konten majalah serta materi publikasi digital.',
      articles_card2_title: 'Wawancara Narasumber',
      articles_card2_description: 'Menggali informasi dari narasumber saat event sebagai bahan untuk menyusun konten yang relevan dan informatif.',
      articles_card3_title: 'Berita & Publikasi Digital',
      articles_card3_description: 'Mengkurasi, menyunting, dan mengelola berita untuk publikasi melalui website dan media sosial.'
    },
    en: {
      nav_articles: 'Articles',
      articles_kicker: 'Registry Magazine · Editorial',
      articles_title: 'Articles & Coverage',
      articles_description: 'My work at Registry Magazine included event coverage and interviews, along with curating and publishing news for the website and social media.',
      articles_focus_label: 'Editorial focus',
      articles_card1_title: 'Event Coverage',
      articles_card1_description: 'Covering and documenting events to support magazine content production and digital publication.',
      articles_card2_title: 'Interviews & Profiles',
      articles_card2_description: 'Gathering information from event speakers as a basis for relevant, informative editorial content.',
      articles_card3_title: 'News & Digital Publishing',
      articles_card3_description: 'Curating, editing, and managing news content for publication on websites and social media.'
    }
  };

  for (const [language, additions] of Object.entries(articleTranslations)) {
    if (window.portfolioLanguages?.[language]) {
      Object.assign(window.portfolioLanguages[language], additions);
    }
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('[data-category]')];
  const supportedLanguages = ['id', 'en', 'hybrid'];
  const defaultLanguage = supportedLanguages.includes(root.dataset.language)
    ? root.dataset.language
    : 'hybrid';

  function getUiTranslations(language = languageSelect.value) {
    if (language === 'hybrid') return hybridUiTranslations;
    return window.portfolioLanguages?.[language] || window.portfolioLanguages?.id || hybridUiTranslations;
  }

  function setTranslatedText(node, translated) {
    if (node.children.length) {
      const directText = [...node.childNodes].find((child) =>
        child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()
      );
      if (directText) {
        directText.nodeValue = ` ${translated} `;
      } else {
        node.insertBefore(document.createTextNode(translated), node.firstChild);
      }
      return;
    }
    node.textContent = translated;
  }

  function restoreHybridContent() {
    hybridContentSnapshot.forEach((snapshot, node) => {
      if (snapshot.directTextNode && snapshot.directTextNode.parentNode === node) {
        snapshot.directTextNode.nodeValue = snapshot.directTextValue;
        return;
      }
      if (snapshot.originalChildren) {
        node.replaceChildren(...snapshot.originalChildren.map((child) => child.cloneNode(true)));
      }
    });
  }

  // Certificate previews stay inactive until a real certificate URL is supplied.
  document.querySelectorAll('.certificate_preview_link[data-certificate-url]').forEach((link) => {
    const certificateUrl = (link.dataset.certificateUrl || '').trim();

    if (!certificateUrl) {
      link.href = '#';
      link.classList.add('certificate_link_pending');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
      link.addEventListener('click', (event) => event.preventDefault());
      return;
    }

    link.href = certificateUrl;
    link.classList.remove('certificate_link_pending');
    link.removeAttribute('aria-disabled');
    link.removeAttribute('tabindex');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  if (currentYear) currentYear.textContent = new Date().getFullYear();
  if (languageSelect) languageSelect.value = defaultLanguage;

  function applyLanguage(language) {
    const selectedLanguage = supportedLanguages.includes(language) ? language : 'hybrid';
    const translations = getUiTranslations(selectedLanguage);

    root.dataset.language = selectedLanguage;
    root.lang = selectedLanguage === 'en' ? 'en' : 'id';

    if (selectedLanguage === 'hybrid') {
      restoreHybridContent();
    } else {
      document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.dataset.i18n;
        if (!Object.prototype.hasOwnProperty.call(translations, key)) return;
        setTranslatedText(node, translations[key]);
      });
    }

    const languageLabel = document.querySelector('[data-i18n="language_label"]');
    const languageTooltip = translations.language_tooltip || hybridUiTranslations.language_tooltip;
    languageLabel?.setAttribute('title', languageTooltip);

    if (languageSelect) {
      languageSelect.title = languageTooltip;
      languageSelect.setAttribute('aria-label', translations.language_label || 'Choose language');
    }

    themeToggle?.setAttribute(
      'aria-label',
      root.dataset.theme === 'dark' ? translations.theme_light : translations.theme_dark
    );

    if (menuToggle && mobileNav) {
      menuToggle.setAttribute(
        'aria-label',
        mobileNav.classList.contains('hidden') ? translations.menu_open : translations.menu_close
      );
    }

    try {
      localStorage.setItem('giyan-language-v2', selectedLanguage);
    } catch (error) {
      // Storage can be unavailable in private browsing contexts.
    }
  }

  function applyTheme(theme, save = true) {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;

    if (themeIcon) {
      themeIcon.innerHTML = nextTheme === 'dark'
        ? '<path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z"/>'
        : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
    }

    const translations = getUiTranslations();
    themeToggle?.setAttribute(
      'aria-label',
      nextTheme === 'dark' ? translations.theme_light : translations.theme_dark
    );

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = nextTheme === 'dark' ? '#101114' : '#f5f5f0';

    if (save) {
      try {
        localStorage.setItem('giyan-theme', nextTheme);
      } catch (error) {
        // Storage can be unavailable in private browsing contexts.
      }
    }
  }

  languageSelect?.addEventListener('change', (event) => applyLanguage(event.target.value));
  themeToggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  menuToggle?.addEventListener('click', () => {
    if (!mobileNav) return;
    const isOpen = !mobileNav.classList.contains('hidden');
    mobileNav.classList.toggle('hidden', isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    const translations = getUiTranslations();
    menuToggle.setAttribute('aria-label', isOpen ? translations.menu_open : translations.menu_close);
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.add('hidden');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', getUiTranslations().menu_open);
    });
  });

  // Close the desktop More dropdown after navigation, outside clicks, or Escape.
  desktopMoreMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      desktopMoreMenu.open = false;
    });
  });

  document.addEventListener('click', (event) => {
    if (desktopMoreMenu?.open && !desktopMoreMenu.contains(event.target)) {
      desktopMoreMenu.open = false;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (desktopMoreMenu?.open) {
      desktopMoreMenu.open = false;
      desktopMoreMenu.querySelector('summary')?.focus();
    }

    if (mobileNav && !mobileNav.classList.contains('hidden')) {
      mobileNav.classList.add('hidden');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', getUiTranslations().menu_open);
      menuToggle?.focus();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('filter_active', active);
      });
      projectCards.forEach((card) => {
        card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  const revealTargets = document.querySelectorAll(
    '#work > div, #journey article, #articles article, #design .design_card, #skills article, #tools article, #education article, #organization article, #certifications article, #notes .note_card, #about > div > div'
  );

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

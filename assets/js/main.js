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

  const languageAliases = {
    hy: 'hybrid',
    mix: 'hybrid'
  };
  const supportedLanguages = ['id', 'en', 'hybrid'];

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project_card[data-category]')];

  function normalizeLanguage(language) {
    const normalized = languageAliases[language] || language;
    return supportedLanguages.includes(normalized) ? normalized : 'en';
  }

  function getUiTranslations(language = root.dataset.language || languageSelect?.value || 'en') {
    const selectedLanguage = normalizeLanguage(language);
    const dictionaryKey = selectedLanguage === 'hybrid' ? 'hybrid' : selectedLanguage;

    return window.portfolioLanguages?.[dictionaryKey]
      || window.portfolioLanguages?.id
      || {};
  }

  function setTranslatedText(node, translatedText) {
    const directTextNode = [...node.childNodes].find((child) =>
      child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()
    );

    if (directTextNode) {
      const originalValue = directTextNode.nodeValue;
      const leadingSpace = originalValue.match(/^\s*/)?.[0] || '';
      const trailingSpace = originalValue.match(/\s*$/)?.[0] || '';

      directTextNode.nodeValue = `${leadingSpace}${translatedText}${trailingSpace}`;
      return;
    }

    if (node.children.length === 0) {
      node.textContent = translatedText;
      return;
    }

    // Use an explicit child target when a translated element contains nested markup.
    const textTarget = node.querySelector('[data-i18n-text]');
    if (textTarget) textTarget.textContent = translatedText;
  }

  function updatePageMetadata(translations) {
    if (translations.page_title) document.title = translations.page_title;

    const description = document.querySelector('meta[name="description"]');
    if (description && translations.page_description) {
      description.content = translations.page_description;
    }

    const openGraphTitle = document.querySelector('meta[property="og:title"]');
    if (openGraphTitle && translations.page_title) {
      openGraphTitle.content = translations.page_title;
    }

    const openGraphDescription = document.querySelector('meta[property="og:description"]');
    if (openGraphDescription && translations.page_og_description) {
      openGraphDescription.content = translations.page_og_description;
    }
  }

  function updateLanguageControls(translations) {
    const languageTooltip = translations.language_tooltip || 'Choose display language';

    if (languageSelect) {
      languageSelect.title = languageTooltip;
      languageSelect.setAttribute(
        'aria-label',
        translations.language_label || 'Choose language'
      );
    }

    const languageLabel = document.querySelector('[data-i18n="language_label"]');
    languageLabel?.setAttribute('title', languageTooltip);

    themeToggle?.setAttribute(
      'aria-label',
      root.dataset.theme === 'dark'
        ? translations.theme_light || 'Switch to light mode'
        : translations.theme_dark || 'Switch to dark mode'
    );

    if (menuToggle && mobileNav) {
      const isOpen = !mobileNav.classList.contains('hidden');
      menuToggle.setAttribute(
        'aria-label',
        isOpen
          ? translations.menu_close || 'Close navigation menu'
          : translations.menu_open || 'Open navigation menu'
      );
    }
  }

  function applyLanguage(language) {
    const selectedLanguage = normalizeLanguage(language);
    const translations = getUiTranslations(selectedLanguage);

    root.dataset.language = selectedLanguage;
    root.lang = selectedLanguage === 'en' ? 'en' : 'id';

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.dataset.i18n;
      const translatedText = translations[key];

      if (typeof translatedText === 'string') {
        setTranslatedText(node, translatedText);
      }
    });

    if (languageSelect) languageSelect.value = selectedLanguage;

    updatePageMetadata(translations);
    updateLanguageControls(translations);

    try {
      localStorage.setItem('giyan-language-v4', selectedLanguage);
    } catch (error) {
      // The site remains usable when browser storage is unavailable.
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
      nextTheme === 'dark'
        ? translations.theme_light || 'Switch to light mode'
        : translations.theme_dark || 'Switch to dark mode'
    );

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = nextTheme === 'dark' ? '#101114' : '#f5f5f0';
    }

    if (save) {
      try {
        localStorage.setItem('giyan-theme', nextTheme);
      } catch (error) {
        // The site remains usable when browser storage is unavailable.
      }
    }
  }

  function closeMobileMenu() {
    if (!mobileNav) return;

    mobileNav.classList.add('hidden');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', getUiTranslations().menu_open || 'Open navigation menu');
  }

  function closeDesktopMoreMenu() {
    if (desktopMoreMenu?.open) desktopMoreMenu.open = false;
  }

  function initializeCertificateLinks() {
    document.querySelectorAll('.certificate_preview_link[data-certificate-url]').forEach((link) => {
      const certificateUrl = (link.dataset.certificateUrl || '').trim();
      const statusLabel = link.querySelector('small[data-i18n]');

      if (!certificateUrl) {
        link.removeAttribute('href');
        link.classList.add('certificate_link_pending');
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '-1');

        if (statusLabel) statusLabel.dataset.i18n = 'certificate_link_pending';
        return;
      }

      link.href = certificateUrl;
      link.classList.remove('certificate_link_pending');
      link.removeAttribute('aria-disabled');
      link.removeAttribute('tabindex');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');

      // Some certificate cards still carried the old "link pending" label
      // even though their data-certificate-url was already populated.
      // Promote that label to the ready state before translations are applied.
      if (statusLabel && statusLabel.dataset.i18n === 'certificate_link_pending') {
        statusLabel.dataset.i18n = link.dataset.certificateReadyI18n || 'organization_view_certificate';
      }
    });
  }

  function initializeProjectFilters() {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.setAttribute('aria-pressed', String(isActive));
          filterButton.classList.toggle('filter_active', isActive);
        });

        projectCards.forEach((card) => {
          const matchesFilter = selectedFilter === 'all'
            || card.dataset.category === selectedFilter;
          card.classList.toggle('hidden', !matchesFilter);
        });
      });
    });
  }

  function initializeRevealAnimations() {
    const revealTargets = document.querySelectorAll(
      '#work > div, #journey article, #articles article, #design .design_card, #skills article, #tools article, #education article, #organization article, #certifications article, #notes .note_card, #about > div > div'
    );

    if (
      !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is_visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    revealTargets.forEach((target) => {
      target.classList.add('reveal');
      revealObserver.observe(target);
    });
  }

  languageSelect?.addEventListener('change', (event) => {
    applyLanguage(event.currentTarget.value);
  });

  themeToggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  menuToggle?.addEventListener('click', () => {
    if (!mobileNav) return;

    const isOpen = !mobileNav.classList.contains('hidden');
    mobileNav.classList.toggle('hidden', isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    updateLanguageControls(getUiTranslations());
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  desktopMoreMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeDesktopMoreMenu);
  });

  document.addEventListener('click', (event) => {
    if (desktopMoreMenu?.open && !desktopMoreMenu.contains(event.target)) {
      closeDesktopMoreMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (desktopMoreMenu?.open) {
      closeDesktopMoreMenu();
      desktopMoreMenu.querySelector('summary')?.focus();
    }

    if (mobileNav && !mobileNav.classList.contains('hidden')) {
      closeMobileMenu();
      menuToggle?.focus();
    }
  });

  if (currentYear) currentYear.textContent = new Date().getFullYear();

  initializeCertificateLinks();
  initializeProjectFilters();
  initializeRevealAnimations();

  const initialLanguage = normalizeLanguage(root.dataset.language || languageSelect?.value);
  const initialTheme = root.dataset.theme === 'dark' ? 'dark' : 'light';

  applyTheme(initialTheme, false);
  applyLanguage(initialLanguage);
})();

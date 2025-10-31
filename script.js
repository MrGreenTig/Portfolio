
const sliderUtils = window.sliderUtils;

if (!sliderUtils || typeof sliderUtils.getVisibleCards !== 'function') {
  throw new Error('sliderUtils.getVisibleCards is required for the slider to operate correctly.');
}

const { getVisibleCards } = sliderUtils;

document.addEventListener('DOMContentLoaded', function () {
   // === SLIDER ===
  const slider = document.getElementById('slider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let cards = [];
  let currentIndex = 0;
  const gap = 16;
  let visibleCards = getVisibleCards();
  let cardWidth = 0;

  // Helper function to query slider cards from the DOM
  function querySliderCards() {
    if (slider) {
      return Array.from(slider.querySelectorAll('.portfolio-card'));
    }
    return [];
  }

  function updateCardWidth() {
    cards = querySliderCards(); 
    if (cards.length > 0 && cards[0]) { 
      cardWidth = cards[0].offsetWidth + gap;
    } else {
      cardWidth = 0; 
    }
  }

  function updateSlider() { 
    if (slider) {
      const offset = currentIndex * cardWidth;
      // Ensure offset is a number, default to 0 if cardWidth is 0 or results in NaN
      slider.scrollTo({ left: isNaN(offset) ? 0 : offset, behavior: 'smooth' });
    }
  }

  function nextSlide() {
    cards = querySliderCards();
    if (currentIndex < cards.length - visibleCards) {
      currentIndex++;
      updateSlider();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }

  // Initial setup and event listeners
  if (slider) {
    cards = querySliderCards();       
    visibleCards = getVisibleCards(); 
    updateCardWidth();
    updateSlider();

    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    window.addEventListener('resize', () => {
      visibleCards = getVisibleCards();
      updateCardWidth(); 
      // Adjust currentIndex if it becomes out of bounds after resize or card changes
      const maxPossibleIndex = Math.max(0, cards.length - visibleCards);
      if (currentIndex > maxPossibleIndex) {
        currentIndex = maxPossibleIndex;
      }
      // If no cards are visible (e.g., cards.length < visibleCards), reset currentIndex
      if (cards.length === 0 || cards.length < visibleCards) {
          currentIndex = 0;
      }

      updateSlider();
    });
  } else {
    console.warn("Slider element with id 'slider' not found. Slider functionality will be disabled.");
    // Optionally hide or disable buttons if the slider isn't present
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  // === MODAL LABEL ===
  const originalTexts = {};
  const label = document.createElement('div');
  label.id = 'serviceLabel';
  label.setAttribute('data-i18n', 'Label');
  label.textContent = 'Sign up for a consultation';
  document.body.appendChild(label);
  animateGradient(label);

  const modal = document.getElementById('modal');
  const modalContent = modal?.querySelector('.modal-content');
  const closeBtn = modal?.querySelector('.close');
  const form = document.getElementById('consultation-form');

  animateGradient(modalContent);

  label.onclick = () => {
    modal.style.display = "flex";
  };

  function closeModal() {
    modal.style.display = "none";
  }

  closeBtn?.addEventListener('click', closeModal);
  window.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  function animateGradient(el) {
    if (!el) return;
    let hue = 0;
    function update() {
      hue = (hue + 0.3) % 360;
      const c1 = `hsla(${hue}, 60%, 60%, 0.9)`;
      const c2 = `hsla(${(hue + 120) % 360}, 60%, 60%, 0.9)`;
      const c3 = `hsla(${(hue + 240) % 360}, 60%, 60%, 0.9)`;
      el.style.background = `linear-gradient(45deg, ${c1}, ${c2}, ${c3})`;
      el.style.backgroundSize = '200% 200%';
      el.style.animation = 'gradientShift 5s ease infinite, colorfulShadow 10s infinite linear';
      requestAnimationFrame(update);
    }
    update();
  }



// Обработчики кнопок
document.querySelectorAll('.language-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    setLanguage(lang, true); // при клике включаем звук
  });
});

// Установка языка
async function setLanguage(lang, playSound = true) {
  const audio = document.getElementById("click-sound");

  if (lang === 'ja') {
    audio.src = "music/FM.mp3";
  } else if (lang === 'en') {
    audio.src = "music/en.mp3";
  } else if (lang === 'ru') {
    audio.src = "music/ru.mp3";
  }

  if (playSound) {
    audio.volume = 0.03;
    audio.play();
  }

  console.log("Выбран язык:", lang);

  document.querySelectorAll('.language-button').forEach(btn =>
    btn.classList.remove('active-lang')
  );
  document.querySelector(`.language-button[data-lang="${lang}"]`)?.classList.add('active-lang');

  // === ENGLISH — сброс к оригинальному тексту ===
  if (lang === 'en') {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (originalTexts[key]) el.textContent = originalTexts[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (originalTexts[key]) el.placeholder = originalTexts[key];
    });
    localStorage.setItem('lang', lang);
    return;
  }

  try {
    const res = await fetch(`lang/${lang}.json`);
    const translation = await res.json();

    // === Переводим текст ===
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!originalTexts[key]) originalTexts[key] = el.textContent;
      if (translation[key]) el.textContent = translation[key];
    });

    // === Переводим placeholder ===
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!originalTexts[key]) originalTexts[key] = el.placeholder;
      if (translation[key]) el.placeholder = translation[key];
    });

    localStorage.setItem('lang', lang);
  } catch (err) {
    console.error('Ошибка загрузки перевода:', err);
  }
}

  // === THEME ===
  const themeSwitchButton = document.querySelector('.theme-switch');
  themeSwitchButton?.addEventListener('click', toggleTheme);

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    document.querySelectorAll(
      'header, footer, .modal-content, .portfolio-card, .language-button, button, .about-content, .education-block, .about'
    ).forEach(el => el.classList.toggle('dark-theme', isDark));

    // Картинки
    const themeImage = document.getElementById('theme-image');
    const themeImage2 = document.getElementById('theme-image2');
    if (themeImage) themeImage.src = isDark ? 'pics/MyDark.jpeg' : 'pics/My.jpeg';
    if (themeImage2) themeImage2.src = isDark ? 'pics/MyDarkFooter.jpeg' : 'pics/MyFooter.jpeg';

    if (themeSwitchButton) {
      themeSwitchButton.textContent = isDark ? '☀️' : '🌙';
      themeSwitchButton.classList.toggle('dark-theme', isDark);
    }
  }

  // Применение сохранённой темы
  const savedTheme = localStorage.getItem('theme');
  const dark = savedTheme === 'dark';
  document.body.classList.toggle('dark-theme', dark);
  document.querySelectorAll(
    'header, footer, .modal-content, .portfolio-card, .language-button, button, .about-content,a, .education-block, .about'
  ).forEach(el => el.classList.toggle('dark-theme', dark));
  if (themeSwitchButton) {
    themeSwitchButton.textContent = dark ? '☀️' : '🌙';
    themeSwitchButton.classList.toggle('dark-theme', dark);
  }

  // Картинки при загрузке
  const themeImage = document.getElementById('theme-image');
  const themeImage2 = document.getElementById('theme-image2');
  if (themeImage) themeImage.src = dark ? 'pics/MyDark.jpeg' : 'pics/My.jpeg';
  if (themeImage2) themeImage2.src = dark ? 'pics/MyDarkFooter.jpeg' : 'pics/MyFooter.jpeg';
});


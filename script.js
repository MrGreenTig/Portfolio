document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const label = document.createElement('div');
    const modalContent = modal.querySelector('.modal-content');

    // Создаем и стилизуем ярлык
    label.id = 'serviceLabel';
    label.textContent = 'Sign up for a consultation';
    document.body.appendChild(label);

    // Применяем анимацию градиента к ярлыку и модальному контенту
    animateGradient(label);
    animateGradient(modalContent);

    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('consultation-form');

    // Функция для анимации скрытия label
    function hideLabel() {
        label.style.transition = 'transform 0.5s ease-out';
        label.style.transform = 'translateX(-100%)';
    }

    // Функция для анимации показа label
    function showLabel() {
        label.style.transition = 'transform 0.5s ease-in';
        label.style.transform = 'translateX(0)';
    }

    // Открытие модального окна
    label.onclick = function() {
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        hideLabel();
    }

    // Закрытие модального окна
closeBtn.onclick = function() {
    modal.style.display = "none";
    showLabel();
    label.style.transform = ''; // Сброс transform
}

    // Закрытие модального окна при клике вне его
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        showLabel();
        label.style.transform = ''; // Сброс transform
    }
}
});

function animateGradient(element) {
    let hue = 0;

    function updateGradient() {
        hue = (hue + 0.3) % 360;
        const color1 = `hsla(${hue}, 60%, 60%, 0.9)`;
        const color2 = `hsla(${(hue + 120) % 360}, 60%, 60%, 0.9)`;
        const color3 = `hsla(${(hue + 240) % 360}, 60%, 60%, 0.9)`;

        element.style.background = `
            linear-gradient(45deg,
            ${color1}, 
            ${color2}, 
            ${color3})
        `;
        element.style.backgroundSize = '200% 200%';
        element.style.animation = 'gradientShift 5s ease infinite, colorfulShadow 10s infinite linear';

        requestAnimationFrame(updateGradient);
    }

    updateGradient();
}


const originalTexts = {};

async function setLanguage(lang) {
  // Если язык английский, восстанавливаем оригинальные тексты
  if (lang === 'en') {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (originalTexts[key]) {
        el.textContent = originalTexts[key];
      }
    });
    localStorage.setItem('lang', lang);
    return;
  }

  // Иначе — загружаем перевод
  try {
    const res = await fetch(`lang/${lang}.json`);
    const translation = await res.json();

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');

      // Сохраняем оригинальный текст один раз
      if (!originalTexts[key]) {
        originalTexts[key] = el.textContent;
      }

      if (translation[key]) {
        el.textContent = translation[key];
      }
    });

    localStorage.setItem('lang', lang);
  } catch (error) {
    console.error('Ошибка загрузки перевода:', error);
  }
}

// Установить язык при загрузке
window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  setLanguage(savedLang);
});

 // Воспроизведение звука при нажатии на кнопку:<script>
function setLanguage(lang) {
  const audio = document.getElementById("click-sound");

  if (lang === 'ja') {
    audio.src = "music/FM.mp3";
  } else if (lang === 'en') {
    audio.src = "music/en.mp3";
  } else if (lang === 'ru') {
    audio.src = "music/ru.mp3";
  }
  audio.volume = 0.1;
  audio.play();

  console.log("Выбран язык:", lang);
}


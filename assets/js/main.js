// Замінити цей виклик функції на 'DOMContentLoaded' під час інтеграції
['DOMContentLoaded', 'includesLoaded'].forEach(evt => {
  document.addEventListener(evt, () => {  // прибрати під час інтеграції

    // document.addEventListener('DOMContentLoaded', function () {  //Додати під час інтеграції
    // ***********************************************************

    // Burger menu
    const burger = document.querySelector('.menu_burger');
    const headerMenu = document.querySelector('.header_menu');

    if (burger) {
      burger.addEventListener('click', function () {
        burger.classList.toggle('active');
        headerMenu.classList.toggle('active');
        document.body.classList.toggle('lock');
      });
    }

    // Anchor to top
    const backToTopBtn = document.getElementById('js-backToTop');
    const scrollThreshold = 200;

    function handleScroll() {
      if (window.scrollY > scrollThreshold) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    window.addEventListener('scroll', handleScroll);
    backToTopBtn.addEventListener('click', scrollToTop);

    handleScroll();

    // Header add class scroll on front page
    initHeaderScroll();

    // Toggle sub-menu for mobile version
    const arrows = document.querySelectorAll('.submenu_arrow');

    arrows.forEach(arrow => {
      arrow.addEventListener('click', e => {
        e.preventDefault();

        const li = arrow.closest('li');

        // працює тільки на мобілці
        if (window.innerWidth <= 768) {
          li.classList.toggle('open');
        }
      });
    });

    // Let's talk popup  
    const btn = document.querySelector('.btn_lets_talk');
    // const block = document.querySelector('.views_content');
    const block = btn.parentElement;
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.popup_close');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
      const blockRect = block.getBoundingClientRect();
      const headerHeight = header.offsetHeight; // висота хедера

      // Якщо верх блоку ховається під хедером
      if (blockRect.top < headerHeight) {
        btn.classList.add('btn_fixed');
      } else {
        btn.classList.remove('btn_fixed');
      }
    });

    // Попап
    btn.addEventListener('click', () => overlay.style.display = 'flex');
    closeBtn.addEventListener('click', () => overlay.style.display = 'none');
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.style.display = 'none'; });

    // Slider in front page
    const homeSwiper = new Swiper('.home_slider', {
      navigation: {
        nextEl: '.swiper_button_next.arrow',
        prevEl: '.swiper_button_prev.arrow',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: true,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      watchOverflow: true,
    });

    // Delegation
    document.body.addEventListener('click', onBodyClick);

    // ***************************************************
  }); // прибрати після зміни функції на 'DOMContentLoaded' під час інтеграції
  // ***********************************
});

// 1. Оголошуємо функцію-обробник
function onBodyClick(event) {
  // event.target — елемент, по якому натиснули
  console.log('Клік зафіксовано на:', event.target);

  // приклад делегування: відкриття/закриття деталей замовлення
  // const toggleBtn = event.target.closest('.account_order_show_btn');
  // if (toggleBtn) {
  //   const isDesktop = window.innerWidth >= 767;
  //   const container = isDesktop
  //     ? toggleBtn.closest('.account_order_row')
  //     : toggleBtn.closest('.account_order_item');

  //   if (!container) return;

  //   const details = container.querySelector('.account_order_item_details');
  //   toggleBtn.classList.toggle('open');
  //   container.classList.toggle('open');
  //   if (details) details.classList.toggle('open');
  // }

  // сюди можна додати інші перевірки/обробники по тому ж принципу
}

// 2. Прив’язуємо обробник до <body>
document.body.addEventListener('click', onBodyClick);

// Document body lock scroll
function lockScroll() {
  document.body.classList.add('lock')
  document.documentElement.classList.add('lock')
}

function unlockScroll() {
  document.body.classList.remove('lock')
  document.documentElement.classList.remove('lock')
}

function initHeaderScroll() {
  const header = document.querySelector('.header--home');

  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.remove('no-scroll');
    } else {
      header.classList.add('no-scroll');
    }
  });
}

// Turn on/off sound for video in intro section
function initIntroSoundToggle() {
  const btn = document.getElementById('introSoundBtn');
  const video = document.getElementById('introVideo'); // припускаю, що відео має id="introVideo"
  if (!btn) return;


  // зручні локальні селектори
  const srText = btn.querySelector('.sr_only');
  // const crossPath = btn.querySelector('.intro_sound_cross');

  // початковий стан з localStorage (опціонально)
  const saved = localStorage.getItem('intro_video_sound'); // 'on' або 'off'

  if (saved === 'on') {
    btn.classList.add('sound_on');
    btn.setAttribute('aria-pressed', 'true');
    btn.setAttribute('aria-label', 'Mute');
    if (srText) srText.textContent = 'Mute';
  }

  btn.addEventListener('click', function (e) {
    // Якщо відео є — перемикаємо його звук
    if (video) {
      const isMuted = video.muted;
      if (isMuted) {
        // вмикаємо звук — клік є user gesture, тож браузери дозволять звук
        video.muted = false;
        // опціонально встановлюємо гучність
        try { video.volume = 1.0; } catch (err) { }
        // деякі браузери можуть вимагати play() після зміни; спробуємо
        video.play().catch(() => { });
        // оновлюємо UI
        btn.classList.add('sound_on');
        btn.setAttribute('aria-pressed', 'true');
        btn.setAttribute('aria-label', 'Mute');
        if (srText) srText.textContent = 'Mute';
        localStorage.setItem('intro_video_sound', 'on');
      } else {
        // вимикаємо звук
        video.muted = true;
        btn.classList.remove('sound_on');
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Unmute');
        if (srText) srText.textContent = 'Unmute';
        localStorage.setItem('intro_video_sound', 'off');
      }
    } else {
      // Якщо відео немає — просто міняємо візуальний стан кнопки
      const nowOn = btn.classList.toggle('sound_on');
      btn.setAttribute('aria-pressed', nowOn ? 'true' : 'false');
      btn.setAttribute('aria-label', nowOn ? 'Mute' : 'Unmute');
      if (srText) srText.textContent = nowOn ? 'Mute' : 'Unmute';
    }
  });
}

// Запуск після DOMContentLoaded
document.addEventListener('DOMContentLoaded', initIntroSoundToggle);


// Accordion
document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion_item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion_header');
    const body = item.querySelector('.accordion_body');

    if (!header || !body) return;

    header.addEventListener('click', (e) => {
      const isOpen = body.classList.contains('open');

      // закриваємо всі інші
      accordionItems.forEach(otherItem => {
        const otherBody = otherItem.querySelector('.accordion_body');
        const otherHeader = otherItem.querySelector('.accordion_header');

        otherBody?.classList.remove('open');
        otherHeader?.classList.remove('active');
      });

      // відкриваємо тільки потрібний
      if (!isOpen) {
        body.classList.add('open');
        header.classList.add('active');
      }
    });
  });
});
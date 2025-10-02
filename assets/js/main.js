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

    // // Let's talk popup  
    // const btn = document.querySelector('.btn_lets_talk');
    // // const block = document.querySelector('.views_content');
    // const block = btn.parentElement;
    // const overlay = document.querySelector('.overlay');
    // const closeBtn = document.querySelector('.popup_close');
    // const header = document.querySelector('.header');

    // window.addEventListener('scroll', () => {
    //   const blockRect = block.getBoundingClientRect();
    //   const headerHeight = header.offsetHeight; // висота хедера

    //   // Якщо верх блоку ховається під хедером
    //   if (blockRect.top < headerHeight) {
    //     btn.classList.add('btn_fixed');
    //   } else {
    //     btn.classList.remove('btn_fixed');
    //   }
    // });


    // // Попап
    // btn.addEventListener('click', () => {
    //   overlay.style.display = 'flex';
    //   lockScroll();
    // });
    // closeBtn.addEventListener('click', () => { overlay.style.display = 'none'; unlockScroll(); });
    // overlay.addEventListener('click', e => { if (e.target === overlay) overlay.style.display = 'none'; });

    // CamelCase для змінних/функцій
    const btn = document.querySelector('.btn_lets_talk');
    const block = btn ? btn.parentElement : null; // якщо слідкувати за блоком
    const header = document.querySelector('.header');
    const overlay = document.querySelector('.overlay');
    const closeBtn = document.querySelector('.popup_close');

    const bottomOffset = 120; // завжди 120px як ти просила
    let initialTop = 0;
    let isAtBottom = false;
    let ticking = false;

    if (btn) {
      // Визначає initialTop: якщо в CSS вже задано position:fixed та top, читаємо computedStyle.top.
      // Інакше беремо btn.getBoundingClientRect().top (позиція у вьюпорті).
      function updateInitialTop() {
        const cs = window.getComputedStyle(btn);
        if (cs.position === 'fixed' && cs.top && cs.top !== 'auto') {
          // top може бути наприклад "635px"
          initialTop = parseFloat(cs.top) || 0;
        } else {
          // беремо поточну позицію у вьюпорті
          const rect = btn.getBoundingClientRect();
          initialTop = rect.top;
        }
        // Задаємо inline top, щоб позиція була стабільною незалежно від перерахунку
        btn.style.top = Math.round(initialTop) + 'px';
        // переконаємось, що правий відступ є
        btn.style.right = '20px';
      }

      // Обчислити і застосувати translateY для опускання кнопки до bottomOffset
      function moveToBottom() {
        if (isAtBottom) return;
        const btnHeight = btn.getBoundingClientRect().height;
        const targetTop = window.innerHeight - bottomOffset - btnHeight;
        const delta = targetTop - initialTop;
        btn.style.transform = `translateY(${Math.round(delta)}px)`;
        isAtBottom = true;
      }

      // Повернути вгору (до initialTop)
      function moveToTop() {
        if (!isAtBottom) return;
        btn.style.transform = 'translateY(0)';
        isAtBottom = false;
      }

      function checkScroll() {
        // Тут використовую ту саму логіку, що й раніше: коли "block" заходить під header — опускаємо.
        // Якщо в тебе інша умова — підстав свій тригер (наприклад, scrollY > 300).
        const headerHeight = header ? header.offsetHeight : 0;
        if (!block) {
          // Якщо немає блоку, можна використовувати просту умову — наприклад, якщо сторінка проскролена більше 100px
          if (window.scrollY > 100) moveToBottom();
          else moveToTop();
          return;
        }

        const blockRect = block.getBoundingClientRect();
        if (blockRect.top < headerHeight) {
          moveToBottom();
        } else {
          moveToTop();
        }
      }

      // Throttle через rAF
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            checkScroll();
            ticking = false;
          });
          ticking = true;
        }
      });

      // Оновлюємо initialTop на load та resize (щоб пристосуватись до мобайлу/перевертань)
      window.addEventListener('load', updateInitialTop);
      window.addEventListener('resize', () => {
        // перед перерахунком зберігаємо поточний стан bottom/top
        const wasAtBottom = isAtBottom;
        updateInitialTop();
        // якщо зараз внизу, перерахуємо translate по-новому
        if (wasAtBottom) moveToBottom();
      });

      // Викличемо одразу, якщо скрипт підключений внизу сторінки
      updateInitialTop();
    }

    // Попап
    btn.addEventListener('click', () => {
      overlay.style.display = 'flex';
      lockScroll();
    });
    closeBtn.addEventListener('click', () => { overlay.style.display = 'none'; unlockScroll(); });
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

    // Fade for blocks
    const sections = document.querySelectorAll('.fade');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // Service sub item page show More
    // const contentWrapper = document.querySelector(".services_sub_wrapper");
    // const contentInner = document.querySelector(".services_sub");
    const contentWrapper = document.querySelector(".more_wrapper");
    const contentInner = document.querySelector(".more_inner");
    const btnMore = document.querySelector(".btn_more");

    if (window.innerWidth <= 768) {
      if (contentInner.scrollHeight > 1500) {
        btnMore.classList.add("show");
      }

      btnMore.addEventListener("click", function () {
        contentWrapper.classList.add("open");
        btnMore.style.display = "none"; // сховати кнопку після кліку
      });
    }

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
      // const isOpen = body.classList.contains('open');

      body.classList.toggle('open');
      header.classList.toggle('active');

      // закриваємо всі інші
      // accordionItems.forEach(otherItem => {
      //   const otherBody = otherItem.querySelector('.accordion_body');
      //   const otherHeader = otherItem.querySelector('.accordion_header');

      //   otherBody?.classList.remove('open');
      //   otherHeader?.classList.remove('active');
      // });

      // відкриваємо тільки потрібний
      // if (!isOpen) {
      //   body.classList.add('open');
      //   header.classList.add('active');
      // }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.about_nums_item');
  const nums = document.querySelectorAll('.about_num');
  const container = document.querySelector('.about_nums');
  if (!container) return;

  let countersAnimated = false;
  const counterDuration = 2000; // ms — час, за який повинні завершитися ВСІ лічильники

  // 1) observer для появи елементів (працює кожного разу при вході/виході)
  const itemsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.25 });

  items.forEach(item => itemsObserver.observe(item));

  // допоміжна функція: суфікс (наприклад "+") з textContent
  const getSuffix = (el) => {
    const m = el.textContent.match(/(\D+)$/);
    return m ? m[1] : '';
  };

  // 2) синхронна анімація ВСІХ лічильників за допомогою requestAnimationFrame
  function animateAllCounters(duration) {
    const startTime = performance.now();
    const targets = Array.from(nums).map(n => +n.getAttribute('data-target') || 0);
    const suffixes = Array.from(nums).map(n => getSuffix(n));

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easing (easeOutCubic) — можна поміняти
      const eased = 1 - Math.pow(1 - progress, 3);

      nums.forEach((n, i) => {
        const value = Math.floor(eased * targets[i]);
        n.textContent = value + (suffixes[i] || '');
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // остаточне значення
        nums.forEach((n, i) => n.textContent = targets[i] + (suffixes[i] || ''));
      }
    }

    requestAnimationFrame(step);
  }

  // 3) observer для запуску лічильників один раз (спостерігаємо за контейнером)
  const countersObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;

        // зробити перехід появи елементів таким же довгим, як лічильник
        container.style.setProperty('--about_appear', counterDuration + 'ms');

        // додати visible для тих items, які зараз у viewport — щоб їхня анімація стартувала одночасно
        items.forEach(item => {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            item.classList.add('visible');
          }
        });

        // запустити синхронні лічильники
        animateAllCounters(counterDuration);

        // через duration повернути змінну назад до дефолту (щоб наступні входи/виходи анімувались коротше)
        setTimeout(() => {
          container.style.removeProperty('--about_appear');
        }, counterDuration + 50);

        // більше не потрібно спостерігати
        obs.disconnect();
      }
    });
  }, { threshold: 0.35 });

  countersObserver.observe(container);
});

'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const header = document.querySelector('.header');
const cookieMessage = document.createElement('div');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
const nav = document.querySelector('.nav');
const imgsBlur = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

let currentSlide = 0;
const slideLimit = slides.length;

//MODAL WINDOW
const openModal = function ($event) {
  $event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//BUTTON SCROLLING
btnScrollTo.addEventListener('click', () => {
  const s1Coords = section1.getBoundingClientRect();

  //ferramentas oldschool
  window.scrollTo({
    left: s1Coords.left,
    top: s1Coords.top + window.pageYOffset,
    behavior: 'smooth'
  });

  //modern
  section1.scrollIntoView({ behavior: 'smooth' });
});

//PAGE NAVIGATION
document.querySelector('.nav__links').addEventListener('click', ($event) => {
  $event.preventDefault();

  if($event.target.classList.contains('nav__link')) {
    const id = $event.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
});

//COOKIE MESSAGE
function showCookieMsg() {
  cookieMessage.classList.add('cookie-message');
  cookieMessage.innerHTML = '<h4>This website uses cookies</h4><br>We use cookies to personalise content & ads and to analyse our traffic. <button class="btn btn--close-cookie">Got it</button>';

  header.append(cookieMessage);

  document.querySelector('.btn--close-cookie').addEventListener('click', () => {
    cookieMessage.remove();
    //Or
    //cookieMessage.parentElement.removeChild(cookieMessage);
  });
}

//TABS COMPONENT
tabsContainer.addEventListener('click', function($event) {
  const clicked = $event.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach( tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach( content => content.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//STICKY NAV
function hoveredNav($event, opacity) {
  if ($event.target.classList.contains('nav__link')){
    const hovered = $event.target;
    const sibilings = hovered.closest('.nav').querySelectorAll('.nav__link');
    const logo = hovered.closest('.nav').querySelector('img');

    sibilings.forEach((element) => {
      if (element !== hovered) element.style.opacity = opacity;
    });

    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', ($event) => {
  hoveredNav($event, 0.5);
});

nav.addEventListener('mouseout', ($event) => {
  hoveredNav($event, 1);
});

function stickyNav (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver (stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px'
});

//SECTION SCROLL
function revealSection (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
})

//IMG UNBLUR
function loadImg (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove('lazy-img');
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

//SLIDES
function createDots () {
  slides.forEach((_, index) => {
    dotsContainer.insertAdjacentHTML('beforeend',
    `<button class="dots__dot" data-slide="${index}"></button>`);
  })
}

function activateDot (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

function goToSlide (currentSlide) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
  });
}

function initSlides (slide) {
  goToSlide(slide);
  activateDot(slide);
}

function nextSlide () {
  if (currentSlide === slideLimit - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  initSlides(currentSlide);
}

function previousSlide () {
  if (currentSlide === 0) {
    currentSlide = slideLimit - 1;
  } else {
    currentSlide--;
  }

  initSlides(currentSlide);
}

btnSliderRight.addEventListener('click', nextSlide);
btnSliderLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', $event => {
  if ($event.key === 'ArrowRight') {
    nextSlide();
  } else if ($event.key === 'ArrowLeft') {
    previousSlide();
  }
});

dotsContainer.addEventListener('click', ($event) => {
  if ($event.target.classList.contains('dots__dot')){
    const slideDot = $event.target.dataset.slide;
    initSlides(slideDot);
  }
});

showCookieMsg();
createDots();
initSlides(0);

headerObserver.observe(header);

allSections.forEach(section => {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

imgsBlur.forEach(img => imgObserver.observe(img))

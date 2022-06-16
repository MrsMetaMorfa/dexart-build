/*!
 * gulp-nunjucks-sass-template
 * A Gulp 4 template including SCSS, Nunjucks, JS and more
 *
 * Url: https://github.com/DefaultSimon
 * Author: Simon Goričar
 * Copyright 2022. License: MIT
 */
window.onload = function () {
  const observerOptions = {
    root: null,
    rootMargin: "24px",
    threshold: 0.5
  };

  function observerCallback(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // fade in observed elements that are in view
        entry.target.classList.remove('animate-off');
        entry.target.classList.add('animate');
      } else {
        // fade out observed elements that are not in view
        entry.target.classList.remove('animate');
        entry.target.classList.add('animate-off');
      }
    });
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const fadeElms = document.querySelectorAll('.section');
  fadeElms.forEach(el => observer.observe(el));

  function Parallax(e) {
    let _w = window.innerWidth/2;
    let _h = window.innerHeight/2;
    let _mouseX = e.clientX;
    let _mouseY = e.clientY;
    let elems = this.querySelectorAll('.parallaxed');
    elems.forEach((el, index) => {
      let multiply = index * -0.001 - 0.001;
      el.style.marginLeft = `${(_mouseX - _w) * multiply}%`;
      el.style.marginTop = `${(_mouseY - _h) * multiply}%`;
    });
  }

  const parallaxes = document.querySelectorAll('.parallax');
  parallaxes.forEach((parallax) => {
    parallax.addEventListener("mousemove", Parallax);
  });

  const sections = document.querySelectorAll('.section');

  // sections.forEach((section) => {
  //   console.log(section.classList);
  // });
  let isScrolling = false;

  function Scroll(element, isDown, speed, type) {
    isScrolling = true;
    let start = null;
    let firstPos = window.pageYOffset || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;
    let target = 0;
    let pos = 0;

    if (type === 'center') {
      target = isDown ? (windowHeight + element.offsetHeight) / 2 : element.parentElement.getBoundingClientRect().top + (windowHeight + element.offsetHeight) / 2;
    } else if (type === 'bottom') {
      target = element.parentElement.getBoundingClientRect().bottom - windowHeight;
    } else {
      target = element.getBoundingClientRect().top;
    }

    console.log(firstPos, target, pos, element);

    (function() {

      const browser = ['ms', 'moz', 'webkit', 'o'];

      for(let x = 0, length = browser.length; x < length && !window.requestAnimationFrame; x++) {
        window.requestAnimationFrame = window[browser[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[browser[x]+'CancelAnimationFrame'] || window[browser[x]+'CancelRequestAnimationFrame'];
      }

    }());

    function showAnimation (timestamp) {

      if(!start) { start = timestamp || new Date().getTime(); } //get id of animation

      let elapsed = timestamp - start;
      let progress = elapsed / +speed; // animation duration 500ms
      progress = +progress.toFixed(2);

      // console.log(start, timestamp, progress, elapsed, speed, firstPos, target, pos);

      //ease in function from https://github.com/component/ease/blob/master/index.js
      const outQuad = function(n){
        return n * (2 - n);
      };

      let easeInPercentage = +(outQuad(progress)).toFixed(2);

      pos = firstPos + (target * easeInPercentage);
      pos = +pos.toFixed(2);
      window.scrollTo(0, pos);

      console.log(firstPos, target, pos, easeInPercentage);

      if( isNaN(pos) || pos < 0 ||
        !isDown && pos <= 0 ||
        !isDown && pos <= (firstPos + target + 1) ||
        isDown && pos >= (firstPos + target) ||
        isDown && pos >= document.body.clientHeight - window.innerHeight - 1 ||
        pos > document.body.clientHeight - window.innerHeight ) {
        cancelAnimationFrame(start);
        if(element) {
          element.focus();
        }
        pos = 0;
        isScrolling = false;
      } else {
        window.requestAnimationFrame(showAnimation);
      }
    }
    window.requestAnimationFrame(showAnimation);
  }

  function InnerScroll(container, elements, isDown) {
    isScrolling = true;
    let containerTop = container.querySelector('.section__variants').getBoundingClientRect().top;
    let parent = container.querySelector('ul');
    let current = container.querySelector('.variant--current');
    let targetIndex = isDown ?
      Array.from(elements).findIndex( el => el.classList.contains('variant--current')) + 1 :
      Array.from(elements).findIndex( el => el.classList.contains('variant--current')) - 1;
    let target = Array.from(elements)[targetIndex].getBoundingClientRect().top;
    let pos = 0;
    if (parent.style.transform) {
      let style = window.getComputedStyle(parent);
      let matrix = new DOMMatrixReadOnly(style.transform);
      pos = matrix.m42;
    }
    console.log(containerTop, parent.getBoundingClientRect().top, target, pos);
    current.classList.remove('variant--current');
    Array.from(elements)[targetIndex].classList.add('variant--current');
    parent.style.transform = `translateY(${containerTop - target + pos}px)`;
    setTimeout(() => isScrolling = false, 300);
  }

  function SlidesScroll(container, elements, isDown) {
    isScrolling = true;
    let current = Array.from(elements).findIndex(el => el.classList.contains('show'));
    let target = isDown ? current + 1 : current - 1;
    Array.from(elements)[current].classList.remove('show');
    Array.from(elements)[target].classList.add('show');
    container.setAttribute('data-slide', +target);
    setTimeout(() => isScrolling = false, 300);
  }

  function AnimateFade(current, target, idDown) {
    if (!(!idDown && target.offsetHeight < window.innerHeight)) {
      current.classList.add('animate-fade');
      target.classList.remove('animate-fade');
    }
  }

  function Wheel(e, down) {
    e.preventDefault();
    let isDown = down || e.deltaY > 0;
    if (!isScrolling) {
      let current = Array.from(sections).findIndex(section => section.classList.contains('animate'));
      let target;
      if (isDown) {
        target = current + 1 < sections.length ? Array.from(sections)[current + 1] : Array.from(sections)[current];
      } else {
        target = current > 0 ? Array.from(sections)[current - 1] : Array.from(sections)[0];
      }

      if (sections[current].classList.contains('section--variants')) {
        let variants = document.querySelectorAll('.section--variants .variant');
        if (
          isDown && variants[variants.length - 1].classList.contains('variant--current') ||
          !isDown && variants[0].classList.contains('variant--current')
        ) {
          new Scroll(target, isDown, 600);
        } else {
          new InnerScroll(document.querySelector('.section--variants'), variants, isDown);
        }

      } else if (sections[current].classList.contains('section--world')) {
        let slides = document.querySelectorAll('.section--world .section__slide');
        if (isDown && slides[slides.length - 1].classList.contains('show') ||
          !isDown && slides[0].classList.contains('show')) {
          new Scroll(target, isDown, 600);
        } else {
          new SlidesScroll(sections[current], slides, isDown);
        }

      } else if (
        sections[current].classList.contains('section--roadmap') ||
        target.classList.contains('section--roadmap') && !isDown ||
        target.classList.contains('section--opportunities') && !isDown
      ) {
        let expertise = document.querySelector('.section--roadmap .expertise');
        if (expertise.classList.contains('animate-off')) {
          if (isDown) {
            new AnimateFade(sections[current].querySelector('.section__content'), expertise, isDown);
            new Scroll(expertise, isDown, 900, 'bottom');
            expertise.classList.remove('animate-off');
          } else {
            target.querySelector('.community').classList.remove('animate-fade');
            new Scroll(target.querySelector('.community'), isDown, 900, 'center');
          }
        } else if (expertise.classList.contains('animate-fade')) {
          expertise.classList.remove('animate-fade');
          target.querySelector('.section__content').classList.add('animate-fade');
          new Scroll(expertise, isDown, 900, 'bottom');
        } else {
          if (isDown) {
            new Scroll(target, isDown, 600);
            expertise.classList.add('animate-fade');
          } else {
            new Scroll(sections[current], isDown, 600);
            expertise.classList.add('animate-off');
            sections[current].querySelector('.section__content').classList.remove('animate-fade');
          }
        }

      } else if (
        sections[current].classList.contains('section--opportunities') ||
        target.classList.contains('section--opportunities') && !isDown ||
        target.classList.contains('section--backstory') && !isDown
      ) {
        let community = document.querySelector('.section--opportunities .community');
        if (community.classList.contains('animate-off')) {
          if (isDown) {
            community.classList.remove('animate-off');
            new AnimateFade(sections[current].querySelector('.section__content'), community, isDown);
            new Scroll(community, isDown, 900, 'center');
          } else {
            target.querySelector('.place').classList.remove('animate-fade');
            new Scroll(target.querySelector('.place'), isDown, 900, 'center');
          }
        } else if (community.classList.contains('animate-fade')) {
          community.classList.remove('animate-fade');
          target.querySelector('.section__content').classList.add('animate-fade');
          new Scroll(community, isDown, 900, 'center');
        } else {
          if (isDown) {
            new Scroll(community, isDown, 900, 'center');
            community.classList.add('animate-fade');
          } else {
            new Scroll(sections[current], isDown, 600);
            community.classList.add('animate-off');
            sections[current].querySelector('.section__content').classList.remove('animate-fade');
          }
        }

      } else if (
        sections[current].classList.contains('section--backstory') ||
        target.classList.contains('section--backstory') && !isDown ||
        target.classList.contains('section--world') && !isDown
      ) {
        let place = document.querySelector('.section--backstory .place');
        if (place.classList.contains('animate-off')) {
          if (isDown) {
            place.classList.remove('animate-off');
            new AnimateFade(sections[current].querySelector('.section__content'), place, isDown);
            new Scroll(place, isDown, 900, 'center');
          } else {
            sections[current].classList.remove('animate-off');
            new Scroll(target, isDown, 600);
          }
        } else if (place.classList.contains('animate-fade')) {
          place.classList.remove('animate-fade');
          target.querySelector('.section__content').classList.add('animate-fade');
          new Scroll(place, isDown, 900, 'center');
        } else {
          if (isDown) {
            new Scroll(place, isDown, 900, 'center');
            place.classList.add('animate-fade');
          } else {
            new Scroll(sections[current], isDown, 600);
            place.classList.add('animate-off');
            sections[current].querySelector('.section__content').classList.remove('animate-fade');
          }
        }

      } else {
        console.log(target);
        new Scroll(target, isDown, 600);
      }
    }
  }

  window.addEventListener('wheel', Wheel, {passive: false});
  window.addEventListener('mousewheel', Wheel, {passive: false});
  window.addEventListener('DOMMouseScroll', Wheel, {passive: false});

  let touchStartPosY = 0;
  document.body.ontouchstart = function(e){
    touchStartPosY = e.changedTouches[0].clientY;
    console.log(e.changedTouches);
  };
  window.addEventListener('touchmove', (e) => {
    // Different devices give different values with different decimal percentages.
    const currentPageY = Math.round(e.changedTouches[0].screenY);
    console.log(currentPageY, touchStartPosY);
    if (touchStartPosY - currentPageY > 50) {
      e.preventDefault();
      new Wheel(e, true);
    } else if (touchStartPosY - currentPageY < -50) {
      e.preventDefault();
      new Wheel(e, false);
    }
  });

  // document.onkeyup = function(e){
  //   console.log('Key : ' + e.code);
  //   let current = Array.from(sections).findIndex( section => section.classList.contains('animate') );
  //   let target;
  //   if (e.code === ('Space' || 'ArrowDown' || 'PageDown' || 'Down')) {
  //     e.preventDefault();
  //     target = current + 1 < sections.length ? Array.from(sections)[current + 1] : Array.from(sections)[current];
  //     new Scroll(target, true);
  //   } else if (e.code === ('ArrowUp' || 'PageUp' || 'Up')) {
  //     e.preventDefault();
  //     target = current > 0 ? Array.from(sections)[current - 1] : Array.from(sections)[0];
  //     new Scroll(target, false);
  //   }
  // };

  let splide = new Splide( '.road', {
    perPage: 3,
    perMove: 1,
    breakpoints: {
      920: {
        perPage: 2
      },
      520: {
        perPage: 1
      },
    },
  } );
  splide.mount();

  let press = new Splide( '.section__articles', {
    perPage: 3,
    perMove: 1,
    gap: '32px',
    breakpoints: {
      640: {
        gap: '16px',
        perPage: 2
      },
      520: {
        gap: '16px',
        perPage: 1
      },
    },
  } );
  press.mount();

  let splideOpp = new Splide( '.section__opportunities', {
    perPage: 4,
    perMove: 1,
    gap: '32px',
    breakpoints: {
      920: {
        perPage: 2
      },
      640: {
        perPage: 1
      }
    },
  } );
  splideOpp.mount();
};


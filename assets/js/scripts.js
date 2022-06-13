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

  const fadeElms = document.querySelectorAll('section');
  fadeElms.forEach(el => observer.observe(el));

  function parallax(e) {
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

  const top = document.querySelector('.section--top');
  top.addEventListener("mousemove", parallax);

  const sections = document.querySelectorAll('.section');

  // sections.forEach((section) => {
  //   console.log(section.classList);
  // });
  function Scroll(element, isDown) {
    let start = null;
    let firstPos = window.pageYOffset || document.documentElement.scrollTop;
    let target = element.getBoundingClientRect().top;
    let pos = 0;

    console.log(firstPos, target, pos);

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
      let progress = elapsed / 600; // animation duration 500ms
      progress = +progress.toFixed(2);

      //ease in function from https://github.com/component/ease/blob/master/index.js
      const outQuad = function(n){
        return n * (2 - n);
      };

      let easeInPercentage = +(outQuad(progress)).toFixed(2);

      pos = firstPos + (target * easeInPercentage);
      pos = +pos.toFixed(2);
      window.scrollTo(0, pos);

      console.log(firstPos, target, pos, easeInPercentage, document.body.clientHeight - window.innerHeight);

      if( pos < 0 ||
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
      } else {
        window.requestAnimationFrame(showAnimation);
      }
    }
    window.requestAnimationFrame(showAnimation);
  }

  function InnerScroll(container, elements, isDown) {
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
  }

  function SlidesScroll(elements, isDown) {
    let current = Array.from(elements).findIndex(el => el.classList.contains('show'));
    let target = isDown ? current + 1 : current - 1;
    Array.from(elements)[current].classList.remove('show');
    Array.from(elements)[target].classList.add('show');
  }

  function ScrollToCenter(container, element, isDown) {
    let start = null;
    let firstPos = window.pageYOffset || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;
    let target = isDown ? (windowHeight + element.offsetHeight) / 2 : container.getBoundingClientRect().top;
    let pos = 0;

    console.log(firstPos, windowHeight, element.offsetHeight, element.getBoundingClientRect().top, target, pos);

    element.classList.add('animate');

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
      let progress = elapsed / 900; // animation duration 600ms
      progress = +progress.toFixed(2);

      //ease in function from https://github.com/component/ease/blob/master/index.js
      const outQuad = function(n){
        return n * (2 - n);
      };

      let easeInPercentage = +(outQuad(progress)).toFixed(2);

      pos = firstPos + (target * easeInPercentage);
      pos = +pos.toFixed(2);
      window.scrollTo(0, pos);

      console.log(firstPos, target, pos, easeInPercentage, document.body.clientHeight - window.innerHeight);

      if( pos < 0 ||
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
      } else {
        window.requestAnimationFrame(showAnimation);
      }
    }
    window.requestAnimationFrame(showAnimation);
  }

  function ScrollToBottom(container, element, isDown) {
    let start = null;
    let firstPos = window.pageYOffset || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;
    let target = isDown ? (container.offsetHeight - windowHeight) : element.getBoundingClientRect().bottom - windowHeight;
    let pos = 0;

    console.log(firstPos, element.offsetHeight, element.getBoundingClientRect().bottom, target, pos);

    element.classList.add('animate');

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
      let progress = elapsed / 900; // animation duration 600ms
      progress = +progress.toFixed(2);

      //ease in function from https://github.com/component/ease/blob/master/index.js
      const outQuad = function(n){
        return n * (2 - n);
      };

      let easeInPercentage = +(outQuad(progress)).toFixed(2);

      pos = firstPos + (target * easeInPercentage);
      pos = +pos.toFixed(2);
      window.scrollTo(0, pos);

      console.log(firstPos, target, pos, easeInPercentage, document.body.clientHeight - window.innerHeight);

      if( pos < 0 ||
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
      } else {
        window.requestAnimationFrame(showAnimation);
      }
    }
    window.requestAnimationFrame(showAnimation);
  }

  function Wheel(e) {
    e.preventDefault();
    let current = Array.from(sections).findIndex( section => section.classList.contains('animate') );
    let target;
    if (e.deltaY > 0) {
      target = current + 1 < sections.length ? Array.from(sections)[current + 1] : Array.from(sections)[current];
    } else {
      target = current > 0 ? Array.from(sections)[current - 1] : Array.from(sections)[0];
    }

    if (sections[current].classList.contains('section--variants')) {
      let variants = document.querySelectorAll('.section--variants .variant');
      if (e.deltaY > 0 && variants[variants.length - 1].classList.contains('variant--current') ||
        e.deltaY < 0 && variants[0].classList.contains('variant--current')) {
        new Scroll(target, e.deltaY > 0);
      } else {
        new InnerScroll(document.querySelector('.section--variants'), variants, e.deltaY > 0);
      }
    }
    else if (sections[current].classList.contains('section--world')) {
      let slides = document.querySelectorAll('.section--world .section__slide');
      if (e.deltaY > 0 && slides[slides.length - 1].classList.contains('show') ||
        e.deltaY < 0 && slides[0].classList.contains('show')) {
        new Scroll(target, e.deltaY > 0);
      } else {
        new SlidesScroll(slides, e.deltaY > 0);
      }
    }
    else if (
      sections[current].classList.contains('section--backstory') && e.deltaY > 0 ||
      target.classList.contains('section--backstory') && e.deltaY < 0 ||
      document.querySelector('.animate').classList.contains('place')
    ) {
      let place = document.querySelector('.section--backstory .place');
      if (sections[current].classList.contains('section--backstory')) {
        new ScrollToCenter(document.querySelector('.section--backstory'), place, e.deltaY > 0);
      } else {
        let targetIndex = e.deltaY > 0 ?
          Array.from(sections).findIndex(el => el.classList.contains('section--opportunities')) :
          Array.from(sections).findIndex(el => el.classList.contains('section--backstory'));
        target = Array.from(sections)[targetIndex];
        new Scroll(target, e.deltaY > 0);
        place.classList.remove('animate');
      }
    }
    else if (
      sections[current].classList.contains('section--opportunities') && e.deltaY > 0 ||
      target.classList.contains('section--opportunities') && e.deltaY < 0 ||
      document.querySelector('.animate').classList.contains('community')
    ) {
      let community = document.querySelector('.section--opportunities .community');
      if (sections[current].classList.contains('section--opportunities')) {
        new ScrollToCenter(document.querySelector('.section--opportunities'), community, e.deltaY > 0);
      } else {
        let targetIndex = e.deltaY > 0 ?
          Array.from(sections).findIndex(el => el.classList.contains('section--roadmap')) :
          Array.from(sections).findIndex(el => el.classList.contains('section--opportunities'));
        target = Array.from(sections)[targetIndex];
        new Scroll(target, e.deltaY > 0);
        community.classList.remove('animate');
      }
    }
    else if (
      sections[current].classList.contains('section--roadmap') && e.deltaY > 0 ||
      target.classList.contains('section--roadmap') && e.deltaY < 0 ||
      document.querySelector('.animate').classList.contains('expertise')
    ) {
      let expertise = document.querySelector('.section--roadmap .expertise');
      if (sections[current].classList.contains('section--roadmap')) {
        new ScrollToBottom(document.querySelector('.section--roadmap'), expertise, e.deltaY > 0);
      } else {
        let targetIndex = e.deltaY > 0 ?
          Array.from(sections).findIndex(el => el.classList.contains('section--partners')) :
          Array.from(sections).findIndex(el => el.classList.contains('section--roadmap'));
        target = Array.from(sections)[targetIndex];
        new Scroll(target, e.deltaY > 0);
        expertise.classList.remove('animate');
      }
    }
    else {
      new Scroll(target, e.deltaY > 0);
    }
  }

  window.addEventListener('wheel', Wheel, {passive: false});
  window.addEventListener('mousewheel', Wheel, {passive: false});
  window.addEventListener('DOMMouseScroll', Wheel, {passive: false});

  document.onkeyup = function(e){
    console.log('Key : ' + e.code);
    let current = Array.from(sections).findIndex( section => section.classList.contains('animate') );
    let target;
    if (e.code === ('Space' || 'ArrowDown' || 'PageDown' || 'Down')) {
      target = current + 1 < sections.length ? Array.from(sections)[current + 1] : Array.from(sections)[current];
      new Scroll(target, true);
    } else if (e.code === ('ArrowUp' || 'PageUp' || 'Up')) {
      target = current > 0 ? Array.from(sections)[current - 1] : Array.from(sections)[0];
      new Scroll(target, false);
    }
  };

  let splide = new Splide( '.splide', {
    perPage: 3,
    perMove: 1,
    gap    : '32px',
    breakpoints: {
      820: {
        perPage: 2
      },
      520: {
        perPage: 1
      },
    },
  } );

  splide.mount();
};

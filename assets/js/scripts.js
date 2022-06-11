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
    rootMargin: "0px",
    threshold: 0.85
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
    const firstPos = window.pageYOffset || document.documentElement.scrollTop;
    const target = element.getBoundingClientRect().top;
    let pos = 0;

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

      if( pos < 0 || !isDown && pos <= 0 || !isDown && pos <= (firstPos + target + 1) || isDown && pos >= (firstPos + target) || isDown && pos >= document.body.clientHeight - window.innerHeight -1 || pos >= document.body.clientHeight - window.innerHeight ) {
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

  window.onwheel = (e) => {
    let current = Array.from(sections).findIndex( section => section.classList.contains('animate') );
    let target;
    if (e.deltaY > 0) {
      target = current + 1 < sections.length ? Array.from(sections)[current + 1] : Array.from(sections)[current];
    } else {
      target = current > 0 ? Array.from(sections)[current - 1] : Array.from(sections)[0];
    }
    new Scroll(target, e.deltaY > 0);
  };

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
};

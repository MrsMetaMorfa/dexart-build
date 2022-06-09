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
    threshold: 1
  };

  function observerCallback(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // fade in observed elements that are in view
        entry.target.classList.toggle('animate');
      } else {
        // fade out observed elements that are not in view
        entry.target.classList.toggle('animate');
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

  // Magic happens here


};

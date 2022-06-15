let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let video = document.querySelector('.video');
let iframe = video.querySelector('.video__frame');
let link = video.querySelector('.video__link');
let button = video.querySelector('.video__button');

function onPlayerReady() {
  console.log(player);
}

function pauseVideo() {
  if (player && player.hasOwnProperty('getPlayerState')) {
    iframe.pauseVideo();
    button.classList.toggle('hide');
  }
}
function playVideo() {
  if (player && player.hasOwnProperty('getPlayerState')) {
    iframe.playVideo();
    button.classList.toggle('hide');
  }
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onReady': onPlayerReady,
    }
  });

  // console.log(player, player.hasOwnProperty('getPlayerState'));
}

video.addEventListener('click', () => {
  console.log(link.classList.contains('hide'));
  if (!link.classList.contains('hide')) {
    let url = iframe.getAttribute('data-src');
    iframe.src = url;
    playVideo();
    link.classList.add('hide');
  } else if (button.classList.contains('hide')) {
    pauseVideo();
  } else {
    playVideo();
  }
  button.classList.add('hide');
});
